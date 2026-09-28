// تصویرسازی خدمات تخصصی (صفحه خدمات کاتالوگ) — هم‌خانوادهٔ آیکون‌ها: هندسه گرد، خط سرمه‌ای و یک عنصر توپُر طلایی،
// روی پس‌زمینه‌ای از دایره‌های هم‌مرکز ظریف که یادآور زنجیرهٔ حکاکی‌شده جلد است.
// شبکه ۱۶۰ × ۱۲۰؛ شکل‌ها با رنگ زمینه صفحه پر می‌شوند تا خط‌های پس‌زمینه از زیرشان دیده نشود.
// بدون شفافیت (برای PDF/X-1a) و بدون متن.

const NAVY = 'var(--navy)';
const GOLD = 'var(--gold)';
const SOFT = 'var(--navy-30)';
const PAPER = 'var(--page-bg, #FBF9F4)';

const rings = (cx = 80, cy = 60) =>
  [56, 50, 44, 38, 32].map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="var(--navy-12)" stroke-width="0.6" fill="none"/>`).join('');

const wrap = (body, label) =>
  `<svg class="illo" viewBox="0 0 160 120" role="img" aria-label="${label}" fill="none" stroke="${NAVY}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${rings()}${body}</svg>`;

export const illustrations = {
  // ارزیابی و امکان‌سنجی: گزارش طرح با نمودار، زیر ذره‌بین
  evaluation: wrap(
    `<rect x="46" y="20" width="54" height="72" rx="4" fill="${PAPER}"/>
     <path d="M55 33h30M55 41h36M55 49h22"/>
     <path d="M55 82h36" stroke="${SOFT}"/>
     <rect x="57" y="70" width="6" height="12" rx="1" fill="${PAPER}"/>
     <rect x="67" y="63" width="6" height="19" rx="1" fill="${PAPER}"/>
     <rect x="77" y="57" width="6" height="25" rx="1" fill="${GOLD}" stroke="none"/>
     <circle cx="104" cy="76" r="15" fill="${PAPER}"/>
     <path d="M115 87l12 12" stroke-width="3.4"/>
     <path d="M97 76.5l5 5 9-10"/>`,
    'ارزیابی و امکان‌سنجی طرح'
  ),

  // ارزش‌گذاری: ترازو — دارایی فکری (نگین طلایی) در برابر سرمایه (سکه‌ها)
  valuation: wrap(
    `<path d="M80 30v58"/>
     <path d="M70 88h20l5 6H65z" fill="${PAPER}"/>
     <path d="M60 94h40"/>
     <path d="M44 38h72"/>
     <circle cx="80" cy="28" r="3.2" fill="${NAVY}" stroke="none"/>
     <path d="M44 38l-11 26M44 38l11 26M116 38l-11 26M116 38l11 26" stroke="${SOFT}" stroke-width="1"/>
     <path d="M29 64h30a15 8 0 0 1-30 0z" fill="${PAPER}"/>
     <path d="M101 64h30a15 8 0 0 1-30 0z" fill="${PAPER}"/>
     <path d="M36 55l4-6h8l4 6-8 9z" fill="${GOLD}" stroke="none"/>
     <path d="M36 55h16" stroke="${PAPER}" stroke-width="1"/>
     <rect x="106" y="58" width="20" height="5" rx="2.5" fill="${PAPER}"/>
     <rect x="107" y="52.5" width="18" height="5" rx="2.5" fill="${PAPER}"/>
     <rect x="108" y="47" width="16" height="5" rx="2.5" fill="${PAPER}"/>`,
    'ارزش‌گذاری'
  ),

  // توسعه بازار و تجاری‌سازی: محصول، فروش رو به رشد و مسیر ورود به بازار
  market: wrap(
    `<path d="M30 62l18-9 18 9-18 9z" fill="${PAPER}"/>
     <path d="M30 62v22l18 9V71z" fill="${PAPER}"/>
     <path d="M66 62v22l-18 9V71z" fill="${PAPER}"/>
     <path d="M39 57.5l18 9" stroke="${GOLD}" stroke-width="2.4"/>
     <rect x="80" y="76" width="9" height="17" rx="1.2" fill="${PAPER}"/>
     <rect x="94" y="66" width="9" height="27" rx="1.2" fill="${PAPER}"/>
     <rect x="108" y="54" width="9" height="39" rx="1.2" fill="${GOLD}" stroke="none"/>
     <path d="M76 93h46"/>
     <path d="M76 62c14-4 28-14 42-30" stroke="${NAVY}"/>
     <path d="M109 31.5l9.5 0.5-1.5 9.5"/>`,
    'توسعه بازار و تجاری‌سازی'
  ),

  // مشاوره ساختار تأمین مالی: ترکیب سه ابزار در یک ساختار — نمودار حلقوی سه‌بخشی و راهنما
  structure: (() => {
    // سه کمان حلقه: طلایی (ضمانت‌نامه)، سرمه‌ای (تسهیلات)، روشن (سرمایه)
    const cx = 62, cy = 60, r = 26, w = 11;
    const pt = (deg) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)].map((v) => v.toFixed(2)).join(' '); };
    const arc = (a0, a1, color) => `<path d="M${pt(a0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${pt(a1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="butt"/>`;
    return wrap(
      `<circle cx="${cx}" cy="${cy}" r="${r + w / 2 + 3}" fill="${PAPER}" stroke="none"/>
       ${arc(4, 158, GOLD)}${arc(164, 262, NAVY)}${arc(268, 356, SOFT)}
       <circle cx="${cx}" cy="${cy}" r="${r - w / 2 - 4}" stroke="${SOFT}" stroke-width="0.8"/>
       <rect x="104" y="40" width="8" height="8" rx="2" fill="${GOLD}" stroke="none"/>
       <rect x="104" y="56" width="8" height="8" rx="2" fill="${NAVY}" stroke="none"/>
       <rect x="104" y="72" width="8" height="8" rx="2" fill="${SOFT}" stroke="none"/>
       <path d="M118 44h18M118 60h14M118 76h16" stroke="${SOFT}" stroke-width="2"/>`,
      'مشاوره ساختار تأمین مالی'
    );
  })(),
};

// ترتیب با فهرست خدمات در data/catalog.mjs
export const serviceIllustrations = ['evaluation', 'valuation', 'market', 'structure'];
