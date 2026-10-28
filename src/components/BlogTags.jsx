// Tags de um post. Tag sem página própria (poucos posts ou sem descrição) aparece como texto, sem link.
export default function BlogTags({ tags, rotulo }) {
  if (!tags.length) return null
  return (
    <ul className="blog-tags" aria-label={rotulo}>
      {tags.map((t) => (
        <li key={t.slug}>{t.rota ? <a href={t.rota}>{t.nome}</a> : <span>{t.nome}</span>}</li>
      ))}
    </ul>
  )
}
