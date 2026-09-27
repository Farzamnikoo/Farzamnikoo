// داده‌های پایه مشترک (Master Data) — بخش صفر سند محتوا.
// این فایل تنها منبع داده‌های ثبتی و تماس برای همه اقلام است.
// هر مقدار null در خروجی به‌صورت «[TODO]» قابل رؤیت چاپ می‌شود تا پیش از چاپ تکمیل شود.

export const master = {
  nameFa: 'صندوق پژوهش و فناوری توسعه و آینده',
  legalFa: 'سهامی خاص',
  shortFa: 'صندوق توسعه و آینده',
  nameEn: 'Development & Future Research and Technology Fund',
  legalEn: 'Private Joint-Stock Company',
  abbrEn: 'DFF',
  web: 'tafund.ir',

  // [TODO] — اولویت یک
  regNo: null,        // شماره ثبت
  nationalId: null,   // شناسه ملی
  address: null,      // نشانی
  addressEn: null,    // نشانی لاتین (برای LH-04)
  postcode: null,     // کدپستی ده‌رقمی
  tel: null,          // تلفن
  fax: null,          // نمابر
  emailUser: null,    // بخش پیش از @tafund.ir (پیشنهاد: info)

  // [TODO] — اولویت دو
  licenseNo: null,
  licenseDate: null,
  economicCode: null, // فقط برای LH-01-F
  ceoTel: null,       // تلفن مستقیم دفتر مدیرعامل (LH-02، اختیاری)
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export const fa = (s) => String(s).replace(/[0-9]/g, (d) => FA_DIGITS[d]);

export const TODO = '<span class="todo">[TODO]</span>';
export const val = (x, { latin = false } = {}) =>
  x == null ? TODO : latin ? `<span class="lat">${x}</span>` : fa(x);
export const email = (d) =>
  `<span class="lat">${d.emailUser == null ? '[TODO]' : d.emailUser}@${d.web}</span>`;
export const web = (d) => `<span class="lat">${d.web}</span>`;
