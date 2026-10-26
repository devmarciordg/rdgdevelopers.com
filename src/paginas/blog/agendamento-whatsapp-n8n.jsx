import Artigo from '../../components/Artigo.jsx'
import { artigo, breadcrumb } from '../../schema.js'

const titulo = 'Agendamento pelo WhatsApp com n8n e Evolution API'
const descricao = 'Passo a passo para automatizar o agendamento pelo WhatsApp com n8n e Evolution API: arquitetura, fluxo, boas práticas, LGPD e a alternativa oficial da Meta.'
const data = '2026-10-26'
const rota = '/blog/agendamento-whatsapp-n8n'

export const meta = {
  titulo,
  descricao,
  data,
  categoria: 'Automação',
  leitura: '7 min',
  schema: [
    artigo({ titulo, descricao, rota, data }),
    breadcrumb([['Blog', '/blog'], [titulo, rota]]),
  ],
}

const payload = `{
  "event": "messages.upsert",
  "instance": "clinica-exemplo",
  "data": {
    "key": {
      "remoteJid": "5500000000000@s.whatsapp.net",
      "fromMe": false,
      "id": "ID-DA-MENSAGEM"
    },
    "pushName": "Nome do contato",
    "message": {
      "conversation": "Oi, quero marcar um horário"
    },
    "messageTimestamp": 1700000000
  }
}`

export default function Post() {
  return (
    <Artigo titulo={titulo} descricao={descricao} data={data} categoria={meta.categoria} leitura={meta.leitura}>
      <p>
        Para muita clínica e negócio de serviço, o WhatsApp é a porta de entrada de quase todo agendamento. O problema é que essa porta depende de alguém olhando o celular. Este texto mostra, de forma conceitual, como montar um agendamento automático com <strong>n8n</strong> e <strong>Evolution API</strong>, o que cada peça faz e os cuidados que a gente considera obrigatórios antes de colocar isso no ar.
      </p>

      <h2>O problema: a mensagem chega, a resposta não</h2>
      <p>Quem atende pelo WhatsApp conhece o roteiro:</p>
      <ul>
        <li><strong>Mensagem respondida tarde.</strong> O contato escreve à noite ou no meio de um atendimento, e a resposta só sai horas depois.</li>
        <li><strong>Agenda bagunçada.</strong> Horário anotado no papel, na agenda e na cabeça da recepção, com risco de marcar duas pessoas no mesmo horário.</li>
        <li><strong>Contato que esfria.</strong> Quem pediu um horário e não teve retorno costuma procurar outra opção.</li>
      </ul>
      <p>
        A automação não substitui a equipe. Ela cuida da parte repetitiva (mostrar horários, confirmar, lembrar) e deixa as pessoas livres para o que precisa de conversa de verdade.
      </p>

      <h2>A arquitetura em uma linha</h2>
      <p>
        <strong>WhatsApp → Evolution API → webhook → n8n → agenda e CRM → resposta no WhatsApp.</strong> Cada peça tem um papel:
      </p>
      <ul>
        <li><strong>Evolution API:</strong> conecta um número de WhatsApp a um servidor e expõe uma API para enviar mensagens. Quando chega uma mensagem, ela avisa um endereço configurado (o webhook).</li>
        <li><strong>Webhook:</strong> uma URL que recebe esse aviso em formato JSON. No n8n, é o nó <code>Webhook</code> que inicia o fluxo.</li>
        <li><strong>n8n:</strong> a ferramenta de automação que lê a mensagem, decide o próximo passo e conversa com os outros sistemas. Pode rodar em servidor próprio ou na versão em nuvem.</li>
        <li><strong>Agenda:</strong> por exemplo, o Google Agenda, onde o n8n consulta horários livres e cria o evento.</li>
        <li><strong>CRM:</strong> onde fica o registro do contato e do histórico do atendimento. Pode ser um CRM pronto ou até uma planilha, no começo.</li>
        <li><strong>Resposta:</strong> o n8n chama a Evolution API de volta para enviar a mensagem ao contato.</li>
      </ul>

      <h3>Como é a mensagem que chega</h3>
      <p>
        Abaixo, um exemplo simplificado do JSON que o webhook recebe quando alguém manda uma mensagem. Os campos reais variam conforme a versão e a configuração da Evolution API, e os valores aqui são fictícios.
      </p>
      <pre><code>{payload}</code></pre>
      <p>
        Do lado do n8n, os dados que importam são o número de quem escreveu (<code>remoteJid</code>), o texto (<code>conversation</code>) e o campo <code>fromMe</code>. Filtrar mensagens com <code>fromMe: true</code> é o primeiro cuidado, para o fluxo não responder às próprias mensagens e entrar em loop.
      </p>

      <h2>O fluxo do agendamento, passo a passo</h2>

      <h3>1. Saudação</h3>
      <p>
        O fluxo identifica se é um contato novo ou conhecido (consultando o CRM pelo número) e responde com uma mensagem curta: quem é o negócio e as opções disponíveis, como "agendar", "reagendar" e "falar com a equipe", de preferência numeradas.
      </p>

      <h3>2. Horários disponíveis</h3>
      <p>
        Quando a pessoa escolhe agendar, o n8n consulta a agenda (no Google Agenda, a consulta de horários ocupados) e monta uma lista com poucos horários livres dentro do horário de atendimento. Mostrar três ou quatro opções costuma ser mais claro do que despejar a semana inteira.
      </p>

      <h3>3. Confirmação</h3>
      <p>
        Com o horário escolhido, o fluxo verifica de novo se ele continua livre (outra pessoa pode ter marcado no meio do caminho), cria o evento na agenda, registra no CRM e envia a confirmação com data, hora e endereço. Guardar o estado da conversa (em que etapa o contato está) é o que permite ao fluxo entender a próxima resposta.
      </p>

      <h3>4. Lembrete antes do horário</h3>
      <p>
        Um segundo fluxo, disparado por agendamento (o nó <code>Schedule Trigger</code> do n8n), busca os compromissos do dia seguinte ou das próximas horas e envia um lembrete pedindo confirmação. Esse lembrete vai só para quem marcou e já está em conversa com o negócio.
      </p>

      <h3>5. Reagendamento</h3>
      <p>
        Se a pessoa responde que não pode ir, o fluxo oferece novos horários, move o evento na agenda e atualiza o CRM. Cancelar e liberar o horário também precisa ser simples.
      </p>

      <h3>6. Passar para humano</h3>
      <p>
        Quando a mensagem não se encaixa em nenhuma opção, quando a pessoa pede, ou quando o assunto é sensível, o fluxo para de responder sozinho, avisa a equipe e marca a conversa como "em atendimento humano". Enquanto essa marca existir, o robô fica em silêncio naquele número.
      </p>

      <h2>Boas práticas que não são opcionais</h2>

      <h3>Sempre ter saída para o atendimento humano</h3>
      <p>
        Em qualquer etapa, a pessoa deve conseguir falar com alguém. Robô que prende o contato num menu sem fim cria o mesmo problema que a automação queria resolver.
      </p>

      <h3>Respeitar o horário de atendimento</h3>
      <p>
        O agendamento pode funcionar 24 horas, mas o fluxo precisa deixar claro quando a equipe responde. Fora do horário, um aviso honesto ("a equipe retorna a partir de tal hora") evita a sensação de abandono quando a pessoa pede atendimento humano.
      </p>

      <h3>Opt-out</h3>
      <p>
        Quem não quer mais receber lembretes precisa conseguir sair com uma palavra simples, como "parar". O fluxo registra essa escolha e respeita.
      </p>

      <h3>LGPD: só o necessário</h3>
      <p>
        Peça apenas o que o agendamento exige: nome, telefone e o horário. Em saúde, o cuidado é maior: <strong>o robô não deve pedir sintomas, diagnóstico ou qualquer detalhe clínico</strong>. Esse tipo de informação é dado sensível e deve ser tratado pela equipe, no canal e no sistema adequados. Defina também por quanto tempo os registros ficam guardados e quem tem acesso a eles.
      </p>

      <h3>Nada de disparo em massa para lista fria</h3>
      <p>
        Mandar mensagem em massa para números que nunca falaram com o negócio vai contra as políticas do WhatsApp e aumenta muito o risco de bloqueio do número. A automação de agendamento funciona em cima de conversas que o próprio contato iniciou.
      </p>

      <h3>Logs e monitoramento</h3>
      <p>
        O n8n guarda o histórico de execuções, e isso precisa ser acompanhado. Configure um fluxo de erro que avise a equipe quando algo falhar (agenda fora do ar, conexão do WhatsApp caída, resposta que não saiu) e monitore se a instância da Evolution API continua conectada. Uma automação parada em silêncio é pior do que nenhuma automação.
      </p>

      <h2>Evolution API ou API oficial da Meta?</h2>
      <p>
        Esse ponto precisa ser dito com clareza. A <strong>Evolution API usa uma conexão não oficial</strong> com o WhatsApp: ela se conecta ao número como se fosse um aparelho vinculado, pela leitura de QR code. A Meta não oferece suporte a esse tipo de integração, e existe o risco de restrição ou bloqueio do número, principalmente se o uso fugir do padrão de uma conversa normal.
      </p>
      <p>
        A alternativa oficial é a <strong>WhatsApp Business Platform</strong>, com a <a href="https://developers.facebook.com/docs/whatsapp/cloud-api" rel="noopener">Cloud API da Meta</a>. As diferenças, de forma honesta:
      </p>
      <ul>
        <li><strong>Risco:</strong> na API oficial, a integração é autorizada pela Meta; o número ainda pode sofrer restrição se descumprir as políticas, mas não pela forma de conexão. Na Evolution API, o risco ligado à conexão existe e é de quem opera.</li>
        <li><strong>Custo:</strong> a Evolution API é software livre, e o custo é o servidor e a manutenção. A Cloud API cobra por mensagem conforme as regras de preço da Meta, que mudam com o tempo e por país; vale consultar a documentação atual.</li>
        <li><strong>Aprovação de modelos:</strong> na API oficial, mensagens iniciadas pelo negócio fora da janela de atendimento (como alguns lembretes) precisam usar modelos aprovados pela Meta. Na Evolution API não há essa etapa, o que parece prático, mas é justamente a liberdade que aumenta o risco.</li>
        <li><strong>Configuração:</strong> a API oficial pede conta empresarial verificada e um número dedicado. A Evolution API é mais rápida de testar.</li>
      </ul>
      <p>
        Na prática, a Evolution API pode servir para validar o fluxo e para volumes pequenos, com a consciência do risco. Para uma operação que depende do WhatsApp todos os dias, a API oficial é o caminho mais seguro. A boa notícia é que o fluxo no n8n muda pouco: troca-se a entrada e a saída de mensagens, e a lógica de agenda e CRM continua a mesma.
      </p>

      <h2>Por onde começar</h2>
      <p>
        Comece pequeno: só a saudação, a consulta de horários e a passagem para humano. Teste com a equipe antes de abrir para os contatos, acompanhe as execuções por algumas semanas e só depois adicione lembretes e reagendamento. A <a href="https://docs.n8n.io" rel="noopener">documentação do n8n</a> cobre os nós de webhook, agenda e tratamento de erro usados aqui.
      </p>
      <p>
        Se você prefere que alguém monte e acompanhe isso, a gente faz esse tipo de projeto dentro do serviço de <a href="/servicos#automacao">automação de atendimento</a>. E se ainda não sabe se faz sentido para o seu caso, o <a href="/diagnostico">diagnóstico gratuito</a> é um bom primeiro passo.
      </p>
    </Artigo>
  )
}
