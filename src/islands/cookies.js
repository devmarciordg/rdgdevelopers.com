// Ilha do consentimento de cookies (LGPD + Google Consent Mode v2). O default "denied" vem do snippet no <head>.
// Delegação no document: funciona mesmo se o markup aparecer depois do script.
const d = document
const KEY = 'rdg-consent'
const caixa = n => d.querySelector(`#cookie-preferencias [name=${n}]`)
const ler = () => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } }

function salvar(metricas, marketing) {
  const detail = { v: 1, data: new Date().toISOString(), metricas, marketing }
  try { localStorage.setItem(KEY, JSON.stringify(detail)) } catch {}
  const m = marketing ? 'granted' : 'denied'
  window.gtag?.('consent', 'update', {
    analytics_storage: metricas ? 'granted' : 'denied',
    ad_storage: m, ad_user_data: m, ad_personalization: m,
  })
  d.documentElement.classList.remove('cookies-pendente')
  const p = d.getElementById('cookie-preferencias')
  if (p?.matches(':popover-open')) p.hidePopover()
  // Tags (GTM, Pixel) entram aqui depois: carregar no evento 'rdg:consent' e, na carga da página, se ler() já autorizar.
  window.dispatchEvent(new CustomEvent('rdg:consent', { detail }))
}

d.addEventListener('click', e => {
  const acao = e.target.closest?.('[data-consent]')?.dataset.consent
  if (acao === 'todos') salvar(true, true)
  else if (acao === 'nenhum') salvar(false, false)
  else if (acao === 'salvar') salvar(caixa('metricas').checked, caixa('marketing').checked)
})

// 'toggle' não borbulha: captura no document. Ao abrir, reflete o salvo e foca o primeiro controle.
d.addEventListener('toggle', e => {
  if (e.target.id !== 'cookie-preferencias' || e.newState !== 'open') return
  const c = ler()
  caixa('metricas').checked = !!c?.metricas
  caixa('marketing').checked = !!c?.marketing
  caixa('metricas').focus()
}, true)
