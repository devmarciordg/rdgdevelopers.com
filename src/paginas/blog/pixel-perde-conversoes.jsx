import Artigo from '../../components/Artigo.jsx'
import { artigo, breadcrumb } from '../../schema.js'

const titulo = 'Por que o pixel perde conversões e como resolver'
const descricao = 'Bloqueadores, Safari, recusa de cookies e cliques para o WhatsApp fazem o pixel perder conversões. Veja o que o server-side resolve e o que não resolve.'
const rota = '/blog/pixel-perde-conversoes'
const data = '2026-10-26'

export const meta = {
  titulo,
  descricao,
  data,
  categoria: 'Tráfego e dados',
  leitura: '7 min',
  schema: [
    artigo({ titulo, descricao, rota, data }),
    breadcrumb([['Blog', '/blog'], [titulo, rota]]),
  ],
}

export default function Pagina() {
  return (
    <Artigo titulo={titulo} descricao={descricao} data={data} categoria={meta.categoria} leitura={meta.leitura}>
      <p>
        Você vê um número de vendas, agendamentos ou orçamentos no caixa e outro, bem menor, no
        Gerenciador de Anúncios. Não é impressão. O pixel, aquele código que roda no navegador do
        visitante, depende de condições que nem sempre acontecem. Quando falha, a conversão existe
        no seu negócio, mas não chega à plataforma de anúncios.
      </p>
      <p>
        Este texto explica, sem rodeio, onde o pixel perde informação, por que isso piora as
        campanhas e o que o rastreamento server-side muda. Também mostra o que ele não muda, porque
        isso importa tanto quanto.
      </p>

      <h2>Como o pixel funciona e por que ele é frágil</h2>
      <p>
        O pixel da Meta e a tag do Google são scripts. O navegador do visitante baixa o script,
        executa e envia um aviso para a plataforma: "esta pessoa viu a página", "esta pessoa enviou o
        formulário". Tudo acontece do lado do visitante. Se o navegador não baixar, não executar ou
        não conseguir enviar, o evento some. Você não recebe erro nenhum: ele simplesmente não aparece.
      </p>

      <h2>Onde as conversões se perdem</h2>

      <h3>Bloqueadores de anúncio e extensões</h3>
      <p>
        Bloqueadores e extensões de privacidade têm listas de domínios e scripts de rastreamento
        conhecidos. Os domínios do pixel da Meta e das tags do Google estão nessas listas. Para quem
        usa essas ferramentas, o script nem carrega. Alguns navegadores já vêm com proteção parecida
        ligada por padrão.
      </p>

      <h3>Restrições do navegador: Safari e ITP</h3>
      <p>
        O Safari tem a Intelligent Tracking Prevention (ITP). Além de bloquear cookies de terceiros,
        ela limita a duração de cookies de primeira parte criados por JavaScript, que é exatamente o
        tipo de cookie que o pixel usa para reconhecer o visitante. Na prática, se a pessoa clica no
        anúncio hoje e volta para comprar alguns dias depois, o navegador pode já ter apagado a
        informação que ligava a compra ao clique. A conversão acontece, mas sem atribuição.
      </p>

      <h3>iOS e App Tracking Transparency</h3>
      <p>
        No iPhone, a App Tracking Transparency (ATT) obriga os aplicativos a pedir permissão para
        rastrear o usuário entre apps e sites de outras empresas. Muita gente recusa. Isso afeta
        principalmente o que acontece dentro dos apps, como Instagram e Facebook, e reduz o que a
        Meta consegue associar ao seu anúncio. Não é algo que o seu site controla, mas faz parte do
        motivo pelo qual os números ficaram menos completos nos últimos anos.
      </p>

      <h3>Recusa de cookies e consentimento</h3>
      <p>
        Se o seu site tem um banner de cookies feito do jeito certo, parte dos visitantes vai recusar
        o rastreamento de marketing. E isso deve ser respeitado. A LGPD exige base legal para tratar
        dados pessoais, e a recusa é uma escolha legítima do visitante. Rastreamento que ignora essa
        escolha é um risco jurídico e de reputação, não uma otimização. Essa perda é esperada e
        nenhuma ferramenta séria deve "recuperá-la".
      </p>

      <h3>Página lenta: o visitante sai antes do pixel carregar</h3>
      <p>
        Em conexão móvel ruim, uma página pesada pode demorar vários segundos para ficar pronta. O
        pixel costuma carregar depois do conteúdo principal. Se a pessoa desiste antes, o clique foi
        pago, mas a visita nem foi registrada. Velocidade da página não é só experiência: é também
        qualidade de dado.
      </p>

      <h3>Redirecionamentos e o clique para o WhatsApp</h3>
      <p>
        Para negócio local, este costuma ser o ponto mais sensível. Muita conversa começa no botão do
        WhatsApp. O visitante clica, sai do site e a conversa acontece num aplicativo onde o pixel não
        existe. Se o evento não for disparado antes da saída, ou se a página trocar rápido demais, o
        clique se perde. E mesmo quando o clique é registrado, o agendamento ou a venda que acontece
        depois, dentro da conversa, fica invisível para a plataforma. Redirecionamentos em cadeia
        (encurtadores, páginas intermediárias) também podem descartar os parâmetros que identificam o
        clique no anúncio.
      </p>

      <h2>O efeito nas campanhas: o algoritmo aprende com dado incompleto</h2>
      <p>
        O problema não é só o relatório feio. As campanhas de conversão da Meta e do Google usam os
        eventos recebidos para decidir para quem mostrar o anúncio. Se só uma parte das conversões
        chega, o algoritmo aprende com uma amostra distorcida. Ele pode concluir que um público ou
        criativo não funciona quando funciona, ou demorar mais para sair da fase de aprendizado por
        falta de volume. Quem opera tráfego acaba tomando decisão de verba olhando para um retrato
        parcial.
      </p>

      <h2>A solução: enviar os eventos também pelo servidor</h2>
      <p>
        Rastreamento server-side significa que, além do navegador, o seu servidor envia os eventos
        direto para a plataforma de anúncios. A comunicação é de servidor para servidor, então não
        depende de o script carregar no navegador do visitante. As principais formas são estas:
      </p>
      <ul>
        <li>
          <strong>API de Conversões da Meta (CAPI):</strong> o seu site ou sistema envia eventos como
          lead, agendamento ou compra direto para a Meta, com dados do cliente criptografados por
          hash. Documentação oficial:{' '}
          <a href="https://developers.facebook.com/docs/marketing-api/conversions-api" rel="noopener">
            Conversions API, Meta for Developers
          </a>.
        </li>
        <li>
          <strong>Google Tag Manager server-side:</strong> um contêiner do Tag Manager roda num
          servidor seu, em um subdomínio do seu próprio domínio. O navegador fala com esse servidor, e
          ele repassa os dados para Google Ads, GA4, Meta e outros. Isso também dá controle sobre
          quais dados saem do seu site. Documentação oficial:{' '}
          <a href="https://developers.google.com/tag-platform/tag-manager/server-side" rel="noopener">
            Server-side tagging, Google Tag Platform
          </a>.
        </li>
        <li>
          <strong>Conversões otimizadas do Google (enhanced conversions):</strong> junto com a
          conversão, a tag envia dados que o cliente já informou, como e-mail ou telefone, com hash.
          O Google usa isso para associar a conversão ao clique no anúncio quando o cookie falhou.
          Os detalhes estão na Central de Ajuda do Google Ads, no tópico de conversões otimizadas.
        </li>
      </ul>
      <p>
        Para o caso do WhatsApp e de agendamentos, o servidor tem outra vantagem: ele pode enviar a
        conversão quando ela de fato acontece, por exemplo quando o agendamento é confirmado no
        sistema, e não só quando alguém clica num botão. A gente detalha esse cenário em{' '}
        <a href="/blog/meta-capi-para-clinicas">Meta CAPI para clínicas</a>.
      </p>

      <h3>Deduplicação: o mesmo evento não pode contar duas vezes</h3>
      <p>
        O caminho recomendado é manter o pixel e o servidor juntos. Só que, quando os dois funcionam,
        a mesma conversão chega duas vezes. Para a plataforma entender que é um evento só, os dois
        envios precisam carregar o mesmo nome de evento e o mesmo identificador (na Meta, o{' '}
        <code>event_id</code>). Sem deduplicação bem feita, o relatório infla e o algoritmo aprende com
        dado errado de novo, só que para o outro lado. Vale conferir a qualidade dos eventos no
        Gerenciador de Eventos depois de qualquer mudança.
      </p>

      <h2>O que o server-side não resolve</h2>
      <ul>
        <li>
          <strong>Não burla consentimento.</strong> Se o visitante recusou cookies de marketing, o
          servidor também não deve enviar dados dele para fins de anúncio. Server-side bem feito
          respeita a mesma escolha que o banner registrou.
        </li>
        <li>
          <strong>Não conserta campanha ruim.</strong> Oferta fraca, público errado, criativo que não
          comunica ou atendimento lento no WhatsApp continuam sendo problemas. Dado melhor ajuda o
          algoritmo a aprender, mas não cria demanda.
        </li>
        <li>
          <strong>Não recupera tudo.</strong> Parte da perda vem de escolhas de privacidade e de limites
          das plataformas. O objetivo é ter o dado mais completo possível dentro das regras, não um
          número perfeito.
        </li>
        <li>
          <strong>Não funciona sozinho.</strong> Exige configuração, eventos bem definidos e
          manutenção. Implementação malfeita pode piorar os dados em vez de melhorar.
        </li>
      </ul>

      <h2>Checklist para conferir no seu negócio</h2>
      <ul>
        <li>Compare as conversões reais do mês (caixa, agenda, CRM) com as que aparecem na plataforma de anúncios.</li>
        <li>Abra o Gerenciador de Eventos da Meta e veja se os eventos chegam pelo navegador, pelo servidor ou pelos dois.</li>
        <li>Confira se pixel e servidor enviam o mesmo identificador de evento, para evitar contagem dupla.</li>
        <li>Teste o botão do WhatsApp: o clique gera um evento antes de a pessoa sair do site?</li>
        <li>Verifique se o banner de cookies realmente bloqueia as tags de marketing quando o visitante recusa.</li>
        <li>Meça a velocidade da sua página de destino no celular, em conexão móvel.</li>
        <li>Revise se links e redirecionamentos preservam os parâmetros de clique do anúncio na URL.</li>
        <li>No Google Ads, confira se as conversões otimizadas estão ativas e sem alertas de diagnóstico.</li>
      </ul>
      <p>
        Se algum desses pontos não fechar, vale olhar com calma antes de mexer na verba. A gente
        implementa <a href="/servicos/rastreamento-server-side">rastreamento server-side</a> com
        consentimento respeitado e opera <a href="/servicos/trafego-pago">tráfego pago</a> em cima
        desses dados.
      </p>
    </Artigo>
  )
}
