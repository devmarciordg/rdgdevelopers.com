import { empresa } from '../empresa.js'
import '../styles/manutencao.css'

// selo: critério de uso, nunca popularidade (a RDG não publica dados de venda)
const planos = [
  { horas: 2, paraQuem: 'Site institucional que muda pouco.' },
  { horas: 4, paraQuem: 'Site com atualizações frequentes.', selo: 'Indicado para quem atualiza o site todo mês' },
  { horas: 6, paraQuem: 'Site com landing pages e ajustes de campanha.' },
]
const MAX = 6
const inclusos = ['Hospedagem', 'Backup', 'Monitoramento', 'Atendimento de segunda a sexta, das 9h às 17h']

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export default function Manutencao() {
  return (
    <section className="secao" id="manutencao" aria-labelledby="manutencao-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">Manutenção mensal</span>
          <h2 id="manutencao-titulo">Planos de manutenção por horas de trabalho</h2>
          <p className="secao-sub">
            Três planos fixos mensais. Todos incluem hospedagem, backup e monitoramento.
            O valor a gente passa na proposta.
          </p>
        </div>

        <ul className="grade planos">
          {planos.map((p) => (
            <li className={p.selo ? 'card plano plano-destaque' : 'card plano'} key={p.horas}>
              <span className="plano-horas" aria-hidden="true">{p.horas} h</span>
              {/* Barra de horas: cada segmento é 1 hora; o número já está no título */}
              <span className="plano-barra" aria-hidden="true">
                {Array.from({ length: MAX }, (_, i) => <i key={i} className={i < p.horas ? 'on' : undefined} />)}
              </span>
              <h3>{p.horas} horas por mês</h3>
              <p>{p.paraQuem}</p>
              {p.selo && <span className="plano-selo">{p.selo}</span>}
            </li>
          ))}
        </ul>

        <div className="plano-inclui">
          <h3>Os três planos incluem</h3>
          <ul className="plano-itens">
            {inclusos.map((t) => <li key={t}><Check />{t}</li>)}
          </ul>
        </div>

        <div className="manutencao-acoes">
          <a className="btn" href="/diagnostico">Peça uma proposta</a>
          <a className="btn ghost" href={empresa.whatsappLink} rel="noopener">Falar no WhatsApp</a>
        </div>

        <p className="manutencao-nota">
          Horas não acumulam. Hora excedente cobrada à parte, combinada antes. Condições completas na proposta e no contrato.
        </p>
      </div>
    </section>
  )
}
