import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import { empresa } from '../empresa.js'

export const meta = {
  titulo: 'Pedido recebido',
  descricao: 'Recebemos o seu pedido de diagnóstico. A resposta chega em até 1 dia útil, de segunda a sexta, das 9h às 17h.',
  noindex: true,
  // Página já termina em formulário ou próximos passos: sem convite no rodapé
  semConvite: true,
}

// Pico-Fim: o fim mostra onde a pessoa está no caminho e o que vem depois
const passos = [
  { titulo: 'Pedido recebido', prazo: 'Feito', texto: 'Seu nome e contato chegaram para a gente.' },
  { titulo: 'A gente responde', prazo: 'Até 1 dia útil', texto: 'Pelo WhatsApp ou e-mail que você deixou, para marcar a conversa.' },
  { titulo: 'Conversa de 20 minutos', prazo: 'Gratuita', texto: 'Olhamos o seu site, anúncios e atendimento com você.' },
  { titulo: 'Proposta por escrito', prazo: 'Até 1 dia útil', texto: 'Escopo, prazo e valor. Você decide sem pressa.' },
]

export default function Obrigado() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Pedido recebido"
        titulo="Pronto. O primeiro passo já foi"
        sub="A gente responde em até 1 dia útil. O atendimento é de segunda a sexta, das 9h às 17h."
      />
      <section className="secao" aria-labelledby="proximos-titulo">
        <div className="wrap">
          <h2 id="proximos-titulo">O que acontece agora</h2>
          <ol className="passos obrigado-passos">
            {passos.map((p, i) => (
              <li className="passo" key={p.titulo} aria-current={i === 0 ? 'step' : undefined}>
                <span className="passo-num" aria-hidden="true">{i === 0 ? '✓' : String(i + 1).padStart(2, '0')}</span>
                <h3>{p.titulo}</h3>
                <span className="passo-prazo">{p.prazo}</span>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
          <div className="passos-pe">
            <p>Enquanto isso, o mini-diagnóstico ajuda a chegar na conversa com os pontos já anotados.</p>
            <div className="pg-diagnostico-acoes">
              <a className="btn" href="/diagnostico#mini-diagnostico">Fazer o mini-diagnóstico</a>
              <a className="btn ghost" href={empresa.whatsappLink} rel="noopener">Falar agora no WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
