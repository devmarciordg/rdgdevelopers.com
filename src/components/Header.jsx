import { empresa } from '../empresa.js'
import Icone from './Icone.jsx'
import { servicos } from '../servicos.js'
import '../styles/header.css'

const links = [
  { titulo: 'Projetos', href: '/projetos' },
  { titulo: 'Blog', href: '/blog' },
  { titulo: 'Sobre', href: '/sobre' },
]

function ItemServico({ titulo, desc, href, icone }) {
  return (
    <li>
      <a className="nav-item" href={href}>
        <span className="nav-item-icone"><Icone nome={icone} /></span>
        <span>
          <span className="nav-item-titulo">{titulo}</span>
          <span className="nav-item-desc">{desc}</span>
        </span>
      </a>
    </li>
  )
}

function Logo() {
  return (
    <svg aria-hidden="true" viewBox="1267.74 310.68 449.56 144.02" height="22">
      <path fill="currentColor" d="M1267.74 454.71L1267.74 310.68L1360.74 310.68C1374.73 310.68 1386.73 315.69 1396.74 325.70C1406.76 335.71 1411.76 347.72 1411.76 361.71C1411.76 371.31 1409.26 380.16 1404.25 388.25C1399.25 396.34 1392.56 402.58 1384.19 406.97L1411.76 454.71L1356.95 454.71L1327.48 390.97L1327.48 454.71L1267.74 454.71ZM1423.90 375.75L1423.90 310.68L1495.91 310.68C1508.94 310.68 1520.98 313.90 1532.02 320.35C1543.06 326.80 1551.81 335.58 1558.26 346.69C1564.70 357.80 1567.93 369.83 1567.93 382.80C1567.93 395.76 1564.70 407.76 1558.26 418.80C1551.81 429.84 1543.06 438.59 1532.02 445.03C1520.98 451.48 1508.94 454.71 1495.91 454.71L1423.90 454.71L1423.90 390.97L1492.52 375.75L1423.90 375.75ZM1573.28 382.69C1573.28 369.66 1576.50 357.63 1582.95 346.58C1589.39 335.54 1598.14 326.80 1609.18 320.35C1620.22 313.90 1632.26 310.68 1645.29 310.68C1658.46 310.68 1670.56 313.94 1681.60 320.45C1692.64 326.97 1701.32 335.71 1707.63 346.69L1645.29 382.69L1717.30 382.69C1717.30 395.59 1714.18 407.49 1707.94 418.39C1701.70 429.30 1693.23 437.97 1682.53 444.42C1671.83 450.86 1660.10 454.29 1647.35 454.71C1634.04 455.12 1621.70 452.13 1610.31 445.75C1598.93 439.38 1589.91 430.60 1583.25 419.42C1576.60 408.24 1573.28 396.00 1573.28 382.69Z" />
    </svg>
  )
}

// Menus usam a Popover API: Esc, clique fora e retorno de foco sem JS
export default function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <nav className="wrap nav" aria-label="Principal">
        <a className="nav-logo" href="/" aria-label="RDG Developers, início"><Logo /></a>

        <ul className="nav-links">
          <li>
            <button className="nav-trigger" popoverTarget="menu-servicos">
              Serviços
              <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </li>
          {links.map((l) => <li key={l.href}><a className="nav-link" href={l.href}>{l.titulo}</a></li>)}
        </ul>

        <div className="nav-cta">
          <a className="btn ghost btn-sm" href={empresa.whatsappLink} rel="noopener">WhatsApp</a>
          <a className="btn btn-sm" href="/diagnostico">Diagnóstico gratuito</a>
        </div>

        <button className="nav-burger" popoverTarget="menu-mobile" aria-label="Abrir menu">
          <span aria-hidden="true" />
        </button>
      </nav>

      <div className="nav-pop" id="menu-servicos" popover="auto">
        <ul className="nav-grid">
          {servicos.map((s) => <ItemServico key={s.href} {...s} />)}
        </ul>
        <p className="nav-pop-foot">
          <a href="/servicos">Ver todos os serviços</a>
          <a href="/manutencao">Planos de manutenção mensal</a>
        </p>
      </div>

      <div className="nav-mobile" id="menu-mobile" popover="auto" aria-label="Menu">
        <p className="nav-mobile-label">Serviços</p>
        <ul className="nav-mobile-list">
          {servicos.map((s) => <ItemServico key={s.href} {...s} />)}
        </ul>
        <ul className="nav-mobile-links">
          <li><a href="/manutencao">Manutenção mensal</a></li>
          {links.map((l) => <li key={l.href}><a href={l.href}>{l.titulo}</a></li>)}
          <li><a href="/indicacao">Programa de indicação</a></li>
        </ul>
        <div className="nav-mobile-cta">
          <a className="btn" href="/diagnostico">Agendar diagnóstico gratuito</a>
          <a className="btn ghost" href={empresa.whatsappLink} rel="noopener">Falar no WhatsApp</a>
        </div>
      </div>
    </header>
  )
}
