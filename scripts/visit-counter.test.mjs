import assert from "node:assert/strict";
import test from "node:test";

const endpoint = "https://icjagfkzeottwewaycjs.supabase.co/functions/v1/site-visit";
let version = 0;
async function freshCounter() {
  return (await import(`../visit-counter.js?test=${version++}`)).countPageLoad;
}

test("counts without consent or storage and sends no identifiers or referrer", async () => {
  const count = await freshCounter();
  const requests = [];
  const send = async (...args) => { requests.push(args); return { ok: true }; };
  assert.equal(await count(endpoint, send, {}), true);
  assert.deepEqual(requests, [[endpoint, {
    method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer", keepalive: true,
  }]]);
  assert.equal(await count(endpoint, send, {}), false);
  assert.equal(requests.length, 1);
});

test("honors browser privacy signals and disabled configuration", async () => {
  const count = await freshCounter();
  const send = () => { throw new Error("must not send"); };
  assert.equal(await count(endpoint, send, { globalPrivacyControl: true }), false);
  assert.equal(await count(endpoint, send, { doNotTrack: "1" }), false);
  assert.equal(await count("", send, {}), false);
  assert.equal(await count("http://example.org", send, {}), false);
});

test("does not queue or retry a failed count and a new document can count again", async () => {
  const count = await freshCounter();
  let attempts = 0;
  const send = async () => { attempts++; throw new Error("offline"); };
  assert.equal(await count(endpoint, send, {}), false);
  assert.equal(await count(endpoint, send, {}), false);
  assert.equal(attempts, 1);
  const nextPage = await freshCounter();
  assert.equal(await nextPage(endpoint, async () => ({ ok: true }), {}), true);
});

test("the deployed initialization counts even when optional analytics was declined", async (context) => {
  const names = ["window", "document", "location", "localStorage", "sessionStorage", "fetch"];
  const saved = names.map((name) => Object.getOwnPropertyDescriptor(globalThis, name));
  context.after(() => names.forEach((name, index) => {
    if (saved[index]) Object.defineProperty(globalThis, name, saved[index]);
    else delete globalThis[name];
  }));
  const requests = [];
  Object.assign(globalThis, {
    window: { addEventListener() {} },
    location: { pathname: "/", hostname: "www.squared.ng" },
    document: { cookie: "squared_analytics_consent_v1=denied", querySelector: () => null, addEventListener() {} },
    localStorage: { getItem: () => "denied", removeItem() {} },
    sessionStorage: { removeItem() {} },
    fetch: async (url, options) => {
      requests.push([url, options]);
      return { ok: true, json: async () => ({ endpoint: "https://example.org/analytics", aggregateEndpoint: endpoint }) };
    },
  });
  await import(`../analytics.js?integration=${Date.now()}`);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requests.filter(([url]) => url === endpoint).length, 1);
  assert.equal(requests.filter(([url]) => url === "https://example.org/analytics").length, 0);
});
