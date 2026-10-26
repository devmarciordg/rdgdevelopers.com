import CabecalhoPagina from '../../components/CabecalhoPagina.jsx'
import Icone from '../../components/Icone.jsx'
import { breadcrumb, servico, faq } from '../../schema.js'
import '../../styles/faq.css'
import '../../styles/pg-rastreamento.css'

const ROTA = '/servicos/rastreamento-server-side'
const DESCRICAO = 'Eventos enviados pelo navegador e pelo servidor (Meta CAPI e GTM server-side), com deduplicação e respeito ao consentimento da LGPD.'

const perguntas = [
  { pergunta: 'Preciso disso se já tenho o pixel instalado?', resposta: 'O pixel continua lá. O servidor entra como segundo caminho para os eventos que o navegador não consegue entregar. Os dois trabalham juntos, e a plataforma junta os duplicados.' },
  { pergunta: 'Quantas conversões a mais vou ver?', resposta: 'Não dá para prometer um número. O ganho depende de cada site, do público e de quantos visitantes aceitam os cookies. A gente mede antes e depois da implantação e mostra a diferença.' },
  { pergunta: 'Server-side serve para rastrear quem recusou os cookies?', resposta: 'Não. Os eventos de marketing só são enviados com o consentimento do visitante, pelo navegador ou pelo servidor. Server-side melhora a entrega dos dados autorizados, não é forma de burlar a escolha de ninguém.' },
  { pergunta: 'Funciona com WhatsApp e agendamento?', resposta: 'Sim. O clique para o WhatsApp e a confirmação de agendamento viram eventos próprios, enviados pelo navegador e pelo servidor como qualquer outra conversão.' },
  { pergunta: 'O mesmo evento não vai ser contado duas vezes?', resposta: 'Não, se a deduplicação estiver certa. Navegador e servidor enviam o mesmo event_id, e a plataforma guarda um só. É um dos pontos que conferimos evento a evento nos testes.' },
]

const entregas = [
  { titulo: 'Mapeamento dos eventos', texto: 'Definimos o que importa para o seu negócio: lead, contato pelo WhatsApp, agendamento, compra. Nada de rastrear tudo sem critério.' },
  { titulo: 'Configuração', texto: 'Pixel e tag no navegador, API de Conversões da Meta e Google Tag Manager server-side, com o mesmo event_id nos dois lados.' },
  { titulo: 'Testes evento a evento', texto: 'Conferimos cada evento nas ferramentas de diagnóstico da Meta e do Google: se chegou, se foi deduplicado e com quais dados.' },
  { titulo: 'Documentação', texto: 'Um registro do que foi feito: quais eventos existem, onde disparam e como conferir. Fica com você.' },
]

export const meta = {
  titulo: 'Rastreamento server-side: Meta CAPI e GTM',
  descricao: DESCRICAO,
  schema: [
    breadcrumb([['Serviços', '/servicos'], ['Rastreamento server-side', ROTA]]),
    servico({ nome: 'Rastreamento server-side (Meta CAPI e GTM server-side)', descricao: DESCRICAO, rota: ROTA }),
    faq(perguntas),
  ],
}

export default function RastreamentoServerSide() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Serviços', '/servicos'], ['Rastreamento server-side']]}
        rotulo="Rastreamento"
        titulo="Seu anúncio só aprende com o que consegue enxergar"
        sub="Parte das conversões do seu site não chega à Meta nem ao Google. A gente cria um segundo caminho, pelo servidor, para os dados que o visitante autorizou chegarem completos."
      />

      <section className="secao" id="problema" aria-labelledby="problema-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">O problema</span>
            <h2 id="problema-titulo">O pixel perde eventos no caminho</h2>
            <p className="secao-sub">
              Quando alguém preenche um formulário ou chama no WhatsApp, o site avisa a plataforma de anúncio pelo navegador do visitante.
              Só que esse aviso nem sempre chega.
            </p>
          </div>
          <ul className="grade">
            <li className="card"><h3>Bloqueadores de anúncio</h3><p>Extensões e navegadores que barram o pixel antes de ele enviar qualquer coisa.</p></li>
            <li className="card"><h3>Restrições do navegador</h3><p>O Safari, por exemplo, limita cookies de rastreamento com o ITP. Outros navegadores seguem caminho parecido.</p></li>
            <li className="card"><h3>Conexão que cai</h3><p>No celular, a pessoa envia o formulário e fecha a página. O aviso não termina de sair.</p></li>
            <li className="card"><h3>Recusa de cookies</h3><p>Quem não autoriza não deve ser rastreado. Isso é correto e continua assim.</p></li>
          </ul>
          <p className="pg-rastreamento-nota">
            Resultado: a Meta e o Google otimizam suas campanhas com dados incompletos. Eles acham que um anúncio converte menos do que converte
            e mandam a verba para o lugar errado. Explicamos com mais calma em{' '}
            <a href="/blog/pixel-perde-conversoes">por que o pixel perde conversões</a>.
          </p>
        </div>
      </section>

      <section className="secao" id="como-funciona" aria-labelledby="como-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Como funciona</span>
            <h2 id="como-titulo">Dois caminhos, uma conversão</h2>
            <p className="secao-sub">O evento sai pelo navegador, como hoje, e também pelo servidor. A plataforma recebe os dois e conta uma vez só.</p>
          </div>
          <figure className="pg-rastreamento-fig">
            <ol className="pg-rastreamento-fluxo">
              <li><strong>Visitante</strong><span>aceita os cookies e faz uma ação: lead, WhatsApp, agendamento, compra.</span></li>
              <li>
                <strong>Navegador</strong><span>pixel e tag do Google, como sempre.</span>
                <strong>Servidor</strong><span>API de Conversões da Meta e GTM server-side.</span>
              </li>
              <li><strong>Meta e Google</strong><span>recebem pelos dois lados, reconhecem o mesmo event_id e contam uma conversão.</span></li>
            </ol>
            <figcaption>Fluxo do evento: do visitante, por dois caminhos em paralelo, até as plataformas de anúncio.</figcaption>
          </figure>

          <div className="prosa pg-rastreamento-prosa">
            <h3>Para quem é técnico</h3>
            <p>
              No navegador, o pixel da Meta e a tag do Google disparam normalmente. Em paralelo, o mesmo evento é enviado do servidor:
              para a Meta pela <strong>Conversions API (CAPI)</strong>, e para o Google por um container do <strong>Google Tag Manager server-side</strong>,
              que recebe as requisições num domínio próprio e as repassa às plataformas.
            </p>
            <p>
              Cada evento leva um <code>event_id</code> gerado no navegador e repetido no envio do servidor. Com ele, a plataforma faz a
              deduplicação: se os dois chegam, fica um; se o navegador falha, o do servidor cobre. Dados de contato, como e-mail e telefone,
              vão com hash SHA-256 quando a plataforma exige esse formato.
            </p>
            <p>
              Para clínicas, a aplicação prática da CAPI está em <a href="/blog/meta-capi-para-clinicas">Meta CAPI para clínicas</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="secao" id="entregas" aria-labelledby="entregas-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">O que entregamos</span>
            <h2 id="entregas-titulo">Do mapa dos eventos à conferência</h2>
            <p className="secao-sub">O ganho depende de cada site, então não prometemos número: medimos antes e depois e mostramos a diferença.</p>
          </div>
          <ol className="grade">
            {entregas.map((e) => (
              <li className="card" key={e.titulo}><h3>{e.titulo}</h3><p>{e.texto}</p></li>
            ))}
          </ol>
          <p className="pg-rastreamento-nota">
            Rastreamento bem feito é a base da <a href="/servicos/trafego-pago">gestão de tráfego pago</a>: sem ele, a otimização trabalha no escuro.
          </p>
        </div>
      </section>

      <section className="secao" id="lgpd" aria-labelledby="lgpd-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">LGPD e consentimento</span>
            <h2 id="lgpd-titulo">Server-side não burla consentimento</h2>
          </div>
          <div className="prosa pg-rastreamento-prosa">
            <p>
              Vamos ser claros: enviar pelo servidor <strong>não</strong> é um jeito de rastrear quem disse não. Os eventos de marketing só saem,
              por qualquer caminho, depois que o visitante aceita no banner de cookies.
            </p>
            <p>
              A escolha dele é repassada às ferramentas pelo <strong>Google Consent Mode v2</strong>, e o servidor obedece à mesma regra do
              navegador. O que muda é a entrega: os dados autorizados chegam inteiros, sem se perder num bloqueador ou numa conexão ruim.
            </p>
          </div>
        </div>
      </section>

      <section className="secao" id="faq" aria-labelledby="faq-titulo">
        <div className="wrap faq">
          <div className="secao-topo faq-topo">
            <span className="label">Perguntas frequentes</span>
            <h2 id="faq-titulo">Dúvidas sobre rastreamento</h2>
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

      <section className="secao" id="cta" aria-labelledby="cta-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Próximo passo</span>
            <h2 id="cta-titulo">Descubra o que o seu pixel está perdendo</h2>
            <p className="secao-sub">No diagnóstico gratuito, a gente olha como o seu site envia os eventos hoje e indica o que vale ajustar.</p>
          </div>
          <a className="btn pg-rastreamento-btn" href="/diagnostico">Agendar diagnóstico gratuito <Icone nome="seta" tamanho={16} /></a>
        </div>
      </section>
    </>
  )
}
