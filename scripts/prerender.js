// Pós-build: gera um HTML estático por rota, o sitemap e confere os links internos.
import fs from 'node:fs'
import path from 'node:path'
import { montar } from './montar.js'

const DIST = 'dist'
const SSR = '.ssr'
const SITE = 'https://rdgdevelopers.com'

const tpl = fs.readFileSync(`${DIST}/index.html`, 'utf8')
const { render, paginas } = await import(path.resolve(SSR, 'entry-server.js'))

// Imagens importadas só pelas páginas saem no build SSR, com o mesmo hash
if (fs.existsSync(`${SSR}/assets`)) {
  for (const f of fs.readdirSync(`${SSR}/assets`)) {
    if (!f.endsWith('.css')) fs.copyFileSync(`${SSR}/assets/${f}`, `${DIST}/assets/${f}`)
  }
}

const arquivoDe = (rota) => (rota === '/' ? 'index.html' : rota === '/404' ? '404.html' : `${rota.slice(1)}/index.html`)
const rotas = new Set(paginas.map((p) => p.rota))
const quebrados = []

for (const p of paginas) {
  if (!p.meta?.titulo || !p.meta?.descricao) throw new Error(`${p.rota}: meta.titulo e meta.descricao são obrigatórios`)
  const r = render(p.rota)
  const html = montar(tpl, r)
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const alvo = href.replace(/\/+$/, '') || '/'
    const arquivo = !path.extname(alvo) && !rotas.has(alvo)
    const estatico = path.extname(alvo) && !fs.existsSync(path.join(DIST, alvo))
    if (arquivo || estatico) quebrados.push(`${p.rota} -> ${href}`)
  }
  const destino = path.join(DIST, arquivoDe(p.rota))
  fs.mkdirSync(path.dirname(destino), { recursive: true })
  fs.writeFileSync(destino, html)
}

const urls = paginas
  .filter((p) => p.rota !== '/404' && !p.meta.noindex)
  .map((p) => `  <url><loc>${SITE}${p.rota === '/' ? '/' : p.rota}</loc></url>`)
fs.writeFileSync(`${DIST}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
fs.rmSync(SSR, { recursive: true, force: true })

console.log(`prerender: ${paginas.length} páginas, ${urls.length} no sitemap`)
if (quebrados.length) {
  console.error(`links internos quebrados (${quebrados.length}):\n  ${[...new Set(quebrados)].join('\n  ')}`)
  process.exitCode = 1
}
