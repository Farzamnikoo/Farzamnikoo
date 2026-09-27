// ساخت خروجی‌ها: HTML → PDF (برداری، فونت جاسازی‌شده) و PNG با Chromium (Playwright).
// اجرا: npm run build                   همه اقلام
//       node tools/build.mjs catalog    مرحله ۲: صفحه‌های نمونه و برگه سیستم
//       node tools/build.mjs catalog16  مرحله ۳: کاتالوگ کامل ۱۶ صفحه
//       node tools/build.mjs brochure   مرحله ۴: بروشور سه‌لت
//       node tools/build.mjs lh-final   سربرگ‌های نهایی LH-01 تا LH-04 (گزینه الف)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { letterhead, letterheadFinal, FINAL, page, OPTIONS } from '../src/letterhead.mjs';
import { compareSheet } from '../src/compare.mjs';
import { samplePages, allPages } from '../src/catalog.mjs';
import { systemSheet } from '../src/catalog-system.mjs';
import { brochureSheets } from '../src/brochure.mjs';

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

// ═══ مرحله ۳: کاتالوگ کامل ۱۶ صفحه ═══
if (want('catalog16')) {
  const OUT = outDir('03-catalog');
  const pages = allPages();
  const url = write('catalog_16p.html', page(pages.join('\n'), {
    title: 'کاتالوگ صندوق پژوهش و فناوری توسعه و آینده',
    css: ['../src/catalog.css'],
  }));
  const { p, ctx } = await open(url, { scale: 2 });
  await p.pdf({ path: path.join(OUT, 'catalog_16p.pdf'), preferCSSPageSize: true, printBackground: true });
  const els = p.locator('.cp');
  for (let i = 0; i < pages.length; i++) {
    await els.nth(i).screenshot({ path: path.join(OUT, 'png', `p${String(i + 1).padStart(2, '0')}.png`) });
  }
  await ctx.close();

  // دوصفحه‌ای‌ها به ترتیب راست‌به‌چپ: صفحه زوج راست، فرد چپ؛ جلد بیرونی باز = [جلد رو | پشت جلد]
  const pairs = [[16, 1], ...Array.from({ length: 7 }, (_, k) => [2 * k + 2, 2 * k + 3])];
  const spreadCss = `<style>
    @page { size: 420mm 297mm; margin: 0; }
    .spread-sheet { width: 420mm; height: 297mm; display: flex; break-after: page; overflow: hidden; }
    .spread-sheet .cp { break-after: auto; margin: 0 !important; flex: none; }
  </style>`;
  const sp = write('catalog_spreads.html', page(spreadCss + pairs.map(([r, l]) =>
    `<div class="spread-sheet">${pages[r - 1]}${pages[l - 1]}</div>`).join('\n'), {
    title: 'کاتالوگ — دوصفحه‌ای‌ها',
    css: ['../src/catalog.css'],
  }));
  const s2 = await open(sp, { width: 420, height: 297 });
  await s2.p.pdf({ path: path.join(OUT, 'catalog_spreads_A3.pdf'), width: '420mm', height: '297mm', printBackground: true });
  await s2.ctx.close();
  console.log('✓ کاتالوگ ۱۶ صفحه →', path.relative(ROOT, OUT));
}

// ═══ سربرگ‌های نهایی ═══
if (want('lh-final')) {
  const OUT = outDir('05-letterhead');
  for (const code of Object.keys(FINAL)) {
    const url = write(`${code}.html`, page(letterheadFinal(code), { title: `${code} ${FINAL[code]}`, css: ['../src/letterhead.css'] }));
    const { p, ctx } = await open(url, { scale: 2 });
    await p.pdf({ path: path.join(OUT, `${code}_RGB.pdf`), preferCSSPageSize: true, printBackground: true });
    await p.locator('.sheet').screenshot({ path: path.join(OUT, 'png', `${code}.png`) });
    await ctx.close();
    // PNG شفاف ۳۰۰ نقطه در اینچ برای نامه‌های دیجیتال
    const t = await open(url, { scale: 300 / 96 });
    await t.p.evaluate(() => document.body.classList.add('transparent'));
    await t.p.locator('.sheet').screenshot({ path: path.join(OUT, 'png', `${code}_transparent_300dpi.png`), omitBackground: true });
    await t.ctx.close();
  }
  console.log('✓ سربرگ‌های نهایی →', path.relative(ROOT, OUT));
}

// ═══ مرحله ۴: بروشور سه‌لت ═══
if (want('brochure')) {
  const OUT = outDir('04-brochure');
  const url = write('brochure.html', page(brochureSheets().join('\n'), {
    title: 'بروشور صندوق پژوهش و فناوری توسعه و آینده',
    css: ['../src/brochure.css'],
  }));
  const { p, ctx } = await open(url, { width: 297, height: 210, scale: 2 });
  await p.pdf({ path: path.join(OUT, 'brochure_trifold.pdf'), width: '297mm', height: '210mm', printBackground: true });
  const sheets = p.locator('.bs');
  await sheets.nth(0).screenshot({ path: path.join(OUT, 'png', 'outside.png') });
  await sheets.nth(1).screenshot({ path: path.join(OUT, 'png', 'inside.png') });
  await p.evaluate(() => document.body.classList.add('show-folds'));
  await sheets.nth(0).screenshot({ path: path.join(OUT, 'png', 'outside-folds.png') });
  await sheets.nth(1).screenshot({ path: path.join(OUT, 'png', 'inside-folds.png') });
  await ctx.close();
  console.log('✓ بروشور →', path.relative(ROOT, OUT));
}

await browser.close();
