// برگه مقایسه سه گزینه سربرگ (A3 افقی، سه صفحه): نمای کامل، جزئیات ۱:۱، آزمون سیاه‌وسفید.

import { letterhead, OPTIONS, fa } from './letterhead.mjs';

const NOTES = {
  a: [
    ['چاپ از Word روی چاپگر اداری', 'کامل؛ هیچ عنصری تا لبه کاغذ نمی‌رود.'],
    ['چاپ سیاه‌وسفید و فکس', 'بسیار سبک و خوانا.'],
    ['چاپ افست', 'دو رنگ، بدون نشت؛ کم‌هزینه‌ترین.'],
    ['حضور هویت بصری', 'آرام و کلاسیک.'],
  ],
  b: [
    ['چاپ از Word روی چاپگر اداری', 'نوار لبه راست به‌خاطر حاشیه چاپ‌نشدنی چاپگر (حدود ۴ میلی‌متر) با یک باریکه سفید چاپ می‌شود؛ در قالب Word نوار کمی به داخل منتقل می‌شود.'],
    ['چاپ سیاه‌وسفید و فکس', 'خوانا؛ یک نوار باریک مشکی در لبه.'],
    ['چاپ افست', 'دو رنگ، با نشت ۳ میلی‌متر در لبه راست.'],
    ['حضور هویت بصری', 'متوسط؛ نوار عمودی در بایگانی و پوشه دیده می‌شود.'],
  ],
  c: [
    ['چاپ از Word روی چاپگر اداری', 'نوارهای تمام‌لبه فقط روی کاغذ پیش‌چاپ افست درست درمی‌آیند.'],
    ['چاپ سیاه‌وسفید و فکس', 'نوار پهن مشکی در پایین؛ مصرف تونر بالا و افت خوانایی متن سفید در کپی و فکس.'],
    ['چاپ افست', 'دو رنگ، با نشت در بالا و پایین.'],
    ['حضور هویت بصری', 'قوی و قاب‌دار.'],
  ],
};

const RECOMMENDED = 'a';

const styles = `
@page { size: 420mm 297mm; margin: 0; }
body { background: #fff; }
.cmp { width: 420mm; height: 297mm; position: relative; overflow: hidden; box-sizing: border-box; padding: 14mm 16mm 12mm; color: var(--navy); page-break-after: always; }
.cmp:last-child { page-break-after: auto; }
.cmp-head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 0.85pt solid var(--gold); padding-bottom: 4mm; margin-bottom: 7mm; }
.cmp-head h1 { margin: 0; font-size: 19pt; font-weight: 700; line-height: 1.3; }
.cmp-head p { margin: 1mm 0 0; font-size: 10pt; color: var(--navy-70); }
.cmp-meta { text-align: left; font-size: 9pt; color: var(--navy-70); line-height: 1.7; }
.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10mm; }
.thumb { width: 122mm; height: calc(297mm * 122 / 210); position: relative; overflow: hidden; outline: 0.5pt solid var(--navy-30); }
.thumb > .lh { zoom: 0.580952; }   /* ۱۲۲ ÷ ۲۱۰ — zoom به‌جای transform تا Chromium هنگام صفحه‌بندی PDF آن را نبُرد */
.col h2 { margin: 5mm 0 1mm; font-size: 13pt; font-weight: 700; display: flex; align-items: center; gap: 3mm; }
.tag { font-size: 8pt; font-weight: 500; color: #fff; background: var(--navy); padding: 0.4mm 2.4mm; border-radius: 1mm; }
.col .sum { margin: 0 0 3mm; font-size: 9.5pt; line-height: 1.8; color: var(--ink); }
.col dl { margin: 0; display: grid; grid-template-columns: 38mm 1fr; row-gap: 1.6mm; column-gap: 3mm; font-size: 8.6pt; line-height: 1.7; }
.col dt { font-weight: 500; color: var(--navy); }
.col dd { margin: 0; color: var(--ink); }
.foot-note { position: absolute; bottom: 10mm; right: 16mm; left: 16mm; font-size: 8.5pt; color: var(--navy-70); line-height: 1.7; }

/* صفحه ۲: جزئیات ۱:۱ */
.detail { display: grid; grid-template-columns: 1fr 210mm; gap: 12mm; }
.specs { font-size: 9pt; line-height: 1.85; color: var(--ink); }
.specs h3 { font-size: 11pt; margin: 0 0 2mm; color: var(--navy); }
.specs table { border-collapse: collapse; width: 100%; margin-bottom: 6mm; }
.specs td { border-bottom: 0.5pt solid var(--navy-12); padding: 1.2mm 0; vertical-align: top; }
.specs td:first-child { font-weight: 500; color: var(--navy); width: 34mm; }
.rows { display: flex; flex-direction: column; gap: 4mm; }
.row-label { font-size: 9.5pt; font-weight: 700; margin-bottom: 1.2mm; }
.crop { width: 210mm; position: relative; overflow: hidden; outline: 0.5pt solid var(--navy-30); }
.crop.h { height: 44mm; }
.crop.f { height: 31mm; margin-top: 1.5mm; }
.crop > .lh { position: absolute; right: 0; top: 0; }
.crop.f > .lh { top: calc(-297mm + 31mm); }

/* صفحه ۳: آزمون سیاه‌وسفید */
.gray .thumb { filter: grayscale(1) contrast(1.05); }
`;

export function compareSheet() {
  const keys = Object.keys(OPTIONS);
  const head = (title, sub, page) => `
    <div class="cmp-head">
      <div><h1>${title}</h1><p>${sub}</p></div>
      <div class="cmp-meta">صندوق پژوهش و فناوری توسعه و آینده<br>مرحله ۱ از ۵ گردش کار · مهر ۱۴۰۵ · صفحه ${fa(page)} از ۳</div>
    </div>`;

  const p1 = `
  <section class="cmp">
    ${head('سربرگ عمومی LH-01 — سه گزینه چیدمان هدر و فوتر', 'لطفاً یک گزینه را انتخاب کنید؛ نسخه‌های LH-02 تا LH-04 و قالب Word پس از انتخاب بر پایه همان گزینه ساخته می‌شوند.', 1)}
    <div class="cols">
      ${keys.map((k) => `
        <div class="col">
          <div class="thumb">${letterhead(k)}</div>
          <h2>گزینه ${OPTIONS[k].code} — ${OPTIONS[k].title}${k === RECOMMENDED ? ' <span class="tag">پیشنهاد طراح</span>' : ''}</h2>
          <p class="sum">${OPTIONS[k].summary}</p>
          <dl>${NOTES[k].map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>
        </div>`).join('')}
    </div>
    <div class="foot-note">نشان به‌کاررفته موقت است و با دریافت فایل برداری نشان مصوب، در همه گزینه‌ها جایگزین می‌شود. «[TODO]»ها عمداً قابل رؤیت نگه داشته شده‌اند.</div>
  </section>`;

  const p2 = `
  <section class="cmp">
    ${head('جزئیات هدر و فوتر در مقیاس ۱:۱', 'این صفحه را در اندازه واقعی (بدون «Fit to page») چاپ کنید تا اندازه حروف روی کاغذ سنجیده شود.', 2)}
    <div class="detail">
      <div class="specs">
        <h3>مشخصات مشترک هر سه گزینه</h3>
        <table>
          <tr><td>قطع</td><td>A4 — ۲۱۰ × ۲۹۷ میلی‌متر</td></tr>
          <tr><td>ناحیه امن متن</td><td>از ۴۵ میلی‌متری بالا تا ۲۵ میلی‌متری پایین؛ راست و چپ ۲۲ میلی‌متر</td></tr>
          <tr><td>خط طلایی</td><td>۰٫۸۵ پوینت، ۳۷ میلی‌متر از لبه بالا، به عرض ستون متن</td></tr>
          <tr><td>نام صندوق</td><td>وزیرمتن Bold، ۱۲٫۵ پوینت</td></tr>
          <tr><td>سهامی خاص</td><td>وزیرمتن Regular، ۸٫۵ پوینت، تنت ۷۰٪ سرمه‌ای</td></tr>
          <tr><td>فیلدهای اداری</td><td>وزیرمتن Medium، ۹ پوینت، خط‌چین ۵۲ میلی‌متری</td></tr>
          <tr><td>فوتر</td><td>وزیرمتن Regular، ۷٫۳ پوینت؛ متن لاتین Inter</td></tr>
          <tr><td>رنگ‌ها</td><td>فقط سرمه‌ای (Pantone 2767 C) و طلایی؛ خاکستری‌ها تنت سرمه‌ای هستند، نه رنگ سوم</td></tr>
        </table>
        <h3>بدون چاپ</h3>
        <table>
          <tr><td>بسمه تعالی</td><td>طبق توصیه سند چاپ نشده و در قالب Word به‌صورت متن قرار می‌گیرد.</td></tr>
          <tr><td>شعار</td><td>در سربرگ درج نمی‌شود.</td></tr>
          <tr><td>واترمارک</td><td>درج نشده؛ در صورت تأیید، مونوگرام با شفافیت زیر ۵٪ افزوده می‌شود.</td></tr>
        </table>
      </div>
      <div class="rows">
        ${keys.map((k) => `
          <div>
            <div class="row-label">گزینه ${OPTIONS[k].code} — ${OPTIONS[k].title}</div>
            <div class="crop h">${letterhead(k)}</div>
            <div class="crop f">${letterhead(k)}</div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;

  const p3 = `
  <section class="cmp gray">
    ${head('آزمون چاپ سیاه‌وسفید', 'شبیه‌سازی چاپ روی چاپگر لیزری تک‌رنگ و فکس.', 3)}
    <div class="cols">
      ${keys.map((k) => `
        <div class="col">
          <div class="thumb">${letterhead(k)}</div>
          <h2>گزینه ${OPTIONS[k].code} — ${OPTIONS[k].title}</h2>
          <p class="sum">${NOTES[k][1][1]}</p>
        </div>`).join('')}
    </div>
  </section>`;

  return { body: p1 + p2 + p3, styles };
}
