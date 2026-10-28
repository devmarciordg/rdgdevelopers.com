// Páginas geradas a partir de content/: cada post, cada tema com post, cada tag com página e cada case.
// Mesmo formato de src/paginas ({ rota, meta, Pagina }), então render e prerender não mudam.
import Artigo from '../components/Artigo.jsx'
import BlogLista from '../components/BlogLista.jsx'
import Case from '../components/Case.jsx'
import { artigo, breadcrumb, caso, colecao } from '../schema.js'
import { posts, temas, tags, projetos } from './index.js'

const recente = (lista) => lista.map((p) => p.atualizado ?? p.publicado).sort().at(-1)

const listagem = ({ rota, titulo, descricao, rotulo, lista }) => ({
  rota,
  meta: {
    titulo,
    descricao,
    lastmod: recente(lista),
    schema: [colecao({ titulo, descricao, rota, posts: lista }), breadcrumb([['Blog', '/blog'], [titulo, rota]])],
  },
  Pagina: () => (
    <BlogLista
      cabecalho={{ trilha: [['Blog', '/blog'], [rotulo]], rotulo, titulo, sub: descricao }}
      posts={lista}
      ativo={rota}
    />
  ),
})

export const paginasDoConteudo = [
  ...posts.map((p) => ({
    rota: p.rota,
    meta: {
      titulo: p.titulo,
      descricao: p.descricao,
      lastmod: p.atualizado ?? p.publicado,
      // O post já termina no CTA do diagnóstico: sem o convite repetido no rodapé
      semConvite: true,
      artigo: { publicado: p.publicado, atualizado: p.atualizado, secao: p.tema.nome, tags: p.tags.map((t) => t.nome) },
      schema: [artigo(p), breadcrumb([['Blog', '/blog'], [p.tema.nome, p.tema.rota], [p.titulo, p.rota]])],
    },
    Pagina: () => <Artigo post={p} />,
  })),
  ...temas.filter((t) => t.posts.length).map((t) => listagem({
    rota: t.rota, titulo: `Artigos sobre ${t.nome.toLowerCase()}`, descricao: t.descricao ?? `Artigos do blog da RDG Developers sobre ${t.nome}.`, rotulo: t.nome, lista: t.posts,
  })),
  ...tags.filter((t) => t.rota).map((t) => listagem({
    rota: t.rota, titulo: `Artigos sobre ${t.nome}`, descricao: t.descricao, rotulo: t.nome, lista: t.posts,
  })),
  ...projetos.map((p) => ({
    rota: p.rota,
    // O case termina no próprio convite, ligado ao serviço: sem o convite repetido no rodapé
    meta: { titulo: p.titulo, descricao: p.resumo, semConvite: true, imagem: `/og/projetos/${p.id}.png`, schema: [caso(p), breadcrumb([['Projetos', '/projetos'], [p.cliente, p.rota]])] },
    Pagina: () => <Case p={p} />,
  })),
]
