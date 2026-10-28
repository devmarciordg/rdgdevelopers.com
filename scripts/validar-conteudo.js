// npm run validar: confere content/ sem rodar o Vite. O painel admin pode chamar antes de gravar.
import fs from 'node:fs'
import path from 'node:path'
import { carregar } from '../src/conteudo/carregar.js'

const arquivos = {}
for (const f of fs.readdirSync('content', { recursive: true })) {
  const arq = path.join('content', f).split(path.sep).join('/')
  if (/\.(md|json)$/.test(arq)) arquivos[arq] = fs.readFileSync(arq, 'utf8')
}
const { posts, projetos, erros, avisos } = carregar(arquivos)
for (const a of avisos) console.warn(`aviso: ${a}`)
for (const e of erros) console.error(`erro: ${e}`)
console.log(`${posts.length} posts e ${projetos.length} projetos publicados, ${erros.length} erros, ${avisos.length} avisos`)
if (erros.length) process.exitCode = 1
