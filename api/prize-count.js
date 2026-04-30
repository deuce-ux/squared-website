const SUPABASE_URL = 'https://kvsanzslkekfpmbzeesh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c2FuenNsa2VrZnBtYnplZXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1Njk3NjgsImV4cCI6MjA5MzE0NTc2OH0.o3dtNSmp6FKQKjkWnD_VAbDww8naCKkxj60tg1s56Fw';

export default async function handler(req, res) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/prize_waitlist?select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact'
    }
  });

  const range = response.headers.get('content-range');
  const count = range ? parseInt(range.split('/')[1], 10) : 0;
  return res.status(200).json({ count: isNaN(count) ? 0 : count });
}
