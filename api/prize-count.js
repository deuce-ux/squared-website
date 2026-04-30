export default async function handler(req, res) {
  const response = await fetch('https://kvsanzlkekfpmbzeesh.supabase.co/rest/v1/prize_waitlist?select=id', {
    headers: {
      'apikey': 'sb_publishable_gVozftJ489LvZBkI55GidA_nvIzhOFi',
      'Authorization': 'Bearer sb_publishable_gVozftJ489LvZBkI55GidA_nvIzhOFi',
      'Prefer': 'count=exact'
    }
  });

  const range = response.headers.get('content-range');
  const count = range ? parseInt(range.split('/')[1], 10) : 0;
  return res.status(200).json({ count: isNaN(count) ? 0 : count });
}
