import { empresa } from '../empresa.js'
import '../styles/whatsapp-flutuante.css'

// Balão com telefone, traço monocromático (não é o logo oficial)
export default function WhatsAppFlutuante() {
  return (
    <a className="wa-flutuante" href={empresa.whatsappLink} rel="noopener" aria-label="Falar no WhatsApp">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.6z" />
        <path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l1-1.5-2-1-1 .8a4.5 4.5 0 0 1-2.3-2.3l.8-1-1-2z" />
      </svg>
    </a>
  )
}
