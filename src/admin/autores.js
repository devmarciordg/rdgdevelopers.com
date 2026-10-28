// Autores no painel: lista, cadastro e edição, com foto. Grava content/autores.json e src/assets/autores/<slug>.webp num commit
import { gravar, lerImagem, ErroConflito } from './github.js'
import { carregar } from '../conteudo/carregar.js'
import { slugify } from '../conteudo/md.js'
import { h, botao, tela, anunciar } from './dom.js'
import { autoresJson } from './post.js'
import { paraBase64, processarQuadrada } from './imagens.js'

const JSON_AUTORES = 'content/autores.json'
const SLUG = /^(?=.{1,40}$)[a-z0-9]+(-[a-z0-9]+)*$/
const webp = (slug) => `src/assets/autores/${slug}.webp`
const iniciais = (nome) => { const p = nome.trim().split(/\s+/); return ((p[0]?.[0] ?? '') + (p.length > 1 ? p.at(-1)[0] : '')).toUpperCase() }

// Avatar no painel: foto do repo baixada pela API (o site no ar pode ainda não ter o arquivo) ou as iniciais
function avatar(ctx, a, url) {
  const el = h('span', { className: 'avatar-admin', 'aria-hidden': 'true' }, iniciais(a.nome))
  const foto = ctx.fotos.find((f) => f.caminho === webp(a.slug))
  const mostrar = (u) => { if (u) el.replaceChildren(h('img', { src: u, alt: '', width: 56, height: 56 })) }
  if (url) mostrar(url)
  else if (foto) lerImagem(ctx.token, foto).then((b) => mostrar(URL.createObjectURL(b)), () => {})
  return el
}

export function telaAutores(app, ctx, msg) {
  const lista = JSON.parse(ctx.arquivos[JSON_AUTORES])
  tela(app, 'Autores',
    h('p', { className: 'ajuda' }, 'Quem pode assinar os posts. Só pessoas reais da RDG, que autorizaram o uso do nome e da foto.'),
    h('p', { className: 'acoes' }, botao('Novo autor', () => formulario(app, ctx, null), 'btn'), botao('Voltar à lista', ctx.voltar)),
    h('div', { className: 'resultado', role: 'status' }, msg),
    h('ul', { className: 'posts' }, lista.map((a) => h('li', {},
      h('div', { className: 'autor-linha' }, avatar(ctx, a), h('div', {}, h('strong', {}, a.nome), h('span', { className: 'meta' }, [a.cargo, a.url].filter(Boolean).join(' · ')))),
      botao('Editar', () => formulario(app, ctx, a.slug), 'btn btn-sm ghost', `Editar ${a.nome}`)))))
}

function formulario(app, ctx, slugOrig) {
  const lista = JSON.parse(ctx.arquivos[JSON_AUTORES])
  const atual = lista.find((a) => a.slug === slugOrig) ?? { slug: '', nome: '', cargo: '', url: '/sobre' }
  let foto = null // { blob, url } quando uma foto nova foi escolhida
  let slugManual = !!slugOrig

  const campo = (id, rotulo, el, ajuda) => h('div', { className: 'campo' }, h('label', { htmlFor: id }, rotulo), el, ajuda && h('p', { className: 'ajuda', id: `${id}-ajuda` }, ajuda))
  const nome = h('input', { type: 'text', id: 'a-nome', value: atual.nome, maxLength: 80, required: true })
  const slug = h('input', { type: 'text', id: 'a-slug', value: atual.slug, readOnly: !!slugOrig, spellcheck: false, maxLength: 40, 'aria-describedby': 'a-slug-ajuda' })
  const cargo = h('input', { type: 'text', id: 'a-cargo', value: atual.cargo ?? '', maxLength: 60 })
  const url = h('input', { type: 'text', id: 'a-url', value: atual.url, spellcheck: false, 'aria-describedby': 'a-url-ajuda' })
  nome.addEventListener('input', () => { if (!slugManual) slug.value = slugify(nome.value).slice(0, 40).replace(/-$/, '') })
  slug.addEventListener('input', () => { slugManual = true })

  const previa = h('div', { className: 'autor-linha' })
  const desenharPrevia = () => previa.replaceChildren(avatar(ctx, { slug: slugOrig ?? '', nome: nome.value || '?' }, foto?.url))
  nome.addEventListener('input', desenharPrevia)
  const seletor = h('input', { type: 'file', id: 'a-foto', accept: 'image/*', 'aria-describedby': 'a-foto-ajuda' })
  seletor.addEventListener('change', async () => {
    const arq = seletor.files[0]
    if (!arq) return
    try {
      const blob = await processarQuadrada(arq)
      foto = { blob, url: URL.createObjectURL(blob) }
      desenharPrevia()
      anunciar('Foto pronta. Ela vai junto ao salvar.')
    } catch { anunciar('Não consegui abrir essa imagem. Tente um JPG, PNG ou WebP.') }
  })

  const erros = h('ul', { className: 'conferencia', 'aria-live': 'polite' })
  const resultado = h('div', { className: 'resultado', role: 'status' })
  const btnSalvar = botao('Salvar autor', salvar, 'btn')

  async function salvar() {
    // Mantém campos que o formulário não mostra (ex.: organizacao da RDG); cargo vazio sai do arquivo
    const { cargo: _, ...resto } = atual
    const a = { ...resto, slug: slug.value.trim(), nome: nome.value.trim(), ...(cargo.value.trim() && { cargo: cargo.value.trim() }), url: url.value.trim() }
    const novaLista = slugOrig ? lista.map((x) => (x.slug === slugOrig ? a : x)) : [...lista, a]
    const json = autoresJson(novaLista)
    // Primeiro as regras em português claro; passando nelas, a mesma conferência do build (schema de autores)
    const msgs = []
    if (!SLUG.test(a.slug)) msgs.push('endereço (slug): só minúsculas, números e hífens, até 40 caracteres')
    if (a.nome.length < 3) msgs.push('escreva o nome completo')
    if (!slugOrig && lista.some((x) => x.slug === a.slug)) msgs.push(`já existe um autor com o endereço "${a.slug}"`)
    if (!msgs.length) msgs.push(...carregar({ ...ctx.arquivos, [JSON_AUTORES]: json }).erros.filter((e) => e.startsWith(JSON_AUTORES)).map((e) => e.replace(`${JSON_AUTORES} `, '')))
    erros.replaceChildren(...msgs.map((m) => h('li', { className: 'erro' }, `Erro: ${m}`)))
    if (msgs.length) return
    const arquivos = { [JSON_AUTORES]: json }
    const apagar = []
    if (foto) {
      arquivos[webp(a.slug)] = { base64: await paraBase64(foto.blob) }
      // A foto antiga em AVIF teria prioridade no <picture> do site: sai junto
      const avif = `src/assets/autores/${a.slug}.avif`
      if (ctx.fotos.some((f) => f.caminho === avif)) apagar.push(avif)
    }
    btnSalvar.disabled = true
    resultado.replaceChildren(h('p', {}, 'Gravando no GitHub...'))
    try {
      const r = await gravar(ctx.token, { base: ctx.base, arquivos, apagar, mensagem: `docs(blog): ${slugOrig ? 'atualiza' : 'cadastra'} autor "${a.nome}"` })
      await ctx.recarregar()
      telaAutores(app, ctx, h('p', {}, `${a.nome} gravado (`, h('a', { href: r.url, target: '_blank', rel: 'noopener' }, 'ver o commit'), '). A foto aparece no site quando o deploy rodar.'))
    } catch (e) {
      btnSalvar.disabled = false
      resultado.replaceChildren(h('p', {}, e.message), e instanceof ErroConflito ? botao('Recarregar', () => location.reload(), 'btn btn-sm') : '')
    }
  }

  // Erro corrigido some ao digitar: a lista volta na próxima tentativa de salvar
  for (const el of [nome, slug, cargo, url]) el.addEventListener('input', () => erros.replaceChildren())
  desenharPrevia()
  tela(app, slugOrig ? `Editar: ${atual.nome}` : 'Novo autor',
    h('div', { className: 'form' },
      campo('a-nome', 'Nome completo', nome),
      campo('a-slug', 'Endereço (slug)', slug, slugOrig ? 'Travado: os posts citam o autor por este endereço.' : 'Sai do nome; é como os posts citam o autor.'),
      campo('a-cargo', 'Cargo (opcional)', cargo),
      campo('a-url', 'Página do autor', url, 'Caminho do site começando com /, ex.: /sobre'),
      h('div', { className: 'campo' }, h('label', { htmlFor: 'a-foto' }, 'Foto'), previa, seletor,
        h('p', { className: 'ajuda', id: 'a-foto-ajuda' }, 'O painel recorta um quadrado do centro e reduz para 112px. Sem foto, o site mostra as iniciais. Use só foto com autorização da pessoa.'))),
    erros,
    h('p', { className: 'acoes' }, btnSalvar, botao('Voltar', () => telaAutores(app, ctx))),
    resultado)
}
