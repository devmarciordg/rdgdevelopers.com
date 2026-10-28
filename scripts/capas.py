# Gera as capas dos cases (src/assets/projetos/<id>-800|1600.avif|webp) e a imagem de compartilhamento
# (public/og/projetos/<id>.png) a partir das logos em interno/logos. Roda à mão quando chega logo nova:
#   python3 scripts/capas.py   (precisa de rsvg-convert, magick, avifenc e cwebp; não roda no CI)
# Estilo dos cards do site: fundo na cor do case, textura de grade no canto e a logo centralizada.
import json, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
# id: (logo, tom da logo: 'original', 'claro' ou 'escuro', altura relativa da logo)
LOGOS = {
    'tradi': ('tradi.svg', 'claro', .34),
    'amigo': ('amigo.svg', 'original', .62),
    'bons-de-pista': ('bons-de-pista.webp', 'claro', .5),
    # Cliente não autorizou o nome nem a logo: fatia de pizza desenhada no lugar
    'pizzaria-gv': ('pizzaria-gv.svg', 'claro', .5),
    'clickdente': ('clickdente.svg', 'claro', .55),
}

def rgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

def tinta(h):
    lum = lambda c: c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
    l = sum(w * lum(c / 255) for w, c in zip((.2126, .7152, .0722), rgb(h)))
    return (21, 21, 23) if (l + .05) / .05 > 1.05 / (l + .05) else (255, 255, 255)

def logo(arq, altura, tmp):
    png = Path(tmp) / 'logo.png'
    if arq.endswith('.svg'):
        subprocess.run(['rsvg-convert', '-h', str(altura * 2), str(RAIZ / 'interno/logos' / arq), '-o', str(png)], check=True)
    else:
        subprocess.run(['magick', str(RAIZ / 'interno/logos' / arq), '-resize', f'x{altura * 2}', str(png)], check=True)
    img = Image.open(png).convert('RGBA')
    return img.resize((round(img.width * altura / img.height), altura), Image.LANCZOS)

def capa(id, cor, l, w, h, tmp):
    arq, tom, rel = LOGOS[id]
    base = Image.new('RGBA', (w, h), rgb(cor) + (255,))
    t = tinta(cor)
    # Grade de 1px a cada 64px (a 1600 de largura), mais forte no canto superior direito, como .case-capa::before
    passo = round(w / 25)
    grade = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(grade)
    for x in range(0, w, passo): d.line([(x, 0), (x, h)], fill=t + (40,), width=max(1, w // 1000))
    for y in range(0, h, passo): d.line([(0, y), (w, y)], fill=t + (40,), width=max(1, w // 1000))
    mascara = Image.radial_gradient('L').resize((w * 2, w * 2)).crop((0, w - 0, w, w + h))
    mascara = mascara.point(lambda v: max(0, 255 - v * 1.4))
    grade.putalpha(Image.composite(grade.getchannel('A'), Image.new('L', (w, h), 0), mascara))
    base = Image.alpha_composite(base, grade)
    marca = logo(arq, round(h * rel), tmp)
    if tom != 'original':
        cor_logo = Image.new('RGBA', marca.size, (255, 255, 255, 255) if tom == 'claro' else (21, 21, 23, 255))
        cor_logo.putalpha(marca.getchannel('A'))
        marca = cor_logo
    base.alpha_composite(marca, ((w - marca.width) // 2, (h - marca.height) // 2))
    return base.convert('RGB')

with tempfile.TemporaryDirectory() as tmp:
    for id in LOGOS:
        cor = json.loads((RAIZ / f'content/projetos/{id}.json').read_text())['capa']['cor']
        for w in (800, 1600):
            png = Path(tmp) / f'{id}-{w}.png'
            capa(id, cor, None, w, w * 10 // 16, tmp).save(png)
            saida = RAIZ / 'src/assets/projetos' / f'{id}-{w}'
            subprocess.run(['avifenc', '-q', '60', '-s', '4', str(png), f'{saida}.avif'], check=True, capture_output=True)
            subprocess.run(['cwebp', '-q', '80', str(png), '-o', f'{saida}.webp'], check=True, capture_output=True)
        og = RAIZ / 'public/og/projetos' / f'{id}.png'
        og.parent.mkdir(parents=True, exist_ok=True)
        capa(id, cor, None, 1200, 630, tmp).save(og, optimize=True)
        print(id, 'ok')
