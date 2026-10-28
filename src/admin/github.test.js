// npm test: fetch falso, nada chega ao GitHub de verdade
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { conectar, lerConteudo, gravar, ErroGithub, ErroConflito } from './github.js'

const G = 'https://api.github.com/repos/devmarciordg/rdgdevelopers.com/git'
const REF = `${G}/refs/heads/main`

// rotas: { 'MÉTODO url': [status, corpo] }; devolve o log de chamadas
function falso(rotas) {
  const log = []
  globalThis.fetch = async (url, op) => {
    const chave = `${op.method} ${url}`
    log.push({ chave, corpo: op.body && JSON.parse(op.body), op })
    const [status, corpo] = rotas[chave] ?? [404, {}]
    return { ok: status < 300, status, headers: new Headers(), json: async () => corpo }
  }
  return log
}
const b64 = (s) => Buffer.from(s).toString('base64').replace(/(.{60})/g, '$1\n')

test('lerConteudo: só content/*.md|json, acento e emoji em UTF-8', async () => {
  const log = falso({
    [`GET ${REF}`]: [200, { object: { sha: 'c1' } }],
    [`GET ${G}/commits/c1`]: [200, { tree: { sha: 't1' } }],
    [`GET ${G}/trees/t1?recursive=1`]: [200, { tree: [
      { path: 'content/blog/ação.md', type: 'blob', sha: 'b1' },
      { path: 'content/taxonomia.json', type: 'blob', sha: 'b2' },
      { path: 'content/blog', type: 'tree', sha: 'x' },
      { path: 'src/main.js', type: 'blob', sha: 'x' },
      { path: 'public/blog/img/painel-1200x800.webp', type: 'blob', sha: 'i1', size: 5120 },
      { path: 'public/og.png', type: 'blob', sha: 'x', size: 1 },
      { path: 'src/assets/autores/marcio.webp', type: 'blob', sha: 'f1', size: 1900 },
    ] }],
    [`GET ${G}/blobs/b1`]: [200, { content: b64('---\ntitulo: Atenção 🚀\n---\nCoração') }],
    [`GET ${G}/blobs/b2`]: [200, { content: b64('{"temas":[]}') }],
  })
  const r = await lerConteudo('tk')
  assert.deepEqual(r, { base: 'c1', arquivos: {
    'content/blog/ação.md': '---\ntitulo: Atenção 🚀\n---\nCoração',
    'content/taxonomia.json': '{"temas":[]}',
  }, imagens: [{ caminho: 'public/blog/img/painel-1200x800.webp', sha: 'i1', tamanho: 5120 }], fotos: [{ caminho: 'src/assets/autores/marcio.webp', sha: 'f1', tamanho: 1900 }] })
  const h = log[0].op.headers
  assert.equal(h.Authorization, 'Bearer tk')
  assert.equal(h['X-GitHub-Api-Version'], '2022-11-28')
  assert.equal(log[0].op.cache, 'no-store')
})

const feliz = (extra = {}) => ({
  [`GET ${REF}`]: [200, { object: { sha: 'c1' } }],
  [`GET ${G}/commits/c1`]: [200, { tree: { sha: 't1' } }],
  [`POST ${G}/blobs`]: [201, { sha: 'b9' }],
  [`POST ${G}/trees`]: [201, { sha: 't2' }],
  [`POST ${G}/commits`]: [201, { sha: 'c2', html_url: 'https://github.com/x/commit/c2' }],
  [`PATCH ${REF}`]: [200, {}],
  ...extra,
})
const pedido = { base: 'c1', arquivos: { 'content/blog/a.md': 'é', 'content/taxonomia.json': '{}' }, mensagem: 'docs(blog): publica "A"' }

test('gravar: ref, blobs, tree com base_tree, commit com parent, PATCH sem force', async () => {
  const log = falso(feliz())
  assert.deepEqual(await gravar('tk', pedido), { commit: 'c2', url: 'https://github.com/x/commit/c2' })
  assert.deepEqual(log.map((l) => l.chave), [
    `GET ${REF}`, `GET ${G}/commits/c1`, `POST ${G}/blobs`, `POST ${G}/blobs`, `POST ${G}/trees`, `POST ${G}/commits`, `PATCH ${REF}`,
  ])
  assert.deepEqual(log[2].corpo, { content: 'é', encoding: 'utf-8' })
  assert.deepEqual(log[4].corpo.base_tree, 't1')
  assert.deepEqual(log[4].corpo.tree.map((e) => e.path), ['content/blog/a.md', 'content/taxonomia.json'])
  assert.deepEqual(log[5].corpo, { message: 'docs(blog): publica "A"', tree: 't2', parents: ['c1'] })
  assert.deepEqual(log[6].corpo, { sha: 'c2', force: false })
})

test('gravar: main andou depois da leitura vira ErroConflito sem gravar nada', async () => {
  const log = falso(feliz({ [`GET ${REF}`]: [200, { object: { sha: 'c0' } }] }))
  await assert.rejects(gravar('tk', pedido), ErroConflito)
  assert.equal(log.length, 1)
})

test('gravar: PATCH 422 vira ErroConflito', async () => {
  falso(feliz({ [`PATCH ${REF}`]: [422, {}] }))
  await assert.rejects(gravar('tk', pedido), (e) => e instanceof ErroConflito && /Recarregue/.test(e.message))
})

test('conectar: 401, sem push, rede fora e caso feliz', async () => {
  falso({ 'GET https://api.github.com/user': [401, {}] })
  await assert.rejects(conectar('x'), (e) => e instanceof ErroGithub && !(e instanceof ErroConflito) && /Token inválido/.test(e.message))
  falso({ 'GET https://api.github.com/user': [200, { login: 'm' }], 'GET https://api.github.com/repos/devmarciordg/rdgdevelopers.com': [200, { permissions: { push: false } }] })
  await assert.rejects(conectar('x'), /não pode gravar/)
  falso({ 'GET https://api.github.com/user': [200, { login: 'm' }] })
  await assert.rejects(conectar('x'), /não pode gravar/)
  falso({ 'GET https://api.github.com/user': [200, { login: 'm' }], 'GET https://api.github.com/repos/devmarciordg/rdgdevelopers.com': [200, { permissions: { push: true } }] })
  assert.deepEqual(await conectar('x'), { usuario: 'm' })
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch') }
  await assert.rejects(conectar('x'), /Sem conexão/)
})

test('gravar: token só de leitura (403 no POST do blob) vira mensagem de permissão', async () => {
  falso({
    [`GET ${REF}`]: [200, { object: { sha: 'c1' } }],
    [`GET ${G}/commits/c1`]: [200, { tree: { sha: 't1' } }],
    [`POST ${G}/blobs`]: [403, {}],
  })
  await assert.rejects(gravar('t', { base: 'c1', arquivos: { 'content/blog/a.md': 'x' }, mensagem: 'm' }), /não pode gravar/)
})

test('gravar: recusa caminho fora de posts, taxonomia, autores e imagens, sem rede', async () => {
  const log = falso({})
  for (const p of ['content/blog/a/b.md', 'content/blog/../../README.md', 'src/x.js', 'content/projetos/tradi.json'])
    await assert.rejects(gravar('t', { base: 'c1', arquivos: { [p]: 'x' }, mensagem: 'm' }), /não grava/)
  assert.equal(log.length, 0)
})

test('gravar: imagem vai em base64 e apagar vira sha null na árvore', async () => {
  const log = falso(feliz())
  const img = 'public/blog/img/painel-1200x800.webp'
  await gravar('tk', { base: 'c1', arquivos: { [img]: { base64: 'UklGRg==' } }, apagar: ['public/blog/img/velha-10x10.webp'], mensagem: 'm' })
  assert.deepEqual(log[2].corpo, { content: 'UklGRg==', encoding: 'base64' })
  assert.deepEqual(log[3].corpo.tree, [
    { path: img, mode: '100644', type: 'blob', sha: 'b9' },
    { path: 'public/blog/img/velha-10x10.webp', mode: '100644', type: 'blob', sha: null },
  ])
})

test('gravar: só apaga imagem do blog, nunca post nem outro arquivo', async () => {
  const log = falso({})
  for (const p of ['content/blog/a.md', 'public/og.png', 'public/blog/img/../../index.html', 'src/assets/marcio-480.webp', 'src/assets/autores/../x.webp'])
    await assert.rejects(gravar('t', { base: 'c1', arquivos: {}, apagar: [p], mensagem: 'm' }), /não grava/)
  assert.equal(log.length, 0)
})

test('gravar: autores.json e foto de autor; troca de foto apaga o avif antigo', async () => {
  const log = falso(feliz())
  await gravar('tk', { base: 'c1', arquivos: { 'content/autores.json': '[]\n', 'src/assets/autores/ana.webp': { base64: 'UklGRg==' } }, apagar: ['src/assets/autores/ana.avif'], mensagem: 'm' })
  assert.deepEqual(log.find((l) => l.chave === `POST ${G}/trees`).corpo.tree.map((e) => `${e.path} ${e.sha}`), [
    'content/autores.json b9', 'src/assets/autores/ana.webp b9', 'src/assets/autores/ana.avif null',
  ])
})
