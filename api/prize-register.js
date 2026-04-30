const SUPABASE_URL = 'https://kvsanzlkekfpmbzeesh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c2FuenNsa2VrZnBtYnplZXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1Njk3NjgsImV4cCI6MjA5MzE0NTc2OH0.o3dtNSmp6FKQKjkWnD_VAbDww8naCKkxj60tg1s56Fw';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { full_name, email } = req.body;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/prize_waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ full_name, email })
  });

  if (response.status === 409) return res.status(409).json({ error: 'duplicate' });
  if (!response.ok) {
    const text = await response.text();
    console.error('Supabase error:', response.status, text);
    return res.status(500).json({ error: 'failed', detail: text });
  }
  return res.status(200).json({ success: true });
}
