import BlogLista from '../../components/BlogLista.jsx'
import { posts } from '../../conteudo/index.js'
import { breadcrumb, colecao } from '../../schema.js'

const titulo = 'Blog: tráfego, automação e sites'
const descricao = 'Artigos práticos da RDG Developers sobre tráfego e dados, automação, performance de sites e os bastidores técnicos do que a gente constrói.'

export const meta = {
  titulo,
  descricao,
  lastmod: posts.map((p) => p.atualizado ?? p.publicado).sort().at(-1),
  schema: [colecao({ titulo, descricao, rota: '/blog', posts }), breadcrumb([['Blog', '/blog']])],
}

export default function Blog() {
  return (
    <BlogLista
      cabecalho={{
        trilha: [['Blog']],
        rotulo: 'Blog',
        titulo: 'O que a gente aprende no dia a dia',
        sub: 'Textos diretos sobre rastreamento, tráfego, automação e sites rápidos, escritos por quem faz o trabalho.',
      }}
      posts={posts}
      ativo="/blog"
    />
  )
}
