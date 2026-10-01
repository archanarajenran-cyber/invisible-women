// Tiny server: serves the website and calls Gemini so the API key stays secret.
// Needs Node 18+. No npm packages required.
const http = require('http'), fs = require('fs'), path = require('path');

// Read GEMINI_API_KEY from the .env file (never put the key in script.js)
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach(l => {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch (e) { /* no .env file yet */ }

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const PORT = process.env.PORT || 3000;
const FILES = { 'index.html': 'text/html; charset=utf-8', 'style.css': 'text/css; charset=utf-8',
  'script.js': 'text/javascript; charset=utf-8', 'scheme.js': 'text/javascript; charset=utf-8' };

const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = ''; for await (const c of req) body += c;
    try {
      if (!KEY || KEY.includes('PASTE')) return json(res, 500, { error: 'NO_KEY' });
      const { system, contents } = JSON.parse(body);
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { temperature: 0.3 } })
      });
      const d = await r.json();
      if (!r.ok) return json(res, 500, { error: d.error?.message || 'Gemini error' });
      const text = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
      return json(res, 200, { text });
    } catch (e) { return json(res, 500, { error: e.message }); }
  }
  const name = (req.url.split('?')[0] === '/' ? 'index.html' : req.url.slice(1).split('?')[0]);
  if (!FILES[name]) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': FILES[name] });
  fs.createReadStream(path.join(__dirname, name)).pipe(res);
}).listen(PORT, () => console.log(`Open http://localhost:${PORT}  (API key ${KEY ? 'found' : 'MISSING - see README'})`));
