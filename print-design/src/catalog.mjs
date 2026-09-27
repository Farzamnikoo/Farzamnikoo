// صفحه‌های کاتالوگ — هر تابع یک صفحه A4 می‌سازد. متن‌ها فقط از data/catalog.mjs و data/master.mjs خوانده می‌شوند.

import fs from 'node:fs';
import { master, fa, val, TODO, email, web } from '../data/master.mjs';
import * as C from '../data/catalog.mjs';
import { icons, marks } from './icons.mjs';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const chain6 = read('../brand/pattern/chain-6.svg');
const qrSvg = read('../brand/qr-tafund.svg');

const todoLabel = (text) => `<span class="todo-fa">[<span class="lat">TODO</span>: ${text}]</span>`;

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
    ${folio ? `<div class="folio">${fa(page)}</div>` : ''}
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

const box = (b, cls = '') =>
  `<div class="box ${cls}"><h3 class="t-sub">${b.title}</h3><ul class="t-body dots">${b.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;

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
      <div class="t-caption edition">${c.edition}</div>
      <div class="lockup">
        <img class="mark" src="../brand/logo/logo-mark-reverse.svg" alt="نشان صندوق">
        <div class="n1">${c.nameLine1}</div>
        <div class="n2">${c.nameLine2}</div>
        <div class="legal">${c.legal}</div>
        <div class="gold-rule"></div>
        <div class="tagline">${c.tagline}</div>
      </div>`,
  });
}

// ═══ ۲ سخن مدیرعامل ═══
export function ceoPage(p = C.ceoNote) {
  const name = master.ceoName ? master.ceoName : todoLabel(p.signatureTodo);
  return shell({
    page: p.page,
    cls: 'ceo',
    body: `
      ${opener({ title: p.title })}
      <div class="letter cols-8">
        ${p.paragraphs.map((x, i) => `<p class="t-body${i === 0 ? ' first' : ''}">${x}</p>`).join('')}
        <div class="sign">
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
      <div class="panel"><div class="stats">${p.stats.map(stat).join('')}</div></div>
      <p class="t-body cols-8 glance-text">${p.text}</p>`,
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
      ${row(p.vision.title, `<p class="t-body">${p.vision.text}</p>`)}
      ${row(p.mission.title, `<p class="t-body">${p.mission.text}</p>`)}
      ${row(p.valuesTitle, `<div class="values">
        ${p.values.map((v) => `<div class="value">${icons[v.icon]}<h3 class="t-sub">${v.name}</h3><p class="t-body">${v.text}</p></div>`).join('')}
      </div>`)}`,
  });
}

// ═══ ۵ مبانی قانونی ═══
export function legalPage(p = C.legal) {
  return shell({
    page: p.page,
    cls: 'legal',
    body: `
      ${opener({ title: p.title })}
      <div class="intro-row">
        <p class="t-body">${p.text}</p>
        <aside class="box"><p class="t-body"><b>${p.boxLead}</b> ${p.boxText(val(master.licenseNo), val(master.licenseDate))}</p></aside>
      </div>
      <table class="law">
        <thead><tr>${p.head.map((h) => `<th class="t-caption">${h}</th>`).join('')}</tr></thead>
        <tbody>${p.rows.map(([doc, year, role]) => `<tr><td class="doc">${doc}</td><td class="year">${year}</td><td>${role}</td></tr>`).join('')}</tbody>
      </table>`,
  });
}

// ═══ ۶ سه ابزار، یک مسیر ═══
export function overviewPage(p = C.overview) {
  const [hStage, hNeed, hTool] = p.head;
  return shell({
    page: p.page,
    cls: 'overview',
    body: `
      ${opener({ title: p.title })}
      <p class="t-body cols-8 intro">${p.text}</p>
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

// ═══ ۷، ۸، ۹ ابزارهای مالی ═══
export function instrumentPage(p) {
  const item = (it, i) => {
    const [name, desc] = it;
    const marker = p.numbered ? `<span class="no">${fa(i + 1)}</span>` : '<span class="bullet" aria-hidden="true"></span>';
    return desc
      ? `<li>${marker}<span class="name">${name}</span><span class="t-body desc">${desc}</span></li>`
      : `<li class="plain">${marker}<span class="t-body">${name}</span></li>`;
  };
  const note = p.note
    ? `<aside class="note-navy"><h3 class="t-sub">${p.note.title}</h3><p class="t-body">${p.note.text}</p></aside>`
    : '';
  return shell({
    page: p.page,
    cls: 'instrument',
    body: `
      ${opener({ title: p.title, eyebrow: p.eyebrow, icon: p.icon })}
      <p class="t-body cols-8 intro">${p.text}</p>
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

// ═══ ۱۰ خدمات تخصصی ═══
export function servicesPage(p = C.services) {
  return shell({
    page: p.page,
    cls: 'services',
    body: `
      ${opener({ title: p.title })}
      <div class="cards2">
        ${p.items.map(([name, desc]) => `<div class="card"><span class="card-tick"></span><h3 class="t-sub">${name}</h3><p class="t-body">${desc}</p></div>`).join('')}
      </div>`,
  });
}

// ═══ ۱۱ فرآیند ═══
export function processPage(p = C.process) {
  return shell({
    page: p.page,
    cls: 'process',
    body: `
      ${opener({ title: p.title })}
      <div class="band">
        <ol class="steps6">
          ${p.steps.map(([t, d], i) => `<li class="step"><span class="n">${fa(i + 1)}</span><h3 class="t-sub">${t}</h3><p class="t-body">${d}</p></li>`).join('')}
        </ol>
      </div>
      <aside class="note-line"><p class="t-body">${p.note}</p></aside>`,
  });
}

// ═══ ۱۲ متقاضیان ═══
export function applicantsPage(p = C.applicants) {
  const list = (l, kind) => `
    <section class="plist ${kind}">
      <h2 class="t-sub">${l.title}</h2>
      <ul class="t-body">${l.items.map((x) => `<li>${marks[kind === 'ok' ? 'check' : 'cross']}<span>${x}</span></li>`).join('')}</ul>
    </section>`;
  return shell({
    page: p.page,
    cls: 'applicants',
    body: `
      ${opener({ title: p.title })}
      <div class="plists">${list(p.eligible, 'ok')}${list(p.excluded, 'no')}</div>`,
  });
}

// ═══ ۱۳ حاکمیت ═══
export function governancePage(p = C.governance) {
  const profiles = master.board
    ? `<div class="profiles">${master.board.split('\n').filter(Boolean).map((l) => `<div class="profile t-body">${l}</div>`).join('')}</div>`
    : `<div class="todo-area">${todoLabel(p.profilesTodo)}</div>`;
  return shell({
    page: p.page,
    cls: 'governance',
    body: `
      ${opener({ title: p.title })}
      <h2 class="t-sub block-title first">${p.organsTitle}</h2>
      <div class="organs">
        ${p.organs.map(([n, d]) => `<div class="organ"><h3 class="t-sub">${n}</h3><p class="t-body">${d}</p></div>`).join('')}
      </div>
      <div class="gov-row">
        <section class="committees">
          <h2 class="t-sub">${p.committeesTitle}</h2>
          <ul class="t-body dots">${p.committees.map((x) => `<li>${x}</li>`).join('')}</ul>
        </section>
        <aside class="box"><h3 class="t-sub">${p.commitment.title}</h3><p class="t-body">${p.commitment.text}</p></aside>
      </div>
      ${profiles}`,
  });
}

// ═══ ۱۴ مسیرهای همکاری ═══
export function cooperationPage(p = C.cooperation) {
  return shell({
    page: p.page,
    cls: 'cooperation',
    body: `
      ${opener({ title: p.title })}
      <div class="coop">
        ${p.columns.map(([t, d], i) => `<div class="coop-col"><span class="big-n">${fa(i + 1)}</span><h3 class="t-sub">${t}</h3><p class="t-body">${d}</p></div>`).join('')}
      </div>`,
  });
}

// ═══ ۱۵ تماس ═══
export function contactPage(p = C.contact) {
  const L = p.labels;
  const row = (label, value) => `<div class="crow"><dt class="t-caption">${label}</dt><dd class="t-body">${value}</dd></div>`;
  return shell({
    page: p.page,
    cls: 'contact',
    body: `
      ${opener({ title: p.title })}
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
      </div>`,
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
  coverPage(), ceoPage(), glancePage(), vmvPage(), legalPage(), overviewPage(),
  instrumentPage(C.guarantee), instrumentPage(C.facility), instrumentPage(C.equity),
  servicesPage(), processPage(), applicantsPage(), governancePage(), cooperationPage(), contactPage(), backPage(),
];

export const samplePages = () => [coverPage(), glancePage(), instrumentPage(C.guarantee)];
export { instrumentPage as instrument };
