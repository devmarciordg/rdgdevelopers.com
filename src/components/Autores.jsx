import { Fragment } from 'react'

// Quem escreveu o post: avatares sobrepostos (versão em HTML/CSS do AvatarGroup da HeroUI, sem JS) e os nomes.
// Foto em src/assets/autores/<slug>.webp e .avif; sem foto, as iniciais. A foto é decorativa: o nome está ao lado
const fotos = import.meta.glob('../assets/autores/*.{avif,webp}', { eager: true, import: 'default' })
const foto = (slug, tipo) => fotos[`../assets/autores/${slug}.${tipo}`]
const iniciais = (nome) => { const p = nome.split(' '); return (p[0][0] + (p.length > 1 ? p.at(-1)[0] : '')).toUpperCase() }

export function Avatar({ a, tamanho = 32 }) {
  return (
    <span className="avatar" style={{ '--tam': `${tamanho}px` }} aria-hidden="true">
      {foto(a.slug, 'webp') ? (
        <picture>
          {foto(a.slug, 'avif') && <source type="image/avif" srcSet={foto(a.slug, 'avif')} />}
          <img src={foto(a.slug, 'webp')} width={tamanho} height={tamanho} alt="" loading="lazy" decoding="async" />
        </picture>
      ) : iniciais(a.nome)}
    </span>
  )
}

// Topo do post: grupo de avatares + "Por A, B e C" (cada nome leva à página da pessoa)
export function PorAutores({ autores }) {
  return (
    <span className="por-autores">
      <span className="avatar-grupo">{autores.map((a) => <Avatar key={a.slug} a={a} />)}</span>
      <span>Por {autores.map((a, i) => (
        <Fragment key={a.slug}>{i === 0 ? '' : i === autores.length - 1 ? ' e ' : ', '}<a href={a.url}>{a.nome}</a></Fragment>
      ))}</span>
    </span>
  )
}

// Fim do post: cada pessoa com foto, nome e cargo
export function QuemEscreveu({ autores }) {
  return (
    <section className="quem-escreveu" aria-labelledby="quem-escreveu-titulo">
      <h2 id="quem-escreveu-titulo" className="label">Quem escreveu</h2>
      <ul>
        {autores.map((a) => (
          <li key={a.slug}>
            <Avatar a={a} tamanho={56} />
            <span><a href={a.url}>{a.nome}</a>{a.cargo && <span className="quem-cargo">{a.cargo}</span>}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
