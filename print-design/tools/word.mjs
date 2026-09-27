// قالب‌های Word سربرگ (.dotx) — گزینه الف، با همان حاشیه‌ها و قلم.
// صفحه اول: سربرگ کامل (LH-01، LH-02 یا LH-04)؛ صفحه‌های بعد خودکار: سربرگ صفحه دوم (LH-03) با شماره صفحه.
// متن‌ها واقعی و قابل ویرایش‌اند (نه تصویر)؛ فقط نشان تصویر است.
// اجرا: node tools/word.mjs      (نیازمند: npm install)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { master } from '../data/master.mjs';

const require = createRequire(import.meta.url);
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, TabStopType, VerticalAlign, PageNumber, TableLayoutType, LineRuleType,
} = require('docx');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist', '05-letterhead', 'word');
fs.mkdirSync(OUT, { recursive: true });

const mm = (v) => Math.round(v * 56.6929);           // DXA
const px = (v) => (v / 25.4) * 96;                   // mm → px (ImageRun)
const C = { navy: '0F2547', navy70: '57667E', navy85: '334663', navy55: '7B879A', gold: 'C9A227' };
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const fa = (s) => String(s).replace(/[0-9]/g, (d) => FA_DIGITS[d]);
const v = (x) => (x == null ? '[TODO]' : fa(x));
const FONT = { ascii: 'Inter', hAnsi: 'Inter', cs: 'Vazirmatn', eastAsia: 'Vazirmatn' };

const markPng = fs.readFileSync(path.join(ROOT, 'dist', 'logo', 'logo-mark.png'));
const MARK_RATIO = 889 / 2000;

const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };

// متن فارسی
const fr = (text, o = {}) => new TextRun({
  text, font: FONT, rightToLeft: true,
  size: o.size ?? 22, sizeComplexScript: o.size ?? 22,
  bold: o.bold, boldComplexScript: o.bold, color: o.color ?? C.navy,
});
// متن لاتین
const lr = (text, o = {}) => new TextRun({
  text, font: FONT, rightToLeft: false,
  size: o.size ?? 22, sizeComplexScript: o.size ?? 22, bold: o.bold, color: o.color ?? C.navy,
});
const P = (children, o = {}) => new Paragraph({
  children, bidirectional: o.ltr ? false : true,
  alignment: o.align ?? AlignmentType.START,
  spacing: { before: o.before ?? 0, after: o.after ?? 0, ...(o.line === 0 ? { line: 240, lineRule: LineRuleType.AT_LEAST } : { line: o.line ?? 240 }) },
  border: o.border, tabStops: o.tabs,
});
const cell = (children, width, o = {}) => new TableCell({
  children, width: { size: width, type: WidthType.DXA },
  verticalAlign: o.valign ?? VerticalAlign.CENTER, borders: o.borders ?? noBorders,
  margins: { top: 0, bottom: 0, left: o.padL ?? 0, right: o.padR ?? 0 },
});
const table = (cells, widths) => new Table({
  rows: [new TableRow({ children: cells })],
  columnWidths: widths, width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  borders: noBorders, visuallyRightToLeft: true, layout: TableLayoutType.FIXED,
});
const mark = (wmm) => new ImageRun({ type: 'png', data: markPng, transformation: { width: px(wmm), height: px(wmm * MARK_RATIO) } });
const sepRun = () => fr('  |  ', { size: 15, color: C.gold });

const W = mm(166);  // عرض ستون متن

// فیلدهای اداری با نقطه‌چین
const field = (label, widthMm, size = 18) => P([fr(label, { size, bold: true }), fr('\t', { size, color: C.navy55 })], {
  tabs: [{ type: TabStopType.END, position: mm(widthMm - 1), leader: 'dot' }], after: 60,
});

function nameBlock(extra) {
  const lines = [
    P([fr(master.nameFa, { size: 25, bold: true })], { after: 20 }),
    P([fr(master.legalFa, { size: 17, color: C.navy70 })]),
  ];
  if (extra) lines.push(P([fr(extra, { size: 17, bold: true })], { before: 20 }));
  return lines;
}

const goldRule = () => P([], { border: { bottom: { style: BorderStyle.SINGLE, size: 7, color: C.gold, space: 1 } }, before: 120 });

function firstHeader(code) {
  if (code === 'LH-04') {
    const top = table([
      cell([P([mark(22)], { line: 0 })], mm(25)),
      cell(nameBlock(), mm(80), { borders: { ...noBorders, left: { style: BorderStyle.SINGLE, size: 6, color: C.gold } }, padL: mm(3) }),
      cell([
        P([lr(master.nameEn, { size: 19, bold: true })], { ltr: true, align: AlignmentType.LEFT, after: 20 }),
        P([lr(master.legalEn, { size: 15, color: C.navy70 })], { ltr: true, align: AlignmentType.LEFT }),
      ], mm(61)),
    ], [mm(25), mm(80), mm(61)]);
    const fields = table([
      cell([P([])], mm(46)),
      ...[['شماره / ', 'No.'], ['تاریخ / ', 'Date'], ['پیوست / ', 'Encl.']].map(([f, e]) =>
        cell([P([fr(f, { size: 17, bold: true }), lr(e, { size: 16, bold: true }), fr('\t', { size: 17, color: C.navy55 })], {
          tabs: [{ type: TabStopType.END, position: mm(39), leader: 'dot' }],
        })], mm(40))),
    ], [mm(46), mm(40), mm(40), mm(40)]);
    return new Header({ children: [top, P([], { after: 60 }), fields, goldRule()] });
  }
  const extra = code === 'LH-02' ? 'دفتر مدیرعامل' : null;
  const head = table([
    cell([P([mark(22)], { line: 0 })], mm(25)),
    cell(nameBlock(extra), mm(85), { borders: { ...noBorders, left: { style: BorderStyle.SINGLE, size: 6, color: C.gold } }, padL: mm(3) }),
    cell([field('شماره:', 56), field('تاریخ:', 56), field('پیوست:', 56)], mm(56), { valign: VerticalAlign.TOP }),
  ], [mm(25), mm(85), mm(56)]);
  return new Header({ children: [head, goldRule()] });
}

function firstFooter(code) {
  const top = { top: { style: BorderStyle.SINGLE, size: 4, color: C.gold, space: 6 } };
  if (code === 'LH-04') {
    const fa3 = [
      P([fr(`نشانی: ${v(master.address)}`, { size: 14, color: C.navy85 })]),
      P([fr(`تلفن: ${v(master.tel)}`, { size: 14, color: C.navy85 }), sepRun(), lr(master.web, { size: 14, color: C.navy85 })]),
      P([fr(`شماره ثبت: ${v(master.regNo)}`, { size: 14, color: C.navy85 }), sepRun(), fr(`شناسه ملی: ${v(master.nationalId)}`, { size: 14, color: C.navy85 })]),
    ];
    const en = (t) => P([lr(t, { size: 13, color: C.navy85 })], { ltr: true, align: AlignmentType.LEFT });
    const en3 = [
      en(`Address: ${master.addressEn ?? '[TODO]'}`),
      en(`Tel: ${master.tel ?? '[TODO]'}  |  ${master.web}`),
      en(`Reg. No: ${master.regNo ?? '[TODO]'}  |  National ID: ${master.nationalId ?? '[TODO]'}`),
    ];
    return new Footer({ children: [P([], { border: top }), table([cell(fa3, mm(104)), cell(en3, mm(62))], [mm(104), mm(62)])] });
  }
  const tel = code === 'LH-02' && master.ceoTel ? master.ceoTel : master.tel;
  const s = { size: 15, color: C.navy85 };
  const line1 = P([
    fr(`نشانی: ${v(master.address)}`, s), sepRun(), fr(`کدپستی: ${v(master.postcode)}`, s), sepRun(),
    fr(`تلفن: ${v(tel)}`, s), sepRun(), fr(`نمابر: ${v(master.fax)}`, s),
  ], { align: AlignmentType.CENTER, border: top });
  const line2 = P([
    lr(master.web, s), sepRun(), lr(`${master.emailUser ?? '[TODO]'}@${master.web}`, s), sepRun(),
    fr(`شماره ثبت: ${v(master.regNo)}`, s), sepRun(), fr(`شناسه ملی: ${v(master.nationalId)}`, s),
  ], { align: AlignmentType.CENTER });
  return new Footer({ children: [line1, line2] });
}

// صفحه دوم به بعد (LH-03)
const contHeader = () => new Header({
  children: [table([
    cell([P([mark(15)], { line: 0 })], mm(83)),
    cell([P([
      new TextRun({ children: ['صفحه ', PageNumber.CURRENT, ' از ', PageNumber.TOTAL_PAGES], font: FONT, rightToLeft: true, size: 18, sizeComplexScript: 18, bold: true, boldComplexScript: true, color: C.navy }),
    ], { align: AlignmentType.END })], mm(83)),
  ], [mm(83), mm(83)])],
});
const contFooter = () => new Footer({
  children: [P([fr(`${master.nameFa} — `, { size: 15, color: C.navy85 }), lr(master.web, { size: 15, color: C.navy85 })], {
    align: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.gold, space: 6 } },
  })],
});

function build(code, title) {
  const doc = new Document({
    creator: master.nameFa,
    title: `${code} ${title}`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 22, sizeComplexScript: 22, color: '2B303A', rightToLeft: true, language: { value: 'en-US', bidirectional: 'fa-IR' } },
          paragraph: { spacing: { line: 360, after: 120 } },
        },
      },
    },
    sections: [{
      properties: {
        titlePage: true,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: mm(45), bottom: mm(25), left: mm(22), right: mm(22), header: mm(13), footer: mm(9.5) },
        },
        bidi: true,
      },
      headers: { first: firstHeader(code), default: contHeader() },
      footers: { first: firstFooter(code), default: contFooter() },
      children: [
        // «بسمه تعالی» طبق تصمیم کارفرما: چاپ نمی‌شود و در قالب Word به‌صورت متن قرار می‌گیرد
        P([fr('بسمه تعالی', { size: 22, bold: true })], { align: AlignmentType.CENTER, after: 360 }),
        P([fr('', {})]),
      ],
    }],
  });
  return doc;
}

const TEMPLATES = { 'LH-01': 'سربرگ عمومی', 'LH-02': 'سربرگ مدیرعامل', 'LH-04': 'سربرگ دوزبانه' };
for (const [code, title] of Object.entries(TEMPLATES)) {
  const buf = await Packer.toBuffer(build(code, title));
  const docx = path.join(OUT, `${code}.docx`);
  fs.writeFileSync(docx, buf);
  // .docx → .dotx: فقط نوع محتوای بخش اصلی عوض می‌شود
  const work = path.join(ROOT, 'build', `dotx-${code}`);
  fs.rmSync(work, { recursive: true, force: true });
  fs.mkdirSync(work, { recursive: true });
  execFileSync('unzip', ['-q', docx, '-d', work]);
  const ct = path.join(work, '[Content_Types].xml');
  fs.writeFileSync(ct, fs.readFileSync(ct, 'utf8').replace(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml'));
  const dotx = path.join(OUT, `${code}_template.dotx`);
  fs.rmSync(dotx, { force: true });
  execFileSync('zip', ['-q', '-X', '-r', dotx, '.'], { cwd: work });
  console.log('✓', code, '→', path.relative(ROOT, dotx));
}
