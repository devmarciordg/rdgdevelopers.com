import { renderToString } from 'react-dom/server'
import Layout from './Layout.jsx'
import { head } from './head.js'

// Rota = caminho do arquivo: paginas/servicos/index.jsx -> /servicos
const modulos = import.meta.glob('./paginas/**/*.jsx', { eager: true })
const rotaDe = (arq) => arq.replace('./paginas', '').replace(/\.jsx$/, '').replace(/\/index$/, '') || '/'

export const paginas = Object.entries(modulos).map(([arq, m]) => ({ rota: rotaDe(arq), meta: m.meta, Pagina: m.default }))

export function render(url) {
  const rota = url.replace(/\/+$/, '') || '/'
  const p = paginas.find((x) => x.rota === rota) ?? paginas.find((x) => x.rota === '/404')
  const { Pagina } = p
  return {
    status: p.rota === '/404' && rota !== '/404' ? 404 : 200,
    head: head({ ...p.meta, rota: p.rota }),
    html: renderToString(<Layout><Pagina /></Layout>),
  }
}
