// Pós-build: gera um HTML estático por rota, o feed do blog e o sitemap, confere os links internos e o orçamento de peso.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { montar } from './montar.js'

const DIST = 'dist'
const SSR = '.ssr'
const SITE = 'https://rdgdevelopers.com'

const tpl = fs.readFileSync(`${DIST}/index.html`, 'utf8')
const { render, paginas, posts } = await import(path.resolve(SSR, 'entry-server.js'))

// Imagens importadas só pelas páginas saem no build SSR, com o mesmo hash
if (fs.existsSync(`${SSR}/assets`)) {
  for (const f of fs.readdirSync(`${SSR}/assets`)) {
    if (!f.endsWith('.css')) fs.copyFileSync(`${SSR}/assets/${f}`, `${DIST}/assets/${f}`)
  }
}

// Feed Atom do blog (só resumo). Antes das páginas: elas apontam para ele e os links são conferidos
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const quando = (d) => `${d}T00:00:00-03:00`
fs.mkdirSync(`${DIST}/blog`, { recursive: true })
fs.writeFileSync(`${DIST}/blog/feed.xml`, `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="pt-BR">
  <title>Blog da RDG Developers</title>
  <subtitle>Tráfego, automação e sites rápidos, escritos por quem faz o trabalho.</subtitle>
  <link href="${SITE}/blog"/>
  <link rel="self" href="${SITE}/blog/feed.xml"/>
  <id>${SITE}/blog</id>
  <updated>${quando(posts.map((p) => p.atualizado ?? p.publicado).sort().at(-1) ?? '2026-10-26')}</updated>
${posts.map((p) => `  <entry>
    <title>${xml(p.titulo)}</title>
    <link href="${SITE}${p.rota}"/>
    <id>${SITE}${p.rota}</id>
    <published>${quando(p.publicado)}</published>
    <updated>${quando(p.atualizado ?? p.publicado)}</updated>
${p.autores.map((a) => `    <author><name>${xml(a.nome)}</name></author>`).join('\n')}
    <category term="${xml(p.tema.slug)}" label="${xml(p.tema.nome)}"/>
    <summary>${xml(p.descricao)}</summary>
  </entry>`).join('\n')}
</feed>
`)

const arquivoDe = (rota) => (rota === '/' ? 'index.html' : rota === '/404' ? '404.html' : `${rota.slice(1)}/index.html`)
const rotas = new Set(paginas.map((p) => p.rota))
if (rotas.size !== paginas.length) {
  const vistas = new Set()
  throw new Error(`rota duplicada: ${paginas.map((p) => p.rota).filter((r) => vistas.has(r) || !vistas.add(r)).join(', ')}`)
}
const quebrados = []

for (const p of paginas) {
  if (!p.meta?.titulo || !p.meta?.descricao) throw new Error(`${p.rota}: meta.titulo e meta.descricao são obrigatórios`)
  const r = render(p.rota)
  const html = montar(tpl, r)
  // Imagem que o post cita precisa existir (public/ vai inteiro para dist/)
  for (const [, src] of html.matchAll(/<img src="(\/[^"?#]*)/g)) if (!fs.existsSync(path.join(DIST, src))) quebrados.push(`${p.rota} -> ${src}`)
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
  .map((p) => `  <url><loc>${SITE}${p.rota === '/' ? '/' : p.rota}</loc>${p.meta.lastmod ? `<lastmod>${p.meta.lastmod}</lastmod>` : ''}</url>`)
fs.writeFileSync(`${DIST}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
fs.rmSync(SSR, { recursive: true, force: true })

console.log(`prerender: ${paginas.length} páginas, ${urls.length} no sitemap, ${posts.length} posts no feed`)

// Orçamento (gzip): CSS que a página do site baixa, o do /admin à parte, e cada JS. Estourou, o build falha: performance é requisito, não desejo
const LIMITE = { css: 12 * 1024, cssAdmin: 3 * 1024, js: 15 * 1024 }
const gz = (f) => zlib.gzipSync(fs.readFileSync(f), { level: 9 }).length
const assets = fs.readdirSync(`${DIST}/assets`).map((f) => `${DIST}/assets/${f}`)
// CSS que cada página do site baixa (todas usam o mesmo template) e, à parte, o que só o /admin baixa
const cssDe = (html) => [...fs.readFileSync(html, 'utf8').matchAll(/<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"/g)].map((m) => `${DIST}/${m[1]}`)
const cssSite = cssDe(`${DIST}/index.html`)
const css = cssSite.reduce((t, f) => t + gz(f), 0)
const cssAdmin = cssDe(`${DIST}/admin/index.html`).filter((f) => !cssSite.includes(f)).reduce((t, f) => t + gz(f), 0)
const estouros = assets.filter((f) => f.endsWith('.js') && gz(f) > LIMITE.js).map((f) => `${f}: ${gz(f)} B de JS (limite ${LIMITE.js})`)
if (css > LIMITE.css) estouros.push(`CSS do site: ${css} B (limite ${LIMITE.css})`)
if (cssAdmin > LIMITE.cssAdmin) estouros.push(`CSS só do /admin: ${cssAdmin} B (limite ${LIMITE.cssAdmin})`)
console.log(`orçamento: CSS do site ${(css / 1024).toFixed(1)} KB gzip, só do /admin ${(cssAdmin / 1024).toFixed(1)} KB`)
if (estouros.length) {
  console.error(`orçamento estourado:\n  ${estouros.join('\n  ')}`)
  process.exitCode = 1
}
if (quebrados.length) {
  console.error(`links internos quebrados (${quebrados.length}):\n  ${[...new Set(quebrados)].join('\n  ')}`)
  process.exitCode = 1
}
