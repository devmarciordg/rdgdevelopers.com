import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import CaseCard from '../components/CaseCard.jsx'
import { breadcrumb, colecao } from '../schema.js'
import { projetos } from '../conteudo/index.js'

const titulo = 'Cases de clientes'
const descricao = 'Cases de clientes da RDG Developers em tráfego pago para delivery e em e-commerce: o problema, o que foi feito e o resultado de cada um.'

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
        titulo="Cases de clientes"
        sub="Publicados com autorização de cada cliente. Em cada case: o problema, o que a gente fez e o que aprendeu."
      />
      <section className="secao sem-numero" aria-labelledby="cases-titulo">
        <div className="wrap">
          <h2 id="cases-titulo" className="sr-only">Todos os cases</h2>
          {projetos.length > 0 ? (
            <>
              <p className="cases-contagem">{projetos.length === 1 ? '1 case' : `${projetos.length} cases`}</p>
              <ul className="grade cases">{projetos.map((p) => <CaseCard key={p.id} p={p} />)}</ul>
            </>
          ) : (
            <p className="secao-sub">Os cases entram aqui assim que cada cliente autoriza. Enquanto isso, <a href="/diagnostico">peça um diagnóstico</a>.</p>
          )}
        </div>
      </section>
    </>
  )
}
