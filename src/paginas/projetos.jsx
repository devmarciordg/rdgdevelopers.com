import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import CaseCard from '../components/CaseCard.jsx'
import { breadcrumb, colecao } from '../schema.js'
import { projetos } from '../conteudo/index.js'
import { contar, FACETAS, opcoes, valoresDoCase } from '../conteudo/filtros.js'

const estudos = projetos.filter((p) => !p.cliente).length
const clientes = projetos.length - estudos
const titulo = 'Cases'
const descricao = 'Cases da RDG Developers em tráfego pago para delivery e em e-commerce, e cases de estudo: o problema, o que foi feito e o que aprendemos.'

const cards = projetos.map(valoresDoCase)

// Oculta no HTML: a ilha islands/filtros.js mostra. Sem JS, todos os cases aparecem e não há controle que não funciona
function Filtros() {
  const facetas = FACETAS.filter(([k]) => opcoes(cards, k).length > 1)
  return (
    <form className="filtros" data-filtros hidden aria-label="Filtrar cases">
      <div className="filtros-grade">
        {facetas.map(([k, rotulo]) => (
          <div key={k}>
            <label htmlFor={`filtro-${k}`}>{rotulo}</label>
            <div className="filtros-sel">
              <select id={`filtro-${k}`} name={k} defaultValue="">
                <option value="">Todos</option>
                {opcoes(cards, k).map((v) => <option key={v} value={v}>{v} ({contar(cards, {}, k, v)})</option>)}
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
        ))}
      </div>
      <div className="filtros-ativos" data-filtros-ativos></div>
    </form>
  )
}

export const meta = {
  titulo: `Projetos: ${titulo.toLowerCase()}`,
  descricao,
  schema: [colecao({ titulo, descricao, rota: '/projetos', posts: projetos }), breadcrumb([['Projetos', '/projetos']])],
}

export default function Projetos() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Projetos']]}
        rotulo="Projetos"
        titulo="Cases"
        sub="Cases de clientes publicados com autorização de cada um. A tag “Case de estudo” marca projeto da RDG com empresa fictícia, sem cliente nem resultado real."
      />
      <section className="secao sem-numero" aria-labelledby="cases-titulo">
        <div className="wrap">
          <h2 id="cases-titulo" className="sr-only">Todos os cases</h2>
          {projetos.length > 0 ? (
            <>
              <Filtros />
              <p className="cases-contagem" role="status" data-filtros-status>{clientes === 1 ? '1 case de cliente' : `${clientes} cases de clientes`}{estudos > 0 && ` e ${estudos === 1 ? '1 case de estudo' : `${estudos} cases de estudo`}`}</p>
              <ul className="grade cases" data-filtros-grade>{projetos.map((p) => <CaseCard key={p.id} p={p} />)}</ul>
              <p className="secao-sub" data-filtros-vazio hidden>Nenhum case com esses filtros. <button className="link-limpar" type="button">Limpar filtros</button></p>
            </>
          ) : (
            <p className="secao-sub">Os cases entram aqui assim que cada cliente autoriza. Enquanto isso, <a href="/diagnostico">peça um diagnóstico</a>.</p>
          )}
        </div>
      </section>
    </>
  )
}
