---
titulo: Agendamento pelo WhatsApp com n8n e Evolution API
descricao: Passo a passo para automatizar o agendamento pelo WhatsApp com n8n e Evolution API: arquitetura, fluxo, boas práticas, LGPD e a alternativa oficial da Meta.
status: publicado
publicado: 2026-10-20
autores: [rdg]
tema: automacao
tags: [whatsapp, n8n, lgpd]
---

Para muita clínica e negócio de serviço, o WhatsApp é a porta de entrada de quase todo agendamento. O problema é que essa porta depende de alguém olhando o celular. Este texto mostra, de forma conceitual, como montar um agendamento automático com **n8n** e **Evolution API**, o que cada peça faz e os cuidados que a gente considera obrigatórios antes de colocar isso no ar.

## O problema: a mensagem chega, a resposta não

Quem atende pelo WhatsApp conhece o roteiro:

- **Mensagem respondida tarde.** O contato escreve à noite ou no meio de um atendimento, e a resposta só sai horas depois.
- **Agenda bagunçada.** Horário anotado no papel, na agenda e na cabeça da recepção, com risco de marcar duas pessoas no mesmo horário.
- **Contato que esfria.** Quem pediu um horário e não teve retorno costuma procurar outra opção.

A automação não substitui a equipe. Ela cuida da parte repetitiva (mostrar horários, confirmar, lembrar) e deixa as pessoas livres para o que precisa de conversa de verdade.

## A arquitetura em uma linha

**WhatsApp → Evolution API → webhook → n8n → agenda e CRM → resposta no WhatsApp.** Cada peça tem um papel:

- **Evolution API:** conecta um número de WhatsApp a um servidor e expõe uma API para enviar mensagens. Quando chega uma mensagem, ela avisa um endereço configurado (o webhook).
- **Webhook:** uma URL que recebe esse aviso em formato JSON. No n8n, é o nó `Webhook` que inicia o fluxo.
- **n8n:** a ferramenta de automação que lê a mensagem, decide o próximo passo e conversa com os outros sistemas. Pode rodar em servidor próprio ou na versão em nuvem.
- **Agenda:** por exemplo, o Google Agenda, onde o n8n consulta horários livres e cria o evento.
- **CRM:** onde fica o registro do contato e do histórico do atendimento. Pode ser um CRM pronto ou até uma planilha, no começo.
- **Resposta:** o n8n chama a Evolution API de volta para enviar a mensagem ao contato.

### Como é a mensagem que chega

Abaixo, um exemplo simplificado do JSON que o webhook recebe quando alguém manda uma mensagem. Os campos reais variam conforme a versão e a configuração da Evolution API, e os valores aqui são fictícios.

```json
{
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
}
```

Do lado do n8n, os dados que importam são o número de quem escreveu (`remoteJid`), o texto (`conversation`) e o campo `fromMe`. Filtrar mensagens com `fromMe: true` é o primeiro cuidado, para o fluxo não responder às próprias mensagens e entrar em loop.

## O fluxo do agendamento, passo a passo

### 1. Saudação

O fluxo identifica se é um contato novo ou conhecido (consultando o CRM pelo número) e responde com uma mensagem curta: quem é o negócio e as opções disponíveis, como "agendar", "reagendar" e "falar com a equipe", de preferência numeradas.

### 2. Horários disponíveis

Quando a pessoa escolhe agendar, o n8n consulta a agenda (no Google Agenda, a consulta de horários ocupados) e monta uma lista com poucos horários livres dentro do horário de atendimento. Mostrar três ou quatro opções costuma ser mais claro do que despejar a semana inteira.

### 3. Confirmação

Com o horário escolhido, o fluxo verifica de novo se ele continua livre (outra pessoa pode ter marcado no meio do caminho), cria o evento na agenda, registra no CRM e envia a confirmação com data, hora e endereço. Guardar o estado da conversa (em que etapa o contato está) é o que permite ao fluxo entender a próxima resposta.

### 4. Lembrete antes do horário

Um segundo fluxo, disparado por agendamento (o nó `Schedule Trigger` do n8n), busca os compromissos do dia seguinte ou das próximas horas e envia um lembrete pedindo confirmação. Esse lembrete vai só para quem marcou e já está em conversa com o negócio.

### 5. Reagendamento

Se a pessoa responde que não pode ir, o fluxo oferece novos horários, move o evento na agenda e atualiza o CRM. Cancelar e liberar o horário também precisa ser simples.

### 6. Passar para humano

Quando a mensagem não se encaixa em nenhuma opção, quando a pessoa pede, ou quando o assunto é sensível, o fluxo para de responder sozinho, avisa a equipe e marca a conversa como "em atendimento humano". Enquanto essa marca existir, o robô fica em silêncio naquele número.

## Boas práticas que não são opcionais

### Sempre ter saída para o atendimento humano

Em qualquer etapa, a pessoa deve conseguir falar com alguém. Robô que prende o contato num menu sem fim cria o mesmo problema que a automação queria resolver.

### Respeitar o horário de atendimento

O agendamento pode funcionar 24 horas, mas o fluxo precisa deixar claro quando a equipe responde. Fora do horário, um aviso honesto ("a equipe retorna a partir de tal hora") evita a sensação de abandono quando a pessoa pede atendimento humano.

### Opt-out

Quem não quer mais receber lembretes precisa conseguir sair com uma palavra simples, como "parar". O fluxo registra essa escolha e respeita.

### LGPD: só o necessário

Peça apenas o que o agendamento exige: nome, telefone e o horário. Em saúde, o cuidado é maior: **o robô não deve pedir sintomas, diagnóstico ou qualquer detalhe clínico**. Esse tipo de informação é dado sensível e deve ser tratado pela equipe, no canal e no sistema adequados. Defina também por quanto tempo os registros ficam guardados e quem tem acesso a eles.

### Nada de disparo em massa para lista fria

Mandar mensagem em massa para números que nunca falaram com o negócio vai contra as políticas do WhatsApp e aumenta muito o risco de bloqueio do número. A automação de agendamento funciona em cima de conversas que o próprio contato iniciou.

### Logs e monitoramento

O n8n guarda o histórico de execuções, e isso precisa ser acompanhado. Configure um fluxo de erro que avise a equipe quando algo falhar (agenda fora do ar, conexão do WhatsApp caída, resposta que não saiu) e monitore se a instância da Evolution API continua conectada. Uma automação parada em silêncio é pior do que nenhuma automação.

## Evolution API ou API oficial da Meta?

Esse ponto precisa ser dito com clareza. A **Evolution API usa uma conexão não oficial** com o WhatsApp: ela se conecta ao número como se fosse um aparelho vinculado, pela leitura de QR code. A Meta não oferece suporte a esse tipo de integração, e existe o risco de restrição ou bloqueio do número, principalmente se o uso fugir do padrão de uma conversa normal.

A alternativa oficial é a **WhatsApp Business Platform**, com a [Cloud API da Meta](https://developers.facebook.com/docs/whatsapp/cloud-api). As diferenças, de forma honesta:

- **Risco:** na API oficial, a integração é autorizada pela Meta; o número ainda pode sofrer restrição se descumprir as políticas, mas não pela forma de conexão. Na Evolution API, o risco ligado à conexão existe e é de quem opera.
- **Custo:** a Evolution API é software livre, e o custo é o servidor e a manutenção. A Cloud API cobra por mensagem conforme as regras de preço da Meta, que mudam com o tempo e por país; vale consultar a documentação atual.
- **Aprovação de modelos:** na API oficial, mensagens iniciadas pelo negócio fora da janela de atendimento (como alguns lembretes) precisam usar modelos aprovados pela Meta. Na Evolution API não há essa etapa, o que parece prático, mas é justamente a liberdade que aumenta o risco.
- **Configuração:** a API oficial pede conta empresarial verificada e um número dedicado. A Evolution API é mais rápida de testar.

Na prática, a Evolution API pode servir para validar o fluxo e para volumes pequenos, com a consciência do risco. Para uma operação que depende do WhatsApp todos os dias, a API oficial é o caminho mais seguro. A boa notícia é que o fluxo no n8n muda pouco: troca-se a entrada e a saída de mensagens, e a lógica de agenda e CRM continua a mesma.

## Por onde começar

Comece pequeno: só a saudação, a consulta de horários e a passagem para humano. Teste com a equipe antes de abrir para os contatos, acompanhe as execuções por algumas semanas e só depois adicione lembretes e reagendamento. A [documentação do n8n](https://docs.n8n.io) cobre os nós de webhook, agenda e tratamento de erro usados aqui.

Se você prefere que alguém monte e acompanhe isso, a gente faz esse tipo de projeto dentro do serviço de [automação de atendimento](/servicos#automacao). E se ainda não sabe se faz sentido para o seu caso, o [diagnóstico gratuito](/diagnostico) é um bom primeiro passo.
