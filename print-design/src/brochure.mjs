// بروشور سه‌لت — A4 افقی، تای غلتان (roll fold) راست‌به‌چپ.
// برگه بیرونی (از چپ به راست): جلد ۱۰۰ | پشت جلد ۱۰۰ | لت تاشونده ۹۷ میلی‌متر.
// برگه داخلی (از چپ به راست): پنل ۶ (۹۷، پشتِ لت) | پنل ۵ (۱۰۰) | پنل ۴ (۱۰۰)؛ خوانش از راست.

import fs from 'node:fs';
import { master, fa, val, email, web } from '../data/master.mjs';
import * as B from '../data/brochure.mjs';
import { icons } from './icons.mjs';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const chain3 = read('../brand/pattern/chain-3-engraved.svg');
const qrSvg = read('../brand/qr-tafund.svg');

export const OUTSIDE = [100, 100, 97];   // جلد، پشت جلد، لت
export const INSIDE = [97, 100, 100];    // پنل ۶، ۵، ۴

function folds(widths) {
  let x = 0;
  return widths.slice(0, -1).map((w) => { x += w; return `<i class="fold" style="left:${x}mm"></i>`; }).join('');
}

export function outsideSheet() {
  const [wc, wb, wf] = OUTSIDE;
  const c = B.cover, b = B.back, f = B.flap;
  return `
<section class="bs outside">
  <div class="trim">
    <div class="panel cover" style="left:0;width:${wc}mm">
      <div class="chain" aria-hidden="true">${chain3.replace('<svg ', '<svg width="100%" ')}</div>
      <div class="pin">
        <img class="mark" src="../brand/logo/logo-mark-reverse.svg" alt="نشان صندوق">
        <div class="lockup">
          <div class="n1">${c.nameLine1}</div>
          <div class="n2">${c.nameLine2}</div>
          <div class="gold-rule"></div>
          <div class="tagline">${c.tagline}</div>
          <div class="tools">${c.tools}</div>
        </div>
      </div>
    </div>

    <div class="panel back" style="left:${wc}mm;width:${wb}mm">
      <div class="pin">
        <h2 class="b-section">${b.title}</h2>
        <div class="rule"></div>
        <p class="b-body">${b.lead(web(master))}</p>
        <div class="qr">${qrSvg}</div>
        <dl class="cdl">
          <div><dt>${b.labels.address}:</dt><dd>${val(master.address)}</dd></div>
          <div><dt>${b.labels.tel}:</dt><dd>${val(master.tel)}</dd></div>
          <div><dt>${b.labels.email}:</dt><dd>${email(master)}</dd></div>
          <div class="site">${web(master)}</div>
        </dl>
        <div class="legal b-caption"><div>${b.legal1}</div><div>${b.legal2}</div></div>
      </div>
    </div>

    <div class="panel flap" style="left:${wc + wb}mm;width:${wf}mm">
      <div class="pin">
        <h2 class="b-section">${f.title}</h2>
        <div class="rule"></div>
        ${f.paragraphs.map((p, i) => `<p class="${i === 0 ? 'b-lead' : 'b-body'}">${p}</p>`).join('')}
      </div>
    </div>
    ${folds(OUTSIDE)}
  </div>
</section>`;
}

export function insideSheet() {
  const I = B.inside;
  // پنل‌ها به ترتیب خوانش: ۴ (راست)، ۵، ۶ (چپ، باریک)
  const [w6, w5, w4] = INSIDE;
  const pos = [{ left: w6 + w5, width: w4 }, { left: w6, width: w5 }, { left: 0, width: w6 }];
  const panel = (p, i) => `
    <div class="panel tool" style="left:${pos[i].left}mm;width:${pos[i].width}mm">
      <div class="pin">
        ${icons[p.icon]}
        <h3 class="b-sub">${p.title}</h3>
        <p class="b-body">${p.text}</p>
        <ul class="b-body dots">${p.items.map((x) => `<li>${x}</li>`).join('')}</ul>
        ${p.note ? `<p class="b-body note"><b>${p.note.lead}</b> ${p.note.text}</p>` : ''}
      </div>
    </div>`;
  // گام‌های فرآیند: هر گام دور از خط تا؛ پیکان‌ها راست‌به‌چپ
  const stepX = [247, 172, 122, 48.5];
  const arrows = [[216, 203], [153, 141], [91, 79]];
  return `
<section class="bs inside">
  <div class="trim">
    <header class="headline">
      <h2 class="b-section">${I.headline}</h2>
      <div class="rule"></div>
    </header>
    ${I.panels.map(panel).join('')}
    <div class="band">
      ${I.steps.map((s, i) => `<div class="step" style="left:${stepX[i]}mm"><span class="n">${fa(i + 1)}</span><span class="t">${s}</span></div>`).join('')}
      <svg class="arrows" viewBox="0 0 297 30" preserveAspectRatio="none" aria-hidden="true">
        ${arrows.map(([x1, x2]) => `<path d="M${x1} 15H${x2}m2.2 -2.2L${x2} 15l2.2 2.2" fill="none" stroke="#DFC069" stroke-width="0.35" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
      </svg>
    </div>
    ${folds(INSIDE)}
  </div>
</section>`;
}

export const brochureSheets = () => [outsideSheet(), insideSheet()];
