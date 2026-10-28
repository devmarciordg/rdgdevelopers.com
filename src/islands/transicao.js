// Troca de página suave (versão vanilla do LoaderGooeyBlobs, sem motion): ao clicar num link interno,
// cobre a tela com as gotas até a página nova chegar; ela entra pelo @view-transition do CSS.
// Com movimento reduzido, a troca continua seca como sempre.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let tela
  let limite
  const esconder = () => tela?.classList.remove('ativa')

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]')
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return
    const u = new URL(a.href, location.href)
    // Outro site, âncora na mesma página ou arquivo (feed.xml, imagens): sem transição
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search) || /\.(?!html$)\w+$/.test(u.pathname)) return
    if (!tela) {
      tela = document.createElement('div')
      tela.className = 'transicao'
      tela.setAttribute('aria-hidden', 'true')
      tela.innerHTML = '<svg width="0" height="0"><filter id="gosma"><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="g"/><feBlend in="SourceGraphic" in2="g"/></filter></svg><div class="transicao-gotas"><i></i><i></i><i></i></div>'
      document.body.append(tela)
      tela.getBoundingClientRect() // aplica o estado inicial antes de ativar, para o fade rodar
    }
    tela.classList.add('ativa')
    // Navegação cancelada ou rede caída: a tela não pode ficar presa
    clearTimeout(limite)
    limite = setTimeout(esconder, 8000)
  })
  // Voltar pelo histórico restaura a página do cache com a tela ainda ativa
  addEventListener('pageshow', (e) => { if (e.persisted) esconder() })
}
