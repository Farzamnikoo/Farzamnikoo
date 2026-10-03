// صفحه‌های کاتالوگ — هر تابع یک صفحه A4 می‌سازد. متن‌ها فقط از data/catalog.mjs و data/master.mjs خوانده می‌شوند.

import fs from 'node:fs';
import { master, fa, val, TODO, email, web } from '../data/master.mjs';
import * as C from '../data/catalog.mjs';
import { icons, illos } from './icons.mjs';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const chain6 = read('../brand/pattern/chain-6-engraved.svg');
const qrSvg = read('../brand/qr-tafund.svg');

const todoLabel = (text) => `<span class="todo-fa">«<span class="lat">TODO</span>: ${text}»</span>`;

// روکش شبکه: ۱۲ ستون، خط پایه ۶ میلی‌متری، کادر حاشیه — روی ناحیه متن (۱۷۵ × ۲۵۸)
function gridOverlay() {
  const cols = Array.from({ length: 12 }, (_, i) =>
    `<rect x="${i * 15}" y="0" width="10" height="258" fill="rgba(224,69,123,0.10)"/>`).join('');
  const lines = Array.from({ length: 44 }, (_, k) =>
    `<line x1="0" x2="175" y1="${k * 6}" y2="${k * 6}" stroke="rgba(0,150,200,0.55)" stroke-width="0.12"/>`).join('');
  return `<svg class="grid-overlay" viewBox="-17.5 -18 210 297" preserveAspectRatio="none">
    <g>${cols}${lines}<rect x="0" y="0" width="175" height="258" fill="none" stroke="rgba(224,69,123,0.8)" stroke-width="0.25" stroke-dasharray="1.2 0.8"/></g></svg>`;
}

const side = (n) => (n % 2 ? 'odd' : 'even');

function shell({ page, cls = '', body, extra = '', folio = true }) {
  return `
<section class="cp ${side(page)} ${cls}" data-page="${page}">
  <div class="trim">
    ${extra}
    <div class="frame">${body}</div>
    ${folio ? `<div class="runfoot"><span class="rf-name">${master.nameFa}</span><span class="folio">${fa(page)}</span></div>` : ''}
    ${gridOverlay()}
  </div>
</section>`;
}

function opener({ title, eyebrow, icon }) {
  return `
    <header class="opener">
      ${eyebrow ? `<span class="t-caption eyebrow">${eyebrow}</span>` : ''}
      ${icon ? icons[icon] : ''}
      <h1 class="t-section">${title}</h1>
    </header>
    <div class="sec-rule"></div>`;
}

const box = (b) =>
  `<div class="card-w"><h3 class="t-sub">${b.title}</h3><ul class="t-body dots">${b.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;

// الگوی زنجیره روی جلد و پشت جلد: یک زنجیره پیوسته از جلد رو به پشت جلد، از روی عطف
// صفحهٔ باز جلد (بیرون) = [جلد رو | پشت جلد] از چپ به راست؛ پشت جلد ادامهٔ راستِ جلد رو است.
const CHAIN = { top: 188, left: -26, width: 481 };
const chainLayer = (offset) =>
  `<div class="chain" aria-hidden="true" style="top:${CHAIN.top}mm;left:${CHAIN.left - offset}mm;width:${CHAIN.width}mm">${chain6.replace('<svg ', '<svg width="100%" ')}</div>`;

// ═══ ۱ جلد ═══
export function coverPage(c = C.cover) {
  return shell({
    page: c.page,
    cls: 'cover',
    folio: false,
    extra: chainLayer(0),
    body: `
      <div class="top">
        <img class="mark" src="../brand/logo/logo-mark-reverse.svg" alt="نشان صندوق">
        <div class="edition">${c.edition}</div>
      </div>
      <div class="lockup">
        <div class="n1">${c.nameLine1}</div>
        <div class="n2">${c.nameLine2}</div>
        <div class="legal">${c.legal}</div>
        <div class="gold-rule"></div>
        <div class="tagline">${c.tagline}</div>
      </div>`,
  });
}

// ═══ ۲ پیام مدیرعامل ═══
export function ceoPage(p = C.ceoNote) {
  const name = master.ceoName ? master.ceoName : todoLabel(p.signatureTodo);
  return shell({
    page: p.page,
    cls: 'ceo',
    body: `
      ${opener({ title: p.title })}
      <div class="letter">
        ${p.paragraphs.map((x, i) => `<p class="${i === 0 ? 'first' : ''}">${x}</p>`).join('')}
        <div class="sign">
          <div class="sign-rule"></div>
          <div class="sign-space"></div>
          <div class="sign-name">${name}</div>
          <div class="t-caption">${p.role}</div>
        </div>
      </div>`,
  });
}

// ═══ ۳ صندوق در یک نگاه ═══
export function glancePage(p = C.atAGlance) {
  const stat = (s) => `
    <div class="stat">
      <div class="fig">${s.word ? `<span class="word">${s.word}</span>` : `<span class="num">${s.figure}</span>${s.unit ? `<span class="unit">${s.unit}</span>` : ''}`}</div>
      <div class="tick"></div>
      <div class="label">${s.label}</div>
    </div>`;
  return shell({
    page: p.page,
    cls: 'glance',
    body: `
      ${opener({ title: p.title })}
      <p class="t-lead lead">${p.text}</p>
      <div class="panel"><div class="stats">${p.stats.map(stat).join('')}</div></div>`,
  });
}

// ═══ ۴ چشم‌انداز، مأموریت، ارزش‌ها ═══
export function vmvPage(p = C.vmv) {
  const row = (label, content) => `<section class="lrow"><h2 class="t-sub lrow-label">${label}</h2><div class="lrow-body">${content}</div></section>`;
  return shell({
    page: p.page,
    cls: 'vmv',
    body: `
      ${opener({ title: p.title })}
      ${row(p.vision.title, `<p class="t-lead">${p.vision.text}</p>`)}
      ${row(p.mission.title, `<p class="t-lead">${p.mission.text}</p>`)}
      <section class="values-wrap">
        <h2 class="t-sub">${p.valuesTitle}</h2>
        <div class="values">
          ${p.values.map((v) => `<div class="value">${icons[v.icon]}<h3 class="t-sub">${v.name}</h3><p class="t-body">${v.text}</p></div>`).join('')}
        </div>
      </section>`,
  });
}

// ═══ ۵ چارچوب قانونی و نظارتی ═══
export function legalPage(p = C.legal) {
  return shell({
    page: p.page,
    cls: 'legal',
    body: `
      ${opener({ title: p.title })}
      <div class="intro-row">
        <p class="t-lead">${p.text}</p>
        <aside class="card-w"><p class="t-body"><b>${p.boxLead}</b> ${p.boxText(val(master.licenseNo), val(master.licenseDate))}</p></aside>
      </div>
      <table class="law">
        <thead><tr>${p.head.map((h) => `<th class="t-caption">${h}</th>`).join('')}</tr></thead>
        <tbody>${p.rows.map(([doc, year, role]) => `<tr><td class="doc">${doc}</td><td class="year">${year}</td><td>${role}</td></tr>`).join('')}</tbody>
      </table>`,
  });
}

// ═══ ۶ مزیت‌های همکاری ═══
export function advantagesPage(p = C.advantages) {
  return shell({
    page: p.page,
    cls: 'advantages',
    body: `
      ${opener({ title: p.title })}
      <p class="t-lead lead">${p.lead}</p>
      <div class="grid6">
        ${p.items.map((it) => `<div class="adv">${icons[it.icon]}<h3 class="t-sub">${it.title}</h3><p class="t-body">${it.text}</p></div>`).join('')}
      </div>`,
  });
}

// ═══ ۷ سه ابزار، یک مسیر ═══
export function overviewPage(p = C.overview) {
  const [hStage, hNeed, hTool] = p.head;
  return shell({
    page: p.page,
    cls: 'overview',
    body: `
      ${opener({ title: p.title })}
      <p class="t-lead lead">${p.text}</p>
      <div class="flow">
        <div class="flow-rail" aria-hidden="true"></div>
        ${p.rows.map((r) => `
          <div class="stage">
            <span class="node" aria-hidden="true"></span>
            <div class="t-caption lbl">${hStage}</div>
            <h3 class="t-sub">${r.stage}</h3>
            <div class="t-caption lbl">${hNeed}</div>
            <p class="t-body need">${r.need}</p>
            <div class="t-caption lbl">${hTool}</div>
            <div class="tool"><span class="tool-icons">${r.icons.map((k) => icons[k]).join('')}</span><b>${r.tool}</b></div>
          </div>`).join('')}
      </div>`,
  });
}

// ═══ ۸، ۹، ۱۰ ابزارهای مالی ═══
export function instrumentPage(p) {
  const item = (it, i) => {
    const [name, desc] = it;
    const marker = p.numbered ? `<span class="no">${fa(i + 1)}</span>` : '<span class="bullet" aria-hidden="true"></span>';
    return desc
      ? `<li>${marker}<span class="name">${name}</span><span class="t-body desc">${desc}</span></li>`
      : `<li class="plain">${marker}<span class="t-body">${name}</span></li>`;
  };
  const note = p.note
    ? `<aside class="note-navy"><h3 class="t-sub">${p.note.title}</h3><p class="t-body">${p.note.text}</p>${p.note.more ? `<span class="more">${p.note.more}</span>` : ''}</aside>`
    : '';
  return shell({
    page: p.page,
    cls: 'instrument',
    body: `
      ${opener({ title: p.title, eyebrow: p.eyebrow, icon: p.icon })}
      <p class="t-lead lead">${p.text}</p>
      <div class="two-col">
        <div class="main">
          <div class="list-head"><h2 class="t-sub">${p.listTitle}</h2>${p.listNote ? `<span class="t-caption">${p.listNote}</span>` : ''}</div>
          <ol class="items">${p.items.map(item).join('')}</ol>
          ${note}
        </div>
        <aside class="side">${p.boxes.map((b) => box(b)).join('')}</aside>
      </div>`,
  });
}

// گام‌های افقی راست‌به‌چپ با پیکان (مزایای مالیاتی و عاملیت)
const flowSteps = (steps, cls) =>
  `<ol class="flow-steps ${cls}">${steps.map(([t, d], i) => `<li><span class="n">${fa(i + 1)}</span><h3 class="t-sub">${t}</h3><p class="t-body">${d}</p></li>`).join('')}</ol>`;
const whoCols = (items) =>
  `<div class="who3">${items.map((w) => `<div class="who">${icons[w.icon]}<h3 class="t-sub">${w.title}</h3><p class="t-body">${w.text}</p></div>`).join('')}</div>`;

// ═══ ۱۱ مزایای مالیاتی ═══
export function taxPage(p = C.tax) {
  return shell({
    page: p.page,
    cls: 'tax',
    body: `
      ${opener({ title: p.title })}
      <p class="t-lead lead">${p.lead}</p>
      <div class="basis">
        <span class="t-caption eb">${p.basis.label}</span>
        <h3 class="t-sub">${p.basis.law}</h3>
        <p class="t-lead">${p.basis.text}</p>
      </div>
      <h2 class="t-sub blk">${p.whoTitle}</h2>
      ${whoCols(p.who)}
      <h2 class="t-sub blk">${p.roleTitle}</h2>
      ${flowSteps(p.role, 'light')}
      <p class="caveat t-caption">${p.caveat}</p>`,
  });
}

// ═══ ۱۲ خدمات تخصصی ═══
export function servicesPage(p = C.services) {
  return shell({
    page: p.page,
    cls: 'services',
    body: `
      ${opener({ title: p.title })}
      <p class="t-lead lead">${p.lead}</p>
      <div class="svc-grid">
        ${p.items.map((it) => `
          <div class="svc">
            ${illos[it.illo]}
            <h3 class="t-sub">${it.title}</h3>
            <p class="t-body">${it.text}</p>
            <ul class="t-body dots">${it.points.map((x) => `<li>${x}</li>`).join('')}</ul>
          </div>`).join('')}
      </div>`,
  });
}

// ═══ ۱۳ فرآیند (با نقل‌قول و دو محور ارزیابی) ═══
export function processPage(p = C.process) {
  return shell({
    page: p.page,
    cls: 'process',
    body: `
      <div class="quote-panel">
        ${opener({ title: p.title })}
        <blockquote class="quote"><p>«${p.quote}»</p><footer>${p.quoteSource}</footer></blockquote>
      </div>
      <p class="t-lead lead">${p.lead}</p>
      <div class="band light">
        <ol class="steps6">
          ${p.steps.map(([t, d], i) => `<li class="step"><span class="n">${fa(i + 1)}</span><h3 class="t-sub">${t}</h3><p class="t-body">${d}</p></li>`).join('')}
        </ol>
      </div>
      <aside class="note-line"><p class="t-body">${p.note}</p></aside>`,
  });
}

// ═══ ۱۴ عاملیت و اداره وجوه ═══
export function agencyPage(p = C.agency) {
  return shell({
    page: p.page,
    cls: 'agency',
    body: `
      ${opener({ title: p.title })}
      <p class="t-lead lead">${p.lead}</p>
      <h2 class="t-sub blk">${p.whoTitle}</h2>
      ${whoCols(p.who)}
      <div class="band cycle">
        <h2 class="t-sub">${p.cycleTitle}</h2>
        ${flowSteps(p.cycle, 'dark')}
      </div>
      <div class="ag-bottom">
        <section><h2 class="t-sub blk">${p.toolsTitle}</h2><ul class="t-body dots">${p.tools.map((x) => `<li>${x}</li>`).join('')}</ul></section>
        <section><h2 class="t-sub blk">${p.valueTitle}</h2><dl class="vals">${p.value.map(([t, d]) => `<div><dt>${t}</dt><dd class="t-body">${d}</dd></div>`).join('')}</dl></section>
      </div>`,
  });
}

// ═══ ۱۵ مسیرهای همکاری و تماس ═══
export function closingPage(p = C.cooperation, c = C.contact) {
  const L = c.labels;
  const row = (label, value) => `<div class="crow"><dt class="t-caption">${label}</dt><dd class="t-body">${value}</dd></div>`;
  return shell({
    page: p.page,
    cls: 'closing contact',
    body: `
      ${opener({ title: p.title })}
      <div class="coop3">
        ${p.columns.map(([t, d], i) => `<div class="coop-col"><span class="big-n">${fa(i + 1)}</span><h3 class="t-sub">${t}</h3><p class="t-body">${d}</p></div>`).join('')}
      </div>
      <h2 class="t-section sec2">${c.title}</h2>
      <div class="sec-rule"></div>
      <div class="contact-grid">
        <dl class="cdl">
          ${row(L.address, val(master.address))}
          ${row(L.postcode, val(master.postcode))}
          <div class="crow pair">
            <div><dt class="t-caption">${L.tel}</dt><dd class="t-body">${val(master.tel)}</dd></div>
            <div><dt class="t-caption">${L.fax}</dt><dd class="t-body">${val(master.fax)}</dd></div>
          </div>
          ${row(L.email, email(master))}
          ${row(L.web, web(master))}
        </dl>
        <figure class="qr">
          <div class="qr-code">${qrSvg}</div>
          <figcaption><span class="lat">${master.web}</span></figcaption>
          <div class="hours"><span class="t-caption">${L.hours}:</span> <span class="t-body">${val(master.hours)}</span></div>
        </figure>
      </div>
      <div class="sign-off"><img src="../brand/logo/logo-mark.svg" alt=""><span class="t-sub">${master.nameFa} <span class="t-caption">(${master.legalFa})</span></span></div>`,
  });
}

// ═══ ۱۶ پشت جلد ═══
export function backPage(p = C.backCover) {
  const social = master.social ? master.social.split('\n').join(' · ') : todoLabel(p.socialTodo);
  return shell({
    page: p.page,
    cls: 'cover back',
    folio: false,
    extra: chainLayer(210),
    body: `
      <div class="back-block">
        <img class="mark" src="../brand/logo/logo-mark-white.svg" alt="نشان صندوق">
        <div class="tagline">${p.tagline}</div>
        <div class="gold-rule"></div>
        <div class="site">${web(master)}</div>
        <div class="social t-caption">${social}</div>
      </div>
      <div class="small-print t-caption">
        <p>${p.legalLine(val(master.regNo), val(master.nationalId))}</p>
        <p>${p.disclaimer}</p>
      </div>`,
  });
}

export const allPages = () => [
  coverPage(), ceoPage(), glancePage(), vmvPage(), legalPage(), advantagesPage(), overviewPage(),
  instrumentPage(C.guarantee), instrumentPage(C.facility), instrumentPage(C.equity),
  taxPage(), servicesPage(), processPage(), agencyPage(), closingPage(), backPage(),
];

export const samplePages = () => [coverPage(), glancePage(), instrumentPage(C.guarantee)];
export { instrumentPage as instrument };
