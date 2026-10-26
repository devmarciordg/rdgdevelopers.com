import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import Icone from '../components/Icone.jsx'
import { empresa } from '../empresa.js'
import { breadcrumb, organizacao } from '../schema.js'
import marcioAvif480 from '../assets/marcio-480.avif'
import marcioAvif960 from '../assets/marcio-960.avif'
import marcioWebp480 from '../assets/marcio-480.webp'
import marcioWebp960 from '../assets/marcio-960.webp'
import luizaAvif480 from '../assets/luiza-480.avif'
import luizaAvif960 from '../assets/luiza-960.avif'
import luizaWebp480 from '../assets/luiza-480.webp'
import luizaWebp960 from '../assets/luiza-960.webp'
import '../styles/quem-somos.css'
import '../styles/pg-sobre.css'

export const meta = {
  titulo: 'Sobre nós: quem somos, missão e valores',
  descricao: 'Quem somos, missão, visão, valores e padrões de trabalho da RDG Developers, empresa de software e soluções digitais de Governador Valadares (MG).',
  schema: [breadcrumb([['Sobre', '/sobre']]), organizacao()],
}

const pessoas = [
  {
    nome: 'Márcio Patrick Rodrigues Dias',
    cargo: 'Sócio e responsável técnico',
    texto: 'Cuida da arquitetura de software, do desenvolvimento, de DevOps e infraestrutura, das integrações, do tráfego pago e da performance.',
    alt: 'Márcio Patrick Rodrigues Dias, responsável técnico da RDG Developers',
    avif: [marcioAvif480, marcioAvif960],
    webp: [marcioWebp480, marcioWebp960],
  },
  {
    nome: 'Luiza Silva',
    cargo: 'Comercial e relacionamento',
    texto: 'Cuida do primeiro contato, da qualificação, das propostas e do relacionamento com cada cliente.',
    alt: 'Luiza Silva, responsável comercial da RDG Developers',
    avif: [luizaAvif480, luizaAvif960],
    webp: [luizaWebp480, luizaWebp960],
  },
]

const valores = [
  {
    titulo: 'Honestidade',
    sim: ['Falamos a verdade sobre prazos, riscos e erros.', 'Propostas sem letra miúda.', 'Dizemos "não sei" quando não sabemos.'],
    nao: ['Esconder problemas.', 'Prometer o que não vamos cumprir.', 'Maquiar números.'],
  },
  {
    titulo: 'Respeito',
    sim: ['Todo mundo é bem-vindo, sem preconceito de gênero, identidade de gênero, orientação sexual, raça, etnia, religião, idade, deficiência, classe social ou aparência.'],
    nao: ['Piadas preconceituosas.', 'Silêncio diante de desrespeito.'],
  },
  {
    titulo: 'Responsabilidade',
    sim: ['Cumprimos prazos ou avisamos antes.', 'Assumimos o erro e resolvemos.', 'Entregamos algo que outra pessoa consegue manter.'],
    nao: ['Empurrar problema para frente.', 'Entregar remendo escondido.'],
  },
  {
    titulo: 'Cuidado com o outro',
    sim: ['Entendemos o negócio antes de propor.', 'Recomendamos o melhor, mesmo que seja mais simples ou mais barato.'],
    nao: ['Vender o que o cliente não precisa.', 'Sumir depois da entrega.'],
  },
  {
    titulo: 'Excelência',
    sim: ['Estudamos e evoluímos.', 'Melhoramos o que já funciona.'],
    nao: ['Aceitar o mediano por comodidade.'],
  },
]

const padroes = [
  { titulo: 'Zero Gambiarra', texto: 'Código limpo e só as dependências indispensáveis.' },
  { titulo: 'Foco em dados', texto: 'Depois da entrega, medimos e reportamos o resultado.' },
  { titulo: 'Performance e confiabilidade', texto: 'Atenção aos Core Web Vitals e monitoramento do que está no ar.' },
  { titulo: 'Escopo claro', texto: 'Proposta e contrato antes de começar. Mudança de escopo sempre por escrito.' },
]

const ferramentas = ['PHP', 'Python', 'Node.js', 'JavaScript', 'React', 'Vite', 'MySQL', 'Redis', 'Docker', 'Caddy', 'n8n', 'Evolution API', 'Uptime Kuma', 'Git']

const sizes = '(min-width: 860px) 530px, calc(100vw - 40px)'
const srcset = ([p, g]) => `${p} 480w, ${g} 960w`

export default function Sobre() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Sobre']]}
        rotulo="Sobre a RDG"
        titulo="Software sob medida, com a verdade na frente"
        sub={`A ${empresa.nome} é uma empresa independente de software e soluções digitais, com sede em Governador Valadares (MG). Começamos a atividade em dezembro de 2025.`}
      >
        <p className="pg-sobre-legal">{empresa.razaoSocial} · CNPJ {empresa.cnpj}</p>
      </CabecalhoPagina>

      <section className="secao" id="pessoas" aria-labelledby="pessoas-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Pessoas</span>
            <h2 id="pessoas-titulo">Quem atende e quem constrói</h2>
            <p className="secao-sub">Você fala direto com as pessoas que cuidam do seu projeto.</p>
          </div>
          <ul className="qs-pessoas">
            {pessoas.map((p) => (
              <li key={p.nome}>
                <picture>
                  <source type="image/avif" srcSet={srcset(p.avif)} sizes={sizes} />
                  <source type="image/webp" srcSet={srcset(p.webp)} sizes={sizes} />
                  <img className="qs-foto" src={p.webp[1]} width="960" height="720" loading="lazy" decoding="async" alt={p.alt} />
                </picture>
                <h3>{p.nome}</h3>
                <p className="qs-cargo">{p.cargo}</p>
                <p>{p.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao" id="missao" aria-labelledby="missao-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Missão e visão</span>
            <h2 id="missao-titulo">Por que existimos e aonde queremos chegar</h2>
          </div>
          <div className="grade">
            <div className="card">
              <h3 className="pg-sobre-h3">Missão</h3>
              <p className="pg-sobre-citacao">
                Desenvolver soluções digitais e arquiteturas de software de alta performance que eliminam
                gargalos técnicos, garantem precisão de dados e impulsionam o crescimento sustentável dos
                nossos clientes.
              </p>
            </div>
            <div className="card">
              <h3 className="pg-sobre-h3">Visão (a nossa meta)</h3>
              <p className="pg-sobre-citacao">
                Até 2036, ser referência nacional em engenharia de software sob medida e dados server-side.
              </p>
              <p>É onde queremos chegar, não algo que já somos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="secao" id="valores" aria-labelledby="valores-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Valores</span>
            <h2 id="valores-titulo">O que fazemos e o que não fazemos</h2>
            <p className="secao-sub">Valor só vale se aparece no dia a dia. Por isso cada um vem com os dois lados.</p>
          </div>
          <ul className="grade pg-sobre-valores">
            {valores.map((v) => (
              <li className="card" key={v.titulo}>
                <h3 className="pg-sobre-h3">{v.titulo}</h3>
                <div className="pg-sobre-lados">
                  <div>
                    <p className="pg-sobre-lado">O que fazemos</p>
                    <ul>{v.sim.map((t) => <li key={t}>{t}</li>)}</ul>
                  </div>
                  <div>
                    <p className="pg-sobre-lado">O que não fazemos</p>
                    <ul>{v.nao.map((t) => <li key={t}>{t}</li>)}</ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao" id="padroes" aria-labelledby="padroes-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Padrões de trabalho</span>
            <h2 id="padroes-titulo">Como a gente trabalha</h2>
          </div>
          <ul className="grade">
            {padroes.map((p) => (
              <li className="card" key={p.titulo}>
                <h3 className="pg-sobre-h3">{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao" id="ferramentas" aria-labelledby="ferramentas-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Caixa de ferramentas</span>
            <h2 id="ferramentas-titulo">Com o que construímos</h2>
            <p className="secao-sub">A ferramenta certa para cada problema, sem dependência que não seja indispensável.</p>
          </div>
          <ul className="pg-sobre-tags">
            {ferramentas.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <p className="pg-sobre-cta">
            <a className="btn" href="/diagnostico">
              Conversar com a gente
              <Icone nome="seta" tamanho={16} />
            </a>
            <a className="btn ghost" href="/servicos">Ver serviços</a>
          </p>
        </div>
      </section>
    </>
  )
}
