// صفحه‌های کاتالوگ — هر تابع یک صفحه A4 می‌سازد. متن‌ها فقط از data/catalog.mjs خوانده می‌شوند.

import fs from 'node:fs';
import { fa } from '../data/master.mjs';
import { cover, atAGlance, guarantee } from '../data/catalog.mjs';
import { icons } from './icons.mjs';

const chainSvg = fs.readFileSync(new URL('../brand/pattern/chain-3.svg', import.meta.url), 'utf8');

// روکش شبکه: ۱۲ ستون، خط پایه ۶ میلی‌متری، کادر حاشیه — روی ناحیه متن (۱۷۵ × ۲۵۸)
function gridOverlay() {
  const cols = Array.from({ length: 12 }, (_, i) =>
    `<rect x="${i * 15}" y="0" width="10" height="258" fill="rgba(224,69,123,0.10)"/>`).join('');
  const lines = Array.from({ length: 44 }, (_, k) =>
    `<line x1="0" x2="175" y1="${k * 6}" y2="${k * 6}" stroke="rgba(0,150,200,0.55)" stroke-width="0.12"/>`).join('');
  return `<svg class="grid-overlay" viewBox="-17.5 -18 210 297" preserveAspectRatio="none">
    <g>${cols}${lines}<rect x="0" y="0" width="175" height="258" fill="none" stroke="rgba(224,69,123,0.8)" stroke-width="0.25" stroke-dasharray="1.2 0.8"/></g></svg>`;
}

function shell({ side, cls = '', folio, body, extra = '' }) {
  return `
<section class="cp ${side} ${cls}">
  <div class="trim">
    ${extra}
    <div class="frame">${body}</div>
    ${folio ? `<div class="folio">${fa(folio)}</div>` : ''}
    ${gridOverlay()}
  </div>
</section>`;
}

const side = (n) => (n % 2 ? 'odd' : 'even');

export function coverPage(c = cover) {
  return shell({
    side: side(c.page),
    cls: 'cover',
    extra: `<div class="chain" aria-hidden="true">${chainSvg.replace('<svg ', '<svg width="100%" ')}</div>`,
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

export function glancePage(p = atAGlance) {
  const stat = (s) => `
    <div class="stat">
      <div class="fig">${s.word ? `<span class="word">${s.word}</span>` : `<span class="num">${s.figure}</span>${s.unit ? `<span class="unit">${s.unit}</span>` : ''}`}</div>
      <div class="tick"></div>
      <div class="label">${s.label}</div>
    </div>`;
  return shell({
    side: side(p.page),
    cls: 'glance',
    folio: p.page,
    body: `
      <header class="opener"><h1 class="t-section">${p.title}</h1></header>
      <div class="sec-rule"></div>
      <div class="panel"><div class="stats">${p.stats.map(stat).join('')}</div></div>
      <p class="t-body cols-8 glance-text">${p.text}</p>`,
  });
}

export function instrumentPage(p = guarantee) {
  return shell({
    side: side(p.page),
    cls: 'instrument',
    folio: p.page,
    body: `
      <header class="opener">
        <span class="t-caption eyebrow">${p.eyebrow}</span>
        ${icons[p.icon]}
        <h1 class="t-section">${p.title}</h1>
      </header>
      <div class="sec-rule"></div>
      <p class="t-body cols-8 intro">${p.text}</p>
      <div class="two-col">
        <div class="main">
          <div class="list-head"><h2 class="t-sub">${p.listTitle}</h2><span class="t-caption">${p.listNote}</span></div>
          <ol class="items">
            ${p.items.map(([name, desc], i) => `<li><span class="no">${fa(i + 1)}</span><span class="name">${name}</span><span class="t-body desc">${desc}</span></li>`).join('')}
          </ol>
        </div>
        <aside class="side">
          ${p.boxes.map((b) => `<div class="box"><h3 class="t-sub">${b.title}</h3><ul class="t-body">${b.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}
        </aside>
      </div>`,
  });
}

export const samplePages = () => [coverPage(), glancePage(), instrumentPage()];
