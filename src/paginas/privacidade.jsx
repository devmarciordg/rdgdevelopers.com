import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import { empresa } from '../empresa.js'
import { breadcrumb } from '../schema.js'
import '../styles/artigo.css'

export const meta = {
  titulo: 'Política de Privacidade',
  descricao: 'Como a RDG Developers coleta, usa, guarda e protege seus dados pessoais, com base na LGPD e no Marco Civil da Internet, e como exercer seus direitos.',
  schema: [breadcrumb([['Política de Privacidade', '/privacidade']])],
}

const secoes = [
  ['quem-somos', 'Quem cuida dos seus dados'],
  ['dados-coletados', 'Quais dados coletamos e por quê'],
  ['bases-legais', 'Bases legais'],
  ['compartilhamento', 'Com quem compartilhamos'],
  ['direitos', 'Seus direitos'],
  ['seguranca', 'Segurança'],
  ['incidentes', 'Incidentes de segurança'],
  ['dados-de-terceiros', 'Dados de terceiros e dos seus clientes'],
  ['menores', 'Menores de idade'],
  ['alteracoes', 'Alterações nesta política'],
]

const Email = () => <a href={`mailto:${empresa.emailPrivacidade}`}>{empresa.emailPrivacidade}</a>

export default function Privacidade() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Política de Privacidade']]}
        rotulo="LGPD"
        titulo="Política de Privacidade"
        sub="Versão 1.0, vigente desde 26/10/2026"
      />
      <div className="wrap">
        <div className="prosa">
          <p>
            Esta política explica, em linguagem simples, quais dados pessoais a {empresa.nome} trata quando você usa este site
            ou fala com a gente, para quê, por quanto tempo e quais são os seus direitos. Ela segue a Lei Geral de Proteção de
            Dados (LGPD, Lei 13.709/2018) e o Marco Civil da Internet (Lei 12.965/2014).
          </p>

          <nav aria-labelledby="sumario-titulo">
            <p id="sumario-titulo"><strong>Sumário</strong></p>
            <ol>
              {secoes.map(([id, nome]) => (
                <li key={id}><a href={`#${id}`}>{nome}</a></li>
              ))}
            </ol>
          </nav>

          <h2 id="quem-somos">1. Quem cuida dos seus dados</h2>
          <p>
            A controladora dos dados, ou seja, quem decide como eles são tratados, é a <strong>{empresa.razaoSocial}</strong>,
            nome comercial {empresa.nome}, CNPJ {empresa.cnpj}, com endereço em {empresa.endereco}.
          </p>
          <p>
            O encarregado pelo tratamento de dados pessoais (DPO) é <strong>{empresa.encarregado}</strong>. Para qualquer
            assunto sobre privacidade, escreva para <Email />.
          </p>

          <h2 id="dados-coletados">2. Quais dados coletamos e por quê</h2>
          <h3>a) Formulário de contato e de diagnóstico</h3>
          <p>
            Coletamos seu <strong>nome</strong> e seu <strong>WhatsApp ou e-mail</strong>, somente depois que você marca a caixa
            de consentimento. Usamos esses dados para responder ao seu pedido de diagnóstico e enviar uma proposta. Se o contato
            não virar contrato, guardamos os dados por até 12 meses e depois os excluímos.
          </p>
          <h3>b) Mini-diagnóstico da página de diagnóstico</h3>
          <p>
            As respostas do <a href="/diagnostico">mini-diagnóstico</a> ficam só no seu navegador. Elas não são enviadas para a
            gente nem para ninguém.
          </p>
          <h3>c) Registros de acesso ao site</h3>
          <p>
            Guardamos o endereço IP e a data e hora de cada acesso por 6 meses. Isso é uma obrigação do Marco Civil da Internet
            (art. 15).
          </p>
          <h3>d) Cookies e armazenamento local</h3>
          <p>
            A sua escolha sobre cookies fica salva no próprio navegador, na chave <code>rdg-consent</code>. Cookies de métricas e
            de marketing (Google e Meta) só são usados com o seu consentimento e somente quando essas ferramentas estiverem
            ativadas no site. Os detalhes estão na <a href="/cookies">Política de Cookies</a>.
          </p>
          <h3>e) Conversas pelo WhatsApp</h3>
          <p>
            Se você falar com a gente pelo WhatsApp, a conversa também é tratada pela Meta, dona do WhatsApp, conforme a política
            de privacidade dela.
          </p>

          <h2 id="bases-legais">3. Bases legais</h2>
          <p>A LGPD exige um motivo legal para cada tratamento. Usamos estes:</p>
          <ul>
            <li><strong>Consentimento:</strong> formulário de contato e cookies não essenciais.</li>
            <li><strong>Procedimentos preliminares a um contrato, a seu pedido:</strong> responder ao pedido de diagnóstico e enviar proposta.</li>
            <li><strong>Cumprimento de obrigação legal:</strong> registros de acesso ao site.</li>
            <li><strong>Legítimo interesse:</strong> quando aplicável e sempre documentado.</li>
          </ul>

          <h2 id="compartilhamento">4. Com quem compartilhamos</h2>
          <p><strong>Não vendemos seus dados.</strong> Eles passam apenas por estes operadores:</p>
          <ul>
            <li>
              <strong>Automação e CRM:</strong> o formulário é processado por uma automação (n8n) e guardado no CRM da RDG
              (Evo CRM). Os dois estão instalados em um servidor VPS de um provedor de infraestrutura contratado pela RDG.
            </li>
            <li>
              <strong>Google e Meta:</strong> somente se você autorizar os cookies de marketing. Esses serviços podem guardar dados
              fora do Brasil. Essa transferência internacional segue o art. 33 da LGPD.
            </li>
          </ul>

          <h2 id="direitos">5. Seus direitos</h2>
          <p>Pelo art. 18 da LGPD, você pode pedir a qualquer momento:</p>
          <ul>
            <li>confirmação de que tratamos seus dados;</li>
            <li>acesso aos seus dados;</li>
            <li>correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei;</li>
            <li>portabilidade dos dados para outro fornecedor;</li>
            <li>informação sobre com quem compartilhamos seus dados;</li>
            <li>revogação do consentimento;</li>
            <li>oposição a um tratamento;</li>
            <li>reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, envie um e-mail para <Email />. Respondemos dentro dos prazos previstos na
            LGPD.
          </p>

          <h2 id="seguranca">6. Segurança</h2>
          <p>Adotamos medidas técnicas e administrativas para proteger seus dados, como:</p>
          <ul>
            <li>acesso aos dados restrito a quem precisa deles;</li>
            <li>servidor com acesso por chave;</li>
            <li>conexão criptografada (HTTPS);</li>
            <li>princípio da minimização: coletamos só o necessário.</li>
          </ul>
          <p>Nenhum sistema é totalmente imune a falhas, mas trabalhamos para reduzir os riscos.</p>

          <h2 id="incidentes">7. Incidentes de segurança</h2>
          <p>
            Se acontecer um incidente de segurança que possa causar risco ou dano relevante a você, comunicamos a ANPD e os
            titulares afetados, conforme a regulamentação.
          </p>

          <h2 id="dados-de-terceiros">8. Dados de terceiros e dos seus clientes</h2>
          <p>
            Não envie pelo formulário dados de pacientes ou de clientes seus. Use o formulário só para os seus próprios dados de
            contato.
          </p>
          <p>
            Quando a RDG trata dados dos clientes finais de um cliente (por exemplo, leads de campanha), ela atua como
            operadora, conforme o contrato com esse cliente.
          </p>

          <h2 id="menores">9. Menores de idade</h2>
          <p>Este site não é direcionado a menores de 18 anos.</p>

          <h2 id="alteracoes">10. Alterações nesta política</h2>
          <p>
            A versão e a data de vigência ficam no topo desta página. Se fizermos mudanças relevantes, elas serão destacadas.
            Dúvidas? Escreva para <Email />.
          </p>
        </div>
      </div>
    </>
  )
}
