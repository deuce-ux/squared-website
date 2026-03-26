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
    const applicant_name  = body.applicant_name  || "there";
    const firstName = applicant_name.split(" ")[0];

    if (!applicant_email) {
      return new Response(JSON.stringify({ error: "no email" }), { status: 400, headers: corsHeaders });
    }

    const html = "<html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'>"
      + "<style>"
      + "body { margin:0; padding:0; font-family:Arial,sans-serif; }"
      + ".cta-btn { background:#F67A3E !important; color:#0E0E0E !important; -webkit-text-fill-color:#0E0E0E !important; }"
      + "</style>"
      + "</head>"
      + "<body style='margin:0;padding:0;font-family:Arial,sans-serif;background:#ffffff;'>"
      + "<table width='100%' cellpadding='0' cellspacing='0' style='background:#ffffff;'>"
      + "<tr><td align='center' style='padding:48px 24px;'>"
      + "<table width='560' cellpadding='0' cellspacing='0' style='max-width:560px;width:100%;'>"

      // Logo
      + "<tr><td style='padding-bottom:40px;'>"
      + "<span style='font-size:18px;font-weight:800;letter-spacing:-0.03em;font-family:Arial,sans-serif;color:#0E0E0E;'>squared.</span>"
      + "</td></tr>"

      // Eyebrow
      + "<tr><td style='padding-bottom:10px;'>"
      + "<p style='margin:0;font-size:10px;letter-spacing:0.14em;color:#F67A3E;font-weight:700;font-family:Arial,sans-serif;text-transform:uppercase;'>SQUARED — YOU'RE IN</p>"
      + "</td></tr>"

      // Headline
      + "<tr><td style='padding-bottom:28px;'>"
      + "<h1 style='margin:0;font-size:42px;font-weight:800;line-height:1.05;letter-spacing:-0.03em;font-family:Arial,sans-serif;color:#0E0E0E;'>" + firstName + ",<br>welcome to<br>the squad.</h1>"
      + "</td></tr>"

      // Divider
      + "<tr><td style='padding-bottom:28px;'>"
      + "<div style='height:1px;background:#e8e0d8;'></div>"
      + "</td></tr>"

      // Para 1
      + "<tr><td style='padding-bottom:20px;'>"
      + "<p style='margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;'>Your application has been reviewed — and you made the cut. We're glad you're here. Squared is built for people who show up, and you clearly get it.</p>"
      + "</td></tr>"

      // Para 2 — payment
      + "<tr><td style='padding-bottom:20px;'>"
      + "<p style='margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;'>To lock in your spot, here's how to pay:</p>"
      + "</td></tr>"

      // Payment options table
      + "<tr><td style='padding-bottom:28px;'>"
      + "<table width='100%' cellpadding='0' cellspacing='0' style='border:1px solid #e8e0d8;border-radius:10px;overflow:hidden;'>"
      + "<tr style='background:#fdf8f3;'>"
      + "<td style='padding:14px 20px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#F67A3E;border-bottom:1px solid #e8e0d8;'>Monthly</td>"
      + "<td style='padding:14px 20px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#0E0E0E;border-bottom:1px solid #e8e0d8;text-align:right;'>&#x20A6;4,000</td>"
      + "</tr>"
      + "<tr style='background:#ffffff;'>"
      + "<td style='padding:14px 20px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#0E0E0E;border-bottom:1px solid #e8e0d8;'>Bi-weekly</td>"
      + "<td style='padding:14px 20px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#0E0E0E;border-bottom:1px solid #e8e0d8;text-align:right;'>&#x20A6;2,000</td>"
      + "</tr>"
      + "<tr style='background:#fdf8f3;'>"
      + "<td style='padding:14px 20px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#0E0E0E;'>Weekly</td>"
      + "<td style='padding:14px 20px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#0E0E0E;text-align:right;'>&#x20A6;1,000</td>"
      + "</tr>"
      + "</table>"
      + "</td></tr>"

      // Para 3 — deadline
      + "<tr><td style='padding-bottom:20px;'>"
      + "<p style='margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;'>You have <strong>48&ndash;72 hours</strong> to make your first payment. If payment isn&rsquo;t received in time, your spot goes to the next person. We&rsquo;re not trying to be harsh &mdash; we just have to keep things moving.</p>"
      + "</td></tr>"

      // Para 4 — what happens after
      + "<tr><td style='padding-bottom:36px;'>"
      + "<p style='margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;'>Once payment is confirmed, you&rsquo;ll be added to the community and assigned to your squad. Then we get to work.</p>"
      + "</td></tr>"

      // CTA
      + "<tr><td style='padding-bottom:48px;'>"
      + "<a href='https://squared.ng/join.html' class='cta-btn' style='display:inline-block;background:#F67A3E;color:#0E0E0E;-webkit-text-fill-color:#0E0E0E;padding:16px 36px;border-radius:100px;text-decoration:none;font-size:15px;font-weight:700;font-family:Arial,sans-serif;'>Pay &amp; Secure Your Spot &rarr;</a>"
      + "</td></tr>"

      // Divider
      + "<tr><td style='padding-bottom:28px;'>"
      + "<div style='height:1px;background:#e8e0d8;'></div>"
      + "</td></tr>"

      // Footer
      + "<tr><td>"
      + "<p style='margin:0 0 6px;font-size:13px;line-height:1.6;font-family:Arial,sans-serif;color:#999;'>Questions? Reply to this email or DM us at @squared_ng on Twitter/X or Instagram.</p>"
      + "<p style='margin:0;font-size:12px;font-family:Arial,sans-serif;color:#bbb;'>&#169; 2025 Squared &middot; <a href='https://squared.ng' style='color:#F67A3E;text-decoration:none;'>squared.ng</a></p>"
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
        from:    "Squared <hello@squared.ng>",
        to:      applicant_email,
        subject: "You\u2019re in \u2014 Welcome to Squared",
        html:    html,
      }),
    });

    const data = await resendRes.json();
    return new Response(JSON.stringify(data), {
      status:  resendRes.ok ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
