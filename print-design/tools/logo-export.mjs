// خروجی نشان در قالب‌های PDF (برداری) و PNG شفاف از روی SVGهای brand/logo.
// اجرا: node tools/logo-export.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'brand', 'logo');
const OUT = path.join(ROOT, 'dist', 'logo');
fs.mkdirSync(OUT, { recursive: true });

const MM = 96 / 25.4;
const browser = await chromium.launch();
for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.svg'))) {
  const name = f.replace(/\.svg$/, '');
  const svg = fs.readFileSync(path.join(SRC, f), 'utf8');
  const [, , vw, vh] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  // عرض مرجع: ۵۰ میلی‌متر برای نسخه بی‌قاب، ۳۰ میلی‌متر برای نسخه با قاب
  const wmm = name.includes('framed') ? 30 : 50;
  const hmm = (wmm * vh) / vw;
  const html = `<!doctype html><html><head><style>@page{size:${wmm}mm ${hmm}mm;margin:0}html,body{margin:0;background:transparent}img{display:block;width:${wmm}mm;height:${hmm}mm}</style></head><body><img src="${pathToFileURL(path.join(SRC, f)).href}"></body></html>`;
  const tmp = path.join(ROOT, 'build', `logo-${name}.html`);
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  fs.writeFileSync(tmp, html);
  const scale = 2000 / (wmm * MM); // PNG با عرض ۲۰۰۰ پیکسل
  const ctx = await browser.newContext({ deviceScaleFactor: scale, viewport: { width: Math.ceil(wmm * MM), height: Math.ceil(hmm * MM) } });
  const p = await ctx.newPage();
  await p.goto(pathToFileURL(tmp).href);
  await p.pdf({ path: path.join(OUT, `${name}.pdf`), width: `${wmm}mm`, height: `${hmm}mm`, printBackground: false });
  await p.locator('img').screenshot({ path: path.join(OUT, `${name}.png`), omitBackground: true });
  await ctx.close();
  fs.copyFileSync(path.join(SRC, f), path.join(OUT, f));
  console.log('✓', name);
}
await browser.close();
