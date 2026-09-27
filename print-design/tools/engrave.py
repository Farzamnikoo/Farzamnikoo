"""
الگوی «زنجیرهٔ حکاکی‌شده» برای جلدها: همان زنجیرهٔ بافتهٔ tools/pattern.py، اما هر حلقه به‌جای سطح پر
با چند خط موازیِ هم‌مرکز کشیده می‌شود؛ مثل حکاکی اوراق بهادار و برگه سهام.
بافت رو و زیر حلقه‌ها عیناً مثل الگوی اصلی است.

خط‌ها سطح پر (fill) هستند، نه stroke، تا در PDF/X و هر بزرگ‌نمایی ضخامتشان دقیق بماند.
خروجی: brand/pattern/chain-3-engraved.svg و chain-6-engraved.svg با fill="currentColor"
اجرا: cd tools && python3 engrave.py
"""

from pathlib import Path
import pathops
from logo import stadium, stroked, d
from pattern import rect

OUT = Path(__file__).resolve().parent.parent / 'brand' / 'pattern'

W, H, PITCH, SW, GAP = 22, 13, 16, 3.4, 8   # تناسبات الگوی اصلی
LINES = 8          # تعداد خط در پهنای هر حلقه
LINE_W = 0.06      # ضخامت هر خط (واحد الگو)؛ روی جلد کاتالوگ (۴٫۵۶ میلی‌متر بر واحد) ≈ ۰٫۲۷ میلی‌متر
EDGE_W = 0.08      # دو خط لبه کمی پررنگ‌تر


def union(paths):
    out = pathops.Path()
    for p in paths:
        out = pathops.op(out, p, pathops.PathOp.UNION)
    return out


def ring_lines(x, y):
    """خط‌های هم‌مرکز در پهنای حلقه: لبه‌ها و خط‌های میانی با فاصله برابر."""
    half = SW / 2 - EDGE_W / 2
    offs = [-half + k * (2 * half) / (LINES - 1) for k in range(LINES)]
    parts = []
    for k, o in enumerate(offs):
        lw = EDGE_W if k in (0, LINES - 1) else LINE_W
        parts.append(stroked(stadium(x - o, y - o, W + 2 * o, H + 2 * o), lw))
    return union(parts)


def engraved_chain(n):
    lines = [ring_lines(i * PITCH, 0) for i in range(n)]
    gaps = [stroked(stadium(i * PITCH, 0, W, H), GAP) for i in range(n)]
    big = W + PITCH * n + 20
    top = rect(-10, -10, big, H / 2 + 10)
    bottom = rect(-10, H / 2, big, H / 2 + 10)
    out = []
    for i, r in enumerate(lines):
        if i > 0:
            r = pathops.op(r, pathops.op(gaps[i - 1], top, pathops.PathOp.INTERSECTION), pathops.PathOp.DIFFERENCE)
        if i < n - 1:
            r = pathops.op(r, pathops.op(gaps[i + 1], bottom, pathops.PathOp.INTERSECTION), pathops.PathOp.DIFFERENCE)
        out.append(r)
    return out


def write(n):
    rings = engraved_chain(n)
    pad = SW / 2
    w_total = W + PITCH * (n - 1)
    box = f'{-pad} {-pad} {w_total + 2 * pad} {H + 2 * pad}'
    paths = ''.join(f'<path d="{d(r)}"/>' for r in rings)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" fill="currentColor">{paths}</svg>\n'
    (OUT / f'chain-{n}-engraved.svg').write_text(svg, encoding='utf-8')
    print(f'✓ chain-{n}-engraved.svg')


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    write(3)
    write(6)
