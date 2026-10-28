// Frontmatter YAML restrito, sem biblioteca: só `chave: valor` numa linha.
// Valor: texto (aspas opcionais), true/false ou lista inline [a, b]. Fora disso, erro com linha.

const valor = (bruto) => {
  const v = bruto.trim()
  if (v === 'true' || v === 'false') return v === 'true'
  if (v.startsWith('[')) {
    if (!v.endsWith(']')) return undefined
    const dentro = v.slice(1, -1).trim()
    return dentro ? dentro.split(',').map((x) => texto(x.trim())) : []
  }
  return texto(v)
}
const texto = (v) => (/^".*"$/.test(v) ? v.slice(1, -1).replace(/\\"/g, '"') : v)

/**
 * @returns {{ dados: object, linhas: Record<string, number>, corpo: string, corpoLinha: number, erros: {linha:number,msg:string}[] }}
 */
export function frontmatter(fonte) {
  const l = fonte.replace(/\r\n?/g, '\n').split('\n')
  const erros = []
  if (l[0] !== '---') return { dados: {}, linhas: {}, corpo: fonte, corpoLinha: 1, erros: [{ linha: 1, msg: 'o arquivo precisa começar com --- (frontmatter)' }] }
  const fim = l.indexOf('---', 1)
  if (fim < 0) return { dados: {}, linhas: {}, corpo: '', corpoLinha: 1, erros: [{ linha: 1, msg: 'frontmatter sem --- de fechamento' }] }

  const dados = {}
  const linhas = {}
  for (let i = 1; i < fim; i++) {
    if (!l[i].trim() || l[i].trim().startsWith('#')) continue
    const m = l[i].match(/^([a-z_]+):(.*)$/)
    const v = m && valor(m[2])
    if (!m || v === undefined || v === '') { erros.push({ linha: i + 1, msg: `linha inválida no frontmatter: "${l[i]}". Use chave: valor` }); continue }
    if (m[1] in dados) erros.push({ linha: i + 1, msg: `campo "${m[1]}" repetido` })
    dados[m[1]] = v
    linhas[m[1]] = i + 1
  }
  return { dados, linhas, corpo: l.slice(fim + 1).join('\n'), corpoLinha: fim + 2, erros }
}

// Caminho inverso, para o painel gravar no mesmo formato que o build lê
export function serializar(dados, corpo) {
  const v = (x) => (Array.isArray(x) ? `[${x.join(', ')}]` : typeof x === 'boolean' ? String(x) : /^[\s"[]|:\s|\s$/.test(x) ? `"${x.replace(/"/g, '\\"')}"` : x)
  return `---\n${Object.entries(dados).map(([k, x]) => `${k}: ${v(x)}`).join('\n')}\n---\n\n${corpo.trim()}\n`
}
