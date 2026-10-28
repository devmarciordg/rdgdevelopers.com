// Markdown de subconjunto -> HTML, só no build (e no preview do futuro painel).
// Aceita só o que o CSS de .prosa estiliza; o resto vira erro com linha, nunca HTML solto.
// Blocos: ## e ### (h1 vem do título), parágrafo, lista - e 1. (um nível), > citação,
// cerca ``` com linguagem opcional, :::nota / :::aviso / :::dica ... ::: (destaques) e imagem numa linha só:
// ![descrição](/blog/img/nome-LxA.webp "legenda"). Largura e altura vêm do nome do arquivo (CLS 0 sem ler a imagem).
// Inline: **negrito**, *itálico*, `código`, [texto](url).

export const DESTAQUES = { nota: 'Nota', aviso: 'Atenção', dica: 'Dica' }
// Caminho público das imagens do blog (arquivos em public/blog/img)
export const IMAGEM = /^\/blog\/img\/[a-z0-9]+(?:-[a-z0-9]+)*-(\d+)x(\d+)\.(?:webp|avif|png|jpg)$/

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function inline(texto, linha, erros) {
  const codigos = []
  // Código primeiro: nada dentro dele é interpretado
  let s = texto.replace(/`([^`]+)`/g, (_, c) => `\u0000${codigos.push(esc(c)) - 1}\u0000`)
  s = esc(s)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, rotulo, url) => {
    if (/^https:\/\//.test(url)) return `<a href="${url}" rel="noopener">${rotulo}</a>`
    if (/^(#|\/(?![/\\]))/.test(url)) return `<a href="${url}">${rotulo}</a>`
    erros.push({ linha, msg: `link "${url}": use https:// ou um caminho interno começando com /` })
    return rotulo
  })
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
  if (/[*[\]]/.test(s.replace(/<[^>]+>/g, '').replace(/\u0000\d+\u0000/g, ''))) {
    erros.push({ linha, msg: 'marcação inline incompleta (asterisco, colchete ou link sem fechar)' })
  }
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codigos[i]}</code>`)
}

/**
 * @param {string} fonte Markdown
 * @param {number} base número da primeira linha no arquivo (para mensagens de erro)
 * @returns {{ html: string, titulos: {nivel:number,id:string,texto:string}[], imagens: string[], palavras: number, erros: {linha:number,msg:string}[] }}
 */
export function md(fonte, base = 1) {
  const linhas = fonte.replace(/\r\n?/g, '\n').split('\n')
  const erros = []
  const titulos = []
  const imagens = []
  const ids = new Set()
  let ultimoNivel = 1

  function blocos(ini, fim) {
    const out = []
    let i = ini
    while (i < fim) {
      const l = linhas[i]
      const n = base + i
      if (!l.trim()) { i++; continue }

      if (l.startsWith('```')) {
        const lang = l.slice(3).trim()
        const corpo = []
        i++
        while (i < fim && !linhas[i].startsWith('```')) corpo.push(linhas[i++])
        if (i >= fim) erros.push({ linha: n, msg: 'bloco de código sem ``` de fechamento' })
        i++
        out.push(`<pre${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(corpo.join('\n'))}</code></pre>`)
        continue
      }

      if (l.startsWith(':::')) {
        const tipo = l.slice(3).trim()
        let j = i + 1
        while (j < fim && linhas[j].trim() !== ':::') j++
        if (j >= fim) erros.push({ linha: n, msg: `destaque ":::${tipo}" sem ::: de fechamento` })
        if (!Object.hasOwn(DESTAQUES, tipo)) erros.push({ linha: n, msg: `destaque ":::${tipo}" não existe. Use: ${Object.keys(DESTAQUES).join(', ')}` })
        out.push(`<aside class="destaque destaque-${esc(tipo)}"><p class="destaque-titulo">${Object.hasOwn(DESTAQUES, tipo) ? DESTAQUES[tipo] : esc(tipo)}</p>${blocos(i + 1, j)}</aside>`)
        i = j + 1
        continue
      }

      if (l.startsWith('![')) {
        const im = l.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)(?: "([^"]*)")?\)$/)
        const tam = im?.[2].match(IMAGEM)
        if (!im) erros.push({ linha: n, msg: 'imagem: use ![descrição](/blog/img/arquivo-LxA.webp) sozinha na linha' })
        else if (!tam) erros.push({ linha: n, msg: `imagem "${im[2]}": o arquivo precisa estar em /blog/img/ e terminar em -LARGURAxALTURA.webp` })
        else if (!im[1].trim()) erros.push({ linha: n, msg: 'imagem sem descrição: escreva o que ela mostra, para quem usa leitor de tela' })
        else {
          imagens.push(im[2])
          const legenda = im[3] ? `<figcaption>${inline(im[3], n, erros)}</figcaption>` : ''
          out.push(`<figure><img src="${im[2]}" alt="${esc(im[1].trim())}" width="${tam[1]}" height="${tam[2]}" loading="lazy" decoding="async">${legenda}</figure>`)
        }
        i++
        continue
      }

      const t = l.match(/^(#{1,6}) (.+)$/)
      if (t) {
        const nivel = t[1].length
        if (nivel < 2 || nivel > 3) erros.push({ linha: n, msg: `título de nível ${nivel}: use ## ou ### (o título principal vem do campo titulo)` })
        else if (nivel > ultimoNivel + 1) erros.push({ linha: n, msg: '### antes de um ##: a hierarquia de títulos pula um nível' })
        ultimoNivel = nivel
        const texto = t[2].trim()
        let id = slugify(texto)
        for (let k = 2; ids.has(id); k++) id = `${slugify(texto)}-${k}`
        ids.add(id)
        titulos.push({ nivel, id, texto })
        out.push(`<h${nivel} id="${id}">${inline(texto, n, erros)}</h${nivel}>`)
        i++
        continue
      }

      const item = (x) => x.match(/^(-|\d+\.) (.*)$/)
      if (item(l)) {
        const ordenada = l[0] !== '-'
        const itens = []
        while (i < fim && linhas[i].trim()) {
          const m = item(linhas[i])
          if (m) {
            if ((m[1] !== '-') !== ordenada) break
            itens.push([m[2], base + i])
          } else if (/^\s{2,}\S/.test(linhas[i]) && itens.length) {
            itens[itens.length - 1][0] += ' ' + linhas[i].trim()
          } else break
          i++
        }
        const tag = ordenada ? 'ol' : 'ul'
        out.push(`<${tag}>${itens.map(([x, ln]) => `<li>${inline(x, ln, erros)}</li>`).join('')}</${tag}>`)
        continue
      }

      if (l.startsWith('>')) {
        const corpo = []
        while (i < fim && linhas[i].startsWith('>')) corpo.push(linhas[i++].replace(/^> ?/, ''))
        out.push(`<blockquote><p>${inline(corpo.join(' '), n, erros)}</p></blockquote>`)
        continue
      }

      if (/^\s*</.test(l)) erros.push({ linha: n, msg: 'HTML direto não é aceito no texto' })
      if (l.includes('![')) erros.push({ linha: n, msg: 'imagem no meio do texto: deixe a imagem sozinha numa linha' })
      const par = []
      while (i < fim && linhas[i].trim() && !/^(```|:::|#{1,6} |- |\d+\. |>|!\[)/.test(linhas[i])) par.push(linhas[i++].trim())
      out.push(`<p>${inline(par.join(' '), n, erros)}</p>`)
    }
    return out.join('')
  }

  const html = blocos(0, linhas.length)
  const palavras = html.replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return { html, titulos, imagens, palavras, erros }
}
