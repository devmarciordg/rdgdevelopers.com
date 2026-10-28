// Ilha do formulário de lead. Sem JS, o form envia pelo action (progressivo).
// O evento submit só dispara após a validação nativa do HTML passar.
// Delegação no document: funciona mesmo se o markup aparecer depois do script
const d = document
const KEY = 'rdg-origem'
const ler = (s, k) => { try { return JSON.parse(s.getItem(k)) } catch { return null } }

// Tesler: a origem da visita (utm_* e site de onde veio) vai junto, sem pedir nada à pessoa.
// É dado de campanha, não pessoal. Entre páginas só fica guardado com consentimento de marketing.
const atual = {}
for (const [k, v] of new URLSearchParams(location.search)) if (k.startsWith('utm_')) atual[k] = v.slice(0, 100)
if (d.referrer && !d.referrer.startsWith(location.origin)) atual.referrer = d.referrer.split(/[?#]/)[0]
const tem = Object.keys(atual).length
const guardar = () => {
  if (tem && ler(localStorage, 'rdg-consent')?.marketing) try { sessionStorage.setItem(KEY, JSON.stringify(atual)) } catch {}
}
guardar()
addEventListener('rdg:consent', guardar)

// Postel: aceita "33999147537", "(33) 99914-7537", "+55 33 9 9914-7537"; devolve "+5533999147537" ou null
const tel = (v) => {
  if (/[a-z@]/i.test(v)) return null
  let n = v.replace(/\D/g, '')
  if (/^\s*\+/.test(v) && !n.startsWith('55')) return n.length >= 8 && n.length <= 15 ? '+' + n : null // fora do Brasil
  n = n.replace(/^0+/, '')
  if (n.length > 11 && n.startsWith('55')) n = n.slice(2)
  return /^[1-9]{2}(9\d{8}|[2-8]\d{7})$/.test(n) ? '+55' + n : null
}
const email = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
// Miller: número em grupos, "(33) 99914-7537"
const fmt = (e) => (e.startsWith('+55') ? e.slice(3).replace(/^(\d\d)(\d{4,5})(\d{4})$/, '($1) $2-$3') : e)
const DICA = 'Com DDD, do jeito que preferir, ou um e-mail.'

function conferir(c) {
  const v = c.value.trim()
  const t = tel(v)
  const ok = t || email(v)
  c.setCustomValidity(!v || ok ? '' : 'Digite um WhatsApp com DDD, como (33) 99914-7537, ou um e-mail válido.')
  d.getElementById(c.getAttribute('aria-describedby')).textContent =
    t ? 'A gente responde no WhatsApp ' + fmt(t) + '.' : ok ? 'A gente responde por e-mail.' : DICA
  return t
}

const campo = (e) => e.target.closest?.('form[data-lead] [name=contato]')
d.addEventListener('input', (e) => campo(e) && conferir(e.target))
// Máscara ao sair do campo: a pessoa digita como quiser, o site arruma
d.addEventListener('focusout', (e) => {
  const t = campo(e) && conferir(e.target)
  if (t) e.target.value = fmt(t)
})

d.addEventListener('submit', async (e) => {
  const f = e.target.closest('form[data-lead]')
  if (!f) return
  e.preventDefault()
  const dados = new FormData(f)
  const b = f.querySelector('[type=submit]')
  const rotulo = b.firstChild
  const status = f.querySelector('[aria-live]')
  const ok = () => (location.href = '/obrigado')
  if (dados.get('site')) return ok() // honeypot preenchido: finge sucesso, não envia
  const contato = String(dados.get('contato')).trim()
  const t = tel(contato)
  // Doherty: o botão muda no mesmo instante do clique
  const antes = rotulo.textContent
  b.disabled = true
  b.setAttribute('aria-busy', 'true')
  rotulo.textContent = 'Enviando...'
  status.textContent = 'Enviando o seu pedido.'
  try {
    const r = await fetch(f.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        nome: String(dados.get('nome')).trim(),
        contato: t || contato.toLowerCase(),
        tipo: t ? 'whatsapp' : 'email',
        consentimento: true,
        origem: location.pathname,
        campanha: tem ? atual : ler(sessionStorage, KEY) || {},
        data: new Date().toISOString(),
      }),
    })
    if (!r.ok) throw 0
    ok()
  } catch {
    status.innerHTML =
      'Não deu para enviar agora. Tente de novo ou <a href="' + f.dataset.whatsapp + '" rel="noopener">fale com a gente no WhatsApp</a>.'
    b.disabled = false
    b.removeAttribute('aria-busy')
    rotulo.textContent = antes
  }
})
