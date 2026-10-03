// نشان با نام (Lockup): افقی، عمودی و دوزبانه، هر کدام در چهار رنگ‌بندی (رنگی، معکوس، سیاه، سفید)
// و سه قالب: SVG (متن به منحنی تبدیل شده، بی‌نیاز از قلم)، PDF برداری و PNG شفاف.
// به‌همراه برگه راهنمای استفاده: فاصله خالی اطراف و حداقل اندازه.
// اجرا: node tools/lockup.mjs      (نیازمند pdftocairo از poppler)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { master } from '../data/master.mjs';
import * as C from '../data/catalog.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist', 'logo', 'lockups');
const BUILD = path.join(ROOT, 'build', 'lockup');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(BUILD, { recursive: true });

const MM = 96 / 25.4;
const read = (f) => fs.readFileSync(path.join(ROOT, 'brand', 'logo', f), 'utf8');
const [n1, n2] = [C.cover.nameLine1, C.cover.nameLine2];          // «صندوق پژوهش و فناوری» / «توسعه و آینده»
const [en1, ...enRest] = master.nameEn.split(' Research');           // «Tose’e & Ayandeh» / «Research and Technology Fund»
const en2 = `Research${enRest.join(' Research')}`;

// رنگ‌بندی‌ها: نشان، رنگ متن، رنگ خط جداکننده
const SCHEMES = {
  color:   { mark: 'logo-mark.svg',         text: '#0F2547', sub: '#0F2547', rule: '#C9A227', bg: '#FFFFFF' },
  reverse: { mark: 'logo-mark-reverse.svg', text: '#FFFFFF', sub: '#FFFFFF', rule: '#DFC069', bg: '#0F2547' },
  black:   { mark: 'logo-mark-black.svg',   text: '#111111', sub: '#111111', rule: '#111111', bg: '#FFFFFF' },
  white:   { mark: 'logo-mark-white.svg',   text: '#FFFFFF', sub: '#FFFFFF', rule: '#FFFFFF', bg: '#0F2547' },
};

// اندازه مرجع: ارتفاع نشان x = ۱۴ میلی‌متر. همه فاصله‌ها نسبتی از x است.
const X = 14;
const css = `
  .lk { display: inline-flex; direction: rtl; font-family: "Vazirmatn"; line-height: 1; }
  .lk img { display: block; height: ${X}mm; width: auto; }
  .lk .rule { width: 0.6pt; align-self: stretch; }
  .lk .fa1 { font-size: ${X * 0.72}pt; font-weight: 400; line-height: 1.55; white-space: nowrap; }
  .lk .fa2 { font-size: ${X * 1.42}pt; font-weight: 500; line-height: 1.3; white-space: nowrap; }
  .lk .en1 { font-family: "Inter"; font-size: ${X * 0.62}pt; font-weight: 500; line-height: 1.5; white-space: nowrap; direction: ltr; }
  .lk .en2 { font-family: "Inter"; font-size: ${X * 0.5}pt; font-weight: 400; line-height: 1.5; white-space: nowrap; direction: ltr; }
  /* افقی: نشان راست، خط طلایی، نام چپ */
  .h { align-items: center; gap: ${X * 0.3}mm; }
  .h .names { display: flex; flex-direction: column; align-items: flex-start; }
  /* عمودی: نشان بالا، نام وسط‌چین زیر آن */
  .v { flex-direction: column; align-items: center; gap: ${X * 0.35}mm; }
  .v img { height: ${X * 1.3}mm; }
  .v .names { display: flex; flex-direction: column; align-items: center; }
  /* دوزبانه: افقی، با نام لاتین زیر نام فارسی و یک خط مویی میان آن دو */
  .b .names { gap: 0; }
  .b .hair { align-self: stretch; height: 0; margin: ${X * 0.07}mm 0 ${X * 0.09}mm; }
`;

function lockupHtml(kind, s) {
  const mark = `<img src="${pathToFileURL(path.join(ROOT, 'brand', 'logo', s.mark)).href}" alt="">`;
  const fa = `<span class="fa1" style="color:${s.sub}">${n1}</span><span class="fa2" style="color:${s.text}">${n2}</span>`;
  const rule = `<i class="rule" style="background:${s.rule}"></i>`;
  if (kind === 'horizontal') return `<div class="lk h">${mark}${rule}<div class="names">${fa}</div></div>`;
  if (kind === 'vertical') return `<div class="lk v">${mark}<div class="names">${fa}</div></div>`;
  return `<div class="lk h b">${mark}${rule}<div class="names">${fa}<i class="hair" style="border-top:0.35pt solid ${s.rule}"></i>` +
    `<span class="en1" style="color:${s.text}">${en1}</span><span class="en2" style="color:${s.sub}">${en2}</span></div></div>`;
}

const page = (body, extraCss = '') => `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(ROOT, 'brand', 'tokens.css')).href}">
<style>@page{margin:0}html,body{margin:0;background:transparent}${css}${extraCss}</style></head><body>${body}</body></html>`;

const browser = await chromium.launch();
const KINDS = ['horizontal', 'vertical', 'bilingual'];
const sizes = {};

for (const kind of KINDS) {
  for (const [sname, s] of Object.entries(SCHEMES)) {
    const name = `lockup-${kind}-${sname}`;
    const file = path.join(BUILD, `${name}.html`);
    // حاشیه کوچک تا دنباله و بالای نویسه‌ها بریده نشود (حریم واقعی ۰٫۵x در برگه راهنماست)
    fs.writeFileSync(file, page(`<div id="box" style="display:inline-block;padding:1.5mm">${lockupHtml(kind, s)}</div>`));
    const p = await browser.newPage();
    await p.goto(pathToFileURL(file).href);
    await p.evaluate(() => document.fonts.ready);
    const box = await p.evaluate(() => { const r = document.getElementById('box').getBoundingClientRect(); return { w: r.width, h: r.height }; });
    const wmm = box.w / MM, hmm = box.h / MM;
    sizes[kind] = { wmm, hmm };
    const pdf = path.join(OUT, `${name}.pdf`);
    await p.pdf({ path: pdf, width: `${wmm}mm`, height: `${hmm}mm`, printBackground: false, pageRanges: '1' });
    // PNG شفاف با عرض ۲۴۰۰ پیکسل
    await p.setViewportSize({ width: Math.ceil(box.w) + 2, height: Math.ceil(box.h) + 2 });
    const ctx2 = await browser.newContext({ deviceScaleFactor: 2400 / box.w, viewport: { width: Math.ceil(box.w) + 2, height: Math.ceil(box.h) + 2 } });
    const p2 = await ctx2.newPage();
    await p2.goto(pathToFileURL(file).href);
    await p2.evaluate(() => document.fonts.ready);
    await p2.locator('#box').screenshot({ path: path.join(OUT, `${name}.png`), omitBackground: true });
    await ctx2.close();
    await p.close();
    // SVG: متن به منحنی (pdftocairo نویسه‌ها را به شکل برداری می‌نویسد)
    execFileSync('pdftocairo', ['-svg', pdf, path.join(OUT, `${name}.svg`)]);
    console.log('✓', name, `${wmm.toFixed(1)}×${hmm.toFixed(1)}mm`);
  }
}

// ——— برگه راهنما: فاصله خالی و حداقل اندازه ———
// x = ارتفاع نشان. فاصله خالی دور هر نسخه = ۰٫۵x. حداقل اندازه طوری که سطر ریزتر نام از ۶ پوینت (چاپ) و ۱۰ پیکسل (صفحه) کمتر نشود.
const fa1pt = X * 0.72;                       // اندازه سطر ریز نام در اندازه مرجع
const minScale = 6 / fa1pt;                   // کوچک‌ترین مقیاس چاپی
const minPxScale = 10 / (fa1pt * 96 / 72);    // کوچک‌ترین مقیاس صفحه‌نمایش
const fmt = (v) => String(Math.ceil(v)).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const mins = Object.fromEntries(KINDS.map((k) => [k, {
  mm: fmt(sizes[k].wmm * minScale), px: fmt(sizes[k].wmm * MM * minPxScale),
}]));
const LABEL = { horizontal: 'افقی', vertical: 'عمودی', bilingual: 'دوزبانه' };
const USE = {
  horizontal: 'نسخه اصلی: سربرگ، اسناد، اسلاید، وبگاه، امضای ایمیل',
  vertical: 'سطوح مربع یا بلند: جلد، تابلو، استند، بنر عمودی',
  bilingual: 'مکاتبات و رویدادهای بین‌المللی، سربرگ دوزبانه',
};

const half = X / 2;
const clearDemo = (kind) => {
  const { wmm, hmm } = sizes[kind];
  return `<div class="cs" style="padding:${half}mm"><div class="inner">${lockupHtml(kind, SCHEMES.color)}</div>
    <span class="xl" style="height:${X}mm">x</span><span class="cl t">۰٫۵x</span><span class="cl r">۰٫۵x</span></div>`;
};

const sheetCss = `
  @page { size: 297mm 210mm; margin: 0; }
  body { font-family: "Vazirmatn"; color: #2B303A; }
  .sheet { width: 297mm; height: 210mm; box-sizing: border-box; padding: 14mm 16mm; position: relative; background: #fff; break-after: page; display: flex; flex-direction: column; }
  h1 { font-size: 20pt; font-weight: 300; color: #0F2547; margin: 0; }
  .sub { font-size: 9pt; color: #57667E; margin: 2mm 0 6mm; }
  .rule-g { width: 14mm; border-top: 0.9pt solid #C9A227; margin-top: 2.5mm; }
  .row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8mm; align-items: end; }
  .cell { display: flex; flex-direction: column; gap: 3mm; min-width: 0; }
  .cell .art { display: flex; align-items: center; justify-content: center; height: 46mm; border: 0.35pt solid #E2E5E9; }
  .cell .art .lk { zoom: 0.62; }
  .cap { font-size: 8.5pt; line-height: 1.7; }
  .cap b { color: #0F2547; font-weight: 600; }
  .cap span { color: #57667E; }
  .cs { position: relative; display: inline-block; outline: 0.5pt dashed #C9A227; outline-offset: 0; }
  .cs .inner { outline: 0.35pt solid #B7BEC8; }
  .cs .xl { position: absolute; top: ${half}mm; right: -6mm; width: 0; border-right: 0.5pt solid #C9A227; font: 500 7pt "Inter"; color: #C9A227; display: flex; align-items: center; padding-right: 1.5mm; }
  .cs .cl { position: absolute; font-size: 6.5pt; color: #C9A227; }
  .cs .cl.t { top: 1mm; left: 50%; transform: translateX(-50%); }
  .cs .cl.r { right: 1mm; top: 50%; transform: translateY(-50%); }
  .twocol { display: grid; grid-template-columns: 1.25fr 1fr; gap: 12mm; margin-top: 2mm; }
  table { border-collapse: collapse; width: 100%; font-size: 8.5pt; }
  th { text-align: right; font-weight: 500; color: #57667E; border-bottom: 0.75pt solid #0F2547; padding: 0 0 2mm 3mm; }
  td { border-bottom: 0.35pt solid #E2E5E9; padding: 2.4mm 3mm 2.4mm 0; }
  td.n { font-weight: 600; color: #0F2547; }
  ul.rules { margin: 0; padding: 0 4mm 0 0; font-size: 8.5pt; line-height: 1.9; }
  .bgs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5mm; margin-top: auto; }
  .bgs .art { height: 30mm; display: flex; align-items: center; justify-content: center; }
  .bgs .art .lk { zoom: 0.42; }
  .foot { font-size: 7pt; color: #7B879A; margin-top: 4mm; }
`;
const sheet = `
<section class="sheet">
  <h1>نشان با نام</h1><div class="rule-g"></div>
  <p class="sub">${master.nameFa} · سه نسخه رسمی. نشان و نام را هرگز جدا از این فایل‌ها کنار هم نچینید.</p>
  <div class="row">
    ${KINDS.map((k) => `<div class="cell"><div class="art">${lockupHtml(k, SCHEMES.color)}</div>
      <div class="cap"><b>${LABEL[k]}</b> · <span>${USE[k]}</span></div></div>`).join('')}
  </div>
  <div class="bgs">
    ${Object.entries(SCHEMES).map(([sn, s]) => `<div class="cell"><div class="art" style="background:${s.bg};${sn === 'color' || sn === 'black' ? 'border:0.35pt solid #E2E5E9' : ''}">${lockupHtml('horizontal', s)}</div>
      <div class="cap"><b>${{ color: 'رنگی', reverse: 'معکوس', black: 'سیاه', white: 'سفید' }[sn]}</b> · <span>${{ color: 'روی زمینه سفید و روشن', reverse: 'روی زمینه سرمه‌ای و تیره', black: 'چاپ تک‌رنگ، فکس، مهر', white: 'روی عکس یا زمینه تیره، تک‌رنگ' }[sn]}</span></div></div>`).join('')}
  </div>
  <p class="foot">فایل‌ها: dist/logo/lockups/ — هر نسخه در SVG (متن به منحنی)، PDF برداری و PNG شفاف.</p>
</section>
<section class="sheet">
  <h1>فاصله خالی و حداقل اندازه</h1><div class="rule-g"></div>
  <p class="sub">x = ارتفاع نشان. دور هر نسخه دست‌کم ۰٫۵x فضای خالی بماند؛ هیچ متن، لبه یا تصویری وارد این حریم نشود.</p>
  <div class="twocol">
    <div style="display:flex;align-items:center;justify-content:center">${clearDemo('horizontal')}</div>
    <div>
      <table>
        <thead><tr><th>نسخه</th><th>حداقل عرض در چاپ</th><th>حداقل عرض در صفحه‌نمایش</th></tr></thead>
        <tbody>
          ${KINDS.map((k) => `<tr><td class="n">${LABEL[k]}</td><td>${mins[k].mm} میلی‌متر</td><td>${mins[k].px} پیکسل</td></tr>`).join('')}
          <tr><td class="n">نشان تنها</td><td>۸ میلی‌متر</td><td>۲۴ پیکسل</td></tr>
        </tbody>
      </table>
      <p class="cap" style="margin-top:5mm"><span>حداقل‌ها طوری تعیین شده‌اند که سطر ریزتر نام («${n1}») در چاپ از ۶ پوینت و در صفحه از ۱۰ پیکسل کوچک‌تر نشود. کوچک‌تر از این، فقط «نشان تنها» یا نسخه قاب‌دار (آواتار) به کار رود.</span></p>
      <ul class="rules">
        <li>نسبت را تغییر ندهید؛ نسخه‌ها را کشیده یا فشرده نکنید.</li>
        <li>رنگ‌ها را عوض نکنید؛ روی زمینه تیره از نسخه معکوس یا سفید استفاده کنید.</li>
        <li>به نسخه‌ها سایه، قاب یا جلوه اضافه نکنید.</li>
        <li>نام را با قلم دیگر بازنویسی نکنید؛ از همین فایل‌ها استفاده کنید.</li>
        <li>نام لاتین: <span class="lat">${master.nameEn}</span> · اختصار: <span class="lat">${master.abbrEn}</span></li>
      </ul>
    </div>
  </div>
  <p class="foot" style="margin-top:auto">نسخه افقی اصلی است. اندازه مرجع فایل‌ها: x = ${fmt(X)} میلی‌متر.</p>
</section>`;
const sheetFile = path.join(BUILD, 'lockup-guide.html');
fs.writeFileSync(sheetFile, page(sheet, sheetCss));
{
  const p = await browser.newPage({ viewport: { width: 1123, height: 794 } });
  await p.goto(pathToFileURL(sheetFile).href);
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(OUT, 'lockup-guide_A4.pdf'), width: '297mm', height: '210mm', printBackground: true });
  const ctx = await browser.newContext({ deviceScaleFactor: 1.6, viewport: { width: 1123, height: 794 } });
  const p2 = await ctx.newPage();
  await p2.goto(pathToFileURL(sheetFile).href);
  await p2.evaluate(() => document.fonts.ready);
  const secs = p2.locator('.sheet');
  for (let i = 0; i < 2; i++) await secs.nth(i).screenshot({ path: path.join(OUT, `lockup-guide-${i + 1}.png`) });
  await ctx.close();
  console.log('✓ lockup-guide_A4.pdf', JSON.stringify(mins));
}
await browser.close();
