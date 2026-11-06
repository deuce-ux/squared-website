import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolveMarketingConsent, sanitizeMarketingProperties } from "../analytics.js";

test("marketing analytics keeps only non-sensitive allowlisted properties", () => {
  assert.deepEqual(sanitizeMarketingProperties({
    cta_location: "hero",
    page_type: "marketing",
    email: "member@example.com",
    goal_title: "Private goal",
    unknown: "drop",
  }), { cta_location: "hero", page_type: "marketing" });
});

test("tracking is disabled without a configured endpoint and never imports a third-party SDK", () => {
  const source = readFileSync(new URL("../analytics.js", import.meta.url), "utf8");
  const config = JSON.parse(readFileSync(new URL("../analytics-config.json", import.meta.url), "utf8"));
  assert.equal(config.endpoint, "");
  assert.doesNotMatch(source, /posthog|google-analytics|gtag\(|session[_-]?replay/i);
  assert.match(source, /consent\(\) !== "granted"/);
});

test("the marketing client uses canonical event names and shared cross-subdomain storage", () => {
  const source = readFileSync(new URL("../analytics.js", import.meta.url), "utf8");
  for (const eventName of ["marketing_page_viewed", "pricing_viewed", "signup_cta_clicked"]) {
    assert.match(source, new RegExp(eventName));
  }
  assert.match(source, /Domain=\.squared\.ng/);
  assert.doesNotMatch(source, /document\.title|email:|goal_title|message_body|task_description/i);
});

test("the shared cross-domain cookie overrides stale per-domain storage", () => {
  assert.equal(resolveMarketingConsent("denied", "granted"), "denied");
  assert.equal(resolveMarketingConsent("granted", "denied"), "granted");
  assert.equal(resolveMarketingConsent(null, "granted"), "granted");
  assert.equal(resolveMarketingConsent(null, null), null);
});

test("the footer control can reopen and withdraw an existing choice", () => {
  const source = readFileSync(new URL("../analytics.js", import.meta.url), "utf8");
  assert.match(source, /installConsentUi\(true\)/);
  assert.match(source, /Withdraw analytics/);
  assert.match(source, /document\.querySelector\("\[data-sq-analytics-banner\]"\)\?\.remove\(\)/);
});

test("queue acknowledgement removes only the exact sent batch", () => {
  const source = readFileSync(new URL("../analytics.js", import.meta.url), "utf8");
  assert.match(source, /const sentIds = new Set\(batch\.map/);
  assert.match(source, /event\.event_id\)\)/);
});
