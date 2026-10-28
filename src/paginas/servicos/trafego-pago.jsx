import CabecalhoPagina from '../../components/CabecalhoPagina.jsx'
import Icone from '../../components/Icone.jsx'
import '../../styles/pg-trafego.css'
import { breadcrumb, servico, faq } from '../../schema.js'

const ROTA = '/servicos/trafego-pago'

// Texto puro: reusado no schema FAQPage.
const perguntas = [
  {
    pergunta: 'Por que o contrato mínimo é de 6 meses?',
    resposta: 'Porque campanha precisa de tempo para aprender e ser otimizada. Nas primeiras semanas, as plataformas ainda estão descobrindo quem responde ao anúncio. Os ajustes que fazem diferença vêm com dados acumulados, e isso não cabe em 30 dias.',
  },
  {
    pergunta: 'Vocês garantem um número de leads ou um custo por lead?',
    resposta: 'Não. Resultado de anúncio depende do mercado, da oferta, da concorrência e do atendimento, coisas que ninguém controla sozinho. O que a gente entrega é o método: rastreamento conferido, campanhas acompanhadas e um relatório mensal com números reais.',
  },
  {
    pergunta: 'Como vou saber se a verba está dando retorno?',
    resposta: 'Todo mês você recebe um relatório consolidado com verba investida, leads, custo por lead e retorno. Como o rastreamento é configurado antes do primeiro anúncio, dá para ver de qual campanha veio cada contato.',
  },
  {
    pergunta: 'Clínica e consultório podem anunciar?',
    resposta: 'Podem, seguindo as regras de publicidade do conselho profissional, como CFO e CFM. Isso inclui não usar foto de antes e depois nem promoção de preço. A responsabilidade técnica pelo conteúdo é do profissional, e a gente ajuda a montar anúncios que respeitam essas regras.',
  },
  {
    pergunta: 'Em quanto tempo recebo a proposta?',
    resposta: 'Em até 1 dia útil depois do diagnóstico. O atendimento é de segunda a sexta, das 9h às 17h.',
  },
]

const descricao = 'Gestão de campanhas no Meta Ads e no Google Ads com rastreamento conferido antes do primeiro anúncio e relatório mensal consolidado.'

export const meta = {
  titulo: 'Gestão de tráfego pago: Meta Ads e Google Ads',
  descricao: 'Gestão de tráfego pago no Meta Ads e no Google Ads com rastreamento conferido antes de anunciar e relatório mensal de verba, leads e custo por lead.',
  schema: [
    breadcrumb([['Serviços', '/servicos'], ['Tráfego pago', ROTA]]),
    servico({ nome: 'Gestão de tráfego pago', descricao, rota: ROTA }),
    faq(perguntas),
  ],
}

const incluso = [
  { titulo: 'Meta Ads', texto: 'Campanhas no Facebook e no Instagram: público, criativos, verba e acompanhamento contínuo.' },
  { titulo: 'Google Ads', texto: 'Anúncios na pesquisa do Google para quem já está procurando o que você oferece. Perfil da Empresa e Maps entram quando fazem sentido para o seu negócio.' },
  { titulo: 'Rastreamento antes de anunciar', texto: 'Pixel com API de Conversões da Meta, conversões do Google Ads, botão de WhatsApp e formulário medidos.' },
  { titulo: 'Relatório mensal consolidado', texto: 'Verba investida, leads, custo por lead e retorno do mês, em linguagem direta. Nunca número diário solto.' },
]

const passos = [
  { titulo: 'Diagnóstico', texto: 'A gente entende o seu negócio, o que você já anuncia e como os contatos chegam hoje.' },
  { titulo: 'Proposta em até 1 dia útil', texto: 'Escopo e valor por escrito, com o contrato mínimo de 6 meses dito logo de cara.' },
  { titulo: 'Rastreamento conferido', texto: 'Pixel, API de Conversões e conversões do Google configurados. Cada evento é testado um a um antes de qualquer anúncio ir ao ar.' },
  { titulo: 'Campanhas e otimização', texto: 'Campanhas no ar, ajustes com base no que foi medido e relatório consolidado todo mês.' },
]

export default function TrafegoPago() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Serviços', '/servicos'], ['Tráfego pago']]}
        rotulo="Tráfego pago"
        titulo="Gestão de tráfego pago que mede antes de anunciar"
        sub="Campanhas no Meta Ads e no Google Ads com rastreamento conferido evento por evento. Você sabe de onde vem cada contato, e a verba vai para o que funciona."
      />

      <section className="secao" id="para-quem" aria-labelledby="para-quem-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Para quem é</span>
            <h2 id="para-quem-titulo">Para quem quer saber o que cada real de anúncio trouxe</h2>
          </div>
          <div className="prosa pg-trafego-prosa">
          <p>
            Faz sentido para negócios locais e de serviço que recebem contatos por WhatsApp, formulário ou
            telefone e querem entender quais anúncios geram esses contatos. Vale tanto para quem nunca anunciou
            quanto para quem já anuncia e não sabe dizer o que está funcionando.
          </p>
          <p>
            Também atendemos clínicas e profissionais de saúde. Nesse caso, os anúncios seguem as regras de
            publicidade dos conselhos profissionais, como CFO e CFM: nada de antes e depois, nada de promoção de
            preço. A responsabilidade técnica pelo conteúdo é do profissional, e a gente ajuda a respeitar essas
            regras em cada anúncio.
          </p>
          <p>
            Não é para quem procura resultado rápido em poucas semanas. Campanha precisa de tempo para aprender e
            ser otimizada, por isso o contrato mínimo é de <strong>6 meses</strong>.
          </p>
          <p>
            Quer saber se faz sentido para você? <a href="/diagnostico">Agende um diagnóstico gratuito</a>.
          </p>
          </div>
        </div>
      </section>

      <section className="secao" id="incluso" aria-labelledby="incluso-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">O que está incluso</span>
            <h2 id="incluso-titulo">Campanha, medição e relatório no mesmo pacote</h2>
            <p className="secao-sub">
              O diferencial é medir certo. Sem rastreamento, a plataforma otimiza no escuro e você paga por isso.
            </p>
          </div>
          <ul className="grade">
            {incluso.map((i) => (
              <li className="card" key={i.titulo}>
                <h3>{i.titulo}</h3>
                <p>{i.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao" id="rastreamento" aria-labelledby="rastreamento-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Antes do primeiro anúncio</span>
            <h2 id="rastreamento-titulo">Por que o rastreamento vem primeiro</h2>
          </div>
          <div className="prosa pg-trafego-prosa">
          <p>
            Anunciar sem medir é pagar sem saber pelo quê. Se o pixel perde conversões, a Meta e o Google aprendem
            com dados incompletos e entregam o anúncio para as pessoas erradas. Por isso, antes de qualquer
            campanha, a gente configura:
          </p>
          <ul>
            <li>pixel da Meta com a API de Conversões, que envia os eventos também pelo servidor;</li>
            <li>conversões do Google Ads;</li>
            <li>medição do clique no botão de WhatsApp e do envio do formulário;</li>
            <li>conferência de cada evento, um a um, antes de liberar a verba.</li>
          </ul>
          <p>
            Com isso, dá para saber de onde vem cada contato e mover a verba para o que funciona. Se quiser entender
            a parte técnica, veja o serviço de{' '}
            <a href="/servicos/rastreamento-server-side">rastreamento server-side</a> e o artigo sobre{' '}
            <a href="/blog/pixel-perde-conversoes">por que o pixel perde conversões</a>.
          </p>
          </div>
        </div>
      </section>

      <section className="secao" id="como-funciona" aria-labelledby="como-funciona-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Como funciona</span>
            <h2 id="como-funciona-titulo">Quatro passos, sem surpresa</h2>
            <p className="secao-sub">O contrato mínimo de 6 meses aparece na proposta, antes de você assinar qualquer coisa.</p>
          </div>
          <ol className="passos">
            {passos.map((p, i) => (
              <li className="passo" key={p.titulo}>
                <span className="passo-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="secao" id="nao-fazemos" aria-labelledby="nao-fazemos-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">O que a gente não faz</span>
            <h2 id="nao-fazemos-titulo">Sem promessa e sem número inventado</h2>
          </div>
          <div className="prosa pg-trafego-prosa">
          <ul>
            <li>
              <strong>Não prometemos resultado.</strong> Nenhuma quantidade de leads, custo por lead ou retorno é
              garantida, porque isso depende do mercado, da oferta e do atendimento.
            </li>
            <li>
              <strong>Não mostramos número diário solto.</strong> Um dia bom ou ruim não diz nada. O relatório é
              mensal e consolidado.
            </li>
            <li>
              <strong>Não anunciamos sem medir.</strong> Se o rastreamento não estiver conferido, a campanha não vai
              ao ar.
            </li>
            <li>
              <strong>Não escondemos o contrato mínimo.</strong> São 6 meses, ditos no diagnóstico e escritos na
              proposta.
            </li>
          </ul>
          </div>
        </div>
      </section>

      <section className="secao" id="faq" aria-labelledby="faq-titulo">
        <div className="wrap faq">
          <div className="secao-topo faq-topo">
            <span className="label">Perguntas frequentes</span>
            <h2 id="faq-titulo">Dúvidas sobre tráfego pago</h2>
            <p className="secao-sub">O que mais perguntam antes de começar.</p>
          </div>
          <div className="faq-lista">
            {perguntas.map((p) => (
              <details key={p.pergunta}>
                <summary><h3>{p.pergunta}</h3><span className="faq-icone" aria-hidden="true" /></summary>
                <p>{p.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="secao" id="diagnostico" aria-labelledby="cta-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Próximo passo</span>
            <h2 id="cta-titulo">Comece pelo diagnóstico</h2>
            <p className="secao-sub">
              A gente olha como os seus contatos chegam hoje e diz, com franqueza, se tráfego pago faz sentido agora.
              Proposta em até 1 dia útil. Atendimento de segunda a sexta, das 9h às 17h.
            </p>
          </div>
          <div className="passos-pe">
            <a className="btn" href="/diagnostico">
              Agendar diagnóstico gratuito
              <Icone nome="seta" tamanho={16} />
            </a>
            <a className="btn ghost" href="/servicos">Ver todos os serviços</a>
          </div>
        </div>
      </section>
    </>
  )
}
