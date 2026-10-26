import '../styles/problemas.css'

const problemas = [
  {
    titulo: 'Site lento',
    texto: 'Cada segundo de espera no celular é gente que desiste antes de ver o seu serviço. E o Google também prefere páginas rápidas.',
    solucao: 'Site leve, medido no PageSpeed antes da entrega.',
  },
  {
    titulo: 'Anúncio sem rastreamento',
    texto: 'Sem saber qual anúncio gerou a conversa ou a venda, a verba vai para o que parece funcionar, não para o que funciona.',
    solucao: 'Pixel com API de Conversões e eventos conferidos um a um.',
  },
  {
    titulo: 'Lead perdido no WhatsApp',
    texto: 'Mensagem respondida horas depois, sem registro nem retorno. O contato que você pagou para trazer esfria.',
    solucao: 'Atendimento organizado com automação e CRM.',
  },
]

export default function Problemas() {
  return (
    <section className="secao" aria-labelledby="problemas-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">O problema</span>
          <h2 id="problemas-titulo">Onde o dinheiro vaza antes de virar cliente</h2>
          <p className="secao-sub">Três gargalos comuns em negócio local. Muitas vezes eles aparecem juntos.</p>
        </div>

        <ol className="grade">
          {problemas.map((p, i) => (
            <li className="card problema" key={p.titulo}>
              <span className="problema-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
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
