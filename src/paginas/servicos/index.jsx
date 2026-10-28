import CabecalhoPagina from '../../components/CabecalhoPagina.jsx'
import Icone from '../../components/Icone.jsx'
import { servicos } from '../../servicos.js'
import { breadcrumb, servico } from '../../schema.js'
import '../../styles/pg-servicos.css'

// Texto próprio desta página, na mesma ordem de src/servicos.js
const detalhes = [
  {
    id: 'sites',
    paragrafos: [
      'Site lento perde visita antes de carregar, e site sem medição não mostra de onde vêm os contatos.',
      'A gente entrega páginas leves, com SEO técnico desde a estrutura, formulário e botão de WhatsApp rastreados.',
      'Antes da entrega, cada página é medida no PageSpeed, e você recebe o resultado.',
    ],
  },
  {
    id: 'trafego',
    paragrafos: [
      'Anunciar sem acompanhar o custo de cada contato é gastar sem saber o que volta.',
      'A gente cria e gerencia campanhas no Meta Ads e no Google Ads, ligadas ao rastreamento do site.',
      'Todo mês você recebe um relatório consolidado de verba, leads, custo por lead e retorno.',
      'O contrato mínimo é de 6 meses, tempo para as campanhas aprenderem e os números ficarem comparáveis.',
    ],
  },
  {
    id: 'rastreamento',
    paragrafos: [
      'Bloqueadores de anúncio e navegadores com proteção de privacidade fazem o pixel perder conversões.',
      'A gente configura a Meta CAPI e o GTM server-side para que os eventos cheguem pelo servidor.',
      'Cada evento é conferido um a um antes de ir para as campanhas, sempre respeitando o consentimento de cookies.',
    ],
  },
  {
    id: 'automacao',
    paragrafos: [
      'Mensagem respondida tarde, agendamento anotado à mão e retorno esquecido custam clientes.',
      'A gente conecta o WhatsApp ao seu CRM para que respostas, agendamentos e retornos aconteçam sozinhos, com n8n e Evolution API.',
      'Também integramos sistemas que hoje não conversam entre si, para os dados não serem digitados duas vezes.',
    ],
    inclui: [
      'Respostas automáticas no WhatsApp',
      'Agendamentos e confirmações pelo WhatsApp',
      'Lembretes de retorno para clientes',
      'Conexão do WhatsApp com o CRM',
      'Fluxos no n8n com a Evolution API',
      'Integrações entre os sistemas que você já usa',
    ],
  },
  {
    id: 'perfil-google',
    paragrafos: [
      'Quem procura um serviço na sua região costuma decidir pelo que aparece no Google, antes de abrir qualquer site.',
      'A gente deixa o perfil da sua empresa completo e atualizado, com as categorias certas, horários e fotos otimizadas.',
      'As publicações mantêm o perfil ativo. Avaliações, só reais: a gente nunca compra avaliação.',
    ],
    inclui: [
      'Perfil da empresa completo e atualizado',
      'Escolha das categorias do negócio',
      'Horários de funcionamento corretos',
      'Fotos otimizadas, com metadados',
      'Publicações no perfil',
      'Avaliações apenas de clientes reais, nunca compradas',
    ],
  },
  {
    id: 'software-sob-medida',
    paragrafos: [
      'Quando nenhum sistema pronto encaixa no seu processo, a equipe acaba adaptando o trabalho à ferramenta.',
      'A gente desenha o sistema a partir do jeito que a sua empresa trabalha, e não o contrário.',
      'Depois da quitação, o código é cedido a você, conforme o contrato.',
    ],
    inclui: [
      'Levantamento do processo da empresa',
      'Sistema desenhado para esse processo',
      'Cessão do código ao cliente após a quitação, conforme o contrato',
    ],
  },
]

const lista = servicos.map((s, i) => ({ ...s, ...detalhes[i] }))

export const meta = {
  titulo: 'Serviços: sites, tráfego, rastreamento e automação',
  descricao: 'Sites, tráfego pago, rastreamento server-side, automações no WhatsApp, perfil no Google e software sob medida. Comece por um diagnóstico gratuito.',
  schema: [
    breadcrumb([['Serviços', '/servicos']]),
    ...servicos.map((s) => servico({ nome: s.titulo, descricao: s.texto, rota: s.href })),
  ],
}

export default function Servicos() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Serviços']]}
        rotulo="Serviços"
        titulo="O que a gente faz pela sua empresa"
        sub="Seis serviços que se conectam: o site recebe a visita, o anúncio traz quem procura, o rastreamento mede e a automação responde. Comece por um diagnóstico gratuito."
      />

      {lista.map((s) => (
        <section className="secao" id={s.id} aria-labelledby={`${s.id}-titulo`} key={s.id}>
          <div className="wrap pg-servicos-split">
            <div>
              <span className="card-icone"><Icone nome={s.icone} /></span>
              <span className="label pg-servicos-label">{s.desc}</span>
              <h2 id={`${s.id}-titulo`}>{s.titulo}</h2>
            </div>
            <div className="pg-servicos-texto">
              {s.paragrafos.map((p) => <p key={p}>{p}</p>)}
              {s.inclui && (
                <>
                  <h3>O que inclui</h3>
                  <ul>{s.inclui.map((item) => <li key={item}>{item}</li>)}</ul>
                </>
              )}
              {s.href.startsWith('/servicos/') ? (
                <a className="btn ghost" href={s.href}>
                  Ver detalhes de {s.titulo.toLowerCase()} <Icone nome="seta" tamanho={16} />
                </a>
              ) : (
                <a className="btn ghost" href="/diagnostico">
                  Conversar sobre {s.titulo.toLowerCase()} <Icone nome="seta" tamanho={16} />
                </a>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="secao" id="proximo-passo" aria-labelledby="proximo-passo-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Próximo passo</span>
            <h2 id="proximo-passo-titulo">Não sabe por onde começar?</h2>
            <p className="secao-sub">
              No diagnóstico gratuito a gente olha o que você já tem e diz quais serviços fazem sentido agora.
              Para o site que já está no ar, existe a manutenção mensal, com hospedagem, backup e monitoramento.
            </p>
          </div>
          <p className="pg-servicos-acoes">
            <a className="btn" href="/diagnostico">Agendar diagnóstico gratuito</a>
            <a className="btn ghost" href="/manutencao">Conhecer a manutenção mensal</a>
          </p>
        </div>
      </section>
    </>
  )
}
