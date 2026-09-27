// آیکون‌های سه ابزار مالی — یک خانواده: هندسه گرد (هم‌ریشه با حلقه‌های نشان)، خط ۲ واحدی در شبکه ۴۸،
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
};
