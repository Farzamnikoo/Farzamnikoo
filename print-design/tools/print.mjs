// نسخه‌های آماده چاپ: نشت ۳ میلی‌متر، علائم برش (و تا برای بروشور)، تبدیل به CMYK با پروفایل FOGRA39
// و خروجی PDF/X-1a با Ghostscript. نسخه RGB (دیجیتال) جدا در پوشه‌های dist/0x ساخته می‌شود.
// اجرا: node tools/print.mjs     (نیازمند Ghostscript)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { letterheadFinal, FINAL, page } from '../src/letterhead.mjs';
import { master } from '../data/master.mjs';
import { allPages } from '../src/catalog.mjs';
import { brochureSheets, OUTSIDE, INSIDE } from '../src/brochure.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, 'build', 'print');
const OUT = path.join(ROOT, 'dist', '06-print');
const ICC = path.join(ROOT, 'brand', 'icc', 'CoatedFOGRA39_argyll.icc');
fs.mkdirSync(BUILD, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const SLUG = 10;   // فاصله لبه برش تا لبه صفحه (میلی‌متر)
const BLEED = 3;
const PT = 72 / 25.4;

// علائم برش در گوشه‌ها و علائم تا (خط‌چین) بیرون از نشت
function marks(W, H, { folds = [], label = '' } = {}) {
  const PW = W + 2 * SLUG, PH = H + 2 * SLUG;
  const x0 = SLUG, y0 = SLUG, x1 = SLUG + W, y1 = SLUG + H, o = BLEED + 0.5, L = SLUG - 0.5;
  const ln = (a, b, c, d, dash = '') => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#000" stroke-width="0.12"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const crop = [
    ln(x0 - L, y0, x0 - o, y0), ln(x0, y0 - L, x0, y0 - o),
    ln(x1 + o, y0, x1 + L, y0), ln(x1, y0 - L, x1, y0 - o),
    ln(x0 - L, y1, x0 - o, y1), ln(x0, y1 + o, x0, y1 + L),
    ln(x1 + o, y1, x1 + L, y1), ln(x1, y1 + o, x1, y1 + L),
  ];
  const fold = folds.flatMap((fx) => [ln(x0 + fx, y0 - L, x0 + fx, y0 - o, '1 0.8'), ln(x0 + fx, y1 + o, x0 + fx, y1 + L, '1 0.8')]);
  return `<svg class="marks" viewBox="0 0 ${PW} ${PH}" style="width:${PW}mm;height:${PH}mm">${crop.join('')}${fold.join('')}
    <text x="${x0}" y="${PH - 3}" font-size="2.2" font-family="Inter, sans-serif" fill="#000">${label}</text></svg>`;
}

function printDoc({ name, items, W, H, css, folds = () => [], labels }) {
  const PW = W + 2 * SLUG, PH = H + 2 * SLUG;
  const style = `<style>
    @page { size: ${PW}mm ${PH}mm; margin: 0; }
    html, body { margin: 0; background: #fff; }
    .pm { position: relative; width: ${PW}mm; height: ${PH}mm; overflow: hidden; break-after: page; background: #fff; }
    .pm .art { position: absolute; left: ${SLUG - BLEED}mm; top: ${SLUG - BLEED}mm; }
    .pm .marks { position: absolute; inset: 0; }
    .print .lh, .print .cp, .print .bs { --bleed: ${BLEED}mm; margin: 0 !important; }
    .print .cp, .print .bs { break-after: auto; }
  </style>`;
  const body = items.map((html, i) => `<section class="pm"><div class="art">${html}</div>${marks(W, H, { folds: folds(i), label: labels[i] })}</section>`).join('\n');
  // عنوان PDF (فیلد Title که PDF/X-1a اجباری می‌داند): نام لاتین صندوق و نام فایل
  const title = `${master.nameEn} — ${name.replace(/_/g, ' ')}`;
  return { html: page(style + body, { title, css, bodyClass: 'print' }), PW, PH };
}

function toPdfX(src, dst, { W, H }) {
  const t = [SLUG, SLUG, SLUG + W, SLUG + H].map((v) => (v * PT).toFixed(3));
  const b = [SLUG - BLEED, SLUG - BLEED, SLUG + W + BLEED, SLUG + H + BLEED].map((v) => (v * PT).toFixed(3));
  execFileSync('gs', [
    '-q', '-dPDFX', '-dBATCH', '-dNOPAUSE', '-dNOOUTERSAVE',
    `--permit-file-read=${ICC}`,
    '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.3',
    '-sColorConversionStrategy=CMYK', '-sProcessColorModel=DeviceCMYK',
    `-sOutputICCProfile=${ICC}`, '-dRenderIntent=1',
    '-dEmbedAllFonts=true', '-dAutoRotatePages=/None',
    `-sPDFX_ICC=${ICC}`,
    `-sOutputFile=${dst}`,
    path.join(ROOT, 'tools', 'PDFX_def.ps'),
    '-c', `[/TrimBox [${t.join(' ')}] /BleedBox [${b.join(' ')}] /PAGES pdfmark`,
    '-f', src,
  ], { stdio: 'inherit' });
  // Ghostscript جعبه برش را برابر کل صفحه می‌گذارد؛ TrimBox و BleedBox درست جداگانه نوشته می‌شوند
  execFileSync('python3', [path.join(ROOT, 'tools', 'boxes.py'), dst, String(SLUG), String(BLEED), String(W), String(H)], { stdio: 'inherit' });
}

const browser = await chromium.launch();
async function render(name, doc, css) {
  const file = path.join(BUILD, `${name}.html`);
  fs.writeFileSync(file, doc.html.replaceAll('href="../', 'href="../../').replaceAll('src="../', 'src="../../'));
  const p = await browser.newPage();
  await p.goto(pathToFileURL(file).href);
  await p.evaluate(() => document.fonts.ready);
  const rgb = path.join(BUILD, `${name}_rgb.pdf`);
  await p.pdf({ path: rgb, width: `${doc.PW}mm`, height: `${doc.PH}mm`, printBackground: true });
  await p.close();
  return rgb;
}

const jobs = [];

// سربرگ‌ها
for (const code of Object.keys(FINAL)) {
  jobs.push({ name: `${code}_print_PDFX1a`, W: 210, H: 297, css: ['../src/letterhead.css'],
    items: [letterheadFinal(code)], labels: [`${code} ${FINAL[code]} — A4 210x297 — bleed 3mm — CMYK FOGRA39`] });
}
// کاتالوگ
{
  const pages = allPages();
  jobs.push({ name: 'catalog_16p_print_PDFX1a', W: 210, H: 297, css: ['../src/catalog.css'], items: pages,
    labels: pages.map((_, i) => `Catalog page ${i + 1}/16 — A4 210x297 — saddle stitch, RTL — bleed 3mm — CMYK FOGRA39`) });
}
// بروشور
{
  const sheets = brochureSheets();
  const acc = (w) => w.slice(0, -1).reduce((a, x) => [...a, (a.at(-1) ?? 0) + x], []);
  jobs.push({ name: 'brochure_trifold_print_PDFX1a', W: 297, H: 210, css: ['../src/brochure.css'], items: sheets,
    folds: (i) => acc(i === 0 ? OUTSIDE : INSIDE),
    labels: ['Brochure OUTSIDE — 297x210, roll fold RTL, panels 100/100/97 — bleed 3mm — CMYK FOGRA39',
      'Brochure INSIDE — 297x210, panels 97/100/100 — bleed 3mm — CMYK FOGRA39'] });
}

for (const j of jobs) {
  const doc = printDoc(j);
  const rgb = await render(j.name, doc);
  const dst = path.join(OUT, `${j.name}.pdf`);
  toPdfX(rgb, dst, j);
  console.log('✓', path.relative(ROOT, dst));
}
await browser.close();
