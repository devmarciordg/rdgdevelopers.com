import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import { empresa } from '../empresa.js'
import { breadcrumb } from '../schema.js'
import '../styles/artigo.css'

export const meta = {
  titulo: 'Política de Cookies',
  descricao: 'Quais cookies e dados de armazenamento local o site da RDG Developers usa, para que servem e como mudar ou apagar a sua escolha.',
  schema: [breadcrumb([['Política de Cookies', '/cookies']])],
}

export default function Cookies() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Política de Cookies']]}
        rotulo="Documento legal"
        titulo="Política de Cookies"
        sub="Versão 1.0, vigente desde 26/10/2026"
      />
      <div className="wrap">
        <div className="prosa">
          <p>
            Esta política explica o que o site da {empresa.nome} guarda no seu navegador, para quê, e como você muda a sua
            escolha.
          </p>

          <h2>1. O que são cookies e armazenamento local</h2>
          <p>
            Cookies são pequenos arquivos que um site grava no seu navegador. O armazenamento local (localStorage) é um
            recurso parecido: o site guarda uma informação no seu navegador, e ela fica só no seu aparelho. Nesta política,
            chamamos os dois de cookies.
          </p>

          <h2>2. Categorias</h2>
          <ul>
            <li>
              <strong>Necessários:</strong> fazem o site funcionar e guardam a sua escolha de consentimento. Ficam sempre
              ativos.
            </li>
            <li>
              <strong>Métricas:</strong> medem visitas e uso do site. Só rodam com o seu consentimento.
            </li>
            <li>
              <strong>Marketing:</strong> medem e melhoram anúncios. Só rodam com o seu consentimento.
            </li>
          </ul>

          <h2>3. O que o site usa hoje</h2>
          <div role="region" aria-label="Tabela de cookies em uso" tabIndex={0} style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Finalidade</th>
                  <th scope="col">Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>rdg-consent</code></td>
                  <td>Armazenamento local do navegador</td>
                  <td>Necessário</td>
                  <td>Guarda a sua escolha de consentimento</td>
                  <td>Até você limpar os dados do navegador ou mudar a escolha</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Hoje o site <strong>não usa</strong> ferramentas de métricas nem de marketing. A tabela acima é tudo o que ele
            guarda no seu navegador.
          </p>

          <h2>4. Quando métricas e marketing forem ativados</h2>
          <p>Se a gente passar a usar ferramentas do Google e da Meta:</p>
          <ul>
            <li>elas só vão rodar com o seu consentimento, na categoria correspondente;</li>
            <li>esta tabela será atualizada antes de elas entrarem no ar;</li>
            <li>o Google Consent Mode v2 começa com tudo negado por padrão, até você autorizar.</li>
          </ul>

          <h2>5. Como mudar a sua escolha</h2>
          <p>Você pode mudar a sua escolha a qualquer momento:</p>
          <p>
            <button type="button" popoverTarget="cookie-preferencias" className="btn ghost">Gerenciar cookies</button>
          </p>
          <p>
            Para apagar o que já foi guardado, limpe os dados do site nas configurações do seu navegador (em geral, no
            menu de privacidade, opção de cookies e dados de sites). Depois disso, o aviso de cookies aparece de novo.
          </p>

          <h2>6. Privacidade</h2>
          <p>
            Como a gente trata os seus dados pessoais está na <a href="/privacidade">Política de Privacidade</a>. Dúvidas:{' '}
            <a href={`mailto:${empresa.emailPrivacidade}`}>{empresa.emailPrivacidade}</a>.
          </p>
        </div>
      </div>
    </>
  )
}
