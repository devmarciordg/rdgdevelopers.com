import Icone from './Icone.jsx'
import '../styles/para-quem.css'

const nichos = [
  { titulo: 'Clínicas e saúde', texto: 'Odontologia, estética e saúde. Agenda cheia depende de lead que chega e é atendido rápido.', icone: 'saude' },
  { titulo: 'Alimentação', texto: 'Pizzarias, restaurantes e delivery. Pedido no WhatsApp e presença no Google na hora da fome.', icone: 'alimentacao' },
  { titulo: 'Prestadores de serviço', texto: 'Quem procura no Google precisa encontrar você e falar com você em um clique.', icone: 'servico' },
  { titulo: 'Nichos técnicos', texto: 'Contabilidade, assistência técnica e segurança eletrônica. Serviço vendido por confiança pede site sério.', icone: 'tecnico' },
]

export default function ParaQuem() {
  return (
    <section className="secao" aria-labelledby="para-quem-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">Para quem é</span>
          <h2 id="para-quem-titulo">Para negócio local que vive de cliente novo</h2>
          <p className="secao-sub">
            Se o seu cliente procura no Google, vê um anúncio ou chama no WhatsApp antes de comprar,
            o nosso trabalho é fazer esse caminho ser rápido e mensurável.
          </p>
        </div>

        <ul className="grade">
          {nichos.map((n) => (
            <li className="card" key={n.titulo}>
              <span className="card-icone"><Icone nome={n.icone} /></span>
              <h3>{n.titulo}</h3>
              <p>{n.texto}</p>
            </li>
          ))}
        </ul>

        <p className="para-quem-rodape">
          Seu segmento não está aqui?{' '}
          <a href="/diagnostico">
            Avaliamos no diagnóstico gratuito
            <Icone nome="seta" tamanho={16} />
          </a>
        </p>
      </div>
    </section>
  )
}
