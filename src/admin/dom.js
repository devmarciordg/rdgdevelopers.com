// Utilitários de DOM do painel. Texto do usuário entra sempre como texto, nunca como HTML.

export function h(tag, props = {}, ...filhos) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else if (k in el) el[k] = v
    else el.setAttribute(k, v === true ? '' : v)
  }
  el.append(...filhos.flat(9).filter((f) => f != null && f !== false))
  return el
}

export const botao = (texto, acao, className = 'btn btn-sm ghost', rotulo) =>
  h('button', { type: 'button', className, onclick: acao, 'aria-label': rotulo }, texto)

// Troca a tela e leva o foco ao título, para leitor de tela e teclado saberem onde estão
export function tela(raiz, titulo, ...filhos) {
  const h1 = h('h1', { tabIndex: -1 }, titulo)
  raiz.replaceChildren(h1, ...filhos.filter(Boolean))
  h1.focus()
  document.title = `${titulo} | Painel do blog`
}

export function anunciar(msg) {
  const el = document.getElementById('anuncio')
  el.textContent = ''
  setTimeout(() => { el.textContent = msg }, 50)
}

export const dataBR = (iso) => iso.split('-').reverse().join('/')

// localStorage pode lançar (aba privada, cota, bloqueio): o painel segue funcionando sem ele
const PREFIXO = 'rdg-admin:post:'
export const local = {
  ler(slug) { try { return JSON.parse(localStorage.getItem(PREFIXO + slug)) } catch { return null } },
  gravar(slug, v) { try { localStorage.setItem(PREFIXO + slug, JSON.stringify(v)); return true } catch { return false } },
  apagar(slug) { try { localStorage.removeItem(PREFIXO + slug) } catch { /* sem armazenamento */ } },
  todos() {
    try { return Object.keys(localStorage).filter((k) => k.startsWith(PREFIXO)).map((k) => [k.slice(PREFIXO.length), JSON.parse(localStorage.getItem(k))]) } catch { return [] }
  },
}
