import { contar } from '../conteudo/filtros.js'

// Busca por título e por tags da listagem do blog. Oculta no HTML: a ilha islands/buscaTags.js mostra, então sem JS não há controle que não funciona.
export default function BuscaTags({ posts }) {
  const tags = [...new Map(posts.flatMap((p) => p.tags).map((t) => [t.slug, t])).values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  // Com 1 artigo, ou sem tags para escolher, não há o que filtrar
  if (posts.length < 2 || tags.length < 2) return null
  const cards = posts.map((p) => ({ tags: p.tags.map((t) => t.slug).join('|') }))
  return (
    <div className="busca-tags" data-busca-tags hidden>
      <div className="busca-nome">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input type="search" aria-label="Pesquisar artigo pelo nome" placeholder="Pesquisar artigo pelo nome" autoComplete="off" data-busca-nome />
      </div>
      <div className="filtro">
        <button type="button" aria-expanded="false" aria-controls="busca-tags-painel">
          <span>Buscar por tag<span data-busca-valor></span></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div id="busca-tags-painel" className="filtro-painel">
          <div className="busca-campo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input type="text" role="combobox" aria-label="Buscar tag" aria-expanded="false" aria-controls="busca-tags-lista" aria-autocomplete="list" autoComplete="off" placeholder="Digite o nome da tag" />
          </div>
          <ul id="busca-tags-lista" className="busca-opcoes" role="listbox" aria-label="Tags" aria-multiselectable="true" tabIndex={-1}>
            {tags.map((t) => (
              <li key={t.slug} id={`busca-tag-${t.slug}`} role="option" aria-selected="false" data-slug={t.slug} data-nome={t.nome}>
                <span>{t.nome}</span>
                <span className="filtros-n">{contar(cards, {}, 'tags', t.slug)}</span>
              </li>
            ))}
          </ul>
          <p className="busca-sem-tag" data-busca-sem-tag hidden>Nenhuma tag encontrada.</p>
        </div>
      </div>
      <div className="busca-selecao" data-busca-selecao hidden>
        <div className="busca-chips" data-busca-chips></div>
        <p className="busca-status" role="status" data-busca-status></p>
      </div>
    </div>
  )
}
