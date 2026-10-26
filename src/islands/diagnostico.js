// Ilha do mini-diagnóstico: tudo roda no navegador, nada é enviado. No-op sem o markup.
const f = document.querySelector('form[data-diagnostico]')
if (f) {
  const r = f.querySelector('[data-resultado]')
  f.querySelector('[type=submit]').hidden = false
  f.addEventListener('submit', (e) => {
    e.preventDefault()
    const d = new FormData(f)
    let n = 0
    for (const li of r.querySelectorAll('[data-q]')) n += !(li.hidden = d.get(li.dataset.q) == 'sim')
    r.querySelector('ul').hidden = !n
    r.querySelector('[data-nenhum]').hidden = n > 0
    r.hidden = false
  })
}
