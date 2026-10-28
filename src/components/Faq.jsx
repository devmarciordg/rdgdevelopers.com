import Icone from './Icone.jsx'
import { empresa } from '../empresa.js'
import '../styles/faq.css'

// Texto puro: o build reusa no schema FAQPage. `link` vira <a> só no HTML.
export const perguntas = [
  { pergunta: 'O diagnóstico é gratuito mesmo?', resposta: 'Sim. É uma conversa de 20 minutos, sem compromisso, para entender o seu negócio e indicar o caminho. A execução, se você quiser, entra numa proposta.' },
  { pergunta: 'Em quanto tempo recebo a proposta?', resposta: 'Em até 1 dia útil depois do diagnóstico, com escopo, prazo e valor por escrito.' },
  { pergunta: 'Existe contrato mínimo?', resposta: 'Na gestão de tráfego pago, sim: 6 meses, porque campanha precisa de tempo para aprender e ser otimizada. Os demais serviços seguem o que estiver na proposta.' },
  { pergunta: 'O código do sistema fica comigo?', resposta: 'No software sob medida, sim: depois da quitação, o código é cedido a você. As condições estão no contrato.' },
  { pergunta: 'Vocês cuidam do site depois que ele vai ao ar?', resposta: 'Sim, pelos planos de manutenção mensal de 2, 4 ou 6 horas, com hospedagem, backup e monitoramento incluídos. As horas não acumulam de um mês para o outro.' },
  { pergunta: 'Qual o horário de atendimento?', resposta: 'De segunda a sexta, das 9h às 17h. Você fala direto com quem constrói.' },
  { pergunta: 'Como vocês tratam os dados dos meus clientes?', resposta: 'Seguindo a LGPD: formulários com consentimento, só os dados necessários e acesso restrito. Os detalhes estão na Política de Privacidade.', link: { texto: 'Política de Privacidade', href: '/privacidade' } },
]

function Resposta({ resposta, link }) {
  if (!link) return <p>{resposta}</p>
  const [antes, depois] = resposta.split(link.texto)
  return <p>{antes}<a href={link.href}>{link.texto}</a>{depois}</p>
}

export default function Faq() {
  return (
    <section className="secao" id="faq" aria-labelledby="faq-titulo">
      <div className="wrap faq">
        <div className="secao-topo faq-topo">
          <span className="label">Perguntas frequentes</span>
          <h2 id="faq-titulo">Antes de você chamar a gente</h2>
          <p className="secao-sub">As dúvidas mais comuns, respondidas direto.</p>
        </div>

        <div>
          <div className="faq-lista">
            {perguntas.map((p) => (
              <details key={p.pergunta}>
                <summary><h3>{p.pergunta}</h3><span className="faq-icone" aria-hidden="true" /></summary>
                <Resposta {...p} />
              </details>
            ))}
          </div>

          <p className="faq-rodape">
            Não achou sua dúvida?{' '}
            <a className="link-seta" href={empresa.whatsappLink} target="_blank" rel="noopener">
              Fale com a gente no WhatsApp
              <Icone nome="seta" tamanho={16} />
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
