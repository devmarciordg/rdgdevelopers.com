import Icone from './Icone.jsx'
import marcioAvif480 from '../assets/marcio-480.avif'
import marcioAvif960 from '../assets/marcio-960.avif'
import marcioWebp480 from '../assets/marcio-480.webp'
import marcioWebp960 from '../assets/marcio-960.webp'
import luizaAvif480 from '../assets/luiza-480.avif'
import luizaAvif960 from '../assets/luiza-960.avif'
import luizaWebp480 from '../assets/luiza-480.webp'
import luizaWebp960 from '../assets/luiza-960.webp'
import '../styles/quem-somos.css'

const pessoas = [
  {
    nome: 'Márcio Patrick Rodrigues Dias',
    cargo: 'Sócio e responsável técnico',
    texto: 'Cuida da arquitetura de software, do desenvolvimento, do tráfego pago e da performance.',
    alt: 'Márcio Patrick Rodrigues Dias, responsável técnico da RDG Developers',
    avif: [marcioAvif480, marcioAvif960],
    webp: [marcioWebp480, marcioWebp960],
  },
  {
    nome: 'Luiza Silva',
    cargo: 'Comercial e relacionamento',
    texto: 'Cuida do primeiro contato, das propostas e do relacionamento com cada cliente.',
    alt: 'Luiza Silva, responsável comercial da RDG Developers',
    avif: [luizaAvif480, luizaAvif960],
    webp: [luizaWebp480, luizaWebp960],
  },
]

const valores = [
  { titulo: 'Honestidade', texto: 'A verdade vem primeiro, mesmo quando custa caro.' },
  { titulo: 'Respeito', texto: 'Todo mundo é bem-vindo. Preconceito, não.' },
  { titulo: 'Responsabilidade', texto: 'Palavra dada é palavra cumprida.' },
  { titulo: 'Cuidado com o outro', texto: 'O sucesso do cliente é o nosso sucesso.' },
  { titulo: 'Excelência', texto: 'Capricho em cada detalhe e vontade de melhorar sempre.' },
]

const sizes = '(min-width: 860px) 530px, calc(100vw - 40px)'
const srcset = ([p, g]) => `${p} 480w, ${g} 960w`

export default function QuemSomos() {
  return (
    <section className="secao" id="quem-somos" aria-labelledby="quem-somos-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">Quem somos</span>
          <h2 id="quem-somos-titulo">Preferimos perder uma venda a ganhar com uma mentira</h2>
          <p className="secao-sub">
            A RDG Developers é uma empresa independente de software e soluções digitais,
            com sede em Governador Valadares (MG). Você fala direto com quem atende e com quem constrói.
          </p>
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

        <div className="qs-missao">
          <p>
            Nossa missão é desenvolver soluções digitais de alta performance que eliminam gargalos
            técnicos, garantem precisão de dados e ajudam nossos clientes a crescer.{' '}
            <strong>Zero Gambiarra</strong> é o nosso padrão de trabalho: código limpo e só as
            dependências indispensáveis.
          </p>
          <a className="btn ghost" href="/sobre">
            Conheça a RDG
            <Icone nome="seta" tamanho={16} />
          </a>
        </div>

        <ul className="grade qs-valores" aria-label="Nossos valores">
          {valores.map((v) => (
            <li className="card" key={v.titulo}>
              <h3>{v.titulo}</h3>
              <p>{v.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
