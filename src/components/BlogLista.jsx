import CabecalhoPagina from './CabecalhoPagina.jsx'
import BlogTags from './BlogTags.jsx'
import BuscaTags from './BuscaTags.jsx'
import { dataBR } from '../conteudo/index.js'
import '../styles/pg-blog.css'

// Listagem do blog: geral (/blog), por tema e por tag. A busca (BuscaTags) só filtra o que já está na página: sem JS, a lista fica completa.
export default function BlogLista({ cabecalho, posts }) {
  return (
    <>
      <CabecalhoPagina {...cabecalho} />
      <section className="secao sem-numero" aria-labelledby="blog-lista-titulo">
        <div className="wrap">
          <BuscaTags posts={posts} />

          <h2 id="blog-lista-titulo" className="sr-only">Artigos</h2>
          {posts.length ? (
            <ol className="blog-lista">
              {posts.map((p) => (
                <li key={p.rota} className="blog-item" data-tags={p.tags.map((t) => t.slug).join('|')}>
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
          <p className="secao-sub" data-busca-vazio hidden>Nenhum artigo encontrado com essa busca. <button className="link-limpar" type="button">Limpar busca</button></p>

          <p className="blog-feed">
            Quer saber quando sair texto novo? Assine o <a href="/blog/feed.xml">feed do blog (Atom)</a> no seu leitor de RSS.
          </p>
        </div>
      </section>
    </>
  )
}
