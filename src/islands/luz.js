// Luz que segue o cursor nos cards de case (ideia do SpotlightCard do React Bits, em JS puro; o desenho fica no CSS).
// Cards vizinhos dividem a mesma luz: ela começa a acender a 80px do card. Só com mouse; no toque o card fica como está
const PERTO = 80
const cards = document.querySelectorAll('.case')

if (cards.length && matchMedia('(hover: hover)').matches) {
  let x = 0
  let y = 0
  let fora = true
  let pedido = 0

  const pintar = () => {
    pedido = 0
    for (const c of cards) {
      const r = c.getBoundingClientRect()
      const dx = x - r.left
      const dy = y - r.top
      const longe = Math.hypot(Math.max(0, -dx, dx - r.width), Math.max(0, -dy, dy - r.height))
      const luz = fora ? 0 : Math.max(0, 1 - longe / PERTO) ** 2
      // Apagando, a luz some onde estava em vez de seguir o cursor para longe
      if (luz > 0) {
        c.style.setProperty('--x', `${dx.toFixed(1)}px`)
        c.style.setProperty('--y', `${dy.toFixed(1)}px`)
      }
      c.style.setProperty('--luz', luz.toFixed(3))
    }
  }
  const pedir = () => { pedido ||= requestAnimationFrame(pintar) }

  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; fora = false; pedir() }, { passive: true })
  addEventListener('scroll', () => { if (!fora) pedir() }, { passive: true })
  document.addEventListener('pointerout', (e) => { if (!e.relatedTarget) { fora = true; pedir() } })
}
