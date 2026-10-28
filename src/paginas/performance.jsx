import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import lh from '../lighthouse.json'
import { breadcrumb } from '../schema.js'
import '../styles/pg-projetos.css'

export const meta = {
  titulo: 'Performance: a medição deste site',
  descricao: 'Notas do Lighthouse deste site, como medimos, o que fizemos para chegar lá e como você mesmo pode conferir no PageSpeed Insights do Google.',
  schema: [breadcrumb([['Performance', '/performance']])],
}

const eixos = [
  ['performance', 'Performance'],
  ['acessibilidade', 'Acessibilidade'],
  ['boasPraticas', 'Boas práticas'],
  ['seo', 'SEO'],
]
const data = lh.data.split('-').reverse().join('/')

export default function Performance() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Performance']]}
        rotulo="Performance"
        titulo="A medição deste site"
        sub={`Notas do ${lh.ferramenta} em ${data}. Pode variar de uma medição para outra.`}
      />

      <section className="secao" id="notas" aria-labelledby="notas-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Resultado</span>
            <h2 id="notas-titulo">Notas nos 4 eixos</h2>
          </div>
          <ul className="grade">
            {eixos.map(([chave, rotulo]) => (
              <li key={chave} className="card">
                <span className="pg-projetos-nota">{lh.notas[chave]}</span>
                <h3>{rotulo}</h3>
              </li>
            ))}
          </ul>
          <dl className="pg-projetos-vitais">
            <div><dt>LCP</dt><dd>{lh.lcp}</dd></div>
            <div><dt>CLS</dt><dd>{lh.cls}</dd></div>
            <div><dt>TBT</dt><dd>{lh.tbt}</dd></div>
          </dl>
        </div>
      </section>

      <section className="secao" id="metodologia" aria-labelledby="metodologia-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Metodologia</span>
            <h2 id="metodologia-titulo">Como medimos</h2>
          </div>
          <div className="prosa">
          <ul>
            <li>Ferramenta: {lh.ferramenta}.</li>
            <li>Perfil: {lh.perfil}.</li>
            <li>{lh.execucoes} execuções, em {data}.</li>
            <li>Ambiente de teste, antes do deploy.</li>
          </ul>
          <p>O resultado pode variar com a rede, o servidor e o momento da medição. É a nota daquele dia, não uma promessa.</p>
          </div>
        </div>
      </section>

      <section className="secao" id="como" aria-labelledby="como-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Técnica</span>
            <h2 id="como-titulo">O que fizemos para chegar lá</h2>
          </div>
          <div className="prosa">
          <ul>
            <li>Vite e React usados só no build: cada rota é pré-renderizada em HTML estático.</li>
            <li>No navegador vão o HTML, um CSS (cerca de 5 KB comprimido) e cerca de 1,3 KB de JavaScript comprimido.</li>
            <li>Esse JavaScript é puro, sem biblioteca, e cuida só do formulário e do consentimento de cookies.</li>
            <li>Fotos em AVIF e WebP.</li>
            <li>Fonte Bebas Neue recortada só com os caracteres do português.</li>
            <li>Consentimento de cookies com Google Consent Mode v2, negado por padrão.</li>
          </ul>
          <p><a href="https://github.com/devmarciordg/rdgdevelopers.com" rel="noopener">Ver o código deste site no GitHub</a></p>
          </div>
        </div>
      </section>

      <section className="secao" id="conferir" aria-labelledby="conferir-titulo">
        <div className="wrap">
          <div className="secao-topo">
            <span className="label">Confira</span>
            <h2 id="conferir-titulo">Como você mesmo pode conferir</h2>
            <p className="secao-sub">O PageSpeed Insights do Google roda o Lighthouse neste site agora, sem pedir nada para a gente. A nota pode sair diferente da nossa.</p>
          </div>
          <a className="btn" href="https://pagespeed.web.dev/analysis?url=https://rdgdevelopers.com" target="_blank" rel="noopener">
            Testar no PageSpeed Insights (abre site externo)
          </a>
        </div>
      </section>
    </>
  )
}
