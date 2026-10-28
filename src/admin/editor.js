// Editor de post: formulário montado do post.schema.json do repo, prévia ao vivo e validação com o mesmo carregar() do CI
import { carregar } from '../conteudo/carregar.js'
import { frontmatter, serializar } from '../conteudo/frontmatter.js'
import { md, slugify } from '../conteudo/md.js'
import { gravar, ErroConflito } from './github.js'
import { h, botao, tela, anunciar, local } from './dom.js'
import { caminho, classificar, hojeLocal, lerPosts, montarDados, taxonomiaJson } from './post.js'
import { citadas, doRepo, mostrarNaPrevia, nomeLivre, paraBase64, processar, publico, semCarregar } from './imagens.js'

const SLUG = /^(?=.{1,60}$)[a-z0-9]+(-[a-z0-9]+)*$/

const STATUS = { rascunho: 'Rascunho', publicado: 'Publicado' }
let avisouPublico = false
let sujo = false
let aberto = null
addEventListener('beforeunload', (e) => { if (sujo && aberto?.isConnected) { e.preventDefault(); e.returnValue = '' } })

// slugOrig: null = post novo; slug fora do repo = rascunho só local. opts: { msg, estado } (estado = restaurar autosave)
export function abrir(raiz, ctx, slugOrig, opts = {}) {
  const { arquivos } = ctx
  const props = JSON.parse(arquivos['content/_schemas/post.schema.json']).properties
  const tax = JSON.parse(arquivos['content/taxonomia.json'])
  const autores = JSON.parse(arquivos['content/autores.json'])
  const original = slugOrig ? arquivos[caminho(slugOrig)] : undefined
  const noRepo = original !== undefined
  const repo = noRepo && lerPosts({ [caminho(slugOrig)]: original })[0]
  const publicadoAntes = noRepo && repo.dados.status === 'publicado'
  const guardado = slugOrig === null ? null : local.ler(slugOrig)
  const arquivoDe = (st) => serializar(montarDados(props, st.dados), st.corpo)

  const vazio = { slug: '', dados: { status: 'rascunho', publicado: hojeLocal(), autores: autores[0] ? [autores[0].slug] : [], tags: [] }, corpo: '', novasTags: [] }
  const s = structuredClone(opts.estado ?? (noRepo ? { slug: slugOrig, dados: repo.dados, corpo: repo.corpo, novasTags: [] } : guardado ?? vazio))
  // Rascunho salvo antes de existir a lista de autores: o autor único vira o primeiro da lista
  if (s.dados.autor && !s.dados.autores) { s.dados.autores = [s.dados.autor]; delete s.dados.autor }
  let chaveLocal = noRepo ? slugOrig : s.slug
  let slugManual = !noRepo && !!s.slug && s.slug !== slugify(s.dados.titulo ?? '')
  let pendente = noRepo && !opts.estado && guardado && arquivoDe(guardado) !== original
  sujo = !!opts.estado
  let ultimo = { erros: [] }
  const ctl = {}

  // Campo com rótulo e ajuda do schema; erro ligado por aria-describedby
  const campo = (k, controle, { rotulo = props[k]?.title, ajuda = props[k]?.description, depois } = {}) => {
    controle.id ||= `c-${k}`
    const erro = h('p', { id: `erro-${k}`, className: 'erro-campo', hidden: true })
    controle.setAttribute('aria-describedby', `ajuda-${k} erro-${k}`)
    ctl[k] = { foco: controle, invalido: controle, erro }
    return h('div', { className: 'campo' }, h('label', { htmlFor: controle.id }, rotulo), controle, depois, h('p', { id: `ajuda-${k}`, className: 'ajuda' }, ajuda), erro)
  }
  const grupo = (k, caixa, ...extra) => {
    const erro = h('p', { id: `erro-${k}`, className: 'erro-campo', hidden: true })
    const fs = h('fieldset', { id: `c-${k}`, className: 'campo', 'aria-describedby': `ajuda-${k} erro-${k}` },
      h('legend', {}, props[k].title), h('p', { id: `ajuda-${k}`, className: 'ajuda' }, props[k].description), caixa, ...extra, erro)
    ctl[k] = { foco: caixa, invalido: fs, erro }
    return fs
  }
  const ligar = (k, el, ev = 'input') => {
    el.value = s.dados[k] ?? ''
    el.addEventListener(ev, () => { s.dados[k] = el.value; mudou() })
    return el
  }
  const escolha = (k, opcoes, vazia = 'Escolha') => ligar(k, h('select', {}, vazia && h('option', { value: '' }, vazia), opcoes.map(([v, t]) => h('option', { value: v }, t))), 'change')
  const marcar = (k, valor, rotulo, caixa, max) => {
    const cb = h('input', { type: 'checkbox', value: valor, checked: (s.dados[k] ?? []).includes(valor) })
    cb.addEventListener('change', () => {
      const l = (s.dados[k] ?? []).filter((x) => x !== valor)
      s.dados[k] = cb.checked ? [...l, valor] : l
      limitar(caixa, max)
      mudou()
    })
    return h('label', { className: 'opcao' }, cb, rotulo)
  }
  const limitar = (caixa, max) => {
    if (!max) return
    const cbs = [...caixa.querySelectorAll('input')]
    const n = cbs.filter((c) => c.checked).length
    cbs.forEach((c) => { c.disabled = !c.checked && n >= max })
  }

  // Título, descrição e slug
  const contadores = {}
  const comContador = (k, el) => {
    contadores[k] = h('span', { className: 'contador' })
    return campo(k, ligar(k, el), { depois: contadores[k] })
  }
  const slugEl = h('input', { type: 'text', value: s.slug, readOnly: noRepo, spellcheck: false, autocomplete: 'off' })
  slugEl.addEventListener('input', () => { slugManual = true; s.slug = slugEl.value.trim(); mudou() })
  const ajudaSlug = !noRepo ? 'Vira o endereço /blog/<slug>. Sai do título enquanto o post é novo; pode editar.'
    : publicadoAntes ? 'Travado: o post já está publicado e mudar o endereço quebra o link de quem já compartilhou.'
      : 'Travado: o arquivo já está no repositório. Para renomear, faça pelo GitHub.'

  // Tags existentes + nova tag (vai para taxonomia.json no mesmo commit)
  const caixaTags = h('div', { className: 'opcoes' })
  const desenharTags = () => {
    caixaTags.replaceChildren(...[...tax.tags, ...s.novasTags].map((t) => marcar('tags', t.slug, s.novasTags.includes(t) ? `${t.nome} (nova)` : t.nome, caixaTags, props.tags.maxItems)))
    limitar(caixaTags, props.tags.maxItems)
  }
  const tagNome = h('input', { type: 'text', id: 'tag-nome', 'aria-describedby': 'tag-slug tag-erro' })
  const tagSlug = h('p', { id: 'tag-slug', className: 'ajuda' })
  const tagDesc = h('textarea', { id: 'tag-desc', rows: 2, 'aria-describedby': 'tag-desc-ajuda' })
  const tagErro = h('p', { id: 'tag-erro', className: 'erro-campo', hidden: true })
  tagNome.addEventListener('input', () => { tagSlug.textContent = tagNome.value ? `Endereço: /blog/tag/${slugify(tagNome.value)}` : '' })
  const novaTag = h('details', { className: 'bloco' }, h('summary', {}, 'Nova tag'),
    h('div', { className: 'campo' }, h('label', { htmlFor: 'tag-nome' }, 'Nome da tag'), tagNome, tagSlug, tagErro),
    h('div', { className: 'campo' }, h('label', { htmlFor: 'tag-desc' }, 'Descrição da tag (opcional)'), tagDesc,
      h('p', { id: 'tag-desc-ajuda', className: 'ajuda' }, 'Com descrição e 2 ou mais posts publicados, a tag ganha página própria. Sem isso, aparece só como texto.')),
    botao('Adicionar tag', () => {
      const nome = tagNome.value.trim()
      const slug = slugify(nome)
      const erro = !slug ? 'Escreva o nome da tag.' : [...tax.tags, ...s.novasTags].some((t) => t.slug === slug) ? `Já existe a tag "${slug}". Marque-a na lista.` : ''
      tagErro.textContent = erro
      tagErro.hidden = !erro
      tagNome.setAttribute('aria-invalid', !!erro)
      if (erro) return tagNome.focus()
      const desc = tagDesc.value.trim()
      s.novasTags.push(desc ? { slug, nome, descricao: desc } : { slug, nome })
      if ((s.dados.tags ?? []).length < props.tags.maxItems) s.dados.tags = [...(s.dados.tags ?? []), slug]
      tagNome.value = tagDesc.value = tagSlug.textContent = ''
      desenharTags()
      anunciar(`Tag ${nome} adicionada.`)
      mudou()
    }))
  // Só a tag nova em uso entra no commit
  const taxonomiaNova = () => {
    const novas = s.novasTags.filter((t) => s.dados.tags?.includes(t.slug))
    return novas.length ? taxonomiaJson({ ...tax, tags: [...tax.tags, ...novas] }) : null
  }

  const caixaRel = h('div', { className: 'opcoes' })
  caixaRel.append(...lerPosts(arquivos).filter((p) => p.dados.status === 'publicado' && p.slug !== slugOrig)
    .map((p) => marcar('relacionados', p.slug, p.dados.titulo ?? p.slug, caixaRel, props.relacionados.maxItems)))
  limitar(caixaRel, props.relacionados.maxItems)

  // Termos vetados: o grupo só aparece quando a validação acusa algum (ou o post já libera)
  const termosVistos = new Set(s.dados.termos_liberados ?? [])
  const caixaTermos = h('div', { className: 'opcoes' })
  const desenharTermos = () => caixaTermos.replaceChildren(...[...termosVistos].map((t) => marcar('termos_liberados', t, `"${t}": este uso não promete resultado`, caixaTermos)))

  const cliente = h('details', { className: 'bloco', open: !!(s.dados.cliente_citado || s.dados.autorizacao_cliente) }, h('summary', {}, 'Cita cliente?'))

  const statusEl = escolha('status', Object.entries(STATUS), null)
  const atualizadoEl = ligar('atualizado', h('input', { type: 'date' }))
  const form = h('div', { className: 'form' })
  for (const k of Object.keys(props)) {
    if (k === 'titulo') form.append(comContador(k, h('input', { type: 'text' })), campo('slug', slugEl, { rotulo: 'Endereço (slug)', ajuda: ajudaSlug }))
    else if (k === 'descricao') form.append(comContador(k, h('textarea', { rows: 3 })))
    else if (k === 'status') form.append(campo(k, statusEl))
    else if (k === 'publicado') form.append(campo(k, ligar(k, h('input', { type: 'date' }))))
    else if (k === 'atualizado') {
      form.append(campo(k, atualizadoEl, { depois: botao('Hoje', () => { atualizadoEl.value = s.dados.atualizado = hojeLocal(); mudou() }, 'btn btn-sm ghost', 'Atualizado hoje') }))
    } else if (k === 'autores') {
      const caixaAutores = h('div', { className: 'opcoes' })
      caixaAutores.append(...autores.map((a) => marcar('autores', a.slug, a.nome, caixaAutores, props.autores.maxItems)))
      limitar(caixaAutores, props.autores.maxItems)
      form.append(grupo(k, caixaAutores))
    }
    else if (k === 'tema') form.append(campo(k, escolha(k, tax.temas.map((t) => [t.slug, t.nome]))))
    else if (k === 'tags') form.append(grupo(k, caixaTags, novaTag))
    else if (k === 'relacionados') { if (caixaRel.childElementCount) form.append(grupo(k, caixaRel)) }
    else if (k === 'cliente_citado' || k === 'autorizacao_cliente') { cliente.append(campo(k, ligar(k, h('input', { type: 'text' })))); form.append(cliente) }
    else if (k === 'termos_liberados') form.append(ctl.grupoTermos = grupo(k, caixaTermos))
    else if (props[k].type === 'string') form.append(campo(k, ligar(k, h('input', { type: 'text' }))))
    // antigos (reservado) e outros arrays não têm campo: o valor do arquivo é mantido
  }
  desenharTags()
  desenharTermos()
  ctl.grupoTermos.hidden = !termosVistos.size

  // Corpo com barra de formatação
  const ta = h('textarea', { id: 'c-corpo', className: 'corpo', rows: 24, value: s.corpo, spellcheck: true })
  ta.addEventListener('input', () => { s.corpo = ta.value; mudou() })
  const inserir = (txt, a, b, selA, selB) => {
    ta.focus()
    ta.setSelectionRange(a, b)
    // execCommand mantém o Ctrl+Z; setRangeText é o plano B
    if (!document.execCommand('insertText', false, txt)) { ta.setRangeText(txt); s.corpo = ta.value; mudou() }
    ta.setSelectionRange(selA, selB)
  }
  const envolver = (antes, depois = antes, padrao = 'texto') => {
    const { selectionStart: a, selectionEnd: b } = ta
    const sel = ta.value.slice(a, b) || padrao
    inserir(antes + sel + depois, a, b, a + antes.length, a + antes.length + sel.length)
  }
  const linhas = (fn) => {
    const v = ta.value
    const a = ta.selectionStart ? v.lastIndexOf('\n', ta.selectionStart - 1) + 1 : 0
    const fim = v.indexOf('\n', ta.selectionEnd)
    const b = fim < 0 ? v.length : fim
    const novo = v.slice(a, b).split('\n').map(fn).join('\n')
    inserir(novo, a, b, a, a + novo.length)
  }
  const inicioLinha = () => (ta.selectionStart && ta.value[ta.selectionStart - 1] !== '\n' ? '\n' : '')
  const bloco = (antes, depois) => envolver(inicioLinha() + antes, depois)
  const titulo = (p) => linhas((l) => p + l.replace(/^#+ /, ''))
  const BARRA = [
    ['##', 'Seção (##)', () => titulo('## ')],
    ['###', 'Subseção (###)', () => titulo('### ')],
    ['B', 'Negrito (Ctrl+B)', () => envolver('**')],
    ['I', 'Itálico (Ctrl+I)', () => envolver('*')],
    ['Link', 'Link', () => envolver('[', '](https://)', 'texto do link')],
    ['Lista', 'Lista', () => linhas((l) => (l.startsWith('- ') ? l : `- ${l}`))],
    ...['nota', 'aviso', 'dica'].map((t) => [t[0].toUpperCase() + t.slice(1), `Destaque ${t}`, () => bloco(`:::${t}\n`, '\n:::')]),
    ['Código', 'Código', () => (ta.value.slice(ta.selectionStart, ta.selectionEnd).includes('\n') ? bloco('```\n', '\n```') : envolver('`'))],
    ['Imagem', 'Inserir imagem', () => seletor.click()],
  ]

  // Imagem: o arquivo é reduzido e convertido aqui; a descrição é obrigatória (leitor de tela) antes de entrar no texto
  const seletor = h('input', { type: 'file', accept: 'image/*', hidden: true })
  const formImagem = h('div', { className: 'bloco form-imagem', hidden: true })
  seletor.addEventListener('change', async () => {
    const arquivo = seletor.files[0]
    seletor.value = ''
    if (!arquivo) return
    const pos = [ta.selectionStart, ta.selectionEnd]
    let img
    try { img = await processar(arquivo) } catch { return anunciar('Não consegui abrir essa imagem. Tente um JPG, PNG ou WebP.') }
    const ocupados = new Set([...ctx.imagens.map((i) => publico(i.caminho)), ...ctx.pendentes.keys()])
    const caminhoImg = nomeLivre(arquivo.name, img, ocupados)
    const url = URL.createObjectURL(img.blob)
    const desc = h('input', { type: 'text', id: 'img-desc', required: true, maxLength: 160, 'aria-describedby': 'img-desc-ajuda' })
    const leg = h('input', { type: 'text', id: 'img-leg', maxLength: 160 })
    const erroDesc = h('p', { className: 'erro-campo', hidden: true }, 'Escreva o que a imagem mostra.')
    formImagem.replaceChildren(
      h('img', { src: url, alt: '', className: 'form-imagem-previa', width: img.largura, height: img.altura }),
      h('p', { className: 'ajuda' }, `${caminhoImg.split('/').pop()} · ${img.largura}x${img.altura} · ${Math.ceil(img.blob.size / 1024)} KB`),
      h('div', { className: 'campo' }, h('label', { htmlFor: 'img-desc' }, 'Descrição da imagem'), desc,
        h('p', { id: 'img-desc-ajuda', className: 'ajuda' }, 'O que ela mostra, para quem usa leitor de tela. Ex.: "Gráfico de conversas por mês no Meta Ads".'), erroDesc),
      h('div', { className: 'campo' }, h('label', { htmlFor: 'img-leg' }, 'Legenda (opcional)'), leg),
      h('p', { className: 'acoes' },
        botao('Inserir no texto', async () => {
          const d = desc.value.replace(/[\[\]"]/g, '').trim()
          erroDesc.hidden = !!d
          if (!d) return desc.focus()
          ctx.pendentes.set(caminhoImg, { base64: await paraBase64(img.blob), url })
          const l = leg.value.replace(/"/g, '').trim()
          formImagem.hidden = true
          // Linha em branco antes e depois: a imagem é um bloco próprio no Markdown
          const antes = ta.value.slice(0, pos[0])
          const sep = !antes || antes.endsWith('\n\n') ? '' : antes.endsWith('\n') ? '\n' : '\n\n'
          const txt = `${sep}![${d}](${caminhoImg}${l ? ` "${l}"` : ''})\n\n`
          inserir(txt, pos[0], pos[1], pos[0] + txt.length, pos[0] + txt.length)
          anunciar('Imagem inserida no texto.')
        }, 'btn btn-sm'),
        botao('Cancelar', () => { formImagem.hidden = true; URL.revokeObjectURL(url); ta.focus() })))
    formImagem.hidden = false
    desc.focus()
  })
  const barra = h('div', { className: 'barra', role: 'group', 'aria-label': 'Formatação do texto' }, BARRA.map(([t, r, f]) => botao(t, f, 'btn btn-sm ghost', r)))
  ta.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return
    const k = e.key.toLowerCase()
    if (k === 'b') { e.preventDefault(); envolver('**') }
    if (k === 'i') { e.preventDefault(); envolver('*') }
  })
  const corpo = campo('corpo', ta, { rotulo: 'Texto', ajuda: 'Markdown do site: ## seção, **negrito**, [link](https://...), - lista, :::nota ... :::, ![descrição](/blog/img/...). Ctrl+S guarda neste navegador.' })
  corpo.querySelector('label').after(barra, seletor, formImagem)

  // Conferência, ações e prévia
  const conferencia = h('ul', { className: 'conferencia' })
  const resultado = h('div', { className: 'resultado', role: 'status' }, opts.msg)
  const btnRascunho = botao('Salvar rascunho', () => enviar('rascunho'), 'btn ghost')
  const btnPublicar = botao('Publicar', () => enviar('publicado'), 'btn')
  const guardarLocal = () => { salvarLocal(); mostrar(h('p', {}, 'Guardado só neste navegador. Nada foi enviado ao GitHub.')) }
  const acoes = h('div', { className: 'acoes' }, btnPublicar, btnRascunho, botao('Guardar só neste navegador', guardarLocal), botao('Voltar à lista', ctx.voltar))
  const pTitulo = h('h1', { className: 'previa-titulo' })
  const pDesc = h('p', { className: 'previa-desc' })
  const prosa = h('div', { className: 'prosa' })
  const escrever = h('section', { id: 'p-escrever', className: 'painel-escrever', 'aria-label': 'Escrever' }, form, corpo,
    h('h2', {}, 'Conferência'), h('div', { 'aria-live': 'polite' }, conferencia), acoes, resultado)
  const previa = h('section', { id: 'p-previa', className: 'painel-previa', 'aria-label': 'Prévia' }, pTitulo, pDesc, prosa)
  const editor = h('div', { className: 'editor', 'data-aba': 'escrever' }, escrever, previa)
  const aba = (nome, rotulo) => {
    const b = botao(rotulo, () => {
      editor.dataset.aba = nome
      abas.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b))
    }, 'btn btn-sm ghost')
    b.setAttribute('aria-pressed', nome === 'escrever')
    b.setAttribute('aria-controls', `p-${nome}`)
    return b
  }
  const abas = h('div', { className: 'abas', role: 'group', 'aria-label': 'Ver' }, aba('escrever', 'Escrever'), aba('previa', 'Prévia'))
  editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); guardarLocal() }
  })

  const faixa = pendente && h('div', { className: 'faixa' },
    h('p', {}, `Este navegador guarda uma versão diferente deste post (de ${new Date(guardado.quando).toLocaleString('pt-BR')}). Enquanto você não escolher, nada novo é guardado aqui.`),
    botao('Restaurar', () => abrir(raiz, ctx, slugOrig, { estado: guardado }), 'btn btn-sm'),
    botao('Descartar', () => { local.apagar(slugOrig); pendente = false; faixa.remove(); anunciar('Versão do navegador descartada.') }))

  tela(raiz, noRepo ? `Editar: ${s.dados.titulo ?? slugOrig}` : 'Novo post', faixa, abas, editor)
  aberto = editor

  function salvarLocal() {
    if (pendente) return
    if (chaveLocal !== s.slug && !noRepo) {
      // Nunca adota a chave de um post do repo: trocaria ou apagaria as alterações não enviadas dele
      if (arquivos[caminho(s.slug)] !== undefined) return
      local.apagar(chaveLocal)
      chaveLocal = s.slug
    }
    local.gravar(chaveLocal, { ...s, quando: Date.now() })
  }

  let timer
  function mudou() {
    sujo = true
    if (!noRepo && !slugManual) slugEl.value = s.slug = slugify(s.dados.titulo ?? '').slice(0, 60).replace(/-$/, '')
    salvarLocal()
    clearTimeout(timer)
    timer = setTimeout(atualizar, 250)
  }

  function atualizar() {
    clearTimeout(timer)
    const arq = caminho(s.slug)
    const txt = arquivoDe(s)
    const taxNova = taxonomiaNova()
    const mapa = { ...arquivos, [arq]: txt }
    if (taxNova) mapa['content/taxonomia.json'] = taxNova
    const r = carregar(mapa, hojeLocal())
    const meu = (l) => l.filter((m) => m.startsWith(arq) || m.startsWith('content/taxonomia.json'))
    // Linha do arquivo logo antes da 1ª linha do texto (serializar tira as linhas em branco do começo)
    const inicio = frontmatter(txt).corpoLinha - (s.corpo.match(/^\s*/)[0].split('\n').length - 1)
    const erros = classificar(meu(r.erros), arq, props, inicio)
    if (!noRepo && s.slug && arquivos[arq] !== undefined) erros.unshift({ campo: 'slug', msg: 'já existe um post com este endereço' })
    if (!SLUG.test(s.slug) && !erros.some((e) => e.campo === 'slug')) erros.unshift({ campo: 'slug', msg: 'use só minúsculas, números e hífens, até 60 caracteres' })
    const avisos = classificar(meu(r.avisos), arq, props, inicio)
    // Imagem citada precisa estar no repo ou ter sido escolhida agora (o build falha com imagem que não existe)
    for (const c of new Set(citadas(s.corpo))) {
      if (!ctx.pendentes.has(c) && !ctx.imagens.some((i) => publico(i.caminho) === c)) erros.push({ campo: 'corpo', msg: `a imagem ${c.split('/').pop()} não está no repositório: insira de novo pelo botão Imagem` })
    }
    ultimo = { erros, txt, taxNova }

    for (const [k, c] of Object.entries(ctl)) {
      if (!c.erro) continue
      const msgs = erros.filter((e) => e.campo === k).map((e) => e.msg)
      c.erro.textContent = msgs.join('. ')
      c.erro.hidden = !msgs.length
      c.invalido.setAttribute('aria-invalid', !!msgs.length)
    }
    for (const e of erros) if (e.termo && !termosVistos.has(e.termo)) { termosVistos.add(e.termo); desenharTermos() }
    ctl.grupoTermos.hidden = !termosVistos.size
    for (const [k, el] of Object.entries(contadores)) {
      el.textContent = `${(s.dados[k] ?? '').trim().length} de ${props[k].maxLength}`
      el.className = `contador${erros.some((e) => e.campo === k) ? ' erro' : avisos.some((e) => e.campo === k) ? ' aviso' : ''}`
    }

    // Só reescreve a lista quando muda, para o aria-live não repetir tudo a cada tecla
    const rotulo = (k) => (k === 'slug' ? 'Endereço' : k === 'corpo' ? 'Texto' : props[k]?.title ?? 'Geral')
    const itens = [...erros.map((e) => ['erro', e]), ...avisos.map((e) => ['aviso', e])]
    const chave = JSON.stringify(itens)
    if (conferencia.dataset.chave !== chave) {
      conferencia.dataset.chave = chave
      conferencia.replaceChildren(...(itens.length ? itens.map(([tipo, e]) => h('li', { className: tipo },
        `${tipo === 'erro' ? 'Erro' : 'Aviso'}: `, ctl[e.campo] ? h('a', { href: `#${ctl[e.campo].invalido.id}`, onclick: (ev) => { ev.preventDefault(); focar(ctl[e.campo].foco) } }, rotulo(e.campo)) : rotulo(e.campo), `: ${e.msg}`))
        : [h('li', { className: 'ok' }, 'Tudo certo: o post passa na mesma conferência do site.')]))
    }
    btnPublicar.disabled = btnRascunho.disabled = erros.length > 0

    pTitulo.textContent = s.dados.titulo ?? ''
    pDesc.textContent = s.dados.descricao ?? ''
    prosa.innerHTML = semCarregar(md(s.corpo).html) // md() escapa HTML e só aceita links https e internos
    mostrarNaPrevia(ctx, prosa)
  }

  function focar(el) { (el.matches('input, select, textarea') ? el : el.querySelector('input:not(:disabled)'))?.focus() }
  function mostrar(...nos) { resultado.replaceChildren(...nos) }
  function ocupado(sim) {
    editor.setAttribute('aria-busy', sim)
    btnPublicar.disabled = btnRascunho.disabled = sim
    ta.readOnly = sim // o que fosse digitado durante a gravação seria trocado pelo texto relido do repo
  }

  async function enviar(status) {
    if (status === 'rascunho' && !avisouPublico) {
      avisouPublico = true
      return mostrar(h('p', {}, 'O repositório é público: o rascunho fica visível no GitHub. Para manter privado, deixe só neste navegador.'),
        h('p', {}, 'Clique em "Salvar rascunho" de novo para enviar mesmo assim.'), botao('Guardar só neste navegador', guardarLocal))
    }
    s.dados.status = statusEl.value = status
    salvarLocal()
    atualizar()
    if (ultimo.erros.length) return mostrar(h('p', {}, 'Corrija os erros da conferência antes de gravar.'))
    const arqs = { [caminho(s.slug)]: ultimo.txt }
    if (ultimo.taxNova) arqs['content/taxonomia.json'] = ultimo.taxNova
    for (const c of new Set(citadas(s.corpo))) if (ctx.pendentes.has(c)) arqs[doRepo(c)] = { base64: ctx.pendentes.get(c).base64 }
    const verbo = status === 'rascunho' ? 'rascunho' : publicadoAntes ? 'atualiza' : 'publica'
    ocupado(true)
    mostrar(h('p', {}, 'Gravando no GitHub...'))
    let r
    try {
      r = await gravar(ctx.token, { base: ctx.base, arquivos: arqs, mensagem: `docs(blog): ${verbo} "${s.dados.titulo.trim()}"` })
    } catch (e) {
      ocupado(false)
      atualizar()
      if (!(e instanceof ErroConflito)) return mostrar(h('p', {}, e.message))
      // A mensagem promete que o texto fica no navegador: vale mesmo com a faixa de versão antiga aberta
      pendente = false
      if (faixa) faixa.remove()
      salvarLocal()
      return mostrar(h('p', {}, e.message), botao('Recarregar', () => { sujo = false; location.reload() }, 'btn btn-sm'))
    }
    local.apagar(chaveLocal)
    // Imagens enviadas viram do repo: a URL local continua servindo a prévia
    for (const c of Object.keys(arqs).filter((a) => a.startsWith('public/')).map(publico)) {
      ctx.urls.set(c, Promise.resolve(ctx.pendentes.get(c).url))
      ctx.pendentes.delete(c)
    }
    sujo = false
    const msg = h('p', {}, 'Gravado no GitHub (', h('a', { href: r.url, target: '_blank', rel: 'noopener' }, 'ver o commit'), '). ',
      status === 'publicado' ? `O post fica em /blog/${s.slug} quando o deploy rodar.` : 'Rascunho não vira página no site.')
    try {
      await ctx.recarregar()
      abrir(raiz, ctx, s.slug, { msg })
      anunciar('Gravado no GitHub.')
    } catch (e) {
      ocupado(false)
      mostrar(msg, h('p', {}, `Não consegui reler o conteúdo (${e.message}). Recarregue a página antes de gravar de novo.`))
    }
  }

  atualizar()
}
