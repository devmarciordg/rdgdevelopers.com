import Icone from './Icone.jsx'
import CaseCard from './CaseCard.jsx'
import { projetos as todos } from '../conteudo/index.js'

// Mesma fonte de /projetos (content/projetos). Na home, só o que tem destaque_home
const projetos = todos.filter((p) => p.destaque_home)

export default function Projetos() {
  // Grade vazia seria prova social negativa: sem case, a seção não aparece
  if (!projetos.length) return null
  return (
    <section className="secao fundo-brilho" id="projetos" aria-labelledby="projetos-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">Cases</span>
          <h2 id="projetos-titulo">Resultados de clientes</h2>
          <p className="secao-sub">
            Cases publicados com autorização de cada cliente: o problema, o que a gente fez e o que mudou.
          </p>
        </div>

        <ul className="grade cases">{projetos.map((p) => <CaseCard key={p.id} p={p} />)}</ul>

        {projetos.length < todos.length && (
          <a className="link-seta projetos-todos" href="/projetos">
            Ver todos os cases <Icone nome="seta" tamanho={16} />
          </a>
        )}
      </div>
    </section>
  )
}
