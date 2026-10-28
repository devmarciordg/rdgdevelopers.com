// Fala só com api.github.com: lê content/ da main e grava tudo num commit só (Git Data API).
export const REPO = { dono: 'devmarciordg', nome: 'rdgdevelopers.com', branch: 'main' }
export class ErroGithub extends Error {}
export class ErroConflito extends ErroGithub {}

const CHAVE = 'rdg-admin-token'
const BASE = `https://api.github.com/repos/${REPO.dono}/${REPO.nome}/git`
const REF = `${BASE}/refs/heads/${REPO.branch}`
const MSG_SEM_ESCRITA = 'Este token não pode gravar no repositório. Gere um token com Contents: Read and write para rdgdevelopers.com.'
const MSG_CONFLITO = 'Alguém gravou no site depois que você abriu o painel. Recarregue: o seu texto fica salvo neste navegador.'

// Armazenamento pode lançar em aba privada ou com dados do site bloqueados
const tenta = (f) => { try { return f() } catch { return null } }
export const tokenSalvo = () => tenta(() => sessionStorage.getItem(CHAVE) || localStorage.getItem(CHAVE))
export function salvarToken(token, persistir) {
  esquecerToken()
  tenta(() => (persistir ? localStorage : sessionStorage).setItem(CHAVE, token))
}
export function esquecerToken() {
  tenta(() => sessionStorage.removeItem(CHAVE))
  tenta(() => localStorage.removeItem(CHAVE))
}

async function api(token, url, metodo = 'GET', corpo) {
  let r
  try {
    r = await fetch(url.startsWith('https://') ? url : `https://api.github.com${url}`, {
      method: metodo,
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: corpo && JSON.stringify(corpo),
    })
  } catch {
    throw new ErroGithub('Sem conexão com o GitHub. Confira a internet e tente de novo.')
  }
  if (r.ok) return r.json()
  if (r.status === 401) throw new ErroGithub('Token inválido ou expirado. Gere um novo token e entre de novo.')
  if (r.status === 429 || (r.status === 403 && r.headers.get('x-ratelimit-remaining') === '0'))
    throw new ErroGithub('O GitHub limitou as chamadas deste token por um tempo. Espere alguns minutos e tente de novo.')
  const e = new ErroGithub(`O GitHub recusou o pedido (erro ${r.status}). Tente de novo em instantes.`)
  e.status = r.status
  throw e
}

export async function conectar(token) {
  const { login } = await api(token, '/user')
  const repo = await api(token, `/repos/${REPO.dono}/${REPO.nome}`).catch((e) => {
    if (e.status) return null // 403/404: o token não enxerga o repositório
    throw e
  })
  if (!repo?.permissions?.push) throw new ErroGithub(MSG_SEM_ESCRITA)
  return { usuario: login }
}

const doBase64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)))

export async function lerConteudo(token) {
  const base = (await api(token, REF)).object.sha
  const commit = await api(token, `${BASE}/commits/${base}`)
  const arvore = await api(token, `${BASE}/trees/${commit.tree.sha}?recursive=1`)
  // shortcut: árvore truncada (mais de 100 mil arquivos) não é tratada, repo do site nunca chega perto
  const itens = arvore.tree.filter((i) => i.type === 'blob' && /^content\/.+\.(md|json)$/.test(i.path))
  const textos = await Promise.all(itens.map((i) => api(token, `${BASE}/blobs/${i.sha}`).then((b) => doBase64(b.content))))
  // Imagens só como lista (caminho, sha, tamanho): o conteúdo vem sob demanda, em lerImagem
  const lista = (re) => arvore.tree.filter((i) => i.type === 'blob' && re.test(i.path)).map((i) => ({ caminho: i.path, sha: i.sha, tamanho: i.size }))
  return { base, arquivos: Object.fromEntries(itens.map((i, n) => [i.path, textos[n]])), imagens: lista(IMAGEM_REPO), fotos: lista(FOTO_AUTOR) }
}

const IMAGEM_REPO = /^public\/blog\/img\/[a-z0-9]+(-[a-z0-9]+)*-\d+x\d+\.(webp|avif|png|jpg)$/
// Foto de autor: src/assets/autores/<slug>.webp (o painel gera) ou .avif (antiga, que o painel apaga ao trocar a foto)
const FOTO_AUTOR = /^src\/assets\/autores\/[a-z0-9]+(-[a-z0-9]+)*\.(webp|avif)$/
const BINARIO = (p) => IMAGEM_REPO.test(p) || FOTO_AUTOR.test(p)
const TIPO = { webp: 'image/webp', avif: 'image/avif', png: 'image/png', jpg: 'image/jpeg' }

// Blob da imagem (para mostrar no painel com URL.createObjectURL; o site no ar pode ainda não ter o arquivo)
export async function lerImagem(token, { caminho, sha }) {
  const { content } = await api(token, `${BASE}/blobs/${sha}`)
  return new Blob([Uint8Array.from(atob(content.replace(/\s/g, '')), (c) => c.charCodeAt(0))], { type: TIPO[caminho.split('.').pop()] })
}

// O painel só escreve posts, taxonomia, autores, imagens do blog e fotos de autor; só apaga imagens e fotos. O resto é recusado antes da rede
const GRAVAVEL = /^content\/(blog\/[a-z0-9]+(-[a-z0-9]+)*\.md|taxonomia\.json|autores\.json)$/

// arquivos: { caminho: texto | { base64 } }; apagar: caminhos de imagem a remover no mesmo commit
export async function gravar(token, { base, arquivos, apagar = [], mensagem }) {
  const fora = [...Object.keys(arquivos).filter((p) => !GRAVAVEL.test(p) && !BINARIO(p)), ...apagar.filter((p) => !BINARIO(p))][0]
  if (fora) throw new ErroGithub(`O painel não grava em ${fora}.`)
  if ((await api(token, REF)).object.sha !== base) throw new ErroConflito(MSG_CONFLITO)
  const { tree } = await api(token, `${BASE}/commits/${base}`)
  // permissions.push do /repos é o papel do usuário, não do token: token só de leitura só falha aqui, no 1º POST
  const entradas = await Promise.all(Object.entries(arquivos).map(async ([path, v]) => {
    const corpo = typeof v === 'string' ? { content: v, encoding: 'utf-8' } : { content: v.base64, encoding: 'base64' }
    const { sha } = await api(token, `${BASE}/blobs`, 'POST', corpo).catch((e) => {
      throw e.status === 403 || e.status === 404 ? new ErroGithub(MSG_SEM_ESCRITA) : e
    })
    return { path, mode: '100644', type: 'blob', sha }
  }))
  // sha null na árvore = arquivo removido
  for (const path of apagar) entradas.push({ path, mode: '100644', type: 'blob', sha: null })
  const arvore = await api(token, `${BASE}/trees`, 'POST', { base_tree: tree.sha, tree: entradas })
  const novo = await api(token, `${BASE}/commits`, 'POST', { message: mensagem, tree: arvore.sha, parents: [base] })
  try {
    await api(token, REF, 'PATCH', { sha: novo.sha, force: false })
  } catch (e) {
    throw e.status === 422 ? new ErroConflito(MSG_CONFLITO) : e
  }
  return { commit: novo.sha, url: novo.html_url }
}
