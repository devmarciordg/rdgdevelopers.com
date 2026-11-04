// npm test (node:test, sem dependência)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { carregar } from './carregar.js'
import { casa, contar, opcoes } from './filtros.js'
import { md } from './md.js'
import { frontmatter, serializar } from './frontmatter.js'
import { validar } from './validar.js'

test('md: blocos e inline do subconjunto', () => {
  const r = md('## Título\n\nTexto **forte**, *leve*, `x<y` e [link](/a) e [fora](https://b.c).\n\n- um\n  continua\n- dois\n\n1. a\n2. b\n\n> citação\n\n```json\n{"a": "<b>"}\n```')
  assert.equal(r.erros.length, 0)
  assert.match(r.html, /^<h2 id="titulo">Título<\/h2>/)
  assert.match(r.html, /<strong>forte<\/strong>, <em>leve<\/em>, <code>x&lt;y<\/code>/)
  assert.match(r.html, /<a href="\/a">link<\/a> e <a href="https:\/\/b.c" rel="noopener">fora<\/a>/)
  assert.match(r.html, /<ul><li>um continua<\/li><li>dois<\/li><\/ul><ol><li>a<\/li><li>b<\/li><\/ol>/)
  assert.match(r.html, /<blockquote><p>citação<\/p><\/blockquote>/)
  assert.match(r.html, /<pre data-lang="json"><code>\{&quot;a&quot;: &quot;&lt;b&gt;&quot;\}<\/code><\/pre>/)
  assert.deepEqual(r.titulos, [{ nivel: 2, id: 'titulo', texto: 'Título' }])
})

test('md: destaques e ids únicos', () => {
  const r = md(':::aviso\nCuidado com **isso**.\n:::\n\n## A\n\n## A')
  assert.equal(r.erros.length, 0)
  assert.match(r.html, /^<aside class="destaque destaque-aviso"><p class="destaque-titulo">Atenção<\/p><p>Cuidado com <strong>isso<\/strong>.<\/p><\/aside>/)
  assert.deepEqual(r.titulos.map((t) => t.id), ['a', 'a-2'])
})

test('md: rejeita o que o site não estiliza, com linha', () => {
  const erros = (s) => md(s, 10).erros.map((e) => `${e.linha} ${e.msg.split(' ')[0]}`)
  assert.deepEqual(erros('# H1'), ['10 título'])
  assert.deepEqual(erros('texto\n\n### pulo'), ['12 ###'])
  assert.deepEqual(erros('<script>x</script>'), ['10 HTML'])
  assert.deepEqual(erros('[x](javascript:alert(1))'), ['10 link'])
  assert.deepEqual(erros(':::perigo\nx\n:::'), ['10 destaque'])
  assert.deepEqual(erros('```\nsem fim'), ['10 bloco'])
  assert.equal(md('<b>x</b> e "aspas"').html.includes('<b>'), false)
})

test('frontmatter: lê, aponta linha e volta ao mesmo formato', () => {
  const fonte = '---\ntitulo: Meta CAPI: guia\ntags: [a, b]\nrascunho: true\n---\n\nCorpo'
  const r = frontmatter(fonte)
  assert.deepEqual(r.dados, { titulo: 'Meta CAPI: guia', tags: ['a', 'b'], rascunho: true })
  assert.equal(r.linhas.tags, 3)
  assert.equal(r.corpo.trim(), 'Corpo')
  assert.deepEqual(frontmatter(serializar(r.dados, r.corpo)).dados, r.dados)
  assert.equal(frontmatter('---\nchave sem dois pontos\n---').erros[0].linha, 2)
})

test('validar: subconjunto de JSON Schema', () => {
  const s = {
    type: 'object', additionalProperties: false, required: ['a', 'd'],
    properties: { a: { type: 'string', maxLength: 3 }, d: { type: 'string', format: 'date' }, t: { type: 'array', maxItems: 1, uniqueItems: true, items: { enum: ['x'] } } },
  }
  assert.deepEqual(validar({ a: 'ok', d: '2026-10-26' }, s), [])
  const e = validar({ a: 'longo', d: '2026-02-30', t: ['x', 'x', 'y'], z: 1 }, s).map((x) => x.caminho)
  assert.deepEqual(e.sort(), ['a', 'd', 't', 't', 't[2]', 'z'])
})

test('md: // e /\\ não contam como link interno; destaque só os do site', () => {
  for (const u of ['//evil.com', '/\\evil.com']) assert.equal(md(`[x](${u})`).erros.length, 1)
  for (const t of ['constructor', '__proto__', 'toString']) assert.equal(md(`:::${t}\nx\n:::`).erros.length, 1)
})

test('md: imagem em linha própria, com descrição e tamanho no nome', () => {
  const r = md('Texto.\n![Painel do Meta Ads](/blog/img/painel-meta-1200x800.webp "Campanha de setembro")\nMais texto.')
  assert.equal(r.erros.length, 0)
  assert.match(r.html, /<p>Texto.<\/p><figure><img src="\/blog\/img\/painel-meta-1200x800.webp" alt="Painel do Meta Ads" width="1200" height="800" loading="lazy" decoding="async"><figcaption>Campanha de setembro<\/figcaption><\/figure><p>Mais texto.<\/p>/)
  assert.deepEqual(r.imagens, ['/blog/img/painel-meta-1200x800.webp'])
  const erro = (s) => md(s).erros.map((e) => e.msg.split(' ')[0])
  assert.deepEqual(erro('![](/blog/img/a-10x10.webp)'), ['imagem'])
  assert.deepEqual(erro('![x](https://evil.com/a-10x10.webp)'), ['imagem'])
  assert.deepEqual(erro('![x](/blog/img/sem-tamanho.webp)'), ['imagem'])
  assert.deepEqual(erro('veja ![x](/blog/img/a-10x10.webp) aqui'), ['imagem'])
  assert.equal(md('![a" onerror="x](/blog/img/a-10x10.webp)').html.includes('onerror="'), false)
})

test('projetos: case de estudo fica junto, sem se passar por cliente', () => {
  const arquivos = {}
  for (const nome of ['content/taxonomia.json', 'content/autores.json', 'content/termos-vetados.json', ...readdirSync('content/_schemas').map((a) => `content/_schemas/${a}`), ...readdirSync('content/projetos').map((a) => `content/projetos/${a}`)]) {
    arquivos[nome] = readFileSync(nome, 'utf8')
  }
  const { projetos } = carregar(arquivos)
  const estudo = projetos.find((p) => p.id === 'apex-contabilidade')
  assert.equal(estudo.cliente, undefined) // sem cliente, o card mostra a tag
  assert.equal(estudo.destaque_home, false) // a home diz "Resultados de clientes"
  assert.equal(estudo.outros.length, 2)
})

test('filtros: combina facetas, aceita mais de um serviço e conta sem a própria faceta', () => {
  const cards = [
    { servico: 'Sites|Tráfego pago', setor: 'Saúde', nicho: 'Clínica', tipo: 'Cliente' },
    { servico: 'Tráfego pago', setor: 'Alimentação', nicho: 'Delivery', tipo: 'Cliente' },
    { servico: 'Sites', setor: 'Alimentação', nicho: 'Sorveteria', tipo: 'Case de estudo' },
  ]
  assert.equal(casa(cards[0], { servico: 'Sites' }), true)
  assert.equal(casa(cards[1], { servico: 'Sites' }), false)
  assert.equal(casa(cards[2], { servico: 'Sites', setor: 'Saúde' }), false)
  assert.equal(casa(cards[2], {}), true)
  assert.equal(contar(cards, { setor: 'Alimentação' }, 'servico', 'Sites'), 1)
  assert.equal(contar(cards, { setor: 'Alimentação' }, 'setor', 'Saúde'), 1) // troca a faceta, não soma
  assert.deepEqual(opcoes(cards, 'servico'), ['Sites', 'Tráfego pago'])
})
