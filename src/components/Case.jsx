import CabecalhoPagina from './CabecalhoPagina.jsx'
import Grafico from './Grafico.jsx'
import CaseCard, { avisoResultado, Capa, Infografico } from './CaseCard.jsx'
import { empresa } from '../empresa.js'
import '../styles/pg-projetos.css'

// Título de seção com link copiável para ela: o dono manda "olha a parte do resultado" direto para o lead
const Secao = ({ id, titulo, children }) => (
  <section className="case-secao" aria-labelledby={id}>
    <h2 id={id}>{titulo} <a className="ancora" href={`#${id}`} aria-label={`Link para a seção ${titulo}`}>#</a></h2>
    {children}
  </section>
)

export default function Case({ p }) {
  const whatsapp = `${empresa.whatsappLink.split('?')[0]}?text=${encodeURIComponent(`Olá! Vi o case ${p.cliente} no site da RDG e quero algo parecido.`)}`
  const servico = p.servicos[0]
  return (
    <>
      <CabecalhoPagina trilha={[['Projetos', '/projetos'], [p.cliente]]} rotulo="Case de cliente" titulo={p.titulo} sub={p.resumo} />

      <section className="secao sem-numero case-relance" aria-labelledby="relance-titulo">
        <div className="wrap">
          <h2 id="relance-titulo" className="sr-only">O case de relance</h2>
          <Infografico p={p} grande />
          {p.resultados?.length > 0 && <p className="case-aviso">{avisoResultado(p)}</p>}
          {p.grafico && <Grafico g={p.grafico} />}
        </div>
      </section>

      <section className="secao sem-numero" aria-label="Resumo do case">
        <div className="wrap case-topo">
          <Capa p={p} grande />
          <div>
            <dl className="case-ficha">
              <div><dt>Cliente</dt><dd>{p.cliente}</dd></div>
              <div><dt>Segmento</dt><dd>{p.segmento}</dd></div>
              {p.cidade && <div><dt>Cidade</dt><dd>{p.cidade}</dd></div>}
              <div><dt>Período</dt><dd>{p.periodo}</dd></div>
              <div><dt>Serviço</dt><dd>{p.servicos.map((s, i) => <span key={s.href}>{i > 0 && ', '}<a href={s.href}>{s.titulo}</a></span>)}</dd></div>
            </dl>
            {p.resultados?.length > 0 && (
              <>
                <dl className="pg-projetos-resultados">
                  {p.resultados.map((r) => <div key={r.valor}><dt>{r.rotulo}</dt><dd>{r.valor}</dd></div>)}
                </dl>
                <p className="case-aviso">{avisoResultado(p)}</p>
              </>
            )}
            <p className="case-acoes">
              {p.site && <a className="btn btn-sm" href={p.site.href} rel="noopener">{p.site.texto}<span className="sr-only"> (abre o site do cliente)</span></a>}
              <a className="btn btn-sm ghost" href="#quero-parecido">Quero algo parecido</a>
              {/* Só aparece com a Clipboard API (ilha copiar.js); sem ela, o endereço da barra serve */}
              <button className="btn btn-sm ghost" type="button" data-copiar hidden>Copiar link do case</button>
              <span className="sr-only" role="status" data-copiar-status></span>
            </p>
          </div>
        </div>
      </section>

      <section className="secao sem-numero" aria-label="O case em detalhe">
        <div className="wrap case-texto">
          <Secao id="contexto" titulo="Contexto"><p>{p.contexto}</p></Secao>
          <Secao id="problema" titulo="O problema"><p>{p.problema}</p></Secao>
          <Secao id="o-que-foi-feito" titulo="O que foi feito"><ol className="case-passos">{p.feito.map((f) => <li key={f}>{f}</li>)}</ol></Secao>
          <Secao id="aprendemos" titulo="O que aprendemos"><p className="case-licao" style={{ '--c': p.capa.cor }}>{p.aprendemos}</p></Secao>
          <Secao id="ferramentas" titulo="Ferramentas"><ul className="pg-projetos-stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul></Secao>
        </div>
      </section>

      <section className="secao sem-numero fundo-grade" id="quero-parecido" aria-labelledby="parecido-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">{servico.titulo}</span>
            <h2 id="parecido-titulo">Quer algo parecido no seu negócio?</h2>
            <p className="secao-sub">Em 20 minutos a gente olha o seu caso e diz o que faria. O resultado de cada negócio depende da verba, da região e da oferta.</p>
          </div>
          <p className="case-acoes">
            <a className="btn" href="/diagnostico">Pedir diagnóstico gratuito</a>
            <a className="btn ghost" href={whatsapp} rel="noopener">Falar no WhatsApp sobre este case</a>
            <a className="link-seta" href={servico.href}>Ver o serviço de {servico.titulo.toLowerCase()}</a>
          </p>
        </div>
      </section>

      {p.outros.length > 0 && (
        <section className="secao sem-numero" aria-labelledby="outros-titulo">
          <div className="wrap">
            <h2 id="outros-titulo">Outros cases</h2>
            <ul className="grade cases">{p.outros.map((o) => <CaseCard key={o.id} p={o} />)}</ul>
          </div>
        </section>
      )}
    </>
  )
}
