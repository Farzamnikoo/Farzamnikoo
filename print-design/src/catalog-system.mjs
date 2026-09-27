// برگه سیستم صفحه‌بندی کاتالوگ (A3 افقی): شبکه، تایپوگرافی، رنگ، آیکون، نشان و الگو.
// نمونه‌متن‌ها فقط از محتوای سند برداشته شده‌اند.

import fs from 'node:fs';
import { instrumentPage } from './catalog.mjs';
import { atAGlance, guarantee } from '../data/catalog.mjs';
import { icons } from './icons.mjs';

const chainSvg = fs.readFileSync(new URL('../brand/pattern/chain-3.svg', import.meta.url), 'utf8');

const swatches = [
  ['سرمه‌ای', '#0F2547', 'عنوان‌ها، متن تأکیدی، نوارها و زمینه‌های تیره', 'navy'],
  ['طلایی', '#C9A227', 'خطوط جداکننده، شماره‌ها، آیکون‌ها؛ هرگز متن بدنه', 'gold'],
  ['طلایی روشن', '#DFC069', 'حلقه دوم نشان، اعداد شاخص روی سرمه‌ای', 'gold-light'],
  ['متن بدنه', '#2B303A', 'متن جاری', 'ink'],
  ['کرم', '#FBF9F4', 'زمینه صفحه‌های داخلی', 'cream'],
  ['خاکستری کارت', '#EEF0F3', 'کادرها و جدول‌ها', 'grey-card'],
];

export function systemSheet() {
  return `
<section class="sys">
  <header class="sys-head">
    <div>
      <h1>کاتالوگ شرکتی: شبکه و سیستم صفحه‌بندی</h1>
      <p>سه صفحه نمونه (جلد، صفحه ۳، صفحه ۷) بر پایه همین سیستم ساخته شده‌اند. پس از تأیید شما، هر ۱۶ صفحه با همین قواعد تکمیل می‌شود.</p>
    </div>
    <div class="sys-meta">صندوق پژوهش و فناوری توسعه و آینده<br>مرحله ۲ از ۵ گردش کار · مهر ۱۴۰۵</div>
  </header>

  <div class="sys-cols">

    <div class="sys-col">
      <h2>شبکه</h2>
      <div class="grid-demo">
        <div class="mini show-grid">${instrumentPage(guarantee)}</div>
        <span class="dim d-top">۱۸</span>
        <span class="dim d-bottom">۲۱</span>
        <span class="dim d-right">۱۷٫۵</span>
        <span class="dim d-left">۱۷٫۵</span>
      </div>
      <table class="spec">
        <tr><td>قطع</td><td>A4، ۱۶ صفحه، منگنه از وسط</td></tr>
        <tr><td>ستون متن</td><td>۱۷۵ × ۲۵۸ میلی‌متر</td></tr>
        <tr><td>ستون‌ها</td><td>۱۲ ستون ۱۰ میلی‌متری، ناودان ۵ میلی‌متر؛ تقسیم‌های رایج: ۱۲، ۸+۴، ۶+۶، ۴+۴+۴، ۳×۴</td></tr>
        <tr><td>خط پایه</td><td>۶ میلی‌متر (۱۷ پوینت)؛ همه فاصله‌های عمودی مضرب آن</td></tr>
        <tr><td>شماره صفحه</td><td>پایین، سمت بیرونی</td></tr>
      </table>
      <div class="spread">
        <div class="sp-page"><span class="sp-no r">۲</span><span class="sp-cap">زوج: شماره در راست</span></div>
        <div class="sp-spine"></div>
        <div class="sp-page"><span class="sp-no l">۳</span><span class="sp-cap">فرد: شماره در چپ</span></div>
      </div>
      <p class="note">راست‌به‌چپ: عطف در لبه راست جلد است؛ صفحه‌های زوج سمت راست و صفحه‌های فرد سمت چپ باز می‌شوند.</p>
    </div>

    <div class="sys-col">
      <h2>تایپوگرافی</h2>
      <div class="levels">
        <div class="lvl"><div class="lvl-meta"><b>۱. عنوان اصلی</b><span>Bold ۳۴ / ۱۸ میلی‌متر · فقط جلد</span></div><div class="t-display spec-navy">توسعه و آینده</div></div>
        <div class="lvl"><div class="lvl-meta"><b>۲. عنوان بخش</b><span>Bold ۲۱ / ۱۲ میلی‌متر + خط طلایی ۰٫۷۵ پوینت</span></div><div><div class="t-section">${atAGlance.title}</div><div class="sec-rule"></div></div></div>
        <div class="lvl"><div class="lvl-meta"><b>۳. عنوان فرعی</b><span>Bold ۱۱٫۵ / ۶ میلی‌متر</span></div><div class="t-sub">${guarantee.listTitle}</div></div>
        <div class="lvl"><div class="lvl-meta"><b>۴. بدنه</b><span>Regular ۹٫۵ / ۶ میلی‌متر (۱٫۷۹ برابر)</span></div><p class="t-body">${atAGlance.text}</p></div>
        <div class="lvl"><div class="lvl-meta"><b>۵. کپشن</b><span>Medium ۷٫۸ / ۴٫۵ میلی‌متر</span></div><div class="t-caption">${guarantee.listNote}</div></div>
      </div>
      <div class="figures">
        <div class="fig-demo"><span class="num">۱۴۰۵</span></div>
        <p class="note">اعداد شاخص: Bold ۴۶ پوینت، طلایی روشن روی سرمه‌ای. قلم: وزیرمتن در سه وزن؛ Inter فقط برای متن لاتین. همه اعداد فارسی.</p>
      </div>
    </div>

    <div class="sys-col">
      <h2>رنگ</h2>
      <div class="swatches">
        ${swatches.map(([n, hex, role, key]) => `<div class="sw"><i style="background:var(--${key})"></i><div><b>${n}</b> <span class="lat">${hex}</span><br><small>${role}</small></div></div>`).join('')}
      </div>
      <div class="ratio"><i style="flex:70;background:var(--cream)"></i><i style="flex:25;background:var(--navy)"></i><i style="flex:5;background:var(--gold)"></i></div>
      <p class="note">نسبت تقریبی در کل سند: ۷۰٪ خنثی، ۲۵٪ سرمه‌ای، ۵٪ طلایی.</p>

      <h2 class="mt">آیکون‌ها</h2>
      <div class="icons">
        <figure>${icons.guarantee}<figcaption>ضمانت‌نامه</figcaption></figure>
        <figure>${icons.facility}<figcaption>تسهیلات</figcaption></figure>
        <figure>${icons.equity}<figcaption>مشارکت</figcaption></figure>
      </div>
      <p class="note">خطی، ضخامت یکسان، سرمه‌ای با یک عنصر طلایی؛ هندسه گرد هم‌ریشه با حلقه‌های نشان.</p>

      <h2 class="mt">نشان و الگو</h2>
      <div class="brand-row">
        <div class="on-navy"><img src="../brand/logo/logo-mark-reverse.svg" alt=""></div>
        <div class="on-cream"><img src="../brand/logo/logo-mark.svg" alt=""></div>
        <div class="on-navy chain-demo">${chainSvg.replace('<svg ', '<svg width="100%" ')}</div>
      </div>
      <p class="note">نشان: گزینهٔ ۳ «زنجیرهٔ پیوند»، نسخه بدون قاب (۳-ج). الگوی سه‌حلقه‌ای فقط روی جلد و پشت جلد، هم‌خانوادهٔ رنگ زمینه؛ قابل اجرا با ورنی موضعی UV به‌جای رنگ.</p>
    </div>
  </div>
</section>`;
}
