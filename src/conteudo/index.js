// Conteúdo do site (content/), lido só no build e no dev. Nada daqui vai para o navegador.
import { carregar } from './carregar.js'

const brutos = import.meta.glob('/content/**/*.{md,json}', { query: '?raw', import: 'default', eager: true })
const c = carregar(Object.fromEntries(Object.entries(brutos).map(([k, v]) => [k.slice(1), v])))

if (c.erros.length) throw new Error(`Conteúdo inválido (${c.erros.length}):\n  ${c.erros.join('\n  ')}`)
if (c.avisos.length && !globalThis.__avisosConteudo) {
  globalThis.__avisosConteudo = true
  console.warn(`Avisos de conteúdo:\n  ${c.avisos.join('\n  ')}`)
}

export const { posts, temas, tags, projetos } = c
export const dataBR = (iso) => iso.split('-').reverse().join('/')
