import Icone from './Icone.jsx'
import lh from '../lighthouse.json'
import '../styles/diferencial.css'

const eixos = [
  ['performance', 'Performance'],
  ['acessibilidade', 'Acessibilidade'],
  ['boasPraticas', 'Boas práticas'],
  ['seo', 'SEO'],
]

const C = 2 * Math.PI * 26 // circunferência do anel (r=26)
const data = lh.data.split('-').reverse().join('/')

export default function Diferencial() {
  return (
    <section className="secao fundo-grade" id="diferencial" aria-labelledby="diferencial-titulo">
      <div className="wrap dif">
        <div>
          <div className="secao-topo">
            <span className="label">Diferencial</span>
            <h2 id="diferencial-titulo">A gente mede o próprio site</h2>
            <p className="secao-sub">
              Em vez de prometer um site rápido, mostramos a nota deste aqui. A mesma ferramenta do
              Google que você pode rodar agora, sem pedir nada para a gente.
            </p>
          </div>

          <div className="dif-bloco">
            <span className="card-icone"><Icone nome="rastreamento" /></span>
            <h3>Contar as vendas que o anúncio sozinho não vê</h3>
            <p>
              Bloqueadores de anúncio e navegadores mais restritos impedem o pixel de registrar parte
              das conversões. A gente envia esses eventos também pelo servidor do seu site (API de
              Conversões da Meta e Google Tag Manager no servidor). Assim, o relatório fica mais
              perto do que de fato aconteceu.
            </p>
          </div>
        </div>

        <div>
          <ul className="dif-notas">
            {eixos.map(([chave, rotulo]) => {
              const nota = lh.notas[chave]
              return (
                <li key={chave}>
                  <svg aria-hidden="true" viewBox="0 0 60 60" width="96" height="96">
                    <circle cx="30" cy="30" r="26" />
                    <circle cx="30" cy="30" r="26" strokeDasharray={`${(C * nota) / 100} ${C}`} />
                  </svg>
                  <span className="dif-num">{nota}</span>
                  <span>{rotulo}</span>
                </li>
              )
            })}
          </ul>

          <p className="dif-vitais">
            LCP {lh.lcp} · CLS {lh.cls} · TBT {lh.tbt}
          </p>
          <p className="dif-nota">
            Medição de {data} ({lh.ferramenta}, {lh.perfil}, {lh.execucoes} execuções). Pode variar.
          </p>

          <p className="dif-links">
            <a className="btn ghost" href="/performance">Ver detalhes da medição</a>
            <a className="btn ghost" href="https://pagespeed.web.dev/analysis?url=https://rdgdevelopers.com" target="_blank" rel="noopener">
              Teste você mesmo no PageSpeed (abre site externo)
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
