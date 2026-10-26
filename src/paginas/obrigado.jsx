import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import { empresa } from '../empresa.js'

export const meta = {
  titulo: 'Pedido recebido',
  descricao: 'Recebemos o seu pedido de diagnóstico. A resposta chega em até 1 dia útil, de segunda a sexta, das 9h às 17h.',
  noindex: true,
}

export default function Obrigado() {
  return (
    <CabecalhoPagina
      rotulo="Pedido recebido"
      titulo="Obrigado, recebemos o seu pedido"
      sub="A gente responde em até 1 dia útil. O atendimento é de segunda a sexta, das 9h às 17h."
    >
      <p className="pg-diagnostico-acoes">
        <a className="btn" href={empresa.whatsappLink} rel="noopener">Falar agora no WhatsApp</a>
        <a className="btn ghost" href="/blog">Ler o blog</a>
        <a className="btn ghost" href="/">Voltar ao início</a>
      </p>
    </CabecalhoPagina>
  )
}
