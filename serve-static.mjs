import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PORT = 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const SHARED_FILE = path.join(__dirname, 'shared', 'layout.js');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
};

function listObservatoires() {
  const dir = path.join(PUBLIC_DIR, 'observatoires');
  let files = [];
  try { files = fs.readdirSync(dir).filter(f => f.endsWith('.html')); } catch {}
  return files.sort();
}

function serveIndexPage(res) {
  const files = listObservatoires();
  const links = files.map(f => {
    const name = f.replace(/\.html$/, '');
    return `    <li><a href="/observatoires/${f}">${name}</a></li>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pays Basque Open Data — Visualisation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #f5f5f5;
      color: #1b263b;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      padding: 2.5rem;
      max-width: 480px;
      width: 90%;
    }
    h1 {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    ul {
      list-style: none;
    }
    li {
      margin-bottom: 0.5rem;
    }
    a {
      display: block;
      padding: 0.75rem 1rem;
      background: #f0fdf4;
      color: #059669;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.95rem;
      transition: background 0.2s;
    }
    a:hover {
      background: #dcfce7;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🌍 Pays Basque Open Data</h1>
    <p>Choisissez un observatoire à visualiser :</p>
    <ul>
${links}
    </ul>
  </div>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = url.pathname;

  // Page d'accueil : liste des observatoires disponibles
  if (filePath === '/') {
    serveIndexPage(res);
    return;
  }

  // Cas spécial : /shared/layout.js est à la racine du projet
  if (filePath === '/shared/layout.js') {
    fs.readFile(SHARED_FILE, 'utf-8', (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Fichier introuvable : shared/layout.js');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(content);
    });
    return;
  }

  // Tout le reste est servi depuis public/
  const fullPath = path.join(PUBLIC_DIR, filePath);
  const ext = path.extname(fullPath);

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Fichier introuvable : ' + filePath);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('==========================================');
  console.log('  🌍 Pays Basque Open Data');
  console.log('  Visualisation des pages HTML');
  console.log('==========================================');
  console.log('');
  console.log('  ▶  http://localhost:' + PORT);
  console.log('');
  console.log('  Pages disponibles :');
  console.log('');

  const files = listObservatoires();
  for (const f of files) {
    console.log('    📄 http://localhost:' + PORT + '/observatoires/' + f);
  }
  console.log('');
  console.log('==========================================');
  console.log('  Le navigateur va s\'ouvrir...');
  console.log('  Appuyez sur Ctrl+C pour arrêter.');
  console.log('==========================================');
  console.log('');

  // Ouvre la page d'accueil (liste des observatoires)
  try {
    execSync('open http://localhost:' + PORT);
  } catch {}
});