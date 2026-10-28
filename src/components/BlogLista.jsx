import CabecalhoPagina from './CabecalhoPagina.jsx'
import BlogTags from './BlogTags.jsx'
import { posts as todos, temas, dataBR } from '../conteudo/index.js'
import '../styles/pg-blog.css'

// Listagem do blog: geral (/blog), por tema e por tag. O filtro são links para páginas estáticas: funciona sem JS.
export default function BlogLista({ cabecalho, posts, ativo }) {
  const comPosts = temas.filter((t) => t.posts.length)
  return (
    <>
      <CabecalhoPagina {...cabecalho} />
      <section className="secao sem-numero" aria-labelledby="blog-lista-titulo">
        <div className="wrap">
          <nav className="blog-filtro" aria-label="Filtrar artigos por tema">
            <ul>
              {[{ rota: '/blog', nome: 'Todos', posts: todos }, ...comPosts].map((t) => (
                <li key={t.rota}>
                  <a href={t.rota} aria-current={t.rota === ativo ? 'page' : undefined}>
                    {t.nome} <span className="blog-filtro-n">{t.posts.length}<span className="sr-only"> {t.posts.length === 1 ? 'artigo' : 'artigos'}</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <h2 id="blog-lista-titulo" className="sr-only">Artigos</h2>
          {posts.length ? (
            <ol className="blog-lista">
              {posts.map((p) => (
                <li key={p.rota} className="blog-item">
                  <p className="blog-item-meta">
                    <a href={p.tema.rota}>{p.tema.nome}</a> · <time dateTime={p.publicado}>{dataBR(p.publicado)}</time> · {p.leitura} min de leitura
                  </p>
                  <h3><a href={p.rota}>{p.titulo}</a></h3>
                  <p>{p.descricao}</p>
                  <BlogTags tags={p.tags} rotulo={`Tags de ${p.titulo}`} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="secao-sub">Ainda não há artigos publicados aqui.</p>
          )}

          <p className="blog-feed">
            Quer saber quando sair texto novo? Assine o <a href="/blog/feed.xml">feed do blog (Atom)</a> no seu leitor de RSS.
          </p>
        </div>
      </section>
    </>
  )
}
