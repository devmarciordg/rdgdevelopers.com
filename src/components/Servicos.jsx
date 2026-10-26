import Icone from './Icone.jsx'
import { servicos } from '../servicos.js'
import '../styles/servicos.css'

export default function Servicos() {
  return (
    <section className="secao" id="servicos" aria-labelledby="servicos-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">Serviços</span>
          <h2 id="servicos-titulo">O que a gente faz</h2>
          <p className="secao-sub">Cada serviço resolve uma parte do caminho até o cliente. Você contrata só o que faz sentido para o seu negócio.</p>
        </div>

        <ul className="grade servicos-grade">
          {servicos.map((s) => (
            <li key={s.href}>
              <a className="card servico" href={s.href}>
                <span className="card-icone"><Icone nome={s.icone} /></span>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
                <span className="servico-mais">Saiba mais <Icone nome="seta" tamanho={16} /></span>
              </a>
            </li>
          ))}
        </ul>

        <a className="servicos-manutencao" href="/manutencao">
          <span>
            <span className="label">Depois da entrega</span>
            <strong>Planos de manutenção mensal com hospedagem, backup e monitoramento</strong>
          </span>
          <Icone nome="seta" />
        </a>
      </div>
    </section>
  )
}
