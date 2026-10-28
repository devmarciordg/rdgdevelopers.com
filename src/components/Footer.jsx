import { empresa } from '../empresa.js'
import { servicos } from '../servicos.js'
import Icone from './Icone.jsx'
import '../styles/footer.css'

// Copiado do Header (não importado) para o rodapé não depender dele
function Logo() {
  return (
    <svg aria-hidden="true" viewBox="1267.74 310.68 449.56 144.02" height="22">
      <path fill="currentColor" d="M1267.74 454.71L1267.74 310.68L1360.74 310.68C1374.73 310.68 1386.73 315.69 1396.74 325.70C1406.76 335.71 1411.76 347.72 1411.76 361.71C1411.76 371.31 1409.26 380.16 1404.25 388.25C1399.25 396.34 1392.56 402.58 1384.19 406.97L1411.76 454.71L1356.95 454.71L1327.48 390.97L1327.48 454.71L1267.74 454.71ZM1423.90 375.75L1423.90 310.68L1495.91 310.68C1508.94 310.68 1520.98 313.90 1532.02 320.35C1543.06 326.80 1551.81 335.58 1558.26 346.69C1564.70 357.80 1567.93 369.83 1567.93 382.80C1567.93 395.76 1564.70 407.76 1558.26 418.80C1551.81 429.84 1543.06 438.59 1532.02 445.03C1520.98 451.48 1508.94 454.71 1495.91 454.71L1423.90 454.71L1423.90 390.97L1492.52 375.75L1423.90 375.75ZM1573.28 382.69C1573.28 369.66 1576.50 357.63 1582.95 346.58C1589.39 335.54 1598.14 326.80 1609.18 320.35C1620.22 313.90 1632.26 310.68 1645.29 310.68C1658.46 310.68 1670.56 313.94 1681.60 320.45C1692.64 326.97 1701.32 335.71 1707.63 346.69L1645.29 382.69L1717.30 382.69C1717.30 395.59 1714.18 407.49 1707.94 418.39C1701.70 429.30 1693.23 437.97 1682.53 444.42C1671.83 450.86 1660.10 454.29 1647.35 454.71C1634.04 455.12 1621.70 452.13 1610.31 445.75C1598.93 439.38 1589.91 430.60 1583.25 419.42C1576.60 408.24 1573.28 396.00 1573.28 382.69Z" />
    </svg>
  )
}

const empresaLinks = [
  { titulo: 'Sobre', href: '/sobre' },
  { titulo: 'Projetos', href: '/projetos' },
  { titulo: 'Blog', href: '/blog' },
  { titulo: 'Manutenção', href: '/manutencao' },
  { titulo: 'Programa de indicação', href: '/indicacao' },
]

const legal = [
  { titulo: 'Política de Privacidade', href: '/privacidade' },
  { titulo: 'Termos de Uso', href: '/termos' },
  { titulo: 'Política de Cookies', href: '/cookies' },
]

const lista = (itens) => itens.map((l) => <li key={l.href}><a href={l.href}>{l.titulo}</a></li>)

// Peak-End: o fim da página repete o único próximo passo. Some onde a página já termina em formulário.
function Convite() {
  return (
    <section className="rodape-convite" aria-labelledby="convite-titulo">
      <div className="wrap">
        <span className="label">Diagnóstico gratuito · 20 minutos · sem compromisso</span>
        <h2 id="convite-titulo">Seu negócio aparece quando procuram?</h2>
        <div className="rodape-convite-cta">
          <a className="btn" href="/diagnostico">Agendar diagnóstico gratuito</a>
          <a className="link-seta" href={empresa.whatsappLink}>
            ou fale no WhatsApp
            <Icone nome="seta" tamanho={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

// Identificação legal visível: CDC art. 31 e Decreto 7.962/2013
export default function Footer({ convite = true }) {
  return (
    <footer className="rodape">
      {convite && <Convite />}
      <div className="wrap">
        <div className="rodape-topo">
          <a className="rodape-logo" href="/" aria-label="RDG Developers, início"><Logo /></a>

          <nav className="rodape-nav" aria-label="Rodapé">
            <div>
              <h2>Serviços</h2>
              <ul>{servicos.map((s) => <li key={s.href}><a href={s.href}>{s.titulo}</a></li>)}</ul>
            </div>
            <div>
              <h2>Empresa</h2>
              <ul>{lista(empresaLinks)}</ul>
            </div>
            <div>
              <h2>Contato</h2>
              {/* Mesmo NAP do JSON-LD (schema.js): o Google cruza os dois */}
              <ul>
                <li><a href={empresa.whatsappLink}>WhatsApp {empresa.whatsapp}</a></li>
                <li><a href={`tel:${empresa.telefone}`}>Ligar {empresa.whatsapp}</a></li>
                {/* Quebra só depois do @ em coluna estreita */}
                <li><a href={`mailto:${empresa.email}`}>{empresa.email.split('@')[0]}@<wbr />{empresa.email.split('@')[1]}</a></li>
              </ul>
              <p className="rodape-horario">{empresa.horario}</p>
            </div>
            <div>
              <h2>Legal</h2>
              <ul>
                {lista(legal)}
                <li><button type="button" className="rodape-link" popoverTarget="cookie-preferencias">Gerenciar cookies</button></li>
              </ul>
            </div>
          </nav>
        </div>

        <address className="rodape-legal">
          <p><strong>{empresa.razaoSocial}</strong> · CNPJ {empresa.cnpj} · {empresa.endereco}</p>
          <p>
            Encarregado pelo tratamento de dados pessoais (DPO): {empresa.encarregado},{' '}
            <a href={`mailto:${empresa.emailPrivacidade}`}>{empresa.emailPrivacidade}</a>
          </p>
          <p>
            Encontrou alguma barreira de acessibilidade? Escreva para{' '}
            <a href={`mailto:${empresa.email}`}>{empresa.email}</a>.
          </p>
          {/* Ano do build: renderizado no deploy, sem JS no navegador */}
          <p>© {new Date().getFullYear()} {empresa.nome}</p>
        </address>
      </div>
    </footer>
  )
}
