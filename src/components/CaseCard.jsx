import Icone from './Icone.jsx'
import { valoresDoCase } from '../conteudo/filtros.js'
import '../styles/projetos.css'

// CDC art. 37 e CONAR: número de um cliente sempre acompanhado deste aviso. Por isso o card não mostra número
export const avisoResultado = (p) => `Resultado deste cliente, no período citado (${p.periodo}). Não é promessa: cada negócio tem verba, região e oferta diferentes.`
// Capa feita da logo por scripts/capas.py (src/assets/projetos/<id>-800|1600). Sem arquivo, fica a capa de cor com o nome
const imagens = import.meta.glob('../assets/projetos/*.{avif,webp}', { eager: true, import: 'default' })
const arq = (id, w, tipo) => imagens[`../assets/projetos/${id}-${w}.${tipo}`]

// Decorativa (aria-hidden, alt vazio): o nome do cliente já está no título. grande = topo do case, que é o LCP
export function Capa({ p, grande }) {
  const sizes = grande ? '(min-width: 900px) 540px, 100vw' : '(min-width: 1000px) 360px, 100vw'
  const srcset = (tipo) => `${arq(p.id, 800, tipo)} 800w, ${arq(p.id, 1600, tipo)} 1600w`
  return (
    <div className={`case-capa${grande ? ' case-capa-grande' : ''}`} style={{ '--c': p.capa.cor, '--t': p.capa.tinta }} aria-hidden="true">
      {arq(p.id, 800, 'webp') ? (
        <picture>
          <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
          <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
          <img src={arq(p.id, 800, 'webp')} width="1600" height="1000" alt="" decoding="async" {...(grande ? { fetchPriority: 'high' } : { loading: 'lazy' })} />
        </picture>
      ) : (
        <>
          <span className="case-capa-tipo">{grande ? p.segmento : 'Case'}</span>
          <span className="case-capa-nome">{p.cliente}</span>
        </>
      )}
    </div>
  )
}

// O case de relance: desafio, o que fizemos e resultado. Lista ordenada: a ordem é a história.
// Só no topo do case, em 3 colunas com ícone: o card mostra apenas capa, título e nicho
const PASSOS = [['desafio', 'Desafio'], ['acao', 'O que fizemos']]
const Rotulo = ({ children }) => <span className="info-rotulo">{children}<span className="sr-only">: </span></span>
export const Infografico = ({ p }) => {
  const { valor, resultado } = p.infografico
  return (
    <ol className="info info-grande" aria-label={`${p.cliente ?? p.titulo} em 3 passos`} style={{ '--c': p.capa.cor }}>
      {PASSOS.map(([k, rotulo]) => (
        <li key={k} className={`info-${k}`}>
          <Icone nome={k} tamanho={28} />
          <Rotulo>{rotulo}</Rotulo>
          <span className="info-texto">{p.infografico[k]}</span>
        </li>
      ))}
      <li className="info-resultado">
        <Icone nome="resultado" tamanho={28} />
        <Rotulo>Resultado</Rotulo>
        <span className="info-texto"><strong className="info-valor">{valor}</strong> {resultado}</span>
      </li>
    </ol>
  )
}

// Card de case (home, /projetos e "outros cases"): capa, título e nicho. Um link só, no título, esticado sobre o card inteiro.
// O h3 vem antes do nicho no HTML (quem navega por título não pula nada); o CSS sobe o nicho com order
export default function CaseCard({ p, Titulo = 'h3' }) {
  const v = valoresDoCase(p)
  return (
    <li className="case" data-servico={v.servico} data-setor={v.setor} data-nicho={v.nicho} data-tipo={v.tipo}>
      {!p.cliente && <p className="case-tag">Case de estudo</p>}
      <Capa p={p} />
      <div className="case-corpo">
        <Titulo><a href={p.rota}>{p.titulo}</a></Titulo>
        <p className="case-meta">{p.segmento} · {p.servicos[0].titulo}</p>
      </div>
    </li>
  )
}
