import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import Contato from '../components/Contato.jsx'
import { breadcrumb } from '../schema.js'
import '../styles/pg-diagnostico.css'

export const meta = {
  titulo: 'Diagnóstico gratuito de 20 minutos',
  descricao:
    'Conversa gratuita e sem compromisso sobre site, anúncios, rastreamento e WhatsApp do seu negócio. Proposta em até 1 dia útil. Faça antes o mini-diagnóstico.',
  schema: [breadcrumb([['Diagnóstico gratuito', '/diagnostico']])],
}

// Cada pergunta: resposta "não" ou "não sei" vira um ponto de atenção ligado ao serviço.
const perguntas = [
  {
    id: 'site',
    pergunta: 'Seu negócio tem site próprio?',
    ponto: 'Sem site próprio',
    texto: 'Sem uma página sua, quem chega pelo Google ou por anúncio depende só de rede social para entender o que você faz.',
    href: '/servicos/landing-pages-sites',
    servico: 'Ver landing pages e sites',
  },
  {
    id: 'rapido',
    pergunta: 'O site abre rápido no celular?',
    ponto: 'Velocidade no celular',
    texto: 'Página lenta no celular faz gente desistir antes de ver o serviço. Vale medir no PageSpeed.',
    href: '/servicos/landing-pages-sites',
    servico: 'Ver landing pages e sites',
  },
  {
    id: 'perfil',
    pergunta: 'O Perfil da Empresa no Google está completo e atualizado?',
    ponto: 'Perfil da Empresa no Google',
    texto: 'Horário, telefone, fotos e categoria desatualizados atrapalham quem procura você no Google Maps.',
    href: '/servicos#perfil-google',
    servico: 'Ver Perfil da Empresa no Google',
  },
  {
    id: 'anuncia',
    pergunta: 'Você anuncia no Meta (Instagram e Facebook) ou no Google?',
    ponto: 'Anúncios',
    texto: 'Se fizer sentido para o seu negócio, anúncio bem segmentado ajuda a chegar em quem está perto e procurando.',
    href: '/servicos/trafego-pago',
    servico: 'Ver tráfego pago',
  },
  {
    id: 'origem',
    pergunta: 'Você sabe quantos contatos vieram de cada anúncio no último mês?',
    ponto: 'Origem dos contatos',
    texto: 'Sem saber qual anúncio trouxe cada contato, a verba vai para o que parece funcionar, não para o que funciona.',
    href: '/servicos/rastreamento-server-side',
    servico: 'Ver rastreamento server-side',
  },
  {
    id: 'pixel',
    pergunta: 'O pixel ou a API de Conversões está configurado?',
    ponto: 'Pixel e API de Conversões',
    texto: 'Sem eventos conferidos, a plataforma de anúncios otimiza com dados incompletos.',
    href: '/servicos/rastreamento-server-side',
    servico: 'Ver rastreamento server-side',
  },
  {
    id: 'whatsapp',
    pergunta: 'Você responde o WhatsApp em poucos minutos no horário comercial?',
    ponto: 'Tempo de resposta no WhatsApp',
    texto: 'Mensagem respondida horas depois esfria o contato que você pagou para trazer.',
    href: '/servicos#automacao',
    servico: 'Ver automação de atendimento',
  },
  {
    id: 'crm',
    pergunta: 'Você registra os contatos num CRM ou planilha?',
    ponto: 'Registro dos contatos',
    texto: 'Sem registro, fica difícil fazer retorno, lembrar quem pediu orçamento e saber o que deu certo.',
    href: '/servicos#automacao',
    servico: 'Ver automação e CRM',
  },
]

const opcoes = [['sim', 'Sim'], ['nao', 'Não'], ['nao-sei', 'Não sei']]

export default function Diagnostico() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Diagnóstico gratuito']]}
        rotulo="Diagnóstico gratuito"
        titulo="Diagnóstico gratuito em 20 minutos"
        sub="Uma conversa gratuita e sem compromisso sobre o seu site, anúncios e atendimento. Depois, a gente envia uma proposta em até 1 dia útil."
      >
        <p className="pg-diagnostico-acoes">
          <a className="btn" href="#contato">Pedir diagnóstico</a>
          <a className="btn ghost" href="#mini-diagnostico">Fazer o mini-diagnóstico</a>
        </p>
      </CabecalhoPagina>

      <section className="secao" id="mini-diagnostico" aria-labelledby="mini-diagnostico-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Mini-diagnóstico</span>
            <h2 id="mini-diagnostico-titulo">8 perguntas antes da conversa</h2>
            <p className="secao-sub">
              Responda aqui mesmo. As respostas ficam só no seu navegador: nada é enviado nem salvo.
            </p>
          </div>

          <form className="pg-diagnostico-form" data-diagnostico>
            <ol className="pg-diagnostico-lista">
              {perguntas.map((p, i) => (
                <li key={p.id}>
                  <fieldset className="pg-diagnostico-q">
                    <legend>
                      <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> {p.pergunta}
                    </legend>
                    <div className="pg-diagnostico-op">
                      {opcoes.map(([v, rotulo]) => (
                        <label key={v}>
                          <input type="radio" name={p.id} value={v} required />
                          {rotulo}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </li>
              ))}
            </ol>

            {/* Sem JS o botão fica escondido e as perguntas valem como checklist */}
            <button className="btn" type="submit" hidden>Ver pontos de atenção</button>

            <div aria-live="polite">
              <div className="pg-diagnostico-res" data-resultado hidden>
                <h3>Pontos de atenção</h3>
                <p data-nenhum hidden>
                  Pelas suas respostas, nenhum ponto chamou atenção. Mesmo assim, a conversa pode encontrar ajustes finos.
                </p>
                <ul className="grade">
                  {perguntas.map((p) => (
                    <li className="card" data-q={p.id} key={p.id} hidden>
                      <h4>{p.ponto}</h4>
                      <p>{p.texto}</p>
                      <a href={p.href}>{p.servico}</a>
                    </li>
                  ))}
                </ul>
                <p className="pg-diagnostico-nota">
                  Este resultado é só orientativo e parte das suas próprias respostas. Não é uma análise do seu negócio.
                  Na conversa de 20 minutos a gente olha o seu caso de verdade.
                </p>
                <a className="btn" href="#contato">Pedir diagnóstico gratuito</a>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Contato />
    </>
  )
}
