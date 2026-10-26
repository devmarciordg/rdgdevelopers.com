import { empresa } from '../empresa.js'
import '../styles/hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-horizon" aria-hidden="true" />

      <div className="wrap hero-content">
        <a className="hero-eyebrow" href="/servicos">
          Sites · Google · Tráfego pago
          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
            <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <h1><span>Site rápido.</span> <span>Anúncio medido.</span> <span>Cliente no WhatsApp.</span></h1>

        <p className="hero-sub">
          Criamos sites que carregam rápido, cuidamos do seu Perfil no Google e gerimos tráfego pago
          com rastreamento correto, para você saber de onde vem cada cliente.
        </p>

        <div className="hero-cta">
          <a className="btn" href="/diagnostico">Agendar diagnóstico gratuito</a>
          <a className="btn ghost" href={empresa.whatsappLink} rel="noopener">Falar no WhatsApp</a>
        </div>
        <p className="hero-note">20 minutos, sem compromisso. Proposta em até 1 dia útil.</p>
      </div>
    </section>
  )
}
