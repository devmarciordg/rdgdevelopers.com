import CabecalhoPagina from './CabecalhoPagina.jsx'
import BlogTags from './BlogTags.jsx'
import { PorAutores, QuemEscreveu } from './Autores.jsx'
import { dataBR } from '../conteudo/index.js'
import '../styles/artigo.css'

// Sumário só compensa em texto com várias seções
const MIN_SECOES_SUMARIO = 3

// Página de post: cabeçalho com datas, sumário, corpo (HTML gerado de content/blog/*.md), tags, CTA e "Leia também"
export default function Artigo({ post: p }) {
  const secoes = p.titulos.filter((t) => t.nivel === 2)
  return (
    <article>
      <CabecalhoPagina trilha={[['Blog', '/blog'], [p.tema.nome, p.tema.rota], [p.titulo]]} rotulo={p.tema.nome} titulo={p.titulo} sub={p.descricao}>
        <p className="artigo-meta">
          <PorAutores autores={p.autores} /> · Publicado em <time dateTime={p.publicado}>{dataBR(p.publicado)}</time>
          {p.atualizado && p.atualizado !== p.publicado && <> · Atualizado em <time dateTime={p.atualizado}>{dataBR(p.atualizado)}</time></>}
          {' '}· {p.leitura} min de leitura
        </p>
      </CabecalhoPagina>
      <div className="wrap">
        {secoes.length >= MIN_SECOES_SUMARIO && (
          <nav className="sumario" aria-labelledby="sumario-titulo">
            <details open>
              <summary id="sumario-titulo">Neste artigo</summary>
              <ol>{secoes.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.texto}</a></li>)}</ol>
            </details>
          </nav>
        )}
        <div className="prosa" dangerouslySetInnerHTML={{ __html: p.html }} />
        <div className="artigo-tags">
          <span className="label">Assuntos</span>
          <BlogTags tags={p.tags} rotulo="Assuntos deste artigo" />
        </div>
        <QuemEscreveu autores={p.autores} />
        <aside className="artigo-cta" aria-label="Próximo passo">
          <p><strong>Quer aplicar isso no seu negócio?</strong> No diagnóstico gratuito de 20 minutos a gente olha o seu caso.</p>
          <a className="btn" href="/diagnostico">Agendar diagnóstico gratuito</a>
        </aside>
        {p.relacionados.length > 0 && (
          <section className="leia-tambem" aria-labelledby="leia-tambem-titulo">
            <h2 id="leia-tambem-titulo">Leia também</h2>
            <ul>
              {p.relacionados.map((r) => (
                <li key={r.rota}>
                  <span className="label">{r.tema.nome}</span>
                  <a href={r.rota}>{r.titulo}</a>
                  <span className="leia-tambem-meta">{r.leitura} min de leitura</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
