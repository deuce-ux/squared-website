# Squared Marketing Analytics

`analytics.js` is loaded by both `homepage.js` and `script.js`. It covers the
public marketing pages and intentionally ignores admin/login pages and redirect
stubs.

## Enablement

Tracking is disabled while `analytics-config.json` contains an empty endpoint.
After the application migration and `analytics-ingest` Edge Function are
approved and deployed, set:

```json
{
  "endpoint": "https://YOUR_PROJECT.supabase.co/functions/v1/analytics-ingest"
}
```

The endpoint URL is public configuration. No service-role key or other secret
belongs in this repository.

## Behaviour

- No visitor ID or marketing event is created before valid optional consent.
- The consent choice and random visitor ID use a shared `.squared.ng` cookie so
  the application can stitch a consented journey.
- The client records `marketing_page_viewed`, `pricing_viewed`, and
  `signup_cta_clicked`.
- It stores only landing path, referrer hostname, UTM source/medium/campaign,
  device category, and browser. It does not store full referrer URLs, arbitrary
  query strings, form values, email addresses, goal/task text, or message
  content.
- Rejection clears the browser visitor ID and queued events.
- The footer receives an “Analytics choices” control so visitors can change a
  decision later.
- Failed tracking requests remain in a seven-day, 100-event local retry queue.
- There is no third-party SDK, session replay, heatmap, or form autocapture.

## Verification

```bash
node --test scripts/analytics.test.mjs
```

No screenshot or browser visual QA is part of this implementation.

## HTTPS endpoint check

Only an `https://` endpoint enables the client. Local HTTP review must inject
`window.SQUARED_ANALYTICS_CONFIG` through an explicit review harness if needed;
the checked-in disabled configuration remains the safe default.
