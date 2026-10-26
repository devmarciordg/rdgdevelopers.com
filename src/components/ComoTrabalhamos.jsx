import Icone from './Icone.jsx'
import '../styles/como-trabalhamos.css'

const passos = [
  {
    titulo: 'Diagnóstico gratuito',
    texto: 'Conversa de 20 minutos, sem compromisso, para entender o seu negócio e onde está o gargalo.',
  },
  {
    titulo: 'Proposta em até 1 dia útil',
    texto: 'Escopo, prazo e valor por escrito, sem letra miúda.',
  },
  {
    titulo: 'Contrato e início',
    texto: 'Contrato assinado digitalmente e sinal. A gente pede os acessos e começa. Mudança de escopo é sempre combinada por escrito.',
  },
  {
    titulo: 'Entrega e acompanhamento',
    texto: 'O site ou a campanha vai ao ar testado: PageSpeed no celular, formulário, botão de WhatsApp e eventos de conversão conferidos. Depois de 30 dias, você recebe um relatório curto com o que foi medido.',
  },
]

export default function ComoTrabalhamos() {
  return (
    <section className="secao" id="como-trabalhamos" aria-labelledby="como-trabalhamos-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">Como trabalhamos</span>
          <h2 id="como-trabalhamos-titulo">Do primeiro contato à entrega, sem surpresa</h2>
          <p className="secao-sub">
            Quatro passos, com prazo claro em cada um. Você sabe o que vem antes de pagar qualquer coisa.
          </p>
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

        <div className="passos-pe">
          <p>Atendimento de segunda a sexta, das 9h às 17h. Você fala direto com quem constrói.</p>
          <a className="btn" href="/diagnostico">
            Agendar diagnóstico gratuito
            <Icone nome="seta" tamanho={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
