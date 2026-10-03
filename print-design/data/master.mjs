// داده‌های پایه مشترک (Master Data) — بخش صفر سند محتوا.
// این فایل تنها منبع داده‌های ثبتی و تماس برای همه اقلام است.
// هر مقدار null در خروجی به‌صورت «TODO» قابل رؤیت چاپ می‌شود تا پیش از چاپ تکمیل شود.
// (از ویرایش ۵ با گیومه به‌جای براکت؛ براکت در متن راست‌به‌چپ در بعضی نمایشگرها وارونه دیده می‌شد.)

export const master = {
  nameFa: 'صندوق پژوهش و فناوری توسعه و آینده',
  legalFa: 'سهامی خاص',
  shortFa: 'صندوق توسعه و آینده',
  // نام و اختصار لاتین: تصمیم کارفرما پس از بازبینی (۱۱ مهر ۱۴۰۵). آپاستروف تایپوگرافیک (’) است.
  nameEn: 'Tose\u2019e & Ayandeh Research and Technology Fund',
  legalEn: 'Private Joint-Stock Company',
  abbrEn: 'TA Fund',
  web: 'tafund.ir',

  // از فرم مرور (۵ مهر ۱۴۰۵). جداکننده‌ها از «-» به «،» یکدست شده‌اند.
  // نام اشخاص و «سپند سابق» با فاصله غیرشکن (\u00A0) به هم بسته‌اند تا در شکست سطر نصف نشوند.
  address: 'تهران، خیابان استاد\u00A0نجات\u00A0الهی، خیابان استاد\u00A0جعفر\u00A0شهری (سپند\u00A0سابق)، شماره\u00A016',
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
  latin: 'tose\u2019e',      // Tose’e & Ayandeh Research and Technology Fund، اختصار TA Fund
  coverNameSplit: 'approved', // «توسعه و آینده» درشت روی جلدها؛ تأیید آگاهانه کارفرما
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export const fa = (s) => String(s).replace(/[0-9]/g, (d) => FA_DIGITS[d]);

export const TODO_TXT = '«TODO»';
export const TODO = `<span class="todo">${TODO_TXT}</span>`;
export const val = (x, { latin = false } = {}) =>
  x == null ? TODO : latin ? `<span class="lat">${x}</span>` : fa(x);
export const email = (d) =>
  `<span class="lat">${d.emailUser == null ? TODO_TXT : d.emailUser}@${d.web}</span>`;
export const web = (d) => `<span class="lat">${d.web}</span>`;
