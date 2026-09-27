// تولید سربرگ — سه گزینه چیدمان (الف، ب، ج) بر پایه یک ساختار مشترک.
// همه ابعاد به میلی‌متر و نسبت به لبه برش (Trim) است؛ عناصر تا لبه با --bleed بیرون می‌زنند.

import { master, fa, val, email, web } from '../data/master.mjs';

export const OPTIONS = {
  a: {
    code: 'الف',
    title: 'خطی',
    summary: 'بدون سطح رنگی؛ فقط نشان، خط طلایی زیر هدر و فوتر وسط‌چین.',
  },
  b: {
    code: 'ب',
    title: 'ستون سرمه‌ای',
    summary: 'نوار باریک سرمه‌ای در لبه راست؛ خط طلایی هدر به نوار متصل است؛ فوتر راست‌چین با برچسب‌های پررنگ.',
  },
  c: {
    code: 'ج',
    title: 'نوار پایه',
    summary: 'نوار سرمه‌ای در لبه بالا و نوار پهن سرمه‌ای در پایین که فوتر روی آن معکوس (سفید) چاپ می‌شود.',
  },
};

const sep = '<i class="sep" aria-hidden="true"></i>';

function lockup(d, { extraLine } = {}) {
  return `
    <div class="lockup">
      <img class="mark" src="../brand/logo/logo-mark.svg" alt="">
      <span class="vrule" aria-hidden="true"></span>
      <div class="names">
        <div class="n1">${d.nameFa}</div>
        <div class="n2">${d.legalFa}</div>
        ${extraLine ? `<div class="n3">${extraLine}</div>` : ''}
      </div>
    </div>`;
}

function fields(labels = ['شماره', 'تاریخ', 'پیوست']) {
  return `
    <div class="fields">
      ${labels.map((l) => `<div class="field"><span class="fl">${l}:</span><span class="dots"></span></div>`).join('')}
    </div>`;
}

// متن دقیق فوتر LH-01 (بخش ۱.۲ سند): دو سطر
function footerLines(d, { labeled = false } = {}) {
  const item = (label, value) =>
    labeled
      ? `<span class="fi"><b>${label}</b> ${value}</span>`
      : `<span class="fi">${label} ${value}</span>`;
  const line1 = [
    item('نشانی:', val(d.address)),
    item('کدپستی:', val(d.postcode)),
    item('تلفن:', val(d.tel)),
    item('نمابر:', val(d.fax)),
  ].join(sep);
  const line2 = [
    `<span class="fi">${web(d)}</span>`,
    `<span class="fi">${email(d)}</span>`,
    item('شماره ثبت:', val(d.regNo)),
    item('شناسه ملی:', val(d.nationalId)),
  ].join(sep);
  return `<div class="fline">${line1}</div><div class="fline">${line2}</div>`;
}

export function letterhead(opt, d = master) {
  const decor = {
    a: '',
    b: '<div class="spine"></div>',
    c: '<div class="topband"></div><div class="footband"></div>',
  }[opt];
  return `
  <div class="sheet lh opt-${opt}">
    <div class="trim">
      ${decor}
      <header class="head">
        ${lockup(d)}
        ${fields()}
      </header>
      <div class="rule"></div>
      <div class="safe" aria-hidden="true"></div>
      <footer class="foot">${footerLines(d, { labeled: opt === 'b' })}</footer>
    </div>
  </div>`;
}

// ═══ نسخه‌های نهایی بر پایه گزینه الف (انتخاب کارفرما) ═══
export const FINAL = {
  'LH-01': 'سربرگ عمومی',
  'LH-02': 'سربرگ مدیرعامل',
  'LH-03': 'سربرگ صفحه دوم',
  'LH-04': 'سربرگ دوزبانه',
};

function footerBilingual(d) {
  const fa1 = `<span class="fi">نشانی: ${val(d.address)}</span>`;
  const fa2 = [`<span class="fi">تلفن: ${val(d.tel)}</span>`, `<span class="fi">${web(d)}</span>`].join(sep);
  const fa3 = [`<span class="fi">شماره ثبت: ${val(d.regNo)}</span>`, `<span class="fi">شناسه ملی: ${val(d.nationalId)}</span>`].join(sep);
  const en = (label, v) => `<span class="fi">${label}: ${v == null ? '[TODO]' : v}</span>`;
  const en1 = en('Address', d.addressEn);
  const en2 = [en('Tel', d.tel), `<span class="fi">${d.web}</span>`].join(sep);
  const en3 = [en('Reg. No', d.regNo), en('National ID', d.nationalId)].join(sep);
  return `
    <div class="fcol fa-col"><div>${fa1}</div><div>${fa2}</div><div>${fa3}</div></div>
    <div class="fcol en-col" dir="ltr" lang="en"><div>${en1}</div><div>${en2}</div><div>${en3}</div></div>`;
}

export function letterheadFinal(code, d = master) {
  if (code === 'LH-03') {
    return `
  <div class="sheet lh opt-a final lh03">
    <div class="trim">
      <header class="head">
        <img class="mark small" src="../brand/logo/logo-mark.svg" alt="">
        <div class="pageno">صفحه <span class="dots"></span> از <span class="dots"></span></div>
      </header>
      <div class="safe" aria-hidden="true"></div>
      <footer class="foot one">${d.nameFa} — ${web(d)}</footer>
    </div>
  </div>`;
  }
  if (code === 'LH-04') {
    return `
  <div class="sheet lh opt-a final lh04">
    <div class="trim">
      <header class="head">
        ${lockup(d)}
        <div class="en-name" dir="ltr" lang="en"><div class="e1">${d.nameEn}</div><div class="e2">${d.legalEn}</div></div>
      </header>
      <div class="fields-row">
        ${[['شماره', 'No.'], ['تاریخ', 'Date'], ['پیوست', 'Encl.']].map(([f, e]) => `<div class="field"><span class="fl">${f} / <span class="lat">${e}</span></span><span class="dots"></span></div>`).join('')}
      </div>
      <div class="rule"></div>
      <div class="safe" aria-hidden="true"></div>
      <footer class="foot bi">${footerBilingual(d)}</footer>
    </div>
  </div>`;
  }
  const extra = code === 'LH-02' ? 'دفتر مدیرعامل' : null;
  const dd = code === 'LH-02' && d.ceoTel ? { ...d, tel: d.ceoTel } : d;
  return `
  <div class="sheet lh opt-a final">
    <div class="trim">
      <header class="head">
        ${lockup(d, { extraLine: extra })}
        ${fields()}
      </header>
      <div class="rule"></div>
      <div class="safe" aria-hidden="true"></div>
      <footer class="foot">${footerLines(dd)}</footer>
    </div>
  </div>`;
}

export function page(body, { title = '', css = [], bodyClass = '' } = {}) {
  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="stylesheet" href="../brand/tokens.css">
${css.map((c) => `<link rel="stylesheet" href="${c}">`).join('\n')}
</head>
<body class="${bodyClass}">
${body}
</body>
</html>`;
}

export { fa };
