import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { sanitizeMarketingProperties } from "../analytics.js";

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
