"""TrimBox و BleedBox را روی همه صفحه‌های یک PDF می‌گذارد (به میلی‌متر: حاشیه صفحه تا برش، نشت، ابعاد برش)."""
import sys
import pikepdf

src, slug, bleed, w, h = sys.argv[1], *map(float, sys.argv[2:6])
pt = 72 / 25.4
trim = [slug * pt, slug * pt, (slug + w) * pt, (slug + h) * pt]
bl = [(slug - bleed) * pt, (slug - bleed) * pt, (slug + w + bleed) * pt, (slug + h + bleed) * pt]
with pikepdf.open(src, allow_overwriting_input=True) as pdf:
    for page in pdf.pages:
        page.obj.TrimBox = pikepdf.Array([round(v, 3) for v in trim])
        page.obj.BleedBox = pikepdf.Array([round(v, 3) for v in bl])
    pdf.save(src, min_version='1.3', force_version='1.3')
