// Filtros de /projetos: um dropdown animado por grupo, com contagem. Por baixo são radios: teclado e leitor de tela vêm do navegador.
// Sem JS, a barra fica oculta e todos os cases aparecem. Os filtros ficam na URL, para o link poder ser compartilhado.
import { casa, contar, FACETAS } from '../conteudo/filtros.js'

const form = document.querySelector('[data-filtros]')

if (form) {
  const itens = [...document.querySelectorAll('[data-filtros-grade] > .case')]
  const cards = itens.map((el) => el.dataset)
  const status = document.querySelector('[data-filtros-status]')
  const textoInicial = status.textContent
  const vazio = document.querySelector('[data-filtros-vazio]')
  const grupos = FACETAS.map(([k]) => k).filter((k) => form.elements[k])
  const opcoes = [...form.querySelectorAll('input')]
  const blocos = [...form.querySelectorAll('[data-filtro]')]

  const url = new URLSearchParams(location.search)
  // Valor da URL que não existe nas opções não marca nada: o grupo fica em "Todos"
  for (const k of grupos) if (url.get(k)) form.elements[k].value = url.get(k)

  function atualizar() {
    const filtros = Object.fromEntries(grupos.map((k) => [k, form.elements[k].value]).filter(([, v]) => v))

    let visiveis = 0
    itens.forEach((el, i) => {
      el.hidden = !casa(cards[i], filtros)
      if (!el.hidden) visiveis++
    })

    for (const o of opcoes) {
      const n = contar(cards, filtros, o.name, o.value)
      o.parentElement.querySelector('.filtros-n').textContent = n
      o.disabled = n === 0 && !o.checked
    }

    for (const el of blocos) {
      const v = el.querySelector('input:checked').value
      el.querySelector('[data-filtro-valor]').textContent = v || 'Todos'
      el.classList.toggle('ativo', !!v)
    }

    const ativos = Object.keys(filtros).length > 0
    status.textContent = ativos ? `${visiveis} de ${itens.length} cases` : textoInicial
    vazio.hidden = visiveis > 0

    const q = new URLSearchParams(filtros)
    history.replaceState(null, '', q.size ? `?${q}` : location.pathname)
  }

  let aberto = null
  const fechar = (devolverFoco) => {
    if (!aberto) return
    const botao = aberto.querySelector('button')
    aberto.classList.remove('aberto')
    botao.setAttribute('aria-expanded', 'false')
    aberto = null
    if (devolverFoco) botao.focus()
  }
  const abrir = (el) => {
    fechar()
    el.classList.add('aberto')
    el.querySelector('button').setAttribute('aria-expanded', 'true')
    aberto = el
    el.querySelector('input:checked').focus()
  }
  for (const el of blocos) el.querySelector('button').addEventListener('click', () => (aberto === el ? fechar(true) : abrir(el)))

  // Fecha ao clicar ou passar com Tab para fora
  const fora = (e) => { if (aberto && !aberto.contains(e.target)) fechar() }
  document.addEventListener('pointerdown', fora)
  document.addEventListener('focusin', fora)
  // detail > 0 é clique de verdade: nas setas o navegador também dispara click, e aí o menu fica aberto
  form.addEventListener('click', (e) => { if (e.target.matches('input') && e.detail > 0) fechar(true) })
  form.addEventListener('keydown', (e) => {
    if (aberto && (e.key === 'Escape' || (e.key === 'Enter' && e.target.matches('input')))) {
      e.preventDefault() // Enter no radio enviaria o formulário
      fechar(true)
    }
  })

  form.addEventListener('change', atualizar)
  // Só alcançável por link com combinação sem resultado: na tela, a opção que zeraria fica desativada
  vazio.querySelector('button').addEventListener('click', () => {
    form.reset()
    atualizar()
    form.querySelector('button').focus()
  })

  form.hidden = false
  atualizar()
}
