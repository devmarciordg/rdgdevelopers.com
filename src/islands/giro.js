// Título giratório da hero (versão vanilla do RotatingText do React Bits, sem motion).
// Letras saem para cima e entram por baixo, da última para a primeira. Movimento reduzido: fica a primeira frase.
const el = document.querySelector('[data-giro]')
const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches

if (el && !reduzir && el.animate) {
  const textos = JSON.parse(el.dataset.giro)
  const ESCALA = 25
  const curva = 'cubic-bezier(.22, 1, .36, 1)'
  let atual = 0
  let visivel = true
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting }).observe(el)

  const letras = (texto) => [...texto].map((c) => {
    const s = document.createElement('span')
    s.textContent = c
    return s
  })

  const trocar = async () => {
    if (!visivel || document.hidden) return
    atual = (atual + 1) % textos.length
    const velhas = el.children.length ? [...el.children] : letras(el.textContent)
    if (!el.children.length) el.replaceChildren(...velhas)
    const n = velhas.length
    await Promise.all(velhas.map((s, i) => s.animate(
      [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-120%)', opacity: 0 }],
      { duration: 300, delay: (n - 1 - i) * ESCALA, easing: 'cubic-bezier(.5, 0, .75, 0)', fill: 'forwards' },
    ).finished))
    const novas = letras(textos[atual])
    el.replaceChildren(...novas)
    novas.forEach((s, i) => s.animate(
      [{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 600, delay: (novas.length - 1 - i) * ESCALA, easing: curva, fill: 'backwards' },
    ))
  }

  setInterval(trocar, 2600)
}
