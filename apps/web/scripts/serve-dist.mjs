/**
 * Petit serveur statique pour les tests, qui imite GitHub Pages :
 * un dossier sert son index.html, un fichier absent renvoie 404.html avec le statut 404.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../dist');
const port = Number(process.env.PORT ?? 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
};

async function file(path) {
  try {
    const info = await stat(path);
    if (info.isDirectory()) return file(join(path, 'index.html'));
    return path;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = normalize(join(root, decodeURIComponent(url.pathname)));
  const found = path.startsWith(root) ? await file(path) : null;
  const target = found ?? join(root, '404.html');
  const body = await readFile(target);
  res.writeHead(found ? 200 : 404, {
    'content-type': types[extname(target)] ?? 'application/octet-stream',
    'cache-control': 'no-cache',
  });
  res.end(body);
}).listen(port, () => console.log(`Kitzy (dist) sur http://localhost:${port}/`));
