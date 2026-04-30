export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { full_name, email } = req.body;

  const response = await fetch('https://kvsanzlkekfpmbzeesh.supabase.co/rest/v1/prize_waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'sb_publishable_gVozftJ489LvZBkI55GidA_nvIzhOFi',
      'Authorization': 'Bearer sb_publishable_gVozftJ489LvZBkI55GidA_nvIzhOFi',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ full_name, email })
  });

  if (response.status === 409) return res.status(409).json({ error: 'duplicate' });
  if (!response.ok) {
    const text = await response.text();
    console.error('Supabase error:', response.status, text);
    return res.status(500).json({ error: 'failed' });
  }
  return res.status(200).json({ success: true });
}
