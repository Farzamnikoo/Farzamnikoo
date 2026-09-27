// ساخت خروجی‌ها: HTML → PDF (برداری، فونت جاسازی‌شده) و PNG با Chromium (Playwright).
// اجرا: npm run build

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { letterhead, page, OPTIONS } from '../src/letterhead.mjs';
import { compareSheet } from '../src/compare.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, 'build');
const OUT = path.join(ROOT, 'dist', '01-letterhead-options');
fs.mkdirSync(BUILD, { recursive: true });
fs.mkdirSync(path.join(OUT, 'png'), { recursive: true });

const write = (name, html) => {
  const file = path.join(BUILD, name);
  fs.writeFileSync(file, html);
  return pathToFileURL(file).href;
};

const MM = 96 / 25.4; // CSS px per mm
const browser = await chromium.launch();

async function open(url, { scale = 1, width = 210, height = 297 } = {}) {
  const ctx = await browser.newContext({
    deviceScaleFactor: scale,
    viewport: { width: Math.ceil(width * MM), height: Math.ceil(height * MM) },
  });
  const p = await ctx.newPage();
  await p.goto(url);
  await p.evaluate(() => document.fonts.ready);
  return { p, ctx };
}

// ۱) هر گزینه به‌صورت A4 مستقل (پیش‌نمایش در اندازه برش، RGB)
for (const k of Object.keys(OPTIONS)) {
  const url = write(`LH-01_option-${k}.html`, page(letterhead(k), {
    title: `LH-01 گزینه ${OPTIONS[k].code}`,
    css: ['../src/letterhead.css'],
  }));
  const { p, ctx } = await open(url, { scale: 2 });
  await p.pdf({ path: path.join(OUT, `LH-01_option-${k.toUpperCase()}.pdf`), preferCSSPageSize: true, printBackground: true });
  const sheet = p.locator('.sheet');
  await sheet.screenshot({ path: path.join(OUT, 'png', `option-${k}.png`) });
  await p.evaluate(() => document.body.classList.add('show-guides'));
  await sheet.screenshot({ path: path.join(OUT, 'png', `option-${k}-guides.png`) });
  await ctx.close();

  // برش‌های هدر و فوتر با وضوح بالا برای بررسی جزئیات
  const hi = await open(url, { scale: 4 });
  await hi.p.screenshot({ path: path.join(OUT, 'png', `option-${k}-head.png`), clip: { x: 0, y: 0, width: 210 * MM, height: 44 * MM } });
  await hi.p.screenshot({ path: path.join(OUT, 'png', `option-${k}-foot.png`), clip: { x: 0, y: 266 * MM, width: 210 * MM, height: 31 * MM } });
  await hi.ctx.close();
}

// ۲) برگه مقایسه A3 افقی
{
  const { body, styles } = compareSheet();
  const url = write('compare_LH-01.html', page(`<style>${styles}</style>${body}`, {
    title: 'مقایسه گزینه‌های سربرگ',
    css: ['../src/letterhead.css'],
  }));
  const { p, ctx } = await open(url, { width: 420, height: 297 });
  await p.pdf({ path: path.join(OUT, 'compare_LH-01_options_A3.pdf'), width: '420mm', height: '297mm', printBackground: true });
  await ctx.close();
}

await browser.close();
console.log('✓ خروجی‌ها در', path.relative(ROOT, OUT));
