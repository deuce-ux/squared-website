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

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:48px 24px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- Logo -->
  <tr><td style="padding-bottom:40px;">
    <span style="font-size:18px;font-weight:800;letter-spacing:-0.03em;font-family:Arial,sans-serif;color:#0E0E0E;">squared.</span>
  </td></tr>

  <!-- Eyebrow -->
  <tr><td style="padding-bottom:12px;">
    <p style="margin:0;font-size:10px;letter-spacing:0.14em;color:#F67A3E;font-weight:700;font-family:Arial,sans-serif;text-transform:uppercase;">The Chosen One.</p>
  </td></tr>

  <!-- Headline -->
  <tr><td style="padding-bottom:32px;">
    <h1 style="margin:0;font-size:36px;font-weight:800;line-height:1.1;letter-spacing:-0.02em;font-family:Arial,sans-serif;color:#0E0E0E;">I'm genuinely happy<br>to have you here.</h1>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding-bottom:28px;">
    <div style="height:1px;background:#e8e0d8;"></div>
  </td></tr>

  <!-- Para 1 -->
  <tr><td style="padding-bottom:20px;">
    <p style="margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">Hi ${firstName},</p>
  </td></tr>

  <tr><td style="padding-bottom:20px;">
    <p style="margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">You've been selected to join Squared from the many applications we received. We chose you because we believe you'll thrive in and contribute to this community.</p>
  </td></tr>

  <tr><td style="padding-bottom:20px;">
    <p style="margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">Squared was created as a space for people who want to do better, stay consistent, and grow together. It's not about perfection — it's about showing up, even on the days when it feels hard.</p>
  </td></tr>

  <tr><td style="padding-bottom:20px;">
    <p style="margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">Before you join the group, I'd love for you to take a moment to read this post. It explains what Squared is, why we exist, what you stand to gain, and the values we uphold: <a href="https://www.instagram.com/p/DLo8ecEIeKm/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" style="color:#F67A3E;font-weight:600;text-decoration:none;">Read the post here.</a></p>
  </td></tr>

  <tr><td style="padding-bottom:28px;">
    <p style="margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">Squared has grown into a place where people build routines, fight procrastination, gain clarity, learn discipline, and even overcome personal struggles. We've seen over and over that when people lean into this rhythm, something shifts. Growth becomes easier. Consistency becomes natural. And life starts to feel less confusing.</p>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding-bottom:28px;">
    <div style="height:1px;background:#e8e0d8;"></div>
  </td></tr>

  <!-- What happens next -->
  <tr><td style="padding-bottom:20px;">
    <p style="margin:0;font-size:16px;font-weight:700;font-family:Arial,sans-serif;color:#0E0E0E;">Here's what happens next:</p>
  </td></tr>

  <!-- Step 1 -->
  <tr><td style="padding-bottom:8px;">
    <p style="margin:0;font-size:16px;font-weight:700;font-family:Arial,sans-serif;color:#0E0E0E;">1. Complete your membership payment within 24 hours:</p>
  </td></tr>

  <tr><td style="padding-bottom:12px;">
    <p style="margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">Pay via Selar — you can choose to pay &#x20A6;4,000 monthly, &#x20A6;2,000 bi-weekly, or &#x20A6;1,000 weekly:</p>
  </td></tr>

  <!-- Selar CTA -->
  <tr><td style="padding-bottom:20px;">
    <a href="https://selar.com/a3y3131i16" style="display:inline-block;background:#F67A3E;color:#0E0E0E;-webkit-text-fill-color:#0E0E0E;padding:14px 32px;border-radius:100px;text-decoration:none;font-size:15px;font-weight:700;font-family:Arial,sans-serif;">Pay via Selar &rarr;</a>
  </td></tr>

  <!-- Bank transfer -->
  <tr><td style="padding-bottom:20px;">
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;font-family:Arial,sans-serif;color:#1a1a1a;">Or make a bank transfer to:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e0d8;border-radius:10px;overflow:hidden;">
      <tr style="background:#fdf8f3;">
        <td style="padding:12px 18px;font-family:Arial,sans-serif;font-size:13px;color:#999;border-bottom:1px solid #e8e0d8;">Bank</td>
        <td style="padding:12px 18px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#0E0E0E;border-bottom:1px solid #e8e0d8;">United Bank for Africa (UBA)</td>
      </tr>
      <tr style="background:#ffffff;">
        <td style="padding:12px 18px;font-family:Arial,sans-serif;font-size:13px;color:#999;border-bottom:1px solid #e8e0d8;">Account Name</td>
        <td style="padding:12px 18px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#0E0E0E;border-bottom:1px solid #e8e0d8;">Chukwudumebi Covenant</td>
      </tr>
      <tr style="background:#fdf8f3;">
        <td style="padding:12px 18px;font-family:Arial,sans-serif;font-size:13px;color:#999;border-bottom:1px solid #e8e0d8;">Account Number</td>
        <td style="padding:12px 18px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#0E0E0E;border-bottom:1px solid #e8e0d8;">2185825692</td>
      </tr>
      <tr style="background:#ffffff;">
        <td style="padding:12px 18px;font-family:Arial,sans-serif;font-size:13px;color:#999;">Amount</td>
        <td style="padding:12px 18px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#F67A3E;">&#x20A6;4,000 (Monthly)</td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding-bottom:8px;">
    <p style="margin:0;font-size:15px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">After paying, <strong>reply to this email with your proof of payment.</strong></p>
  </td></tr>

  <!-- Deadline warning -->
  <tr><td style="padding-bottom:28px;">
    <p style="margin:0;font-size:14px;line-height:1.7;font-family:Arial,sans-serif;color:#999;font-style:italic;">If you don't complete payment within 48 hours, your spot will go to the next person on our waitlist.</p>
  </td></tr>

  <!-- Step 2 -->
  <tr><td style="padding-bottom:8px;">
    <p style="margin:0;font-size:16px;font-weight:700;font-family:Arial,sans-serif;color:#0E0E0E;">2. Once payment is confirmed, you'll receive:</p>
  </td></tr>
  <tr><td style="padding-bottom:20px;">
    <ul style="margin:8px 0 0;padding-left:20px;font-size:15px;line-height:1.9;font-family:Arial,sans-serif;color:#1a1a1a;">
      <li>Your onboarding message</li>
      <li>The link to the main community group</li>
      <li>Your first steps inside Squared</li>
    </ul>
  </td></tr>

  <!-- Step 3 -->
  <tr><td style="padding-bottom:32px;">
    <p style="margin:0;font-size:16px;font-weight:700;font-family:Arial,sans-serif;color:#0E0E0E;">3. Join the community and introduce yourself with a picture.</p>
    <p style="margin:8px 0 0;font-size:15px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">We'll guide you through everything once you're in.</p>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding-bottom:28px;">
    <div style="height:1px;background:#e8e0d8;"></div>
  </td></tr>

  <!-- Closing -->
  <tr><td style="padding-bottom:32px;">
    <p style="margin:0 0 16px;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">You're going to fit in perfectly here, and I can't wait to see how you grow in the next few weeks.</p>
    <p style="margin:0;font-size:16px;line-height:1.75;font-family:Arial,sans-serif;color:#1a1a1a;">Welcome to Squared. We're building something beautiful, and I'm glad you're part of it.</p>
  </td></tr>

  <!-- Signature -->
  <tr><td style="padding-bottom:48px;">
    <p style="margin:0;font-size:15px;line-height:1.8;font-family:Arial,sans-serif;color:#1a1a1a;">Warmly,<br><strong>Covenant</strong><br><span style="color:#999;font-size:13px;">Founder, Squared</span></p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="border-top:1px solid #e8e0d8;padding-top:24px;">
    <p style="margin:0 0 6px;font-size:13px;line-height:1.6;font-family:Arial,sans-serif;color:#999;">Questions? Reply to this email or DM us at @TheSquaredHq on Twitter/X and Instagram.</p>
    <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;color:#bbb;">&copy; 2025 Squared &middot; <a href="https://squared.ng" style="color:#F67A3E;text-decoration:none;">squared.ng</a></p>
  </td></tr>

</table>
</td></tr></table>
</body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Deno.env.get("RESEND_API_KEY"),
      },
      body: JSON.stringify({
        from:    "Covenant from Squared <hello@squared.ng>",
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
