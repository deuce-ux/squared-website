let counted = false;

export async function countPageLoad(endpoint, send = globalThis.fetch, privacy = globalThis.navigator) {
  if (counted || typeof endpoint !== "string" || !/^https:\/\/[^/]+\/functions\/v1\/site-visit$/.test(endpoint)) return false;
  if (privacy?.globalPrivacyControl === true || privacy?.doNotTrack === "1") return false;
  counted = true;
  try {
    const response = await send(endpoint, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}
