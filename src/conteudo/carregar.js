// Lê content/, valida tudo e calcula o que nunca é digitado (rota, leitura, sumário, relacionados).
// Função pura: recebe { 'content/...': texto }. Usada pelo build (via import.meta.glob) e por npm run validar (via fs).
import { frontmatter } from './frontmatter.js'
import { md } from './md.js'
import { validar } from './validar.js'
import { servicos } from '../servicos.js'

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const PALAVRAS_POR_MINUTO = 200
// Tag com menos posts que isso (ou sem descrição) aparece como texto, sem página própria: evita página rala
export const MIN_POSTS_TAG = 2

// Luminância relativa WCAG de um hex #rrggbb, para escolher texto preto ou branco sobre a capa
const luz = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  .reduce((t, c, i) => t + c * [0.2126, 0.7152, 0.0722][i], 0)
export const tintaDe = (hex) => ((luz(hex) + 0.05) / 0.05 > 1.05 / (luz(hex) + 0.05) ? '#151517' : '#fff')

const nomeDe = (arq) => arq.split('/').pop().replace(/\.(md|json)$/, '')
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function carregar(arquivos, hoje = new Date().toISOString().slice(0, 10)) {
  const erros = []
  const avisos = []
  const json = (arq) => {
    try { return JSON.parse(arquivos[arq]) } catch (e) { erros.push(`${arq}: JSON inválido (${e.message})`); return undefined }
  }
  const schema = (nome) => JSON.parse(arquivos[`content/_schemas/${nome}.schema.json`])
  const checar = (arq, valor, nomeSchema, linhaDe = () => '') => {
    for (const e of validar(valor, schema(nomeSchema))) erros.push(`${arq}${linhaDe(e.caminho)} ${e.caminho}: ${e.msg}`)
  }

  const taxonomia = json('content/taxonomia.json') ?? { temas: [], tags: [] }
  checar('content/taxonomia.json', taxonomia, 'taxonomia')
  const autores = json('content/autores.json') ?? []
  checar('content/autores.json', autores, 'autores')
  const vetados = (json('content/termos-vetados.json')?.termos ?? []).map(semAcento)

  const temaPor = new Map(taxonomia.temas.map((t) => [t.slug, { ...t, rota: `/blog/tema/${t.slug}`, posts: [] }]))
  const tagPor = new Map(taxonomia.tags.map((t) => [t.slug, { ...t, rota: null, posts: [] }]))
  const autorPor = new Map(autores.map((a) => [a.slug, a]))
  for (const lista of [taxonomia.temas, taxonomia.tags]) {
    const vistos = new Set()
    for (const t of lista) {
      if (vistos.has(t.slug)) erros.push(`content/taxonomia.json: slug "${t.slug}" repetido`)
      vistos.add(t.slug)
    }
  }

  // Promessa de resultado (CDC art. 37, CONAR): termos de content/termos-vetados.json, palavra inteira ("dado melhor" não casa com "o melhor")
  const usaVetado = (texto) => vetados.filter((t) => new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`).test(semAcento(texto)))

  // Posts
  const todos = []
  for (const arq of Object.keys(arquivos).filter((a) => /^content\/blog\/[^/]+\.md$/.test(a)).sort()) {
    const slug = nomeDe(arq)
    const fm = frontmatter(arquivos[arq])
    const linha = (campo) => (fm.linhas[campo.split(/[.[]/)[0]] ? `:${fm.linhas[campo.split(/[.[]/)[0]]}` : '')
    const erro = (campo, msg) => erros.push(`${arq}${linha(campo)} ${campo}: ${msg}`)
    fm.erros.forEach((e) => erros.push(`${arq}:${e.linha} ${e.msg}`))
    if (!SLUG.test(slug) || slug.length > 60) erros.push(`${arq}: nome do arquivo deve ser um slug (minúsculas, números e hífens, até 60)`)
    const d = fm.dados
    checar(arq, d, 'post', linha)

    const corpo = md(fm.corpo, fm.corpoLinha)
    corpo.erros.forEach((e) => erros.push(`${arq}:${e.linha} ${e.msg}`))
    if (!corpo.html) erros.push(`${arq}: o texto do post está vazio`)

    if (d.titulo?.length > 60) avisos.push(`${arq}${linha('titulo')} titulo: ${d.titulo.length} caracteres; acima de 60 o Google pode cortar`)
    if (d.descricao && (d.descricao.length < 70 || d.descricao.length > 160)) avisos.push(`${arq}${linha('descricao')} descricao: ${d.descricao.length} caracteres; o ideal é entre 70 e 160`)
    if (d.publicado > hoje) erro('publicado', `${d.publicado} é uma data futura`)
    if (d.atualizado && d.publicado && d.atualizado < d.publicado) erro('atualizado', 'é anterior à data de publicação')
    if (d.atualizado > hoje) erro('atualizado', `${d.atualizado} é uma data futura`)
    ;(Array.isArray(d.autores) ? d.autores : []).forEach((a, i) => { if (!autorPor.has(a)) erro(`autores[${i}]`, `"${a}" não existe em content/autores.json`) })
    if (d.tema && !temaPor.has(d.tema)) erro('tema', `"${d.tema}" não existe em content/taxonomia.json`)
    ;(Array.isArray(d.tags) ? d.tags : []).forEach((t, i) => { if (!tagPor.has(t)) erro(`tags[${i}]`, `"${t}" não existe em content/taxonomia.json`) })
    if (d.cliente_citado && !d.autorizacao_cliente) erro('autorizacao_cliente', 'obrigatório quando o post cita um cliente')

    // Bloqueia, salvo liberação explícita e visível no diff
    const liberados = (d.termos_liberados ?? []).map(semAcento)
    for (const t of usaVetado(`${d.titulo} ${d.descricao} ${corpo.html.replace(/<[^>]+>/g, ' ')}`)) {
      if (!liberados.includes(t)) erros.push(`${arq}: usa "${t}", que pode soar como promessa de resultado. Reescreva ou, se o contexto não promete nada, adicione em termos_liberados`)
    }
    liberados.forEach((t) => { if (!vetados.includes(t)) erro('termos_liberados', `"${t}" não está em content/termos-vetados.json`) })

    todos.push({ ...d, slug, rota: `/blog/${slug}`, ...corpo, leitura: Math.max(1, Math.ceil(corpo.palavras / PALAVRAS_POR_MINUTO)) })
  }

  const posts = todos.filter((p) => p.status === 'publicado').sort((a, b) => b.publicado.localeCompare(a.publicado) || a.titulo.localeCompare(b.titulo))
  const postPor = new Map(posts.map((p) => [p.slug, p]))

  // Link para post que não existe ou é rascunho quebraria o build no prerender: acusa aqui, com o arquivo, para o painel mostrar antes do commit
  for (const p of posts) {
    for (const [, s] of p.html.matchAll(/href="\/blog\/([a-z0-9-]+)[#"]/g)) {
      if (!postPor.has(s)) erros.push(`content/blog/${p.slug}.md: link para /blog/${s}, que não é um post publicado`)
    }
  }

  for (const p of todos) {
    for (const r of p.relacionados ?? []) {
      if (r === p.slug || !postPor.has(r)) erros.push(`content/blog/${p.slug}.md relacionados: "${r}" não é outro post publicado`)
    }
  }

  // Liga referências e calcula páginas de tema e tag
  for (const p of posts) {
    p.autores = (p.autores ?? []).map((a) => autorPor.get(a)).filter(Boolean)
    p.tema = temaPor.get(p.tema)
    p.tags = p.tags.map((t) => tagPor.get(t)).filter(Boolean)
    p.tema?.posts.push(p)
    p.tags.forEach((t) => t.posts.push(p))
  }
  for (const t of tagPor.values()) if (t.posts.length >= MIN_POSTS_TAG && t.descricao) t.rota = `/blog/tag/${t.slug}`

  // Leia também: os escolhidos à mão primeiro, depois tags em comum, mesmo tema e mais recente
  for (const p of posts) {
    const manuais = (p.relacionados ?? []).map((s) => postPor.get(s)).filter(Boolean)
    const nota = (o) => o.tags.filter((t) => p.tags.includes(t)).length * 2 + (o.tema === p.tema ? 1 : 0)
    const resto = posts.filter((o) => o !== p && !manuais.includes(o)).sort((a, b) => nota(b) - nota(a))
    p.relacionados = [...manuais, ...resto].slice(0, 3)
  }

  // Projetos
  const projetos = []
  for (const arq of Object.keys(arquivos).filter((a) => /^content\/projetos\/[^/]+\.json$/.test(a))) {
    const p = json(arq)
    if (!p) continue
    checar(arq, p, 'projeto')
    if (!SLUG.test(nomeDe(arq))) erros.push(`${arq}: nome do arquivo deve ser um slug`)
    const caso = p.tipo === 'Case de cliente'
    if (caso && !(p.cliente && p.autorizacao_cliente)) erros.push(`${arq}: case de cliente exige cliente e autorizacao_cliente`)
    if (!caso && (p.cliente || p.resultados)) erros.push(`${arq}: cliente e resultados só valem em tipo "Case de cliente"`)
    if (p.resultados?.length && !p.periodo) erros.push(`${arq}: resultados exigem periodo`)
    if (caso && p.status === 'publicado' && !(p.capa && p.servicos && p.segmento && p.infografico)) erros.push(`${arq}: case publicado exige capa, servicos, segmento e infografico`)
    // Número do infográfico fora de resultados escaparia do aviso e da conferência de período
    const valor = p.infografico?.valor ?? ''
    if (/\d/.test(valor) && !p.resultados?.some((r) => r.valor === valor)) erros.push(`${arq} infografico.valor: "${valor}" não está em resultados`)
    // Gráfico público: índice, nunca valor em reais do cliente
    if (p.grafico && /R\$/.test(JSON.stringify(p.grafico))) erros.push(`${arq} grafico: use índice, sem valor em reais`)
    if (p.grafico?.barras.some((b) => b.valor < 0)) erros.push(`${arq} grafico.barras: valor negativo`)
    for (const n of p.infografico?.resultado.match(/[+-]?\d[\d,]*(%|x\b| vezes)/g) ?? []) {
      if (!p.resultados?.some((r) => r.valor === n)) erros.push(`${arq} infografico.resultado: "${n}" não está em resultados`)
    }
    if (caso && /falta registrar/i.test(p.autorizacao_cliente ?? '')) avisos.push(`${arq} autorizacao_cliente: registre onde está o documento de autorização`)
    const servicosDe = (p.servicos ?? []).map((s) => {
      const achado = servicos.find((x) => x.icone === s)
      if (!achado) erros.push(`${arq} servicos: "${s}" não existe em src/servicos.js`)
      return achado
    }).filter(Boolean)
    for (const t of usaVetado(JSON.stringify(p))) erros.push(`${arq}: usa "${t}", que pode soar como promessa de resultado. Reescreva`)
    if (p.status === 'publicado') {
      projetos.push({ ...p, id: nomeDe(arq), rota: `/projetos/${nomeDe(arq)}`, servicos: servicosDe, capa: p.capa && { ...p.capa, tinta: tintaDe(p.capa.cor) } })
    }
  }
  projetos.sort((a, b) => a.ordem - b.ordem)
  // Outros cases: primeiro os que dividem serviço, depois a ordem
  for (const p of projetos) {
    const comum = (o) => o.servicos.filter((s) => p.servicos.includes(s)).length
    p.outros = projetos.filter((o) => o !== p).sort((a, b) => comum(b) - comum(a) || a.ordem - b.ordem).slice(0, 2)
  }

  return {
    posts,
    temas: [...temaPor.values()],
    tags: [...tagPor.values()],
    autores,
    projetos,
    erros,
    avisos,
  }
}
