import '../styles/problemas.css'

// Ordem do caminho do cliente: anúncio, site, WhatsApp. O número liga o card à etapa do fluxo.
export const problemas = [
  {
    etapa: 'Anúncio',
    titulo: 'Anúncio sem rastreamento',
    texto: 'Sem saber qual anúncio gerou a conversa ou a venda, a verba vai para o que parece funcionar, não para o que funciona.',
    solucao: 'Pixel com API de Conversões e eventos conferidos um a um.',
  },
  {
    etapa: 'Site',
    titulo: 'Site lento',
    texto: 'Cada segundo de espera no celular é gente que desiste antes de ver o seu serviço. E o Google também prefere páginas rápidas.',
    solucao: 'Site leve, medido no PageSpeed antes da entrega.',
  },
  {
    etapa: 'WhatsApp',
    titulo: 'Lead perdido no WhatsApp',
    texto: 'Mensagem respondida horas depois, sem registro nem retorno. O contato que você pagou para trazer esfria.',
    solucao: 'Atendimento organizado com automação e CRM.',
  },
]

const num = (i) => String(i + 1).padStart(2, '0')

export default function Problemas() {
  return (
    <section className="secao" aria-labelledby="problemas-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">O problema</span>
          <h2 id="problemas-titulo">Onde o dinheiro vaza antes de virar cliente</h2>
          <p className="secao-sub">Três gargalos comuns em negócio local. Muitas vezes eles aparecem juntos.</p>
        </div>

        <ol className="fluxo" aria-label="Caminho até virar cliente e onde cada gargalo aparece">
          {problemas.map((p, i) => (
            <li key={p.etapa}>
              <span className="fluxo-etapa">{p.etapa}</span>
              <span className="fluxo-vaza"><span aria-hidden="true">{num(i)}</span> {p.titulo}</span>
            </li>
          ))}
          <li><span className="fluxo-etapa fluxo-fim">Cliente</span></li>
        </ol>

        <ol className="grade">
          {problemas.map((p, i) => (
            <li className="card problema" key={p.titulo}>
              <span className="problema-num" aria-hidden="true">{num(i)}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
              <p className="problema-solucao"><span>Como resolvemos</span>{p.solucao}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
