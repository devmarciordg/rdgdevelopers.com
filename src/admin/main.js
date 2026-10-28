// Painel do blog (/admin): entrar com token do GitHub, listar posts e abrir o editor. Sem backend: fala só com api.github.com
import '../styles/base.css'
import '../styles/artigo.css'
import './admin.css'
import { conectar, lerConteudo, tokenSalvo, salvarToken, esquecerToken, gravar, ErroConflito } from './github.js'
import { h, botao, tela, dataBR, local } from './dom.js'
// Editor em chunk próprio (carrega ao abrir um post): cada JS fica abaixo do orçamento de 15 KB gzip
const abrir = (...a) => import('./editor.js').then((e) => e.abrir(...a))
import { lerPosts } from './post.js'
import { publico, urlDe, usoDasImagens } from './imagens.js'

// Dentro de iframe de outro site, cliques poderiam ser induzidos (clickjacking): meta CSP não aceita frame-ancestors
if (top !== self) {
  document.body.replaceChildren()
  throw new Error('o painel não abre dentro de outro site')
}

const app = document.getElementById('app')
const sair = document.getElementById('sair')
const usuario = document.getElementById('usuario')
// pendentes: imagens escolhidas e ainda não gravadas (só na memória: base64 não cabe no autosave); urls: cache das baixadas
const ctx = { token: null, base: null, arquivos: null, imagens: [], fotos: [], pendentes: new Map(), urls: new Map(), recarregar, voltar: lista }

async function recarregar() {
  const r = await lerConteudo(ctx.token)
  ctx.base = r.base
  ctx.arquivos = r.arquivos
  ctx.imagens = r.imagens
  ctx.fotos = r.fotos
}

async function iniciar(token) {
  const { usuario: nome } = await conectar(token)
  ctx.token = token
  await recarregar()
  usuario.textContent = nome
  sair.hidden = false
}

function entrar(msg) {
  ctx.token = null
  sair.hidden = true
  usuario.textContent = ''
  const token = h('input', { type: 'password', id: 'token', autocomplete: 'off', spellcheck: false, required: true, 'aria-describedby': 'token-ajuda token-erro' })
  const lembrar = h('input', { type: 'checkbox', id: 'lembrar' })
  const erro = h('p', { id: 'token-erro', className: 'erro-campo' })
  const enviar = h('button', { type: 'submit', className: 'btn' }, 'Entrar')
  const falhou = (m) => {
    erro.textContent = m
    erro.hidden = !m
    token.setAttribute('aria-invalid', !!m)
  }
  const form = h('form', { className: 'entrar', noValidate: true, onsubmit: async (e) => {
    e.preventDefault()
    const t = token.value.trim()
    if (!t) { falhou('Cole o token do GitHub.'); return token.focus() }
    enviar.disabled = true
    enviar.textContent = 'Conferindo...'
    try {
      await iniciar(t)
      salvarToken(t, lembrar.checked)
      lista()
    } catch (err) {
      falhou(err.message)
      enviar.disabled = false
      enviar.textContent = 'Entrar'
      token.focus()
    }
  } },
  h('div', { className: 'campo' }, h('label', { htmlFor: 'token' }, 'Token do GitHub'), token,
    h('p', { id: 'token-ajuda', className: 'ajuda' }, 'Crie em ',
      h('a', { href: 'https://github.com/settings/personal-access-tokens/new', target: '_blank', rel: 'noopener' }, 'github.com/settings/personal-access-tokens/new'),
      ': Fine-grained, só o repositório rdgdevelopers.com, permissão Contents: Read and write, validade de 90 dias.'),
    erro),
  h('label', { className: 'opcao' }, lembrar, 'Lembrar neste navegador'),
  h('p', { className: 'ajuda' }, 'Sem marcar, o token some quando você fecha a aba.'),
  enviar)
  tela(app, 'Entrar', form)
  falhou(msg)
  if (msg) token.focus()
}

const item = (slug, d, marca) => {
  const titulo = d.titulo || '(sem título)'
  return h('li', {},
    h('div', {}, h('strong', {}, titulo),
      h('span', { className: 'meta' }, [d.status === 'publicado' ? 'Publicado' : 'Rascunho', d.publicado && dataBR(d.publicado), marca].filter(Boolean).join(' · '))),
    botao('Editar', () => abrir(app, ctx, slug), 'btn btn-sm ghost', `Editar "${titulo}"`))
}

function lista() {
  const posts = lerPosts(ctx.arquivos).sort((a, b) => String(b.dados.publicado).localeCompare(a.dados.publicado))
  const locais = new Map(local.todos().filter(([, v]) => v?.dados))
  const noRepo = new Set(posts.map((p) => p.slug))
  const itens = [
    ...[...locais].filter(([slug]) => !noRepo.has(slug)).map(([slug, v]) => item(slug, v.dados, 'não enviado')),
    ...posts.map((p) => item(p.slug, p.dados, locais.has(p.slug) && 'alterações não enviadas')),
  ]
  tela(app, 'Posts do blog',
    h('p', { className: 'acoes' }, botao('Novo post', () => abrir(app, ctx, null), 'btn'), botao(`Imagens (${ctx.imagens.length})`, () => galeria(), 'btn ghost'),
      botao(`Autores (${JSON.parse(ctx.arquivos['content/autores.json']).length})`, () => import('./autores.js').then((a) => a.telaAutores(app, ctx)), 'btn ghost')),
    itens.length ? h('ul', { className: 'posts' }, itens) : h('p', {}, 'Nenhum post ainda.'))
}

// Galeria: todas as imagens do blog, onde cada uma é usada, e apagar de uma vez as que nenhum post usa
function galeria(msg) {
  const uso = usoDasImagens(ctx.arquivos, local.todos())
  const imgs = [...ctx.imagens].sort((a, b) => (uso.has(publico(a.caminho)) - uso.has(publico(b.caminho))) || a.caminho.localeCompare(b.caminho))
  const semUso = imgs.filter((i) => !uso.has(publico(i.caminho)))
  const resultado = h('div', { className: 'resultado', role: 'status' }, msg)
  let confirmar = false
  const n = semUso.length === 1 ? '1 imagem' : `${semUso.length} imagens`
  const btnApagar = botao(`Apagar ${n} sem uso`, async () => {
    if (!confirmar) {
      confirmar = true
      btnApagar.textContent = `Confirmar: apagar ${n} do repositório`
      return resultado.replaceChildren(h('p', {}, 'Saem do GitHub num commit só. Clique de novo para confirmar.'))
    }
    btnApagar.disabled = true
    resultado.replaceChildren(h('p', {}, 'Apagando...'))
    try {
      const r = await gravar(ctx.token, { base: ctx.base, arquivos: {}, apagar: semUso.map((i) => i.caminho), mensagem: `docs(blog): apaga ${n} sem uso` })
      await recarregar()
      galeria(h('p', {}, `${n} apagada${semUso.length === 1 ? '' : 's'} (`, h('a', { href: r.url, target: '_blank', rel: 'noopener' }, 'ver o commit'), ').'))
    } catch (e) {
      btnApagar.disabled = false
      resultado.replaceChildren(h('p', {}, e.message), e instanceof ErroConflito ? botao('Recarregar', () => location.reload(), 'btn btn-sm') : '')
    }
  }, 'btn btn-sm')
  btnApagar.disabled = !semUso.length
  const cartao = (i) => {
    const onde = uso.get(publico(i.caminho))
    const [, w, hgt] = i.caminho.match(/-(\d+)x(\d+)\.\w+$/)
    const img = h('img', { alt: '', width: w, height: hgt, loading: 'lazy' })
    urlDe(ctx, publico(i.caminho)).then((u) => { if (u) img.src = u })
    return h('li', { className: onde ? 'em-uso' : 'sem-uso' }, img,
      h('div', {}, h('strong', {}, i.caminho.split('/').pop()),
        h('span', { className: 'meta' }, `${w}x${hgt} · ${Math.ceil(i.tamanho / 1024)} KB`),
        h('span', { className: 'meta' }, onde ? `Em uso: ${onde.join(', ')}` : 'Sem uso')))
  }
  tela(app, 'Imagens do blog',
    h('p', { className: 'ajuda' }, `${imgs.length === 1 ? '1 imagem' : `${imgs.length} imagens`}, ${semUso.length} sem uso. Conta como uso qualquer post do repositório, publicado ou rascunho, e rascunhos guardados neste navegador.`),
    h('p', { className: 'acoes' }, btnApagar, botao('Voltar à lista', lista)),
    resultado,
    imgs.length ? h('ul', { className: 'galeria' }, imgs.map(cartao)) : h('p', {}, 'Nenhuma imagem ainda. Elas entram pelo botão Imagem do editor.'))
}

sair.addEventListener('click', () => { esquecerToken(); entrar() })

const salvo = tokenSalvo()
if (salvo) {
  app.replaceChildren(h('p', { role: 'status' }, 'Carregando os posts...'))
  iniciar(salvo).then(lista, (e) => entrar(e.message))
} else entrar()
