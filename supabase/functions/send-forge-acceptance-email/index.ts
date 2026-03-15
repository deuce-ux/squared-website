import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  /* Allow CORS from admin panel */
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { applicant_name, applicant_email } = await req.json();

    if (!applicant_email) {
      return new Response(JSON.stringify({ error: 'applicant_email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const firstName = applicant_name ? applicant_name.split(' ')[0] : 'there';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Squared <forge@squared.ng>',
        to: applicant_email,
        subject: "You're in — Forge 1.0",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #FFF1E0; padding: 40px; border-radius: 16px;">
            <p style="font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #F67A3E; margin: 0 0 32px;">Squared</p>
            <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 16px; color: #FFF1E0; letter-spacing: -0.02em;">You're in, ${firstName}.</h1>
            <p style="font-size: 16px; line-height: 1.7; color: rgba(255,241,224,0.7); margin: 0 0 24px;">
              Your application for Forge 1.0 has been reviewed and accepted. We're glad you applied.
            </p>
            <p style="font-size: 16px; line-height: 1.7; color: rgba(255,241,224,0.7); margin: 0 0 24px;">
              Forge 1.0 kicks off on April 1st. You'll receive details about the first session, what to prepare, and how to access the group shortly.
            </p>
            <p style="font-size: 16px; line-height: 1.7; color: rgba(255,241,224,0.7); margin: 0 0 32px;">
              In the meantime — join Squared Core if you haven't already. The community is where the work happens.
            </p>
            <a href="https://squared.ng/join.html" style="display: inline-block; background: #F67A3E; color: #0E0E0E; padding: 14px 28px; border-radius: 100px; text-decoration: none; font-size: 15px; font-weight: 700;">
              Join Squared Core →
            </a>
            <p style="font-size: 13px; color: rgba(255,241,224,0.3); margin: 48px 0 0;">
              © 2025 Squared. You're receiving this because you applied for Forge 1.0.
            </p>
          </div>
        `,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
