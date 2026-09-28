// آیکون‌های کاتالوگ (سه ابزار مالی، چهار ارزش و شش مزیت) — یک خانواده: هندسه گرد (هم‌ریشه با حلقه‌های نشان)، خط ۲ واحدی در شبکه ۴۸،
// سرمه‌ای با یک عنصر توپُر طلایی. رنگ‌ها از متغیرهای CSS خوانده می‌شوند.

const wrap = (body, label) =>
  `<svg class="icon" viewBox="0 0 48 48" role="img" aria-label="${label}" fill="none" stroke="var(--icon-line, var(--navy))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const icons = {
  // ضمانت‌نامه: طاقِ پوشش بر روی یک هسته — تعهدی که از چیزی محافظت می‌کند
  guarantee: wrap(
    '<path d="M11 38V24a13 13 0 0 1 26 0v14"/><path d="M6 38h36"/>' +
      '<circle cx="24" cy="29" r="4.2" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'صدور ضمانت‌نامه'
  ),
  // تسهیلات: چرخه — بازپرداخت هم‌گام با چرخه نقدی طرح
  facility: wrap(
    '<path d="M24 11a13 13 0 1 1-11.26 6.5"/><path d="M24 17v7l5 3"/>' +
      '<circle cx="12.74" cy="17.5" r="3.4" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'اعطای تسهیلات'
  ),
  // مشارکت: دو دایرهٔ هم‌پوشان با سهم مشترک طلایی
  equity: wrap(
    '<path d="M24 14.474A11 11 0 0 1 24 33.526A11 11 0 0 1 24 14.474Z" fill="var(--icon-accent, var(--gold))" stroke="none"/>' +
      '<circle cx="18.5" cy="24" r="11"/><circle cx="29.5" cy="24" r="11"/>',
    'مشارکت و سرمایه‌گذاری خطرپذیر'
  ),

  // ——— ارزش‌های راهبردی (صفحه ۴) ———
  // انضباط مالی: ترازوی متوازن — دو سوی ترازنامه هم‌وزن
  discipline: wrap(
    '<path d="M8 27h32"/><path d="M24 27l-5.5 10h11z"/><circle cx="14" cy="21" r="5"/>' +
      '<circle cx="34" cy="21" r="5" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'انضباط مالی'
  ),
  // شفافیت: ذره‌بین با هسته روشن — ارزیابی آشکار
  transparency: wrap(
    '<circle cx="21" cy="21" r="11"/><path d="M29 29l10 10"/>' +
      '<circle cx="21" cy="21" r="4" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'شفافیت'
  ),
  // حکمرانی سالم: ارکانِ متصل — یک مرجع و دو رکن
  governance: wrap(
    '<path d="M24 16.5V24M13 31.5V24h22v7.5"/><circle cx="13" cy="36" r="4.5"/><circle cx="35" cy="36" r="4.5"/>' +
      '<circle cx="24" cy="12" r="4.5" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'حکمرانی سالم'
  ),
  // هم‌راستایی ملی: دوایر هم‌مرکز — هدف مشترک
  alignment: wrap(
    '<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="8.5"/>' +
      '<circle cx="24" cy="24" r="3.5" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'هم‌راستایی ملی'
  ),

  // ——— مزیت‌های همکاری (صفحه ۶) ———
  // ارزیابی فناوری‌محور: تراشه با هسته طلایی
  techAssess: wrap(
    '<rect x="14" y="14" width="20" height="20" rx="3"/><path d="M19 8v6M24 8v6M29 8v6M19 34v6M24 34v6M29 34v6M8 19h6M8 24h6M8 29h6M34 19h6M34 24h6M34 29h6"/>' +
      '<rect x="20" y="20" width="8" height="8" rx="1.5" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'ارزیابی فناوری‌محور'
  ),
  // سه ابزار در یک نهاد: سه دایره هم‌پوشان با هسته مشترک
  threeTools: wrap(
    '<circle cx="24" cy="17.5" r="9"/><circle cx="17.5" cy="29" r="9"/><circle cx="30.5" cy="29" r="9"/>' +
      '<circle cx="24" cy="25.2" r="3.2" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'سه ابزار در یک نهاد'
  ),
  // هم‌گام با چرخه نقدی: دو کمان چرخه
  cashCycle: wrap(
    '<path d="M36.5 20.5A13 13 0 0 0 13 16.5"/><path d="M12.5 10.5v6h6"/><path d="M11.5 27.5A13 13 0 0 0 35 31.5"/><path d="M35.5 37.5v-6h-6"/>' +
      '<circle cx="24" cy="24" r="3.6" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'هم‌گام با چرخه نقدی'
  ),
  // فرآیند شفاف و مکتوب: برگه با نشان تأیید
  written: wrap(
    '<path d="M13 7h15l8 8v26H13z"/><path d="M28 7v8h8"/><path d="M18 21h12M18 26h8"/>' +
      '<circle cx="31" cy="34" r="6" fill="var(--icon-accent, var(--gold))" stroke="none"/><path d="M28.4 34.2l1.9 1.9 3.4-3.9" stroke-width="1.8"/>',
    'فرآیند شفاف و مکتوب'
  ),
  // تصمیم در کمیته تخصصی: سه عضو گرد یک میز
  committee: wrap(
    '<circle cx="12.5" cy="21" r="4"/><circle cx="35.5" cy="21" r="4"/><path d="M6.5 32a6 6 0 0 1 12 0M29.5 32a6 6 0 0 1 12 0M17 28a7 7 0 0 1 14 0"/><path d="M6 37h36"/>' +
      '<circle cx="24" cy="16" r="4.5" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'تصمیم در کمیته تخصصی'
  ),
  // مجوز رسمی و نظارت: سپر
  oversight: wrap(
    '<path d="M24 7l14 5v11c0 8.5-5.8 14.6-14 18c-8.2-3.4-14-9.5-14-18V12z"/>' +
      '<circle cx="24" cy="22.5" r="4.2" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'مجوز رسمی و نظارت'
  ),

  // ——— مزایای مالیاتی و عاملیت (صفحه‌های ۱۱ و ۱۴) ———
  // دستگاه اجرایی: ساختمان ستون‌دار
  govBody: wrap(
    '<path d="M8 18.5L24 9l16 9.5z"/><path d="M12.5 22v12M19.5 22v12M28.5 22v12M35.5 22v12"/><path d="M9 34.5h30M7 39h34"/>' +
      '<circle cx="24" cy="15" r="2.6" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'دستگاه‌های اجرایی'
  ),
  // صندوق و نهاد حمایتی: سکه‌های روی هم با سکه طلایی بالا
  supportFund: wrap(
    '<path d="M13 16v6a11 4 0 0 0 22 0v-6"/><path d="M13 22v6a11 4 0 0 0 22 0v-6"/><path d="M13 28v6a11 4 0 0 0 22 0v-6"/>' +
      '<ellipse cx="24" cy="16" rx="11" ry="4" fill="var(--icon-accent, var(--gold))" stroke="var(--icon-accent, var(--gold))"/>',
    'صندوق‌ها و نهادهای حمایتی'
  ),
  // صنعت: کارخانه با دودکش
  industry: wrap(
    '<path d="M6 39h36"/><path d="M8 39V25l8 5v-5l8 5v-5l8 5V13h6v26"/><path d="M13 34h3M21 34h3M29 34h3"/>' +
      '<circle cx="35" cy="8" r="2.6" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'صنایع و بنگاه‌های بزرگ'
  ),
  // سرمایه‌گذار: ستون‌های رو به رشد و سکه
  investor: wrap(
    '<path d="M7 39h34"/><path d="M12 35v-7M19.5 35V22M27 35V16"/>' +
      '<circle cx="35.5" cy="13" r="5" fill="var(--icon-accent, var(--gold))" stroke="none"/>',
    'شرکت‌ها و سرمایه‌گذاران'
  ),
};

// ——— تصویرسازی خطی خدمات تخصصی (صفحه ۱۱) ———
// همان خانواده آیکون‌ها در قاب بزرگ‌تر ۶۴ × ۴۸، خط نازک‌تر و یک سطح طلایی.
const illo = (body, label) =>
  `<svg class="illo" viewBox="0 0 64 48" role="img" aria-label="${label}" fill="none" stroke="var(--icon-line, var(--navy))" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const G = 'fill="var(--icon-accent, var(--gold))" stroke="none"';

export const illos = {
  // ارزیابی و امکان‌سنجی: برگه تحلیل با نمودار و ذره‌بین
  assess: illo(
    `<path d="M10 5h22l7 7v31H10z"/><path d="M32 5v7h7"/><path d="M15 37V29M20.5 37V24M26 37V31"/><path d="M15 16h12M15 20h8"/>` +
      `<circle cx="44" cy="31" r="8.5" fill="var(--page-bg, #FBF9F4)"/><path d="M50 37l7 7"/><circle cx="44" cy="31" r="3.4" ${G}/>`,
    'ارزیابی و امکان‌سنجی طرح'
  ),
  // ارزش‌گذاری: الماس تراش‌خورده با وجه طلایی
  value: illo(
    `<path d="M22 24l10-10 10 10z" ${G}/><path d="M18 14h28l10 10-24 21L8 24z"/><path d="M8 24h48M18 14l4 10 10 21 10-21 4-10M22 24l10-10 10 10"/><path d="M26 8.5l1.5-3M32 7.5V4M38 8.5l-1.5-3"/>`,
    'ارزش‌گذاری'
  ),
  // توسعه بازار و تجاری‌سازی: مسیر صعودی
  market: illo(
    `<path d="M6 42h52M6 42V6"/><path d="M10 35l11-7 9 3 11-11 12-8"/><path d="M47 11.5l6-1.5-1.5 6"/>` +
      `<circle cx="10" cy="35" r="2.2" fill="var(--page-bg, #FBF9F4)"/><circle cx="21" cy="28" r="2.2" fill="var(--page-bg, #FBF9F4)"/><circle cx="30" cy="31" r="2.2" fill="var(--page-bg, #FBF9F4)"/><circle cx="41" cy="20" r="3.4" ${G}/>`,
    'توسعه بازار و تجاری‌سازی'
  ),
  // مشاوره ساختار تأمین مالی: حلقه سه‌بخشی — ترکیب سه ابزار
  structure: illo(
    `<path d="M32 7a17 17 0 0 1 14.72 25.5L39.8 28.5A9 9 0 0 0 32 15z" ${G}/><circle cx="32" cy="24" r="17"/><circle cx="32" cy="24" r="9"/>` +
      `<path d="M32 7v8M46.72 32.5l-6.92-4M17.28 32.5l6.92-4"/>`,
    'مشاوره ساختار تأمین مالی'
  ),
};

// نشانه‌های فهرست
export const marks = {
  check: '<svg class="mk" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="var(--gold)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>',
  cross: '<svg class="mk" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="var(--navy-55)" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>',
};
