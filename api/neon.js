// Vercel Serverless Function: Proxy Neon SQL
// Mengatasi masalah CORS, timeout cold-start, dan multi-query dari client

const NEON_CONNECTION_STRING = process.env.DATABASE_URL || 
  process.env.NEON_DATABASE_URL || 
  'postgresql://neondb_owner:npg_nTzvpcJeB07A@ep-nameless-salad-betekr6e-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function executeSingleQuery(neonEndpoint, connStr, query, params = []) {
  const neonRes = await fetch(neonEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connStr
    },
    body: JSON.stringify({ query, params })
  });

  const data = await neonRes.json();
  if (!neonRes.ok) {
    const msg = data.message || data.error || ('HTTP Error ' + neonRes.status);
    throw new Error(msg);
  }
  return data;
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Neon-Connection-String, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { query, queries, params = [] } = payload;

    if (!query && (!queries || !Array.isArray(queries))) {
      return res.status(400).json({ error: 'Parameter query atau queries (array) diperlukan.' });
    }

    const connStr = req.headers['neon-connection-string'] || NEON_CONNECTION_STRING;

    let host = 'ep-nameless-salad-betekr6e-pooler.c-9.us-east-2.aws.neon.tech';
    try {
      const u = new URL(connStr.replace('postgresql://', 'http://').replace('postgres://', 'http://'));
      if (u.hostname) host = u.hostname;
    } catch (e) {}

    const neonEndpoint = `https://${host}/sql`;

    // 1. Single query execution
    if (query) {
      const data = await executeSingleQuery(neonEndpoint, connStr, query, params);
      return res.status(200).json(data);
    }

    // 2. Batch queries execution (dijalankan berurutan di server)
    const results = [];
    for (const q of queries) {
      if (typeof q === 'string' && q.trim()) {
        const itemResult = await executeSingleQuery(neonEndpoint, connStr, q.trim());
        results.push(itemResult);
      }
    }

    return res.status(200).json({ success: true, results, rowCount: results.length });
  } catch (error) {
    console.error('[API/Neon] Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error'
    });
  }
};
