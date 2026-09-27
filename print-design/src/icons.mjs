// آیکون‌های کاتالوگ (سه ابزار مالی و چهار ارزش) — یک خانواده: هندسه گرد (هم‌ریشه با حلقه‌های نشان)، خط ۲ واحدی در شبکه ۴۸،
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
};

// نشانه‌های فهرست (صفحه ۱۲)
export const marks = {
  check: '<svg class="mk" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="var(--gold)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>',
  cross: '<svg class="mk" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="var(--navy-55)" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>',
};
