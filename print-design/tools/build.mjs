// ساخت خروجی‌ها: HTML → PDF (برداری، فونت جاسازی‌شده) و PNG با Chromium (Playwright).
// اجرا: npm run build                 همه اقلام
//       node tools/build.mjs catalog  فقط کاتالوگ

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { letterhead, page, OPTIONS } from '../src/letterhead.mjs';
import { compareSheet } from '../src/compare.mjs';
import { samplePages } from '../src/catalog.mjs';
import { systemSheet } from '../src/catalog-system.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, 'build');
fs.mkdirSync(BUILD, { recursive: true });

const only = process.argv[2] || 'all';
const want = (k) => only === 'all' || only === k;

const write = (name, html) => {
  const file = path.join(BUILD, name);
  fs.writeFileSync(file, html);
  return pathToFileURL(file).href;
};
const outDir = (name) => {
  const dir = path.join(ROOT, 'dist', name);
  fs.mkdirSync(path.join(dir, 'png'), { recursive: true });
  return dir;
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

// ═══ مرحله ۱: سربرگ ═══
if (want('letterhead')) {
  const OUT = outDir('01-letterhead-options');
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

  const { body, styles } = compareSheet();
  const url = write('compare_LH-01.html', page(`<style>${styles}</style>${body}`, {
    title: 'مقایسه گزینه‌های سربرگ',
    css: ['../src/letterhead.css'],
  }));
  const { p, ctx } = await open(url, { width: 420, height: 297 });
  await p.pdf({ path: path.join(OUT, 'compare_LH-01_options_A3.pdf'), width: '420mm', height: '297mm', printBackground: true });
  await ctx.close();
  console.log('✓ سربرگ →', path.relative(ROOT, OUT));
}

// ═══ مرحله ۲: سیستم صفحه‌بندی کاتالوگ ═══
if (want('catalog')) {
  const OUT = outDir('02-catalog-system');
  const names = ['p01-cover', 'p03-at-a-glance', 'p07-guarantee'];
  const url = write('catalog_samples.html', page(samplePages().join('\n'), {
    title: 'کاتالوگ — صفحه‌های نمونه',
    css: ['../src/catalog.css'],
  }));
  const { p, ctx } = await open(url, { scale: 2 });
  await p.pdf({ path: path.join(OUT, 'catalog_samples.pdf'), preferCSSPageSize: true, printBackground: true });
  const pages = p.locator('.cp');
  for (let i = 0; i < names.length; i++) await pages.nth(i).screenshot({ path: path.join(OUT, 'png', `${names[i]}.png`) });
  await p.evaluate(() => document.body.classList.add('show-grid'));
  await p.pdf({ path: path.join(OUT, 'catalog_samples_grid.pdf'), preferCSSPageSize: true, printBackground: true });
  for (let i = 0; i < names.length; i++) await pages.nth(i).screenshot({ path: path.join(OUT, 'png', `${names[i]}-grid.png`) });
  await ctx.close();

  const sys = write('catalog_system.html', page(systemSheet(), {
    title: 'کاتالوگ — سیستم صفحه‌بندی',
    css: ['../src/catalog.css', '../src/catalog-system.css'],
  }));
  const s = await open(sys, { width: 420, height: 297, scale: 2 });
  await s.p.pdf({ path: path.join(OUT, 'catalog_system_A3.pdf'), width: '420mm', height: '297mm', printBackground: true });
  await s.p.locator('.sys').first().screenshot({ path: path.join(OUT, 'png', 'system-sheet.png') });
  await s.ctx.close();
  console.log('✓ کاتالوگ →', path.relative(ROOT, OUT));
}

await browser.close();
