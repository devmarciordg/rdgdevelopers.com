// Ilha do mini-diagnóstico: tudo roda no navegador, nada é enviado. No-op sem o markup.
const f = document.querySelector('form[data-diagnostico]')
if (f) {
  const r = f.querySelector('[data-resultado]')
  const barra = f.querySelector('[data-progresso]')
  const total = f.querySelectorAll('fieldset').length
  barra.hidden = false
  // Zeigarnik: cada resposta avança o contador e a barra na hora
  f.addEventListener('change', () => {
    const n = new Set(new FormData(f).keys()).size
    barra.querySelector('[data-feitas]').textContent = n
    barra.style.setProperty('--p', n / total)
  })
  f.addEventListener('submit', (e) => {
    e.preventDefault()
    const d = new FormData(f)
    const atencao = (q) => d.get(q) != 'sim'
    let n = 0
    for (const li of r.querySelectorAll('[data-q]')) n += !(li.hidden = !atencao(li.dataset.q))
    for (const g of r.querySelectorAll('[data-grupo]')) {
      let k = 0
      for (const i of g.querySelectorAll('[data-s]')) k += i.classList.toggle('atencao', atencao(i.dataset.s))
      g.querySelector('[data-texto]').textContent = k ? `${k} ${k > 1 ? 'pontos' : 'ponto'} de atenção` : 'Nada chamou atenção'
    }
    r.querySelector('.grade').hidden = !n
    r.querySelector('[data-nenhum]').hidden = n > 0
    r.hidden = false
    r.scrollIntoView({ block: 'start' })
  })
}
