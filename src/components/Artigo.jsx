import CabecalhoPagina from './CabecalhoPagina.jsx'
import '../styles/artigo.css'

const dataBR = (iso) => iso.split('-').reverse().join('/')

// Layout dos posts do blog: cabeçalho, linha de autor/data e corpo em .prosa
export default function Artigo({ titulo, descricao, data, categoria, leitura, children }) {
  return (
    <article>
      <CabecalhoPagina trilha={[['Blog', '/blog'], [titulo]]} rotulo={categoria} titulo={titulo} sub={descricao}>
        <p className="artigo-meta">
          Por <a href="/sobre">Márcio Patrick Rodrigues Dias</a> · <time dateTime={data}>{dataBR(data)}</time> · {leitura} de leitura
        </p>
      </CabecalhoPagina>
      <div className="wrap">
        <div className="prosa">{children}</div>
        <aside className="artigo-cta" aria-label="Próximo passo">
          <p><strong>Quer aplicar isso no seu negócio?</strong> No diagnóstico gratuito de 20 minutos a gente olha o seu caso.</p>
          <a className="btn" href="/diagnostico">Agendar diagnóstico gratuito</a>
        </aside>
      </div>
    </article>
  )
}
