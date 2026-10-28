// Botão "Copiar link do case": só aparece onde a Clipboard API existe (precisa de HTTPS)
const status = document.querySelector('[data-copiar-status]')
for (const b of document.querySelectorAll('[data-copiar]')) {
  if (!navigator.clipboard) break
  const texto = b.textContent
  b.hidden = false
  b.addEventListener('click', async () => {
    let msg = 'Link copiado'
    try { await navigator.clipboard.writeText(location.href.split('#')[0]) } catch { msg = 'Não deu para copiar. Use o endereço da barra.' }
    b.textContent = msg
    if (status) status.textContent = msg
    setTimeout(() => { b.textContent = texto }, 2500)
  })
}
