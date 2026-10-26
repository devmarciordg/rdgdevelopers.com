import Artigo from '../../components/Artigo.jsx'
import { artigo, breadcrumb } from '../../schema.js'

const titulo = 'Meta CAPI para clínicas: como medir lead de verdade'
const descricao = 'O que é a API de Conversões da Meta, como ela se soma ao pixel, quais eventos medir numa clínica e como fazer isso respeitando a LGPD.'
const rota = '/blog/meta-capi-para-clinicas'
const data = '2026-10-26'

export const meta = {
  titulo,
  descricao,
  data,
  categoria: 'Tráfego e dados',
  leitura: '7 min',
  schema: [artigo({ titulo, descricao, rota, data }), breadcrumb([['Blog', '/blog'], [titulo, rota]])],
}

const DOC = 'https://developers.facebook.com/docs/marketing-api/conversions-api'

const exemplo = `{
  "event_name": "Lead",
  "event_time": 1793000000,
  "event_id": "lead-8f3a2c",
  "action_source": "website",
  "event_source_url": "https://suaclinica.com.br/avaliacao",
  "user_data": {
    "em": ["<e-mail normalizado e com hash SHA-256>"],
    "ph": ["<telefone com DDI, normalizado e com hash SHA-256>"],
    "fbp": "fb.1.1700000000000.123456789",
    "client_ip_address": "203.0.113.10",
    "client_user_agent": "Mozilla/5.0 ..."
  }
}`

export default function MetaCapiClinicas() {
  return (
    <Artigo titulo={titulo} descricao={descricao} data={data} categoria={meta.categoria} leitura={meta.leitura}>
      <p>
        Muita clínica anuncia no Instagram, recebe mensagens no WhatsApp e, no fim do mês, não sabe dizer quantos
        pacientes vieram de cada campanha. O Gerenciador de Anúncios mostra um número, a recepção conta outro, e
        ninguém confia em nenhum dos dois. A API de Conversões da Meta (CAPI) não resolve tudo sozinha, mas é a peça
        que falta para o rastreamento parar de depender só do navegador do paciente.
      </p>
      <p>
        Este texto explica o que muda, quais eventos fazem sentido para uma clínica e o que você não pode enviar de
        jeito nenhum. Serve para o dono da clínica entender o que está pagando e para quem opera o tráfego conferir
        se a configuração está certa.
      </p>

      <h2>O que é a API de Conversões</h2>
      <p>
        A API de Conversões é um jeito de enviar eventos para a Meta a partir do servidor, e não do navegador. Em vez
        de um script no site avisar o Facebook que alguém preencheu um formulário, quem avisa é o seu próprio servidor
        (ou um servidor de tags), numa chamada direta para a Meta. A{' '}
        <a href={DOC} rel="noopener">documentação oficial da Conversions API no Meta for Developers</a> descreve os
        campos aceitos e o formato de cada evento.
      </p>
      <p>
        Na prática, isso quer dizer que o evento continua chegando mesmo quando o navegador bloqueia scripts de
        terceiros, quando o paciente usa bloqueador de anúncios ou quando a página fecha antes do pixel terminar de
        carregar. É o que chamamos de <a href="/servicos/rastreamento-server-side">rastreamento server-side</a>.
      </p>

      <h2>Pixel e CAPI: diferença e por que usar os dois</h2>
      <p>
        O pixel roda no navegador. Ele é fácil de instalar e enxerga bem o comportamento na página, mas depende de o
        script carregar e de o navegador permitir cookies e requisições para a Meta. A CAPI roda no servidor. Ela não
        sofre com bloqueadores e permite enviar eventos que nem acontecem no navegador, como um agendamento confirmado
        pela recepção no sistema da clínica.
      </p>
      <p>
        A própria Meta recomenda a configuração redundante: pixel e CAPI enviando os mesmos eventos. Um cobre as
        falhas do outro. O cuidado é não contar o mesmo lead duas vezes, e é aí que entra a deduplicação.
      </p>

      <h2>Os eventos que importam numa clínica</h2>
      <p>
        Não adianta mandar dezenas de eventos. Para clínica, quase sempre três eventos padrão da Meta dão conta do que
        interessa:
      </p>
      <ul>
        <li>
          <strong>Lead</strong>: o paciente deixou nome e contato num formulário. É o evento principal de uma página de
          captação.
        </li>
        <li>
          <strong>Contact</strong>: o paciente clicou para falar no WhatsApp ou ligar. Esse clique não é um lead
          garantido, porque muita gente abre a conversa e não manda mensagem, então vale tratar como um sinal separado.
        </li>
        <li>
          <strong>Schedule</strong>: a consulta ou avaliação foi agendada. É o evento mais próximo do resultado real e
          costuma ser registrado depois, pela recepção ou pelo sistema de agenda, e enviado via servidor.
        </li>
      </ul>
      <p>
        Com esses três separados, dá para ver quantos cliques viraram conversa, quantas conversas viraram cadastro e
        quantos cadastros viraram agenda. Otimizar a campanha para Schedule, quando há volume suficiente, aproxima o
        algoritmo do paciente que de fato aparece.
      </p>

      <h2>Deduplicação com event_id</h2>
      <p>
        Se o pixel e o servidor enviam o mesmo Lead, a Meta precisa saber que é um evento só. Para isso, os dois
        devem mandar o mesmo <code>event_name</code> e o mesmo <code>event_id</code>. No pixel, o identificador vai no
        parâmetro <code>eventID</code>; na CAPI, no campo <code>event_id</code>. Quando os dois batem, a Meta
        descarta a cópia.
      </p>
      <p>
        O jeito mais simples é gerar um identificador único no navegador no momento do envio do formulário, usar no
        pixel e repassar o mesmo valor junto com os dados do formulário para o servidor. Sem isso, o painel mostra o
        dobro de leads e todas as métricas de custo ficam erradas.
      </p>
      <p>Um evento enviado pela CAPI tem mais ou menos este formato:</p>
      <pre><code>{exemplo}</code></pre>

      <h2>Qualidade de correspondência e dados com hash</h2>
      <p>
        A Meta só consegue atribuir um evento a um anúncio se conseguir ligar esse evento a uma pessoa. O Gerenciador de
        Eventos mostra uma nota de qualidade de correspondência de eventos (Event Match Quality) para cada evento
        enviado pelo servidor. Quanto mais parâmetros de identificação corretos, melhor a correspondência.
      </p>
      <p>
        Os principais são e-mail, telefone, nome, o identificador do navegador (<code>fbp</code>), o identificador do
        clique no anúncio (<code>fbc</code>), o IP e o user agent. Dados como e-mail, telefone e nome precisam ser
        normalizados (minúsculas, sem espaços, telefone com código do país) e convertidos em hash SHA-256 antes do
        envio. Os cookies <code>fbp</code> e <code>fbc</code>, o IP e o user agent vão sem hash.
      </p>
      <p>
        Um ponto importante: hash não é anonimização. Um e-mail com hash continua sendo dado pessoal, porque pode ser
        comparado com a base da Meta. Por isso o envio precisa de base legal, e não só de técnica.
      </p>

      <h2>LGPD: consentimento e dado de saúde</h2>
      <p>
        Para clínica, este é o ponto que mais pesa. Dois cuidados não são opcionais:
      </p>
      <ul>
        <li>
          <strong>Só envie com consentimento.</strong> Se o visitante não aceitou cookies de marketing, nem o pixel nem
          a CAPI devem enviar eventos com dados dele. O servidor precisa receber e respeitar a escolha feita no banner
          de cookies.
        </li>
        <li>
          <strong>Nunca envie informação de saúde.</strong> Pela LGPD, dado referente à saúde é dado pessoal sensível.
          Não mande para a Meta o procedimento de interesse, a especialidade, a condição do paciente, o que ele
          escreveu no formulário nem uma URL que revele isso. Use nomes de evento genéricos e uma URL neutra.
        </li>
      </ul>
      <p>
        Na prática, &quot;Lead na página de avaliação&quot; é aceitável. &quot;Lead para tratamento de X&quot; não é.
        Se a sua clínica tem uma página por tratamento, o evento enviado não deve carregar o nome do tratamento em
        nenhum campo, incluindo parâmetros personalizados e o endereço da página.
      </p>
      <p>
        As regras de publicidade do CFM e do CFO continuam valendo no anúncio: medir bem não autoriza promessa de
        resultado, sensacionalismo nem qualquer peça que o conselho da sua área não permita.
      </p>

      <h2>Como conferir no Gerenciador de Eventos</h2>
      <p>
        Antes de confiar nos números, teste. O Gerenciador de Eventos tem a ferramenta de teste de eventos, que gera
        um código de teste. Com esse código no campo <code>test_event_code</code> das chamadas da CAPI, os eventos
        aparecem em tempo real na aba de teste, sem misturar com os dados de produção.
      </p>
      <h3>O que olhar no teste</h3>
      <ul>
        <li>O evento aparece duas vezes, uma do navegador e uma do servidor, e a Meta indica que foi deduplicado.</li>
        <li>Os parâmetros de cliente esperados aparecem como recebidos.</li>
        <li>Nenhum campo traz nome de procedimento, especialidade ou texto livre do paciente.</li>
        <li>Recusar os cookies no banner faz os eventos pararem de chegar.</li>
      </ul>
      <p>
        Depois de publicado, acompanhe a aba de visão geral do conjunto de dados por alguns dias: volume de eventos por
        origem, avisos de diagnóstico e a nota de correspondência de cada evento. E compare com a sua planilha ou CRM.
        Se o painel mostra muito mais leads do que a recepção recebeu, quase sempre é deduplicação quebrada.
      </p>

      <h2>Lead de verdade é o que chega na recepção</h2>
      <p>
        A CAPI melhora o sinal que a Meta recebe, mas o objetivo final é outro: saber quais campanhas trazem
        pacientes. Isso exige ligar o anúncio ao formulário, o formulário ao atendimento e o atendimento à agenda. Com
        os eventos certos, deduplicados e enviados com consentimento, a conversa sobre{' '}
        <a href="/servicos/trafego-pago">tráfego pago</a> deixa de ser sobre cliques e passa a ser sobre agenda.
      </p>
      <p>
        Se você não sabe hoje se o seu site envia eventos pelo servidor, se eles estão duplicados ou se algum dado de
        saúde está saindo junto, vale fazer essa revisão antes de aumentar a verba.
      </p>
    </Artigo>
  )
}
