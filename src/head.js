export const SITE = 'https://rdgdevelopers.com'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// JSON-LD dentro de <script>: escapa "<" para não fechar a tag
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

// Tags de SEO por página. `schema` é uma lista de objetos JSON-LD (ver schema.js).
export function head({ titulo, descricao, rota, imagem = '/og.png', tipo = 'website', schema = [], noindex = false }) {
  const url = SITE + rota
  const t = rota === '/' ? titulo : `${titulo} · RDG Developers`
  return [
    `<title>${esc(t)}</title>`,
    `<meta name="description" content="${esc(descricao)}">`,
    noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="${tipo}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(t)}">`,
    `<meta property="og:description" content="${esc(descricao)}">`,
    `<meta property="og:image" content="${SITE}${imagem}">`,
    '<meta property="og:locale" content="pt_BR">',
    '<meta name="twitter:card" content="summary_large_image">',
    ...schema.map(ld),
  ].join('\n')
}
