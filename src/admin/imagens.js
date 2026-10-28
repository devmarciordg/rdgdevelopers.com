// Imagens do blog no painel: reduz e converte no navegador, nomeia com o tamanho, mostra e diz onde cada uma é usada.
import { lerImagem } from './github.js'
import { slugify } from '../conteudo/md.js'
import { lerPosts } from './post.js'

const LARGURA_MAX = 1600
export const publico = (caminhoRepo) => caminhoRepo.replace(/^public/, '') // public/blog/img/x -> /blog/img/x
export const doRepo = (caminhoPublico) => `public${caminhoPublico}`

// Reduz para no máximo 1600px de largura e converte para WebP (PNG onde o navegador não gera WebP)
export async function processar(arquivo) {
  const bmp = await createImageBitmap(arquivo)
  const escala = Math.min(1, LARGURA_MAX / bmp.width)
  const largura = Math.round(bmp.width * escala)
  const altura = Math.round(bmp.height * escala)
  const canvas = Object.assign(document.createElement('canvas'), { width: largura, height: altura })
  canvas.getContext('2d').drawImage(bmp, 0, 0, largura, altura)
  bmp.close()
  const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/webp', 0.82))
  return { blob, largura, altura, ext: blob.type === 'image/webp' ? 'webp' : 'png' }
}

// Foto de autor: recorte quadrado no centro, 112px (2x do maior avatar do site), WebP
export async function processarQuadrada(arquivo, lado = 112) {
  const bmp = await createImageBitmap(arquivo)
  const q = Math.min(bmp.width, bmp.height)
  const canvas = Object.assign(document.createElement('canvas'), { width: lado, height: lado })
  canvas.getContext('2d').drawImage(bmp, (bmp.width - q) / 2, (bmp.height - q) / 2, q, q, 0, 0, lado, lado)
  bmp.close()
  const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/webp', 0.85))
  if (blob.type !== 'image/webp') throw new Error('sem webp')
  return blob
}

// Nome a partir do arquivo original + tamanho (md.js lê largura e altura daqui); sem repetir um que já existe
export function nomeLivre(original, { largura, altura, ext }, ocupados) {
  const base = slugify(original.replace(/\.[^.]+$/, '')).slice(0, 40).replace(/-$/, '') || 'imagem'
  for (let n = 1; ; n++) {
    const caminho = `/blog/img/${base}${n > 1 ? `-${n}` : ''}-${largura}x${altura}.${ext}`
    if (!ocupados.has(caminho)) return caminho
  }
}

export const paraBase64 = (blob) => new Promise((ok, falha) => {
  const r = new FileReader()
  r.onload = () => ok(r.result.slice(r.result.indexOf(',') + 1))
  r.onerror = falha
  r.readAsDataURL(blob)
})

// URL para mostrar no painel: a enviada agora (ainda só no navegador) ou a do repo, baixada pela API uma vez
export function urlDe(ctx, caminho) {
  const pend = ctx.pendentes.get(caminho)
  if (pend) return Promise.resolve(pend.url)
  if (!ctx.urls.has(caminho)) {
    const img = ctx.imagens.find((i) => publico(i.caminho) === caminho)
    ctx.urls.set(caminho, img ? lerImagem(ctx.token, img).then((b) => URL.createObjectURL(b)) : Promise.resolve(null))
  }
  return ctx.urls.get(caminho)
}

export const citadas = (texto) => [...texto.matchAll(/\/blog\/img\/[^)\s"]+/g)].map((m) => m[0])

// Onde cada imagem aparece: posts do repo (qualquer status) e rascunhos guardados só neste navegador
export function usoDasImagens(arquivos, locais) {
  const uso = new Map()
  const marcar = (texto, onde) => citadas(texto).forEach((c) => uso.set(c, [...new Set([...(uso.get(c) ?? []), onde])]))
  for (const p of lerPosts(arquivos)) marcar(p.corpo, p.dados.titulo ?? p.slug)
  for (const [slug, v] of locais) if (v?.corpo) marcar(v.corpo, `${v.dados?.titulo || slug} (só neste navegador)`)
  return uso
}

// Prévia: o HTML do md() entra com data-src (sem pedir /blog/img/ ao servidor, que pode não ter o arquivo ainda)
export const semCarregar = (html) => html.replaceAll('<img src="/blog/img/', '<img data-src="/blog/img/')
export function mostrarNaPrevia(ctx, raiz) {
  for (const img of raiz.querySelectorAll('img[data-src]')) {
    const caminho = img.dataset.src
    urlDe(ctx, caminho).then((url) => { if (url) img.src = url; else img.alt = `Imagem não encontrada: ${caminho}` })
  }
}
