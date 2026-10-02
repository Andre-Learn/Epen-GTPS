const { get } = require('@vercel/blob');
const defaultConfig = require('../data/default-config.json');

const CONFIG_PATH = 'epen/site-config.json';

async function readConfig() {
  try {
    const result = await get(CONFIG_PATH, { access: 'private', useCache: false });
    if (result && result.statusCode === 200) {
      const text = await new Response(result.stream).text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (_) {}
  return defaultConfig;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const config = await readConfig();
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(200).json(config);
};
