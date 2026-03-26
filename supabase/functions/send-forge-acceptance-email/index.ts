const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const applicant_email = body.applicant_email || "";
    const applicant_name = body.applicant_name || "there";
    const firstName = applicant_name.split(" ")[0];
    if (!applicant_email) {
      return new Response(JSON.stringify({ error: "no email" }), { status: 400, headers: corsHeaders });
    }

    const html = "<html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'>"
      + "<style>"
      + "body { margin:0; padding:0; font-family:Arial,sans-serif; }"
      + ".cta-btn { background:#F67A3E !important; color:#ffffff !important; -webkit-text-fill-color:#ffffff !important; }"
      + "</style>"
      + "</head>"
      + "<body style='margin:0;padding:0;font-family:Arial,sans-serif;'>"
      + "<table width='100%' cellpadding='0' cellspacing='0'>"
      + "<tr><td align='center' style='padding:48px 24px;'>"
      + "<table width='560' cellpadding='0' cellspacing='0' style='max-width:560px;width:100%;'>"

      // Logo
      + "<tr><td style='padding-bottom:48px;'>"
      + "<span style='font-size:20px;font-weight:800;letter-spacing:-0.03em;font-family:Arial,sans-serif;'>squared.</span>"
      + "</td></tr>"

      // Eyebrow
      + "<tr><td style='padding-bottom:12px;'>"
      + "<p style='margin:0;font-size:11px;letter-spacing:0.12em;color:#F67A3E;font-weight:700;font-family:Arial,sans-serif;text-transform:uppercase;'>FORGE 1.0 &mdash; BRAND IDENTITY</p>"
      + "</td></tr>"

      // Headline
      + "<tr><td style='padding-bottom:24px;'>"
      + "<h1 style='margin:0;font-size:40px;font-weight:800;line-height:1.1;letter-spacing:-0.03em;font-family:Arial,sans-serif;'>You&#39;re in,<br>" + firstName + ".</h1>"
      + "</td></tr>"

      // Divider
      + "<tr><td style='padding-bottom:24px;'>"
      + "<div style='height:1px;background:rgba(128,128,128,0.2);'></div>"
      + "</td></tr>"

      // Body para 1
      + "<tr><td style='padding-bottom:20px;'>"
      + "<p style='margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;'>Your application has been reviewed. Out of everyone who applied, you made it. That means something &mdash; don&#39;t waste it.</p>"
      + "</td></tr>"

      // Body para 2
      + "<tr><td style='padding-bottom:20px;'>"
      + "<p style='margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;'>We kick off <strong>April 1st</strong>. Four Tuesday sessions. Small group. No spectators &mdash; everyone works.</p>"
      + "</td></tr>"

      // Body para 3
      + "<tr><td style='padding-bottom:20px;'>"
      + "<p style='margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;'>You&#39;ll get a follow-up with the session link, what to bring, and how to prepare. Watch your inbox.</p>"
      + "</td></tr>"

      // Body para 4 — recommendation, not requirement
      + "<tr><td style='padding-bottom:40px;'>"
      + "<p style='margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;'>In the meantime, Squared Core is worth checking out. It&#39;s a community of young Nigerians working on real goals &mdash; accountability, focus sessions, the whole thing. Good people. Good energy. You&#39;d fit right in.</p>"
      + "</td></tr>"

      // CTA
      + "<tr><td style='padding-bottom:48px;'>"
      + "<a href='https://squared.ng/join.html' class='cta-btn' style='display:inline-block;background:#F67A3E;color:#ffffff;-webkit-text-fill-color:#ffffff;padding:16px 36px;border-radius:100px;text-decoration:none;font-size:15px;font-weight:700;font-family:Arial,sans-serif;'>Check Out Squared Core &rarr;</a>"
      + "</td></tr>"

      // Divider
      + "<tr><td style='padding-bottom:32px;'>"
      + "<div style='height:1px;background:rgba(128,128,128,0.2);'></div>"
      + "</td></tr>"

      // Footer
      + "<tr><td>"
      + "<p style='margin:0 0 6px;font-size:13px;line-height:1.6;font-family:Arial,sans-serif;opacity:0.4;'>This is Squared &mdash; a productivity and accountability community for young Nigerians.</p>"
      + "<p style='margin:0;font-size:12px;font-family:Arial,sans-serif;opacity:0.3;'>&#169; 2025 Squared &middot; <a href='https://squared.ng' style='color:#F67A3E;text-decoration:none;'>squared.ng</a></p>"
      + "</td></tr>"

      + "</table>"
      + "</td></tr></table>"
      + "</body></html>";

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Deno.env.get("RESEND_API_KEY"),
      },
      body: JSON.stringify({
        from: "Squared <forge@squared.ng>",
        to: applicant_email,
        subject: "You're in — Forge 1.0",
        html: html,
      }),
    });

    const data = await resendRes.json();
    return new Response(JSON.stringify(data), {
      status: resendRes.ok ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
