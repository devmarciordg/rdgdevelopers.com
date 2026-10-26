import Icone from './Icone.jsx'
import '../styles/projetos.css'

// Só projetos próprios: nenhum cliente citado (nome, logo ou resultado)
const projetos = [
  {
    rotulo: 'Estudo técnico',
    titulo: 'Este site',
    texto: (
      <>
        Construído com Vite e React só no build, sem JavaScript na maior parte das páginas.
        Lighthouse 100 nos 4 eixos na medição de <time dateTime="2026-10-26">26/10/2026</time>.
      </>
    ),
    stack: ['Vite', 'React (build)', 'HTML e CSS'],
    href: '/performance',
  },
  {
    rotulo: 'Projeto interno',
    titulo: 'Infraestrutura própria',
    texto: 'Servidor VPS com Docker e Caddy rodando o CRM da RDG, as automações em n8n e o monitoramento de disponibilidade com Uptime Kuma.',
    stack: ['VPS', 'Docker', 'Caddy', 'n8n', 'Uptime Kuma'],
    href: '/projetos',
  },
  {
    rotulo: 'Projeto interno',
    titulo: 'Gerador de contratos',
    texto: 'Sistema próprio que gera contratos e termos em PDF com numeração única. A gente usa no dia a dia da RDG.',
    stack: ['Node.js', 'TypeScript', 'PDF'],
    href: '/projetos',
  },
]

export default function Projetos() {
  return (
    <section className="secao" id="projetos" aria-labelledby="projetos-titulo">
      <div className="wrap">
        <div className="secao-topo">
          <span className="label">Projetos</span>
          <h2 id="projetos-titulo">O que a gente constrói e usa</h2>
          <p className="secao-sub">
            Projetos nossos, feitos com a mesma stack que entregamos. Você vê como a gente trabalha antes de contratar.
          </p>
        </div>

        <ul className="grade">
          {projetos.map((p) => (
            <li className="card projeto" key={p.titulo}>
              <span className="projeto-rotulo">{p.rotulo}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
              <ul className="projeto-stack" aria-label={`Tecnologias de ${p.titulo}`}>
                {p.stack.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <a className="projeto-link" href={p.href}>
                Ver projeto<span className="projeto-oculto">: {p.titulo}</span>
                <Icone nome="seta" tamanho={16} />
              </a>
            </li>
          ))}
        </ul>

        <a className="projetos-todos" href="/projetos">
          Ver todos os projetos <Icone nome="seta" tamanho={16} />
        </a>
      </div>
    </section>
  )
}
