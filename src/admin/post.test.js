import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { carregar, tintaDe } from '../conteudo/carregar.js'
import { frontmatter, serializar } from '../conteudo/frontmatter.js'
import { autoresJson, caminho, classificar, hojeLocal, lerPosts, montarDados, taxonomiaJson } from './post.js'

const ler = (a) => fs.readFileSync(a, 'utf8')
const props = JSON.parse(ler('content/_schemas/post.schema.json')).properties

test('taxonomiaJson reproduz o arquivo atual byte a byte', () => {
  const t = ler('content/taxonomia.json')
  assert.equal(taxonomiaJson(JSON.parse(t)), t)
})

test('autoresJson reproduz o arquivo atual byte a byte', () => {
  const t = ler('content/autores.json')
  assert.equal(autoresJson(JSON.parse(t)), t)
})

test('hojeLocal usa o fuso local', () => {
  assert.match(hojeLocal(), /^\d{4}-\d{2}-\d{2}$/)
})

test('montarDados segue a ordem do schema e omite vazios; post do repo volta igual ao lido', () => {
  assert.deepEqual(Object.keys(montarDados(props, { tags: ['a'], titulo: ' X ', atualizado: '', relacionados: [] })), ['titulo', 'tags'])
  const arq = 'content/blog/meta-capi-para-clinicas.md'
  const [p] = lerPosts({ [arq]: ler(arq) })
  // serializar() põe aspas em valor com ": "; o que importa é o build ler o mesmo
  const volta = frontmatter(serializar(montarDados(props, p.dados), p.corpo))
  assert.deepEqual(volta.dados, frontmatter(ler(arq)).dados)
  assert.equal(volta.corpo, frontmatter(ler(arq)).corpo)
})

test('classificar liga erros do carregar aos campos', () => {
  const arq = caminho('Ruim')
  const texto = serializar({ titulo: 'curto', status: 'publicado', publicado: '2999-01-01', tags: ['nao-existe'] }, 'Resultado garantido.\n\n# h1')
  const r = carregar({ ...Object.fromEntries(['content/_schemas/post.schema.json', 'content/_schemas/taxonomia.schema.json', 'content/_schemas/autores.schema.json', 'content/taxonomia.json', 'content/autores.json', 'content/termos-vetados.json'].map((a) => [a, ler(a)])), [arq]: texto }, '2026-01-01')
  const c = classificar(r.erros, arq, props, frontmatter(texto).corpoLinha)
  const campos = new Set(c.map((e) => e.campo))
  for (const k of ['slug', 'titulo', 'publicado', 'tags', 'descricao', 'corpo', 'termos_liberados']) assert.ok(campos.has(k), k)
  assert.ok(c.some((e) => e.campo === 'corpo' && e.msg.startsWith('linha 3:')))
})

test('montarDados: quebra de linha em campo de texto vira espaço', () => {
  const props = { titulo: {}, descricao: {} }
  assert.deepEqual(montarDados(props, { titulo: ' A\nB ', descricao: 'x\r\n\ny' }), { titulo: 'A B', descricao: 'x y' })
})

test('carregar acusa link para post inexistente, e classificar liga ao texto', () => {
  const arquivos = Object.fromEntries(fs.readdirSync('content', { recursive: true }).filter((a) => /\.(md|json)$/.test(a)).map((a) => [`content/${a}`, ler(`content/${a}`)]))
  const arq = 'content/blog/pixel-perde-conversoes.md'
  arquivos[arq] += '\n\nVeja [isto](/blog/nao-existe) e [aquilo](/blog/meta-capi-para-clinicas).\n'
  const { erros } = carregar(arquivos)
  assert.deepEqual(erros, [`${arq}: link para /blog/nao-existe, que não é um post publicado`])
  assert.equal(classificar(erros, arq, props, 10)[0].campo, 'corpo')
})

test('carregar: case de cliente exige autorização e período; projeto não promete resultado', () => {
  const arquivos = Object.fromEntries(fs.readdirSync('content', { recursive: true }).filter((a) => /\.(md|json)$/.test(a)).map((a) => [`content/${a}`, ler(`content/${a}`)]))
  const arq = 'content/projetos/tradi.json'
  const p = JSON.parse(arquivos[arq])
  delete p.autorizacao_cliente
  delete p.periodo
  p.resumo += ' Resultado garantido.'
  arquivos[arq] = JSON.stringify(p)
  const msgs = carregar(arquivos).erros.filter((e) => e.startsWith(arq)).map((e) => e.slice(arq.length + 2))
  assert.deepEqual(msgs, ['case de cliente exige cliente e autorizacao_cliente', 'resultados exigem periodo', 'usa "garantido", que pode soar como promessa de resultado. Reescreva'])
})

test('tintaDe escolhe o texto de maior contraste sobre a capa', () => {
  assert.deepEqual(['#b42318', '#6b21a8', '#ffc300', '#ffffff', '#000000'].map(tintaDe), ['#fff', '#fff', '#151517', '#151517', '#fff'])
})

test('carregar: número do infográfico precisa estar em resultados', () => {
  const arquivos = Object.fromEntries(fs.readdirSync('content', { recursive: true }).filter((a) => /\.(md|json)$/.test(a)).map((a) => [`content/${a}`, ler(`content/${a}`)]))
  const arq = 'content/projetos/tradi.json'
  const p = JSON.parse(arquivos[arq])
  p.infografico.resultado = '+99% de faturamento em 24 dias'
  arquivos[arq] = JSON.stringify(p)
  assert.deepEqual(carregar(arquivos).erros, [`${arq} infografico.resultado: "+99%" não está em resultados`])
})

test('carregar: gráfico do case não aceita valor em reais nem negativo', () => {
  const arquivos = Object.fromEntries(fs.readdirSync('content', { recursive: true }).filter((a) => /\.(md|json)$/.test(a)).map((a) => [`content/${a}`, ler(`content/${a}`)]))
  const arq = 'content/projetos/tradi.json'
  const p = JSON.parse(arquivos[arq])
  p.grafico.nota = 'Faturamento de R$10.000 = 100. Fonte: Saipos.'
  p.grafico.barras[0].valor = -1
  arquivos[arq] = JSON.stringify(p)
  assert.deepEqual(carregar(arquivos).erros, [`${arq} grafico: use índice, sem valor em reais`, `${arq} grafico.barras: valor negativo`])
})

test('carregar: autores precisam existir; post sem autores dá erro em vez de quebrar', () => {
  const arquivos = Object.fromEntries(fs.readdirSync('content', { recursive: true }).filter((a) => /\.(md|json)$/.test(a)).map((a) => [`content/${a}`, ler(`content/${a}`)]))
  const arq = 'content/blog/pixel-perde-conversoes.md'
  arquivos[arq] = arquivos[arq].replace('autores: [rdg]', 'autores: [rdg, ninguem]')
  assert.match(carregar(arquivos).erros.join('\n'), /autores\[1\]: "ninguem" não existe/)
  const ok = carregar(Object.fromEntries(Object.entries(arquivos).map(([k, v]) => [k, k === arq ? v.replace('autores: [rdg, ninguem]', 'autores: [rdg, luiza]') : v])))
  assert.deepEqual(ok.posts.find((p) => p.slug === 'pixel-perde-conversoes').autores.map((a) => a.nome), ['Equipe RDG Developers', 'Luiza Silva'])
})
