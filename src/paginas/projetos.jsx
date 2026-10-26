import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import { breadcrumb } from '../schema.js'
import '../styles/pg-projetos.css'

export const meta = {
  titulo: 'Projetos: estudos técnicos e projetos internos',
  descricao: 'Projetos da RDG Developers: o próprio site, a infraestrutura em servidor próprio e o gerador de contratos. Contexto, problema, solução, stack e aprendizados.',
  schema: [breadcrumb([['Projetos', '/projetos']])],
}

const projetos = [
  {
    id: 'este-site',
    tipo: 'Estudo técnico',
    titulo: 'Este site',
    contexto: 'O site da RDG é a primeira coisa que um cliente vê da gente. Se a gente vende sites rápidos, o nosso precisa ser um.',
    problema: 'Sites feitos com framework costumam mandar muito JavaScript para o navegador, o que deixa a página lenta no celular. E banner de cookies e formulário quase sempre vêm de bibliotecas pesadas.',
    feito: [
      'Vite e React usados só no build: cada rota é pré-renderizada em HTML estático.',
      'No navegador vão o HTML, um CSS (cerca de 5 KB comprimido) e cerca de 1,3 KB de JavaScript comprimido, em JS puro, só para o formulário e o consentimento de cookies.',
      'Fotos em AVIF e WebP.',
      'Fonte Bebas Neue recortada só com os caracteres do português.',
      'Consentimento de cookies com Google Consent Mode v2, negado por padrão.',
    ],
    stack: ['Vite', 'React (só no build)', 'HTML estático', 'CSS', 'JavaScript puro', 'Google Consent Mode v2'],
    aprendemos: 'Dá para usar React para organizar o código sem mandar React para o visitante. Na medição de 26/10/2026, em ambiente de teste, o Lighthouse deu 100 nos 4 eixos.',
    link: ['/performance', 'Ver a medição e como conferir'],
  },
  {
    id: 'infraestrutura',
    tipo: 'Projeto interno',
    titulo: 'Infraestrutura própria',
    contexto: 'A operação da RDG depende de CRM, automações, WhatsApp e de saber quando algo cai.',
    problema: 'Cada ferramenta em um serviço diferente espalha os dados e dificulta o controle sobre onde tudo roda.',
    feito: [
      'Servidor VPS com Docker e Caddy.',
      'Nele rodam o CRM da RDG (Evo CRM), as automações em n8n e a API de WhatsApp (Evolution).',
      'Monitoramento de disponibilidade com Uptime Kuma.',
      'Acesso ao servidor só por chave SSH.',
    ],
    stack: ['VPS', 'Docker', 'Caddy', 'Evo CRM', 'n8n', 'Evolution API', 'Uptime Kuma', 'SSH'],
    aprendemos: 'Colocar cada serviço no próprio contêiner, atrás de um único Caddy, deixa o servidor mais simples de manter. E o monitoramento avisa antes de alguém reclamar.',
  },
  {
    id: 'gerador-contratos',
    tipo: 'Projeto interno',
    titulo: 'Gerador de contratos',
    contexto: 'Todo projeto da RDG começa com contrato ou termo assinado.',
    problema: 'Montar cada documento à mão toma tempo e abre espaço para erro de numeração e de dados.',
    feito: [
      'Sistema próprio em Node.js e TypeScript.',
      'Gera contratos e termos em PDF.',
      'Cada documento recebe numeração única no formato RDG-AAAA-NNN.',
      'Usado no dia a dia da RDG.',
    ],
    stack: ['Node.js', 'TypeScript', 'PDF'],
    aprendemos: 'Uma ferramenta pequena, feita para o próprio processo, resolve mais do que adaptar o processo a uma ferramenta pronta.',
  },
]

export default function Projetos() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Projetos']]}
        rotulo="Projetos"
        titulo="O que a gente constrói"
        sub="Estudos técnicos e projetos internos da RDG, com o problema, a solução e o que aprendemos em cada um."
      />
      {projetos.map((p) => (
        <section key={p.id} className="secao" id={p.id} aria-labelledby={`${p.id}-titulo`}>
          <div className="wrap pg-projetos-item">
            <div className="secao-topo">
              <span className="label pg-projetos-tipo">{p.tipo}</span>
              <h2 id={`${p.id}-titulo`}>{p.titulo}</h2>
            </div>
            <div className="pg-projetos-corpo">
              <div><h3>Contexto</h3><p>{p.contexto}</p></div>
              <div><h3>O problema</h3><p>{p.problema}</p></div>
              <div><h3>O que foi feito</h3><ul>{p.feito.map((f) => <li key={f}>{f}</li>)}</ul></div>
              <div><h3>Stack</h3><ul className="pg-projetos-stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul></div>
              <div><h3>O que aprendemos</h3><p>{p.aprendemos}</p></div>
              {p.link && <p><a className="btn ghost" href={p.link[0]}>{p.link[1]}</a></p>}
            </div>
          </div>
        </section>
      ))}
      <section className="secao" aria-label="Sobre cases de clientes">
        <div className="wrap"><p className="secao-sub">Cases de clientes entram aqui com autorização por escrito.</p></div>
      </section>
    </>
  )
}
