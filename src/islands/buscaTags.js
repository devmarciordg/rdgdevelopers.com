// Busca do blog: campo pelo título e combobox de tags com seleção múltipla. Filtra a lista da própria página, com tudo na URL (?q=texto&tag=a&tag=b).
// Sem JS, os campos ficam ocultos e a listagem continua completa.
import { casaBusca, temTags } from '../conteudo/filtros.js'

const raiz = document.querySelector('[data-busca-tags]')

if (raiz) {
  const caixa = raiz.querySelector('.filtro')
  const botao = caixa.querySelector('button')
  const valor = botao.querySelector('[data-busca-valor]')
  const input = caixa.querySelector('input')
  const lista = caixa.querySelector('[role=listbox]')
  const opcoes = [...lista.children]
  const semTag = caixa.querySelector('[data-busca-sem-tag]')
  const chips = raiz.querySelector('[data-busca-chips]')
  const selecao = raiz.querySelector('[data-busca-selecao]')
  const status = raiz.querySelector('[data-busca-status]')
  const vazio = document.querySelector('[data-busca-vazio]')
  const itens = [...document.querySelectorAll('.blog-lista > .blog-item')]
  const tagsDe = itens.map((el) => el.dataset.tags.split('|'))
  const titulos = itens.map((el) => el.querySelector('h3').textContent)
  const nomes = Object.fromEntries(opcoes.map((o) => [o.dataset.slug, o.dataset.nome]))
  const campoNome = raiz.querySelector('[data-busca-nome]')

  // Tag da URL que não existe nesta listagem é ignorada
  const url = new URLSearchParams(location.search)
  const escolhidas = new Set(url.getAll('tag').filter((t) => nomes[t]))
  campoNome.value = url.get('q') ?? ''
  let aberto = false
  let ativa = null

  const desativada = (o) => o.getAttribute('aria-disabled') === 'true'

  function marcar(o) {
    ativa?.classList.remove('ativa')
    ativa = o
    if (o) {
      o.classList.add('ativa')
      o.scrollIntoView({ block: 'nearest' })
      input.setAttribute('aria-activedescendant', o.id)
    } else input.removeAttribute('aria-activedescendant')
  }
  const navegaveis = () => opcoes.filter((o) => !o.hidden && !desativada(o))

  function buscar() {
    for (const o of opcoes) o.hidden = !casaBusca(o.dataset.nome, input.value)
    semTag.hidden = opcoes.some((o) => !o.hidden)
    marcar(navegaveis()[0] ?? null)
  }

  const casaNome = (i) => casaBusca(titulos[i], campoNome.value)

  function atualizar() {
    const lst = [...escolhidas]
    let visiveis = 0
    itens.forEach((el, i) => {
      el.hidden = !(casaNome(i) && temTags(tagsDe[i], lst))
      if (!el.hidden) visiveis++
    })
    for (const o of opcoes) {
      const n = tagsDe.filter((t, i) => casaNome(i) && temTags(t, [...lst, o.dataset.slug])).length
      const sel = escolhidas.has(o.dataset.slug)
      o.querySelector('.filtros-n').textContent = n
      o.setAttribute('aria-selected', sel)
      o.setAttribute('aria-disabled', n === 0 && !sel)
    }
    if (ativa && (ativa.hidden || desativada(ativa))) marcar(navegaveis()[0] ?? null)

    valor.textContent = lst.length ? ` · ${lst.length}` : ''
    chips.replaceChildren(...lst.map((t) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = `${nomes[t]} ×`
      b.setAttribute('aria-label', `Remover tag ${nomes[t]}`)
      b.addEventListener('click', () => {
        escolhidas.delete(t)
        atualizar()
        botao.focus()
      })
      return b
    }))
    const q = campoNome.value.trim()
    status.textContent = lst.length || q ? `${visiveis} de ${itens.length} ${itens.length === 1 ? 'artigo' : 'artigos'}` : ''
    selecao.hidden = !(lst.length || q)
    vazio.hidden = visiveis > 0

    const params = new URLSearchParams([...(q ? [['q', q]] : []), ...lst.map((t) => ['tag', t])])
    history.replaceState(null, '', params.size ? `?${params}` : location.pathname)
  }

  function alternar(o) {
    if (!o || desativada(o)) return
    const t = o.dataset.slug
    if (escolhidas.has(t)) escolhidas.delete(t)
    else escolhidas.add(t)
    atualizar()
  }

  function fechar(devolverFoco) {
    if (!aberto) return
    aberto = false
    caixa.classList.remove('aberto')
    botao.setAttribute('aria-expanded', 'false')
    input.setAttribute('aria-expanded', 'false')
    input.value = ''
    if (devolverFoco) botao.focus()
  }
  function abrir() {
    aberto = true
    caixa.classList.add('aberto')
    botao.setAttribute('aria-expanded', 'true')
    input.setAttribute('aria-expanded', 'true')
    buscar()
    input.focus()
  }

  campoNome.addEventListener('input', atualizar)
  botao.addEventListener('click', () => (aberto ? fechar(true) : abrir()))
  input.addEventListener('input', buscar)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const nav = navegaveis()
      if (nav.length) marcar(nav[(nav.indexOf(ativa) + (e.key === 'ArrowDown' ? 1 : -1) + nav.length) % nav.length])
    } else if (e.key === 'Enter') {
      e.preventDefault()
      alternar(ativa)
    } else if (e.key === 'Escape') fechar(true)
  })
  // Sem isto, clicar na opção tiraria o foco do campo de busca
  lista.addEventListener('pointerdown', (e) => e.preventDefault())
  lista.addEventListener('click', (e) => {
    const o = e.target.closest('[role=option]')
    if (!o) return
    alternar(o)
    if (!desativada(o)) marcar(o)
  })
  const fora = (e) => { if (aberto && !caixa.contains(e.target)) fechar() }
  document.addEventListener('pointerdown', fora)
  document.addEventListener('focusin', fora)
  vazio.querySelector('button').addEventListener('click', () => {
    escolhidas.clear()
    campoNome.value = ''
    atualizar()
    campoNome.focus()
  })

  raiz.hidden = false
  atualizar()
}
