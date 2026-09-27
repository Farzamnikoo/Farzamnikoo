// داده‌های پایه مشترک (Master Data) — بخش صفر سند محتوا.
// این فایل تنها منبع داده‌های ثبتی و تماس برای همه اقلام است.
// هر مقدار null در خروجی به‌صورت «[TODO]» قابل رؤیت چاپ می‌شود تا پیش از چاپ تکمیل شود.

export const master = {
  nameFa: 'صندوق پژوهش و فناوری توسعه و آینده',
  legalFa: 'سهامی خاص',
  shortFa: 'صندوق توسعه و آینده',
  // نام لاتین: انتخاب فرم مرور (پیشنهاد سند تصمیم نشان). اختصار هنوز تعیین نشده.
  nameEn: 'Tosee & Ayandeh Research and Technology Fund',
  legalEn: 'Private Joint-Stock Company',
  abbrEn: null,
  web: 'tafund.ir',

  // از فرم مرور (۵ مهر ۱۴۰۵). جداکننده‌ها از «-» به «،» یکدست شده‌اند.
  address: 'تهران، خیابان استاد نجات الهی، خیابان استاد جعفر شهری (سپند سابق)، شماره 16',
  postcode: '1598994911',

  // [TODO] — اولویت یک
  regNo: null,        // شماره ثبت
  nationalId: null,   // شناسه ملی
  addressEn: null,    // نشانی لاتین (برای LH-04)
  tel: null,          // تلفن
  fax: null,          // نمابر
  emailUser: null,    // بخش پیش از @tafund.ir (پیشنهاد: info)

  // [TODO] — اولویت دو
  licenseNo: null,
  licenseDate: null,
  economicCode: null, // فقط برای LH-01-F
  ceoTel: null,       // تلفن مستقیم دفتر مدیرعامل (LH-02، اختیاری)
  ceoName: null,      // صفحه ۲ کاتالوگ
  hours: null,        // ساعات کاری
  social: null,       // شبکه‌های اجتماعی رسمی
  board: null,        // اعضای هیئت‌مدیره و مدیرعامل (صفحه ۱۳ کاتالوگ)
};

// تصمیم‌های ثبت‌شده در فرم مرور
export const decisions = {
  letterhead: 'a',          // سربرگ: گزینه الف (خطی)
  bismillah: 'word',        // چاپ نشود؛ در قالب Word به‌صورت متن
  watermark: 'none',
  logoVariation: '3-alef',  // نشان: ۳-الف، پایه با گره واقعی
  tagline: 1,               // «تأمین مالی مسیر ایده تا بازار»
  latin: 'tosee',
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export const fa = (s) => String(s).replace(/[0-9]/g, (d) => FA_DIGITS[d]);

export const TODO = '<span class="todo">[TODO]</span>';
export const val = (x, { latin = false } = {}) =>
  x == null ? TODO : latin ? `<span class="lat">${x}</span>` : fa(x);
export const email = (d) =>
  `<span class="lat">${d.emailUser == null ? '[TODO]' : d.emailUser}@${d.web}</span>`;
export const web = (d) => `<span class="lat">${d.web}</span>`;
