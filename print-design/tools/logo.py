"""
ساخت فایل‌های برداری نشان «زنجیرهٔ پیوند» (گزینهٔ ۳ سند تصمیم نشان، واریاسیون ۳-الف / ۳-ج).

در سند تصمیم، گرهِ دو حلقه با یک خط پهن هم‌رنگِ پس‌زمینه ساخته شده است؛ این روش فقط روی
زمینه‌ای که دقیقاً همان رنگ باشد درست درمی‌آید. اینجا همان هندسه با عملیات بولی به شکل‌های
بسته تبدیل می‌شود تا نشان روی هر زمینه‌ای (کاغذ کرم، تنت، عکس) و در PDF/X بدون شفافیت درست چاپ شود.

اجرا: python3 tools/logo.py   (نیازمند: pip install skia-pathops)
"""

from pathlib import Path
import pathops

K = 0.5522847498307936  # ضریب تقریب ربع دایره با منحنی درجه سه
OUT = Path(__file__).resolve().parent.parent / 'brand' / 'logo'

# رنگ‌ها — هم‌راستا با brand/tokens.css
NAVY = '#0F2547'
GOLD = '#C9A227'
GOLD_LIGHT = '#DFC069'
WHITE = '#FFFFFF'
BLACK = '#111111'


def stadium(x, y, w, h):
    """خط مرکزی یک مستطیل با گوشه‌های کاملاً گرد (شعاع = نصف ارتفاع)."""
    r = h / 2
    p = pathops.Path()
    pen = p.getPen()
    pen.moveTo((x + r, y))
    pen.lineTo((x + w - r, y))
    pen.curveTo((x + w - r + K * r, y), (x + w, y + r - K * r), (x + w, y + r))
    pen.curveTo((x + w, y + r + K * r), (x + w - r + K * r, y + h), (x + w - r, y + h))
    pen.lineTo((x + r, y + h))
    pen.curveTo((x + r - K * r, y + h), (x, y + r + K * r), (x, y + r))
    pen.curveTo((x, y + r - K * r), (x + r - K * r, y), (x + r, y))
    pen.closePath()
    return p


def quarter_arc(cx, cy, r):
    """کمان «M32 23 a9 9 0 0 1 9 9» سند: از بالای دایره تا سمت راست، ساعت‌گرد."""
    p = pathops.Path()
    pen = p.getPen()
    pen.moveTo((cx, cy - r))
    pen.curveTo((cx + K * r, cy - r), (cx + r, cy - K * r), (cx + r, cy))
    pen.endPath()
    return p


def stroked(path, width, cap=pathops.LineCap.BUTT_CAP):
    s = pathops.Path(path)
    s.stroke(width, cap, pathops.LineJoin.ROUND_JOIN, 4)
    s.convertConicsToQuads()   # سرِ گرد کمان به‌صورت conic ساخته می‌شود
    s.simplify()
    return s


def build():
    # هندسه عیناً از سند تصمیم (viewBox 0 0 64 64)
    ring1 = stroked(stadium(9, 23, 32, 18), 4)
    ring2 = stroked(stadium(23, 23, 32, 18), 4)
    gap = stroked(stadium(23, 23, 32, 18), 9)
    over = stroked(quarter_arc(32, 32, 9), 4, pathops.LineCap.ROUND_CAP)

    ring1_cut = pathops.op(ring1, gap, pathops.PathOp.DIFFERENCE)
    return {'ring1': ring1_cut, 'ring2': ring2, 'over': over}


def d(path):
    f = lambda v: f'{v:.3f}'.rstrip('0').rstrip('.')
    out = []
    for verb, pts in path.segments:
        if verb == 'moveTo':
            out.append('M' + ' '.join(f(c) for c in pts[0]))
        elif verb == 'lineTo':
            out.append('L' + ' '.join(f(c) for c in pts[0]))
        elif verb == 'curveTo':
            out.append('C' + ' '.join(f(c) for pt in pts for c in pt))
        elif verb == 'qCurveTo':
            for ctrl, end in pathops.decompose_quadratic_segment(pts):
                out.append('Q' + ' '.join(f(c) for c in (*ctrl, *end)))
        elif verb == 'closePath':
            out.append('Z')
    return ''.join(out)


VARIANTS = {
    # نام فایل: (رنگ حلقه اول، رنگ حلقه دوم، رنگ کمانِ رو، قاب)
    'logo-mark':         (NAVY, GOLD, NAVY, None),         # ۳-ج روی زمینه روشن
    'logo-mark-reverse': (WHITE, GOLD_LIGHT, WHITE, None), # ۳-ج روی زمینه سرمه‌ای
    'logo-mark-framed':  (GOLD, GOLD_LIGHT, GOLD, NAVY),   # ۳-الف با قاب مربع
    'logo-mark-black':   (BLACK, BLACK, BLACK, None),      # تک‌رنگ سیاه (فکس، مهر)
    'logo-mark-white':   (WHITE, WHITE, WHITE, None),      # تک‌رنگ سفید
}


def main():
    parts = build()
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (c1, c2, c3, frame) in VARIANTS.items():
        box = '0 0 64 64' if frame else '7 21 50 22'  # بی‌قاب: دقیقاً مرز بیرونی حلقه‌ها
        bg = f'<rect width="64" height="64" rx="15" fill="{frame}"/>' if frame else ''
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}">'
            f'<title>نشان صندوق پژوهش و فناوری توسعه و آینده</title>{bg}'
            f'<path fill="{c1}" d="{d(parts["ring1"])}"/>'
            f'<path fill="{c2}" d="{d(parts["ring2"])}"/>'
            f'<path fill="{c3}" d="{d(parts["over"])}"/>'
            '</svg>\n'
        )
        (OUT / f'{name}.svg').write_text(svg, encoding='utf-8')
        print('✓', name)


if __name__ == '__main__':
    main()
