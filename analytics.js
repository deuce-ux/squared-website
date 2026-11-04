/* Squared marketing analytics — consent-gated, first-party, no third-party SDK. */

const CONSENT_KEY = "squared_analytics_consent_v1";
const VISITOR_COOKIE = "squared_visitor_id";
const SESSION_KEY = "squared_analytics_session_v1";
const QUEUE_KEY = "squared_analytics_queue_v1";
const CONSENT_VERSION = "2026-11-v1";
const MAX_QUEUE = 100;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const ALLOWED_PATHS = new Set([
  "/", "/index.html", "/community", "/community.html", "/programs", "/programs.html",
  "/bookshop", "/bookshop.html", "/blog", "/blog.html", "/events", "/events.html",
  "/volunteer", "/volunteer.html", "/forge", "/forge.html", "/forge-apply", "/forge-apply.html",
  "/prize", "/prize.html", "/squared-prize", "/squared-prize.html", "/pages-prize", "/pages-prize.html",
]);
const PROPERTY_LIMITS = {
  page_type: 32,
  cta_location: 32,
  pricing_period: 24,
  device_category: 16,
  browser: 32,
  channel: 32,
};

let endpoint = "";
let sending = false;

function randomId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function") globalThis.crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function cookie(name) {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const part = document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix));
  return part ? decodeURIComponent(part.slice(prefix.length)) : null;
}

function writeCookie(name, value, maxAge) {
  if (typeof document === "undefined") return;
  const host = location.hostname;
  const domain = host === "squared.ng" || host.endsWith(".squared.ng") ? "; Domain=.squared.ng" : "";
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${domain}${secure}`;
}

function consent() {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") return stored;
  } catch {
    // Cookie is the cross-domain fallback.
  }
  const stored = cookie(CONSENT_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
}

function visitorId() {
  const existing = cookie(VISITOR_COOKIE);
  if (existing) return existing;
  const created = randomId();
  writeCookie(VISITOR_COOKIE, created, 397 * 24 * 60 * 60);
  return created;
}

function sessionId() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (parsed && parsed.id && parsed.expiresAt > Date.now()) return parsed.id;
  } catch {
    // Replace corrupt state.
  }
  const created = randomId();
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: created, expiresAt: Date.now() + 30 * 60 * 1000 }));
  } catch {
    // The event remains valid without reusable session storage.
  }
  return created;
}

function channelFor(source, medium, referrer) {
  const utmSource = String(source || "").toLowerCase();
  const utmMedium = String(medium || "").toLowerCase();
  const ref = String(referrer || "").toLowerCase();
  if (utmSource === "google" || /google\.|bing\./.test(ref)) return "search";
  if (/instagram|facebook|tiktok|twitter|linkedin/.test(utmSource) || /instagram|facebook|tiktok|twitter|linkedin|(^|\.)x\.com/.test(ref)) return "social";
  if (utmMedium.includes("email") || utmSource.includes("newsletter")) return "email";
  if (utmMedium.includes("cpc") || utmMedium.includes("paid")) return "paid";
  if (utmSource || ref) return "referral";
  return "direct";
}

export function sanitizeMarketingProperties(input) {
  const clean = {};
  if (!input || typeof input !== "object") return clean;
  for (const [key, limit] of Object.entries(PROPERTY_LIMITS)) {
    const value = input[key];
    if (typeof value === "string" && value.trim()) clean[key] = value.trim().slice(0, limit);
    else if (typeof value === "number" || typeof value === "boolean" || value === null) clean[key] = value;
  }
  return clean;
}

function pageContext() {
  const params = new URLSearchParams(location.search);
  const utmSource = params.get("utm_source")?.slice(0, 160) || null;
  const utmMedium = params.get("utm_medium")?.slice(0, 160) || null;
  const utmCampaign = params.get("utm_campaign")?.slice(0, 160) || null;
  let referrerHost = null;
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : null;
  } catch {
    // Invalid or withheld referrers remain unavailable.
  }
  const width = window.innerWidth || 0;
  const userAgent = navigator.userAgent || "";
  const device = /iPad|Tablet/i.test(userAgent) || (width >= 768 && width < 1024)
    ? "tablet"
    : /Mobi|Android|iPhone/i.test(userAgent) || width < 768 ? "mobile" : "desktop";
  const browser = /Edg\//.test(userAgent) ? "Edge" : /Firefox\//.test(userAgent) ? "Firefox"
    : /Chrome\//.test(userAgent) ? "Chrome" : /Safari\//.test(userAgent) ? "Safari" : "Other";
  return {
    source_domain: location.hostname.toLowerCase(),
    page_path: location.pathname.slice(0, 512) || "/",
    referrer_host: referrerHost,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    channel: channelFor(utmSource, utmMedium, referrerHost),
    device_category: device,
    browser,
  };
}

function queueEvent(event) {
  try {
    const current = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    const fresh = current.filter((item) => Date.now() - new Date(item.occurred_at).getTime() <= MAX_AGE_MS);
    if (!fresh.some((item) => item.event_id === event.event_id)) fresh.push(event);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(fresh.slice(-MAX_QUEUE)));
  } catch {
    // Tracking failures never block navigation or the page.
  }
}

async function send(events) {
  if (!endpoint || !events.length || consent() !== "granted") return false;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ events }),
      keepalive: events.length <= 5,
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function flushMarketingQueue() {
  if (sending || !endpoint || consent() !== "granted") return;
  sending = true;
  try {
    const queued = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    if (!queued.length) return;
    if (await send(queued.slice(0, 20))) localStorage.setItem(QUEUE_KEY, JSON.stringify(queued.slice(20)));
  } catch {
    // Retain the queue for the next online visit.
  } finally {
    sending = false;
  }
}

export function trackMarketingEvent(name, properties = {}) {
  if (consent() !== "granted" || !["marketing_page_viewed", "pricing_viewed", "signup_cta_clicked"].includes(name)) return false;
  const event = {
    event_id: randomId(),
    event_name: name,
    occurred_at: new Date().toISOString(),
    anonymous_id: visitorId(),
    session_id: sessionId(),
    properties: sanitizeMarketingProperties(properties),
    ...pageContext(),
  };
  queueEvent(event);
  void flushMarketingQueue();
  return true;
}

function storeConsent(choice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Cookie remains available.
  }
  writeCookie(CONSENT_KEY, choice, 397 * 24 * 60 * 60);
  if (choice === "granted") visitorId();
  else {
    writeCookie(VISITOR_COOKIE, "", 0);
    try {
      localStorage.removeItem(QUEUE_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Withdrawal remains effective through the consent cookie.
    }
  }
  document.querySelector("[data-sq-analytics-banner]")?.remove();
  if (choice === "granted") {
    trackMarketingEvent("marketing_page_viewed", { page_type: "marketing" });
  }
}

function installConsentUi() {
  if (consent()) return;
  const banner = document.createElement("section");
  banner.dataset.sqAnalyticsBanner = "";
  banner.setAttribute("aria-label", "Optional analytics");
  banner.style.cssText = "position:fixed;z-index:10000;left:16px;right:16px;bottom:16px;max-width:620px;margin:auto;background:#fff;color:#17130f;border:1px solid rgba(23,19,15,.16);border-radius:14px;padding:16px;box-shadow:0 18px 48px rgba(23,19,15,.18);font:13px/1.5 'DM Sans',sans-serif;";
  banner.innerHTML = `
    <p style="margin:0;font-weight:700">Optional website analytics</p>
    <p style="margin:6px 0 0;color:#625a52">Allow pseudonymous analytics to help us understand how people find Squared. We never send goal, task, or message content. <a href="https://app.squared.ng/privacy" style="color:#17130f;font-weight:600">Privacy Policy</a>.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <button type="button" data-analytics-allow style="border:0;border-radius:8px;background:#F26522;color:#fff;padding:9px 14px;font:600 12px 'DM Sans',sans-serif">Allow analytics</button>
      <button type="button" data-analytics-deny style="border:1px solid rgba(23,19,15,.18);border-radius:8px;background:#fff;color:#17130f;padding:9px 14px;font:600 12px 'DM Sans',sans-serif">Decline</button>
    </div>`;
  banner.querySelector("[data-analytics-allow]").addEventListener("click", () => storeConsent("granted"));
  banner.querySelector("[data-analytics-deny]").addEventListener("click", () => storeConsent("denied"));
  document.body.appendChild(banner);
}

function installPreferenceControl() {
  const footer = document.querySelector("footer");
  if (!footer || footer.querySelector("[data-sq-analytics-choices]")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.sqAnalyticsChoices = "";
  button.textContent = "Analytics choices";
  button.style.cssText = "background:none;border:0;padding:0;margin-left:16px;font:inherit;color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer";
  button.addEventListener("click", installConsentUi);
  footer.appendChild(button);
}

function observePricing() {
  const pricing = document.querySelector(".pricing, [id*='pricing'], [data-pricing]");
  if (!pricing || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    trackMarketingEvent("pricing_viewed", { page_type: "pricing" });
    observer.disconnect();
  }, { threshold: 0.35 });
  observer.observe(pricing);
}

function observeSignupClicks() {
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!target) return;
    let path = "";
    try {
      path = new URL(target.href, location.href).pathname;
    } catch {
      return;
    }
    if (path !== "/signup") return;
    const inPricing = target.closest(".pricing, [id*='pricing'], [data-pricing]");
    const inHeader = target.closest("header, nav");
    const inFooter = target.closest("footer");
    trackMarketingEvent("signup_cta_clicked", { cta_location: inPricing ? "pricing" : inHeader ? "navigation" : inFooter ? "footer" : "page" });
  }, true);
}

async function loadEndpoint() {
  if (globalThis.SQUARED_ANALYTICS_CONFIG && typeof globalThis.SQUARED_ANALYTICS_CONFIG.endpoint === "string") {
    return globalThis.SQUARED_ANALYTICS_CONFIG.endpoint.trim();
  }
  try {
    const response = await fetch("/analytics-config.json", { cache: "no-store" });
    if (!response.ok) return "";
    const config = await response.json();
    return typeof config.endpoint === "string" ? config.endpoint.trim() : "";
  } catch {
    return "";
  }
}

export async function initialiseMarketingAnalytics() {
  if (typeof window === "undefined" || typeof document === "undefined" || !ALLOWED_PATHS.has(location.pathname)) return;
  endpoint = await loadEndpoint();
  if (!/^https:\/\/[^/]+/i.test(endpoint)) return;
  installPreferenceControl();
  installConsentUi();
  if (consent() === "granted") trackMarketingEvent("marketing_page_viewed", { page_type: "marketing" });
  observePricing();
  observeSignupClicks();
  window.addEventListener("online", () => void flushMarketingQueue());
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  void initialiseMarketingAnalytics();
}
