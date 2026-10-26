import '../styles/cabecalho-pagina.css'

// Topo padrão das páginas internas: trilha, rótulo, H1 e subtítulo.
// trilha: [['Serviços', '/servicos'], ['Tráfego pago']] (o último item é a página atual, sem link)
export default function CabecalhoPagina({ trilha = [], rotulo, titulo, sub, children }) {
  return (
    <header className="cabecalho-pagina">
      <div className="wrap">
        {trilha.length > 0 && (
          <nav aria-label="Você está em">
            <ol className="trilha">
              <li><a href="/">Início</a></li>
              {trilha.map(([nome, href]) => (
                <li key={nome}>{href ? <a href={href}>{nome}</a> : <span aria-current="page">{nome}</span>}</li>
              ))}
            </ol>
          </nav>
        )}
        {rotulo && <span className="label">{rotulo}</span>}
        <h1>{titulo}</h1>
        {sub && <p className="cabecalho-sub">{sub}</p>}
        {children}
      </div>
    </header>
  )
}
