export const SITE = 'https://rdgdevelopers.com'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// JSON-LD dentro de <script>: escapa "<" para não fechar a tag
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

// Tags de SEO por página. `schema` é uma lista de objetos JSON-LD (ver schema.js).
// `artigo` (posts do blog): { publicado, atualizado, secao, tags } vira og:type=article e article:*
export function head({ titulo, descricao, rota, imagem = '/og.png', schema = [], noindex = false, artigo }) {
  const url = SITE + rota
  const t = rota === '/' ? titulo : `${titulo} · RDG Developers`
  return [
    `<title>${esc(t)}</title>`,
    `<meta name="description" content="${esc(descricao)}">`,
    noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="${artigo ? 'article' : 'website'}">`,
    ...(artigo
      ? [
          `<meta property="article:published_time" content="${artigo.publicado}">`,
          `<meta property="article:modified_time" content="${artigo.atualizado ?? artigo.publicado}">`,
          `<meta property="article:section" content="${esc(artigo.secao)}">`,
          ...artigo.tags.map((t) => `<meta property="article:tag" content="${esc(t)}">`),
        ]
      : []),
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(t)}">`,
    `<meta property="og:description" content="${esc(descricao)}">`,
    `<meta property="og:image" content="${SITE}${imagem}">`,
    '<meta property="og:locale" content="pt_BR">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<link rel="alternate" type="application/atom+xml" title="Blog da RDG Developers" href="/blog/feed.xml">',
    ...schema.map(ld),
  ].join('\n')
}
