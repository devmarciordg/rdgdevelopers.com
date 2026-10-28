// Conteúdo entra subindo ao rolar (versão vanilla do AnimatedContent do React Bits, sem GSAP).
// Só esconde o que está abaixo da dobra na carga: sem JS, sem IntersectionObserver ou com movimento reduzido, tudo já aparece.
const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches

if (!reduzir && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((itens) => {
    for (const i of itens) {
      if (!i.isIntersecting) continue
      const el = i.target
      io.unobserve(el)
      el.classList.add('revelado')
      // Depois de entrar, devolve as transições próprias do elemento (hover dos cards)
      el.addEventListener('transitionend', () => {
        el.classList.remove('revelar', 'revelado')
        el.style.transitionDelay = ''
      }, { once: true })
    }
  }, { rootMargin: '0px 0px -10% 0px' })

  for (const el of document.querySelectorAll('.secao-topo, .grade > *, .passos > *, .fluxo > *')) {
    if (el.getBoundingClientRect().top < innerHeight) continue
    // Escalonamento entre irmãos da mesma grade, como o stagger do original
    const i = [...el.parentElement.children].indexOf(el)
    if (i > 0) el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`
    el.classList.add('revelar')
    io.observe(el)
  }
}
