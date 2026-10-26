import CabecalhoPagina from '../../components/CabecalhoPagina.jsx'
import Icone from '../../components/Icone.jsx'
import { breadcrumb, servico, faq } from '../../schema.js'
import '../../styles/pg-sites.css'

const ROTA = '/servicos/landing-pages-sites'
const DESCRICAO = 'Criação de site institucional e landing page sob medida, leves, com SEO técnico, formulário LGPD e WhatsApp rastreados. Testado no celular antes de ir ao ar.'

// Texto puro: o mesmo conteúdo vai para o schema FAQPage.
const perguntas = [
  { pergunta: 'Preciso de um site institucional ou de uma landing page?', resposta: 'Depende do objetivo. Se você quer apresentar a empresa e aparecer no Google para vários serviços, o caminho é o site institucional. Se vai anunciar uma oferta específica, a landing page converte melhor, porque tem um objetivo só. Muitos negócios usam os dois. A gente define isso com você no diagnóstico.' },
  { pergunta: 'Vocês garantem nota máxima no PageSpeed?', resposta: 'Não prometemos nota. A meta de performance do seu site entra por escrito no escopo da proposta, e a gente mede no PageSpeed, no celular, antes da entrega. Este próprio site é o exemplo do padrão que seguimos.' },
  { pergunta: 'O site já vem pronto para medir os contatos?', resposta: 'Sim. O formulário, com consentimento LGPD, e o botão de WhatsApp saem rastreados desde o primeiro dia. Antes de ir ao ar, a gente confere se cada evento de conversão está chegando.' },
  { pergunta: 'Por que não usar um construtor pronto ou um tema cheio de plugins?', resposta: 'Cada plugin e cada biblioteca extra é código que o celular do seu cliente precisa baixar e executar. Fazendo sob medida, só entra o indispensável, o que deixa o site mais leve e mais fácil de manter.' },
  { pergunta: 'Quem cuida do site depois que ele vai ao ar?', resposta: 'Você pode contratar um plano de manutenção mensal, com hospedagem, backup e monitoramento. Os detalhes estão na página de manutenção.' },
]

export const meta = {
  titulo: 'Criação de site e landing page sob medida',
  descricao: DESCRICAO,
  schema: [
    breadcrumb([['Serviços', '/servicos'], ['Sites e landing pages', ROTA]]),
    servico({ nome: 'Criação de sites e landing pages', descricao: DESCRICAO, rota: ROTA }),
    faq(perguntas),
  ],
}

const tipos = [
  {
    titulo: 'Site institucional',
    resumo: 'Apresenta a sua empresa e trabalha para ser encontrado no Google.',
    itens: [
      'Várias páginas: início, serviços, sobre, contato e o que mais o negócio pedir.',
      'Uma página para cada serviço, com título e descrição próprios para o Google.',
      'Serve de base para quem pesquisa, compara e quer conhecer você antes de chamar.',
      'Ideal para presença de longo prazo e SEO.',
    ],
  },
  {
    titulo: 'Landing page',
    resumo: 'Uma página, um objetivo: levar o visitante a uma ação.',
    itens: [
      'Fala de uma oferta só, sem menus que desviam a atenção.',
      'Texto e chamada organizados para o visitante chegar ao contato.',
      'Ideal para receber o tráfego de anúncios no Google ou no Instagram.',
      'Fácil de medir: cada clique no formulário ou no WhatsApp é contado.',
    ],
  },
]

const inclusos = [
  { icone: 'sites', titulo: 'Sob medida, sem gambiarra', texto: 'Layout e código feitos para o seu negócio, com só as dependências indispensáveis. Nada de tema pesado ou plugin sobrando. É o nosso padrão Zero Gambiarra.' },
  { icone: 'tecnico', titulo: 'Core Web Vitals no celular', texto: 'Carregamento, estabilidade visual e resposta ao toque são medidos no PageSpeed, no celular, antes da entrega. A meta de performance entra no escopo da proposta.' },
  { icone: 'google', titulo: 'SEO técnico', texto: 'Título e descrição por página, dados estruturados, sitemap, URLs limpas e acessibilidade. A base para o Google entender e mostrar o seu site.' },
  { icone: 'rastreamento', titulo: 'Conversões rastreadas', texto: 'Formulário com consentimento LGPD e botão de WhatsApp com eventos configurados e conferidos desde o primeiro dia no ar.' },
]

const passos = [
  { titulo: 'Diagnóstico', texto: 'Uma conversa para entender o negócio, o público e o objetivo. Daí sai a escolha entre site, landing page ou os dois.' },
  { titulo: 'Proposta e escopo', texto: 'Páginas, funcionalidades e meta de performance por escrito, antes de qualquer linha de código.' },
  { titulo: 'Construção e validação', texto: 'A gente constrói e testa tudo antes de ir ao ar: PageSpeed no celular, formulário, botão de WhatsApp e eventos de conversão.' },
  { titulo: 'No ar e relatório', texto: 'Site publicado e, 30 dias depois, um relatório com o que aconteceu no primeiro mês.' },
]

export default function LandingPagesSites() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Serviços', '/servicos'], ['Sites e landing pages']]}
        rotulo="Sites e landing pages"
        titulo="Criação de site e landing page que carregam rápido e medem cada contato"
        sub="Sites institucionais e landing pages feitos sob medida, leves e prontos para o Google. Formulário e WhatsApp rastreados desde o primeiro dia, e tudo testado no celular antes de ir ao ar."
      >
        <div className="pg-sites-cta">
          <a className="btn" href="/diagnostico">Agendar diagnóstico gratuito</a>
          <a className="btn ghost" href="/performance">Ver a performance deste site</a>
        </div>
      </CabecalhoPagina>

      <section className="secao" id="site-ou-landing" aria-labelledby="site-ou-landing-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Site ou landing page</span>
            <h2 id="site-ou-landing-titulo">Qual dos dois o seu negócio precisa</h2>
            <p className="secao-sub">Os dois são páginas na internet, mas têm trabalhos diferentes. Escolher certo evita gastar com o formato errado.</p>
          </div>
          <ul className="grade">
            {tipos.map((t) => (
              <li className="card pg-sites-tipo" key={t.titulo}>
                <h3>{t.titulo}</h3>
                <p>{t.resumo}</p>
                <ul>{t.itens.map((i) => <li key={i}>{i}</li>)}</ul>
              </li>
            ))}
          </ul>
          <p className="pg-sites-nota">Vai anunciar e também quer aparecer na busca orgânica? É comum ter o site institucional como base e landing pages para cada campanha. Se o plano inclui anúncios, veja também a <a href="/servicos/trafego-pago">gestão de tráfego pago</a>.</p>
        </div>
      </section>

      <section className="secao" id="incluso" aria-labelledby="incluso-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">O que está incluso</span>
            <h2 id="incluso-titulo">Leve, encontrável e medido</h2>
            <p className="secao-sub">Site bonito que demora para abrir no celular perde o visitante antes da primeira linha. Por isso a gente cuida da parte que não aparece.</p>
          </div>
          <ul className="grade">
            {inclusos.map((c) => (
              <li className="card" key={c.titulo}>
                <span className="card-icone"><Icone nome={c.icone} /></span>
                <h3>{c.titulo}</h3>
                <p>{c.texto}</p>
              </li>
            ))}
          </ul>
          <p className="pg-sites-nota">Quer ver o padrão na prática? Este site foi feito do mesmo jeito, e as medições dele estão na página de <a href="/performance">performance do site da RDG</a>.</p>
        </div>
      </section>

      <section className="secao" id="como-funciona" aria-labelledby="como-funciona-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Como funciona</span>
            <h2 id="como-funciona-titulo">Do diagnóstico ao relatório de 30 dias</h2>
            <p className="secao-sub">Nada vai ao ar sem ser testado. E a entrega não termina na publicação.</p>
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
          <p className="pg-sites-nota">Depois de no ar, o site precisa de cuidado: hospedagem, backup e monitoramento para saber se algo sair do ar. Para isso existem os <a href="/manutencao">planos de manutenção mensal</a>.</p>
        </div>
      </section>

      <section className="secao" id="faq" aria-labelledby="faq-titulo">
        <div className="wrap faq">
          <div className="secao-topo faq-topo">
            <span className="label">Perguntas frequentes</span>
            <h2 id="faq-titulo">Dúvidas sobre criação de site</h2>
            <p className="secao-sub">O que mais perguntam antes de começar um site ou uma landing page.</p>
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
            <h2 id="cta-titulo">Comece pelo diagnóstico gratuito</h2>
            <p className="secao-sub">Conte o que o seu negócio faz e o que espera do site. A gente indica se o melhor caminho é um site institucional, uma landing page ou os dois, e o que entraria no escopo.</p>
          </div>
          <a className="btn" href="/diagnostico">
            Agendar diagnóstico gratuito <Icone nome="seta" tamanho={16} />
          </a>
        </div>
      </section>
    </>
  )
}
