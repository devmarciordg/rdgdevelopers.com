import Icone from './Icone.jsx'
import { problemas } from './Problemas.jsx'
import { empresa } from '../empresa.js'
import lh from '../lighthouse.json'
import '../styles/hero.css'

// Menor nota entre os 4 eixos: o número nunca exagera a medição
const nota = Math.min(...Object.values(lh.notas))

// Parte do título que gira (ilha islands/giro.js). O HTML já sai com a primeira; leitor de tela lê a frase inteira.
const giro = ['site rápido.', 'anúncio rastreado.', 'criativo testado.', 'Google em dia.', 'WhatsApp organizado.']

export default function Hero() {
  return (
    <section className="hero">
      {/* Fundo ASCII em WebGL, montado pela ilha islands/ascii.js depois do load; sem JS fica só o fundo liso */}
      <div className="hero-ascii" data-ascii aria-hidden="true" />
      <div className="wrap hero-layout">
        <div>
          <span className="label">Sites, Google e tráfego pago para negócio local</span>

          <h1>
            <span aria-hidden="true">Seu negócio com</span>
            <span className="hero-giro" data-giro={JSON.stringify(giro)} aria-hidden="true">{giro[0]}</span>
            <span className="sr-only">Seu negócio com site rápido, anúncio rastreado, criativo testado, Google em dia e WhatsApp organizado.</span>
          </h1>

          <p className="hero-sub">
            Site que abre rápido no celular, Perfil no Google em dia e anúncio rastreado, para você
            saber de onde vem cada cliente.
          </p>

          <div className="hero-cta">
            <a className="btn" href="/diagnostico">Agendar diagnóstico gratuito</a>
            <a className="link-seta" href={empresa.whatsappLink} rel="noopener">
              ou fale no WhatsApp <Icone nome="seta" tamanho={16} />
            </a>
          </div>
          <p className="hero-note">20 minutos, sem compromisso.</p>

          {/* Prova só com o que é verificável: medição deste site e regras do nosso processo */}
          <ul className="hero-prova">
            <li><span>Lighthouse</span><a href="/performance">Nota {nota} neste site</a></li>
            <li><span>Proposta</span>em 1 dia útil</li>
            <li><span>Por escrito</span>escopo, prazo e valor</li>
          </ul>
        </div>

        {/* Mesmos dados da seção Problemas: o que fazemos em cada etapa do caminho */}
        <div className="hero-painel">
          <span className="label" id="hero-fluxo-titulo">O caminho até o cliente</span>
          <ol className="hero-fluxo card" aria-labelledby="hero-fluxo-titulo">
            {problemas.map((p) => (
              <li key={p.etapa}>
                <span className="fluxo-etapa">{p.etapa}</span>
                <p>{p.solucao}</p>
              </li>
            ))}
            <li><span className="fluxo-etapa fluxo-fim">Cliente</span></li>
          </ol>
        </div>
      </div>
    </section>
  )
}
