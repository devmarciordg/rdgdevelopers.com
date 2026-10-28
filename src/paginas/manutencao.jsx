import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import Manutencao from '../components/Manutencao.jsx'
import Icone from '../components/Icone.jsx'
import { empresa } from '../empresa.js'
import { breadcrumb, servico, faq } from '../schema.js'
import '../styles/pg-manutencao.css'

const descricao = 'Planos mensais de 2, 4 ou 6 horas para manter seu site em dia, com hospedagem, backup e monitoramento incluídos. Valores passados na proposta.'

const perguntas = [
  { pergunta: 'As horas acumulam de um mês para o outro?', resposta: 'Não. As horas do plano valem para o mês. O que não for usado não passa para o mês seguinte.' },
  { pergunta: 'O que acontece se passar das horas do plano?', resposta: 'A hora excedente é cobrada à parte e sempre combinada antes. Nada é feito além do plano sem você aprovar.' },
  { pergunta: 'Posso trocar de plano?', resposta: 'Sim. A troca é combinada na renovação, conforme o contrato.' },
  { pergunta: 'A hospedagem está inclusa?', resposta: 'Sim. Os três planos incluem hospedagem, backup e monitoramento de disponibilidade.' },
  { pergunta: 'Quando vocês atendem os pedidos?', resposta: 'De segunda a sexta, das 9h às 17h. Os pedidos chegam por WhatsApp ou e-mail.' },
]

export const meta = {
  titulo: 'Manutenção mensal de sites',
  descricao,
  schema: [
    breadcrumb([['Manutenção mensal', '/manutencao']]),
    servico({ nome: 'Manutenção mensal de sites', descricao, rota: '/manutencao' }),
    faq(perguntas),
  ],
}

const passos = [
  { titulo: 'Mande o pedido', texto: `Escreva o que precisa pelo WhatsApp ou pelo e-mail ${empresa.email}. Print ou link da página ajuda.` },
  { titulo: 'A gente confirma', texto: 'Dizemos se cabe nas horas do plano. Se passar, combinamos a hora excedente antes de começar.' },
  { titulo: 'Ajuste no ar', texto: 'Fazemos o ajuste e avisamos quando estiver publicado para você conferir.' },
]

export default function PaginaManutencao() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Manutenção mensal']]}
        rotulo="Para quem já tem site"
        titulo="Manutenção mensal de sites"
        sub="Seu site com hospedagem, backup, monitoramento e horas de trabalho por mês. Para quem já tem site com a RDG ou quer migrar o seu para cá."
      />

      <Manutencao />

      <section className="secao" id="escopo" aria-labelledby="escopo-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">O que cabe nas horas</span>
            <h2 id="escopo-titulo">Ajuste é do plano. Projeto novo tem proposta própria</h2>
            <p className="secao-sub">Uma regra simples para você saber o que esperar antes de pedir.</p>
          </div>
          <ul className="grade">
            <li className="card">
              <h3>Normalmente cabe nas horas</h3>
              <ul className="pg-manutencao-lista">
                <li>Ajustes de texto e imagem</li>
                <li>Pequenas melhorias em páginas que já existem</li>
                <li>Atualizações do site</li>
                <li>Correções</li>
              </ul>
            </li>
            <li className="card">
              <h3>Vira projeto à parte, com proposta</h3>
              <ul className="pg-manutencao-lista">
                <li>Página nova grande</li>
                <li>Sistema novo</li>
                <li>Redesign do site</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <section className="secao" id="como-pedir" aria-labelledby="como-pedir-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Passo a passo</span>
            <h2 id="como-pedir-titulo">Como pedir um ajuste</h2>
            <p className="secao-sub">Atendimento de segunda a sexta, das 9h às 17h.</p>
          </div>
          <ol className="passos">
            {passos.map((p, i) => (
              <li className="passo" key={p.titulo}>
                <span className="passo-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="secao" id="perguntas" aria-labelledby="perguntas-titulo">
        <div className="wrap faq">
          <div className="secao-topo faq-topo">
            <span className="label">Perguntas frequentes</span>
            <h2 id="perguntas-titulo">Dúvidas sobre a manutenção</h2>
          </div>
          <div className="faq-lista">
            {perguntas.map((p) => (
              <details key={p.pergunta}>
                <summary><h3>{p.pergunta}</h3><span className="faq-icone" aria-hidden="true" /></summary>
                <p>{p.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="secao" id="proposta" aria-labelledby="proposta-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Próximo passo</span>
            <h2 id="proposta-titulo">Quer saber o valor para o seu site?</h2>
            <p className="secao-sub">Os valores dos planos a gente passa na proposta, depois de entender o seu site.</p>
          </div>
          <div className="manutencao-acoes">
            <a className="btn" href="/diagnostico">Peça uma proposta <Icone nome="seta" tamanho={16} /></a>
            <a className="btn ghost" href={empresa.whatsappLink} target="_blank" rel="noopener">Falar no WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}
