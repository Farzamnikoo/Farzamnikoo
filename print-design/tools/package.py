"""بسته نهایی تحویل: پوشه‌بندی همه خروجی‌ها و ساخت ZIP.
اجرا (پس از ساخت همه خروجی‌ها): python3 tools/package.py
"""

import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
D = ROOT / 'dist'
NAME = 'TaFund_Print_Package_1405-07'
PKG = D / 'package' / NAME


def put(src, dst):
    dst = PKG / dst
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def put_glob(pattern, folder, rename=lambda n: n):
    for f in sorted(D.glob(pattern)):
        put(f, Path(folder) / rename(f.name))


shutil.rmtree(PKG, ignore_errors=True)
PKG.mkdir(parents=True)

# ۱ سربرگ
put_glob('06-print/LH-*_print_PDFX1a.pdf', '01_Letterhead/print_PDFX1a')
put_glob('05-letterhead/LH-*_RGB.pdf', '01_Letterhead/digital_RGB')
put_glob('05-letterhead/word/*.dotx', '01_Letterhead/word_templates')
put_glob('05-letterhead/png/*_transparent_300dpi.png', '01_Letterhead/png_transparent_300dpi')
# ۲ کاتالوگ
put(D / '06-print/catalog_16p_print_PDFX1a.pdf', '02_Catalog/catalog_16p_print_PDFX1a.pdf')
put(D / '03-catalog/catalog_16p.pdf', '02_Catalog/catalog_16p_RGB.pdf')
put(D / '03-catalog/catalog_spreads_A3.pdf', '02_Catalog/catalog_spreads_A3_RGB.pdf')
put_glob('03-catalog/png/p*.png', '02_Catalog/png')
# ۳ بروشور
put(D / '06-print/brochure_trifold_print_PDFX1a.pdf', '03_Brochure/brochure_trifold_print_PDFX1a.pdf')
put(D / '04-brochure/brochure_trifold.pdf', '03_Brochure/brochure_trifold_RGB.pdf')
for n in ['outside.png', 'inside.png']:
    put(D / '04-brochure/png' / n, f'03_Brochure/png/brochure_{n}')
# ۴ نشان
put_glob('logo/*', '04_Logo')
# ۵ قلم
for f in sorted((ROOT / 'brand/fonts').glob('Vazirmatn-*.ttf')):
    put(f, f'05_Fonts/{f.name}')
put(ROOT / 'brand/fonts/Vazirmatn-OFL.txt', '05_Fonts/Vazirmatn-OFL.txt')
put_glob('fonts/Inter-*.ttf', '05_Fonts')
put(ROOT / 'brand/fonts/Inter-OFL.txt', '05_Fonts/Inter-OFL.txt')
# ۶ رنگ
put(ROOT / 'brand/icc/CoatedFOGRA39_argyll.icc', '06_Color/CoatedFOGRA39_argyll.icc')
# ۷ برگه‌های بازبینی
put(D / '01-letterhead-options/compare_LH-01_options_A3.pdf', '07_Review_sheets/letterhead_options_A3.pdf')
put(D / '02-catalog-system/catalog_system_A3.pdf', '07_Review_sheets/catalog_system_A3.pdf')
put(D / '02-catalog-system/catalog_samples_grid.pdf', '07_Review_sheets/catalog_grid_samples.pdf')
# ۸ منبع
for sub in ['src', 'data', 'brand', 'tools', 'review']:
    shutil.copytree(ROOT / sub, PKG / '08_Source' / sub, ignore=shutil.ignore_patterns('__pycache__'))
for f in ['package.json', 'package-lock.json', 'README.md', '.gitignore']:
    put(ROOT / f, f'08_Source/{f}')
# راهنما
put(ROOT / 'tools/README_package_fa.txt', 'README_fa.txt')

# ZIP (نام‌های لاتین تا در همه سیستم‌عامل‌ها درست باز شود)
zpath = D / f'{NAME}.zip'
zpath.unlink(missing_ok=True)
with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for f in sorted(PKG.rglob('*')):
        if f.is_file():
            z.write(f, Path(NAME) / f.relative_to(PKG))
count = sum(1 for f in PKG.rglob('*') if f.is_file())
print(f'✓ {zpath.relative_to(ROOT)} — {count} files, {zpath.stat().st_size / 1e6:.1f} MB')

# بسته کوچک قالب‌های Word همراه قلم‌ها (برای کسی که فقط نامه می‌نویسد)
wname = 'TaFund_Word_Templates'
wpath = D / f'{wname}.zip'
wpath.unlink(missing_ok=True)
with zipfile.ZipFile(wpath, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for sub in ['01_Letterhead/word_templates', '05_Fonts']:
        for f in sorted((PKG / sub).iterdir()):
            z.write(f, Path(wname) / Path(sub).name / f.name)
    z.write(PKG / 'README_fa.txt', Path(wname) / 'README_fa.txt')
print(f'✓ {wpath.relative_to(ROOT)} — {wpath.stat().st_size / 1e6:.1f} MB')
