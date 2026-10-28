// Ilha do fundo ASCII da hero. O efeito (WebGL2) fica num chunk separado e só carrega depois do load,
// em tempo ocioso: o HTML e o H1 (LCP) já estão na tela e o fundo entra com fade por cima do CSS.
const alvo = document.querySelector('[data-ascii]')
const economia = navigator.connection?.saveData

if (alvo && !economia && 'WebGL2RenderingContext' in window) {
  const carregar = () => import('../efeitos/ascii.js').then((m) => m.iniciar(alvo)).catch(() => {})
  const ocioso = () => ('requestIdleCallback' in window ? requestIdleCallback(carregar, { timeout: 3000 }) : setTimeout(carregar, 1500))
  if (document.readyState === 'complete') ocioso()
  else addEventListener('load', ocioso, { once: true })
}
