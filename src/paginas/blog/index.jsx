import CabecalhoPagina from '../../components/CabecalhoPagina.jsx'
import { breadcrumb } from '../../schema.js'
import '../../styles/pg-blog.css'

export const meta = {
  titulo: 'Blog: tráfego, automação e sites',
  descricao: 'Artigos práticos da RDG Developers sobre tráfego e dados, automação, performance de sites e os bastidores técnicos do que a gente constrói.',
  schema: [breadcrumb([['Blog', '/blog']])],
}

const CATEGORIAS = ['Tráfego e dados', 'Automação', 'Performance e sites', 'Bastidores técnicos']

// Exclui o próprio index para não criar import circular
const modulos = import.meta.glob(['./*.jsx', '!./index.jsx'], { eager: true })
const posts = Object.entries(modulos)
  .map(([arq, m]) => ({ ...m.meta, rota: '/blog/' + arq.slice(2, -4) }))
  .sort((a, b) => b.data.localeCompare(a.data))

const dataBR = (iso) => iso.split('-').reverse().join('/')

export default function Blog() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Blog']]}
        rotulo="Blog"
        titulo="O que a gente aprende no dia a dia"
        sub="Textos diretos sobre rastreamento, tráfego, automação e sites rápidos, escritos por quem faz o trabalho."
      />
      <section className="secao" aria-labelledby="pg-blog-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Artigos</span>
            <h2 id="pg-blog-titulo">Todos os artigos</h2>
            <p className="secao-sub">Os textos estão organizados em quatro temas:</p>
            <ul className="pg-blog-cats">
              {CATEGORIAS.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <ol className="pg-blog-lista">
            {posts.map((p) => (
              <li key={p.rota} className="pg-blog-item">
                <span className="label">{p.categoria}</span>
                <h3><a href={p.rota}>{p.titulo}</a></h3>
                <p>{p.descricao}</p>
                <p className="pg-blog-meta"><time dateTime={p.data}>{dataBR(p.data)}</time> · {p.leitura} de leitura</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
