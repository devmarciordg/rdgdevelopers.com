import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import Icone from '../components/Icone.jsx'
import { empresa } from '../empresa.js'
import { breadcrumb } from '../schema.js'
import '../styles/pg-sobre.css'

export const meta = {
  titulo: 'Programa de indicação',
  descricao: 'Indique um cliente para a RDG Developers e receba 10% de comissão quando ele fechar contrato e pagar. Veja como funciona e leia o regulamento.',
  schema: [breadcrumb([['Programa de indicação', '/indicacao']])],
}

const comissoes = [
  { titulo: 'Projeto pontual', texto: '10% do valor total do projeto fechado pelo cliente indicado.' },
  { titulo: 'Serviço recorrente', texto: '10% de cada uma das 3 primeiras mensalidades pagas pelo cliente indicado.' },
  { titulo: 'Quando você recebe', texto: 'Só depois que a RDG receber do cliente indicado. Se houver estorno ou cancelamento com devolução, a comissão é devolvida.' },
]

export default function Indicacao() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Programa de indicação']]}
        rotulo="Indicação"
        titulo="Indicou, fechou, você recebe"
        sub="Conhece alguém que precisa de site, tráfego pago, automação ou software sob medida? Passe o contato para a gente e receba uma comissão se ele fechar contrato."
      >
        <p className="pg-sobre-cta">
          <a className="btn" href={empresa.whatsappLink} target="_blank" rel="noopener">
            Indicar pelo WhatsApp
            <Icone nome="seta" tamanho={16} />
          </a>
          <a className="btn ghost" href="#regulamento">Ler o regulamento</a>
        </p>
      </CabecalhoPagina>

      <section className="secao" id="comissao" aria-labelledby="comissao-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Comissão</span>
            <h2 id="comissao-titulo">Quanto e quando</h2>
          </div>
          <ul className="grade">
            {comissoes.map((c) => (
              <li className="card" key={c.titulo}>
                <h3 className="pg-sobre-h3">{c.titulo}</h3>
                <p>{c.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao" id="como-indicar" aria-labelledby="como-indicar-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Como indicar</span>
            <h2 id="como-indicar-titulo">Três passos</h2>
          </div>
          <ol className="passos">
            {[
              ['Peça autorização', 'Confirme com a pessoa indicada que ela aceita ser contatada pela RDG.'],
              ['Mande o contato', 'Fale com a gente pelo WhatsApp com o nome e o contato da pessoa indicada.'],
              ['A gente cuida do resto', 'Fazemos o atendimento. Se ela fechar contrato e pagar, você recebe a comissão.'],
            ].map(([titulo, texto], i) => (
              <li className="passo" key={titulo}>
                <span className="passo-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="secao" id="regulamento" aria-labelledby="regulamento-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Regulamento</span>
            <h2 id="regulamento-titulo">Regras do programa</h2>
            <p className="secao-sub">Vigente a partir de 26/10/2026.</p>
          </div>
          <div className="prosa">
            <ol>
              <li>
                <strong>Indicação válida.</strong> É válida a indicação de um contato que ainda não estava em
                negociação com a RDG Developers e que fecha contrato com a gente.
              </li>
              <li>
                <strong>Comissão.</strong> Em projeto pontual, a comissão é de 10% do valor total do projeto.
                Em serviço recorrente, é de 10% de cada uma das 3 primeiras mensalidades.
              </li>
              <li>
                <strong>Pagamento.</strong> A comissão só é paga depois que a RDG receber do cliente indicado.
                O pagamento é feito mediante recibo ou documento fiscal, conforme a legislação.
              </li>
              <li>
                <strong>Estorno e cancelamento.</strong> Se houver estorno ou cancelamento com devolução de
                valores ao cliente indicado, a comissão correspondente deve ser devolvida.
              </li>
              <li>
                <strong>Consentimento do indicado.</strong> A pessoa indicada precisa concordar em ser contatada.
                Você só passa o contato dela com a autorização dela, conforme a Lei Geral de Proteção de Dados (LGPD).
              </li>
              <li>
                <strong>Conduta.</strong> É proibido fazer spam ou prometer resultados em nome da RDG Developers.
              </li>
              <li>
                <strong>Sem vínculo.</strong> Participar do programa não cria vínculo empregatício nem sociedade
                com a RDG Developers.
              </li>
              <li>
                <strong>Alterações.</strong> A RDG pode atualizar este regulamento. Vale a versão vigente na data
                da indicação.
              </li>
              <li>
                <strong>Dúvidas.</strong> Escreva para <a href={`mailto:${empresa.email}`}>{empresa.email}</a>.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
