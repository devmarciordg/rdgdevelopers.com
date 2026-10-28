// Partes puras do editor (sem DOM nem rede), testadas em post.test.js
import { frontmatter } from '../conteudo/frontmatter.js'

// Data local, não UTC: à noite no Brasil o UTC já é amanhã e o carregar acusaria data futura
export const hojeLocal = (d = new Date()) => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10)

export const caminho = (slug) => `content/blog/${slug || '_'}.md`

export const lerPosts = (arquivos) =>
  Object.keys(arquivos).filter((a) => /^content\/blog\/[^/]+\.md$/.test(a)).map((a) => {
    const fm = frontmatter(arquivos[a])
    return { slug: a.slice(13, -3), dados: fm.dados, corpo: fm.corpo.replace(/^\n+/, '') }
  })

// Frontmatter na ordem das propriedades do schema, sem opcionais vazios. Quebra de linha num campo quebraria o frontmatter (uma linha por chave)
export function montarDados(props, d) {
  const out = {}
  for (const k of Object.keys(props)) {
    const v = typeof d[k] === 'string' ? d[k].replace(/\s+/g, ' ').trim() : d[k]
    if (v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)) out[k] = v
  }
  return out
}

// Mesmo formato de content/taxonomia.json: um objeto por linha, então tag nova vira diff de 1 linha
const linha = (o) => `{ ${Object.entries(o).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(', ')} }`
// content/autores.json no mesmo formato (um autor por linha)
export const autoresJson = (lista) => `[\n${lista.map((o) => `  ${linha(o)}`).join(',\n')}\n]\n`
export const taxonomiaJson = (tax) =>
  `{\n${Object.entries(tax).map(([k, l]) => `  ${JSON.stringify(k)}: [\n${l.map((o) => `    ${linha(o)}`).join(',\n')}\n  ]`).join(',\n')}\n}\n`

// Liga cada erro/aviso do carregar() ao campo do formulário. inicioCorpo: linha do arquivo antes da 1ª linha do texto
export function classificar(msgs, arq, props, inicioCorpo) {
  return msgs.map((m) => {
    if (!m.startsWith(arq)) return { campo: 'tags', msg: m.replace('content/taxonomia.json', 'Taxonomia') }
    const [, linha, resto] = m.slice(arq.length).match(/^(?::(\d+))?:? ([^]*)$/) ?? [, , m]
    const f = resto.match(/^([a-z_]+)(?:\[\d+\])?: ([^]*)$/)
    if (f && props[f[1]]) return { campo: f[1], msg: f[2] }
    const t = resto.match(/^usa "(.+?)"/)
    if (t) return { campo: 'termos_liberados', termo: t[1], msg: resto }
    if (resto.startsWith('nome do arquivo')) return { campo: 'slug', msg: 'use só minúsculas, números e hífens, até 60 caracteres' }
    if (resto.startsWith('o texto do post') || resto.startsWith('link para')) return { campo: 'corpo', msg: resto }
    if (linha > inicioCorpo) return { campo: 'corpo', msg: `linha ${linha - inicioCorpo}: ${resto}` }
    return { campo: null, msg: resto }
  })
}
