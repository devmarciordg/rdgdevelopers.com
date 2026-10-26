// Ilha do formulário de lead. Sem JS, o form envia pelo action (progressivo).
// O evento submit só dispara após a validação nativa do HTML passar.
// Delegação no document: funciona mesmo se o markup aparecer depois do script
document.addEventListener('submit', async (e) => {
    const f = e.target.closest('form[data-lead]')
    if (!f) return
    e.preventDefault()
    const d = new FormData(f)
    const b = f.querySelector('[type=submit]')
    const ok = () => (location.href = '/obrigado')
    if (d.get('site')) return ok() // honeypot preenchido: finge sucesso, não envia
    b.disabled = true
    try {
      const r = await fetch(f.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: d.get('nome'),
          contato: d.get('contato'),
          consentimento: true,
          origem: location.pathname,
          data: new Date().toISOString(),
        }),
      })
      if (!r.ok) throw 0
      ok()
    } catch {
      f.querySelector('[aria-live]').innerHTML =
        'Não deu para enviar agora. Tente de novo ou <a href="' + f.dataset.whatsapp + '" rel="noopener">fale com a gente no WhatsApp</a>.'
      b.disabled = false
    }
})
