"""
الگوی «زنجیره» برای جلد و سطوح بزرگ: سه حلقهٔ درهم‌بافته با تناسبات واریاسیون ۳-پ سند نشان
(حلقه ۲۲ × ۱۳، گام ۱۶، ضخامت ۳٫۴). بر خلاف ۳-پ که هر حلقه فقط روی حلقهٔ قبلی می‌افتد، اینجا
حلقه‌ها واقعاً بافته شده‌اند: در تقاطع بالا حلقهٔ راست روی حلقهٔ بعدی و در تقاطع پایین زیر آن.

خروجی: brand/pattern/chain-3.svg با fill="currentColor" (برای درج درون‌خطی در HTML).
اجرا: python3 tools/pattern.py
"""

from pathlib import Path
import pathops
from logo import stadium, stroked, d

OUT = Path(__file__).resolve().parent.parent / 'brand' / 'pattern'


def rect(x, y, w, h):
    p = pathops.Path()
    pen = p.getPen()
    pen.moveTo((x, y)); pen.lineTo((x + w, y)); pen.lineTo((x + w, y + h)); pen.lineTo((x, y + h))
    pen.closePath()
    return p


def woven_chain(n=3, w=22, h=13, pitch=16, sw=3.4, gap=8):
    x0, y0 = 0, 0
    rings = [stroked(stadium(x0 + i * pitch, y0, w, h), sw) for i in range(n)]
    gaps = [stroked(stadium(x0 + i * pitch, y0, w, h), gap) for i in range(n)]
    big = w + pitch * n + 20
    top = rect(-10, y0 - 10, big, h / 2 + 10)
    bottom = rect(-10, y0 + h / 2, big, h / 2 + 10)
    out = []
    for i, r in enumerate(rings):
        if i > 0:  # حلقهٔ قبلی در تقاطع بالا رو است
            r = pathops.op(r, pathops.op(gaps[i - 1], top, pathops.PathOp.INTERSECTION), pathops.PathOp.DIFFERENCE)
        if i < n - 1:  # حلقهٔ بعدی در تقاطع پایین رو است
            r = pathops.op(r, pathops.op(gaps[i + 1], bottom, pathops.PathOp.INTERSECTION), pathops.PathOp.DIFFERENCE)
        out.append(r)
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rings = woven_chain()
    pad = 3.4 / 2
    w_total = 22 + 16 * 2
    box = f'{-pad} {-pad} {w_total + 2 * pad} {13 + 2 * pad}'
    paths = ''.join(f'<path d="{d(r)}"/>' for r in rings)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" fill="currentColor">{paths}</svg>\n'
    (OUT / 'chain-3.svg').write_text(svg, encoding='utf-8')
    print('✓ chain-3.svg')


if __name__ == '__main__':
    main()
