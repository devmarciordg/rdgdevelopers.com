// Filtros de /projetos, no padrão do app de leads: menus com contagem, chips dos ativos e "Limpar tudo".
// Sem JS, a barra fica oculta e todos os cases aparecem. Os filtros ficam na URL, para o link poder ser compartilhado.
import { casa, contar, FACETAS } from '../conteudo/filtros.js'

const form = document.querySelector('[data-filtros]')

if (form) {
  const itens = [...document.querySelectorAll('[data-filtros-grade] > .case')]
  const cards = itens.map((el) => el.dataset)
  const status = document.querySelector('[data-filtros-status]')
  const textoInicial = status.textContent
  const ativos = form.querySelector('[data-filtros-ativos]')
  const vazio = document.querySelector('[data-filtros-vazio]')
  const selects = Object.fromEntries(FACETAS.map(([k]) => [k, form.elements[k]]).filter(([, s]) => s))
  const nomes = Object.fromEntries(FACETAS)
  const filtros = {}

  const url = new URLSearchParams(location.search)
  for (const [k, s] of Object.entries(selects)) {
    const v = url.get(k)
    if (v && [...s.options].some((o) => o.value === v)) { filtros[k] = v; s.value = v }
  }

  const botao = (texto, classe, aoClicar, rotulo) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = classe
    b.textContent = texto
    if (rotulo) b.setAttribute('aria-label', rotulo)
    b.addEventListener('click', aoClicar)
    return b
  }

  const limpar = () => {
    for (const k of Object.keys(selects)) { delete filtros[k]; selects[k].value = '' }
    atualizar()
    Object.values(selects)[0].focus()
  }

  function atualizar() {
    let visiveis = 0
    itens.forEach((el, i) => {
      el.hidden = !casa(cards[i], filtros)
      if (!el.hidden) visiveis++
    })

    for (const [k, s] of Object.entries(selects)) {
      for (const o of s.options) {
        if (!o.value) continue
        const n = contar(cards, filtros, k, o.value)
        o.textContent = `${o.value} (${n})`
        o.disabled = n === 0 && filtros[k] !== o.value
      }
    }

    const escolhidos = Object.entries(filtros)
    ativos.replaceChildren(
      ...escolhidos.map(([k, v]) => botao(`${v} ×`, 'chip', () => {
        delete filtros[k]
        selects[k].value = ''
        atualizar()
        selects[k].focus()
      }, `Remover filtro ${nomes[k]}: ${v}`)),
      ...(escolhidos.length > 1 ? [botao('Limpar tudo', 'link-limpar', limpar)] : []),
    )
    status.textContent = escolhidos.length ? `${visiveis} de ${itens.length} cases` : textoInicial
    vazio.hidden = visiveis > 0

    const q = new URLSearchParams(escolhidos)
    history.replaceState(null, '', q.size ? `?${q}` : location.pathname)
  }

  form.addEventListener('change', (e) => {
    if (e.target.value) filtros[e.target.name] = e.target.value
    else delete filtros[e.target.name]
    atualizar()
  })
  vazio.querySelector('button').addEventListener('click', limpar)

  form.hidden = false
  atualizar()
}
