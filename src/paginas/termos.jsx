import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import { empresa } from '../empresa.js'
import { breadcrumb } from '../schema.js'
import '../styles/artigo.css'

export const meta = {
  titulo: 'Termos de Uso do site',
  descricao: 'Regras para usar o site da RDG Developers: conteúdo informativo, propriedade intelectual, uso proibido, responsabilidade, privacidade e foro.',
  schema: [breadcrumb([['Termos de Uso', '/termos']])],
}

export default function Termos() {
  return (
    <>
      <CabecalhoPagina
        trilha={[['Termos de Uso']]}
        rotulo="Documento legal"
        titulo="Termos de Uso"
        sub="Versão 1.0, vigente desde 26/10/2026"
      />
      <div className="wrap">
        <div className="prosa">
          <p>
            Estes termos valem para o uso do site da {empresa.nome}. Eles não são o contrato de prestação de serviços.
            Quando você contrata a gente, o contrato de serviços é firmado à parte, com cada cliente, e traz as condições
            daquele trabalho.
          </p>

          <h2>1. Aceitação</h2>
          <p>
            Ao acessar ou usar este site, você concorda com estes Termos de Uso. Se não concordar, não use o site.
          </p>

          <h2>2. Quem somos</h2>
          <ul>
            <li>Razão social: {empresa.razaoSocial}</li>
            <li>Nome fantasia: {empresa.nome}</li>
            <li>CNPJ: {empresa.cnpj}</li>
            <li>Endereço: {empresa.endereco}</li>
            <li>E-mail: <a href={`mailto:${empresa.email}`}>{empresa.email}</a></li>
          </ul>

          <h2>3. Conteúdo informativo</h2>
          <p>
            Os textos do blog e das páginas deste site são informação geral. Eles não são consultoria individual e não
            substituem uma análise do seu caso.
          </p>
          <p>
            O mini-diagnóstico é orientativo. Ele aponta caminhos a partir do que você informa, mas não é laudo, parecer
            técnico nem auditoria.
          </p>

          <h2>4. Propriedade intelectual</h2>
          <p>
            Os textos, imagens, código e a marca {empresa.nome} pertencem à {empresa.razaoSocial}. É proibido copiar,
            reproduzir ou distribuir esse material sem autorização por escrito.
          </p>
          <p>Alguns itens de terceiros seguem as próprias licenças:</p>
          <ul>
            <li>
              Fonte Bebas Neue, sob a{' '}
              <a href="https://openfontlicense.org/" rel="noopener">SIL Open Font License 1.1</a>.
            </li>
            <li>
              Ícones adaptados do <a href="https://lucide.dev/" rel="noopener">Lucide</a>, sob a{' '}
              <a href="https://lucide.dev/license" rel="noopener">licença ISC</a>.
            </li>
          </ul>

          <h2>5. Uso proibido</h2>
          <p>Ao usar o site, você não pode:</p>
          <ul>
            <li>atacar, invadir ou tentar explorar falhas do site ou dos servidores;</li>
            <li>sobrecarregar o site com acessos automatizados ou em excesso;</li>
            <li>extrair dados ou conteúdo em massa, por robôs ou qualquer outro meio;</li>
            <li>enviar dados de outras pessoas sem a autorização delas;</li>
            <li>usar o formulário de contato para enviar spam ou mensagens automáticas.</li>
          </ul>

          <h2>6. Links externos</h2>
          <p>
            O site pode ter links para sites de terceiros. A gente não controla esses sites e não responde pelo conteúdo,
            pelas práticas ou pela disponibilidade deles.
          </p>

          <h2>7. Limitação de responsabilidade</h2>
          <p>
            Nos limites permitidos pela lei, a {empresa.nome} não responde por danos causados pelo uso das informações
            gerais deste site, por indisponibilidade ou por conteúdo de terceiros. Nada nestes termos afasta os direitos
            garantidos pelo Código de Defesa do Consumidor, quando aplicáveis.
          </p>

          <h2>8. Disponibilidade</h2>
          <p>
            A gente trabalha para manter o site no ar, mas ele pode ficar fora do ar por manutenção, atualização ou
            falhas de terceiros, como hospedagem e rede.
          </p>

          <h2>9. Privacidade e cookies</h2>
          <p>
            O tratamento dos seus dados pessoais está na <a href="/privacidade">Política de Privacidade</a>. O uso de
            cookies e do armazenamento local está na <a href="/cookies">Política de Cookies</a>.
          </p>

          <h2>10. Alterações destes termos</h2>
          <p>
            Estes termos podem mudar. A versão e a data de vigência ficam no topo desta página. O uso do site depois de
            uma mudança vale como aceite da nova versão.
          </p>

          <h2>11. Lei aplicável e foro</h2>
          <p>
            Estes termos seguem a lei brasileira. Fica eleito o foro da comarca de Governador Valadares/MG, ressalvado o
            foro do domicílio do consumidor quando a lei garantir esse direito.
          </p>

          <h2>12. Contato</h2>
          <p>
            Dúvidas sobre estes termos: <a href={`mailto:${empresa.email}`}>{empresa.email}</a>.
          </p>
        </div>
      </div>
    </>
  )
}
