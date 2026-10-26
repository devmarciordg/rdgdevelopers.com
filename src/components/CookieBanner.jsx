import '../styles/cookie-banner.css'

// Visibilidade do banner vem do snippet no <head> (html.cookies-pendente). Botões ligados em src/islands/cookies.js.
export default function CookieBanner() {
  return (
    <>
      <div className="cookie-banner" role="region" aria-label="Aviso de cookies">
        <p>
          Usamos cookies necessários para o site funcionar. Cookies de métricas e de marketing (Google Ads e Meta) só
          com a sua permissão. <a href="/cookies">Política de cookies</a>
        </p>
        <div className="cookie-acoes">
          <button type="button" className="btn ghost cookie-btn" data-consent="todos">Aceitar todos</button>
          <button type="button" className="btn ghost cookie-btn" data-consent="nenhum">Recusar não essenciais</button>
          <button type="button" className="btn ghost cookie-btn" popoverTarget="cookie-preferencias">Preferências</button>
        </div>
      </div>

      {/* Fora do banner: o rodapé abre este painel mesmo depois que o banner some */}
      <div
        id="cookie-preferencias"
        className="cookie-painel"
        popover="auto"
        role="dialog"
        aria-labelledby="cookie-preferencias-titulo"
      >
        <h2 id="cookie-preferencias-titulo">Preferências de cookies</h2>
        <p className="cookie-intro">
          Escolha o que você permite. Dá para mudar a qualquer momento pelo rodapé do site.{' '}
          <a href="/cookies">Política de cookies</a>
        </p>

        <label className="cookie-cat">
          <input type="checkbox" name="necessarios" defaultChecked disabled />
          <span><strong>Necessários</strong> (sempre ativos)<small>Fazem o site funcionar e guardam esta escolha.</small></span>
        </label>
        <label className="cookie-cat">
          <input type="checkbox" name="metricas" />
          <span><strong>Métricas</strong><small>Contam visitas e páginas vistas para a gente melhorar o site.</small></span>
        </label>
        <label className="cookie-cat">
          <input type="checkbox" name="marketing" />
          <span><strong>Marketing</strong><small>Medem e personalizam anúncios do Google Ads e da Meta.</small></span>
        </label>

        <div className="cookie-acoes">
          <button type="button" className="btn ghost cookie-btn" data-consent="salvar">Salvar preferências</button>
          <button type="button" className="btn ghost cookie-btn" data-consent="todos">Aceitar todos</button>
        </div>
      </div>
    </>
  )
}
