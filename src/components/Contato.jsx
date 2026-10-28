import { empresa } from '../empresa.js'
import '../styles/contato.css'

export default function Contato() {
  return (
    <section className="secao fundo-grade" id="contato" aria-labelledby="contato-titulo">
      <div className="wrap">
        <div className="contato-box">
          <div className="contato-texto">
            <span className="label">Diagnóstico gratuito</span>
            <h2 id="contato-titulo">Vamos olhar o seu caso em 20 minutos</h2>
            <p className="secao-sub">
              Uma conversa rápida, gratuita e sem compromisso. A gente entende o seu negócio, aponta onde
              estão os gargalos e envia uma proposta em até 1 dia útil.
            </p>
            <a className="btn ghost" href={empresa.whatsappLink} rel="noopener">
              Prefiro chamar no WhatsApp
            </a>
          </div>

          <form
            className="contato-form"
            data-lead
            data-whatsapp={empresa.whatsappLink}
            method="post"
            action={empresa.webhookLead || '/obrigado'}
          >
            <div className="campo">
              <label htmlFor="lead-nome">Nome</label>
              <input id="lead-nome" name="nome" type="text" autoComplete="name" maxLength={80} required />
            </div>

            <div className="campo">
              <label htmlFor="lead-contato">WhatsApp ou e-mail</label>
              <input id="lead-contato" name="contato" type="text" autoComplete="tel" maxLength={120} aria-describedby="lead-contato-dica" required />
              {/* A ilha troca a dica conforme o que for digitado (telefone em qualquer formato ou e-mail) */}
              <p className="campo-dica" id="lead-contato-dica">Com DDD, do jeito que preferir, ou um e-mail.</p>
            </div>

            {/* Honeypot: invisível para pessoas e leitores de tela; robô que preencher é descartado */}
            <div className="contato-hp" aria-hidden="true">
              <label htmlFor="lead-site">Site</label>
              <input id="lead-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <p className="contato-nota">
              Seus dados servem só para responder ao seu pedido de diagnóstico e ficam guardados por até 12 meses.
              Não envie dados de pacientes ou de clientes seus por aqui.
            </p>

            <label className="contato-check">
              <input type="checkbox" name="consentimento" value="sim" required />
              <span>
                Concordo com o tratamento dos meus dados pessoais conforme a LGPD e a{' '}
                <a href="/privacidade">Política de Privacidade</a>.
              </span>
            </label>

            <button className="btn" type="submit"><span>Quero meu diagnóstico</span></button>
            <p className="contato-status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>
  )
}
