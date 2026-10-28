---
titulo: Domínio, hospedagem, site e rastreamento: de quem é cada um
descricao: Domínio, hospedagem, site e rastreamento são quatro coisas diferentes. Veja quem deve ser o dono de cada uma e o que dá errado quando não é você.
status: publicado
publicado: 2026-08-21
autores: [marcio]
tema: performance-e-sites
tags: [dominio-e-hospedagem, pixel]
---

A conversa que mais se repete comigo começa assim: "a agência antiga sumiu e eu perdi meu site".

Quase sempre o site não se perdeu. Ele está lá, inteiro, num servidor que continua ligado. O que se perdeu foi o controle de uma das quatro peças que fazem um site existir na internet, e como as quatro chegam numa fatura só, ninguém nunca precisou saber que eram quatro.

Elas são: o domínio, a hospedagem, o site em si e o rastreamento. Cada uma é comprada de uma empresa diferente, cada uma pode estar no nome de uma pessoa diferente, e cada uma quebra de um jeito diferente. Vou separar uma por uma.

## o domínio é um aluguel de nome

`marciordg.com` é um domínio. Você não compra um domínio, você aluga por um período, normalmente de um ano, e renova. Se parar de renovar, ele volta pro mercado e qualquer pessoa pode registrar.

Quem cuida disso no Brasil, para os endereços terminados em `.com.br`, é o Registro.br, ligado ao Comitê Gestor da Internet. Custa R$ 40 por ano no momento em que escrevo isto. Para `.com` e o resto, existem dezenas de registradores privados, e o preço varia porque cada um coloca a sua margem em cima.

Aqui mora o primeiro problema. O registro tem um titular, que é o CPF ou CNPJ vinculado ao domínio, e uma conta de acesso, que é o login e o e-mail. Não são a mesma coisa. É perfeitamente possível o domínio estar registrado no CNPJ da sua empresa e a conta que permite mexer nele estar no e-mail pessoal de um desenvolvedor que você não vê há dois anos. No papel é seu. Na prática, quem consegue apontar o domínio para outro lugar é ele.

Se você só for verificar uma coisa depois de ler este texto, verifique essa. Entre no site do registrador, faça um "esqueci minha senha" e veja se o e-mail cai na sua caixa.

## a hospedagem é onde os arquivos moram

O domínio é o endereço. A hospedagem é o terreno com a construção em cima. É um computador ligado vinte e quatro horas por dia, em algum data center, que guarda os arquivos do seu site e entrega esses arquivos para quem pedir.

Você paga mensal ou anual, e a variação de preço entre o mais barato e o mais caro tem uma explicação bem concreta: em plano compartilhado, o seu site divide o mesmo computador com centenas de outros. Se um deles receber um pico de acesso, os outros ficam lentos junto. Em plano dedicado ou em nuvem, você tem uma fatia reservada de processador e memória.

Isso deixa de ser um detalhe técnico no dia em que você liga tráfego pago. Um servidor lento significa que a pessoa que clicou no anúncio espera mais tempo pela página, e uma parte dela desiste antes de a página aparecer. Você pagou pelo clique de qualquer jeito. Escrevi um artigo inteiro sobre esse cálculo, com números medidos, mas o resumo cabe numa frase: hospedagem barata deixa de ser barata assim que existe verba de mídia envolvida.

## o site é o que você realmente contratou

O site são os arquivos: o texto, as imagens, o código que monta as páginas, o banco de dados com os produtos ou os artigos. É a única das quatro peças que foi feita sob medida para você.

E é por isso que ela é a que mais costuma sumir. Domínio e hospedagem você renova e continuam existindo. O site é um monte de arquivo que alguém montou, e se esse alguém não te entregou uma cópia, a única cópia que existe está no servidor dele.

Peça o código. Não em forma de acesso ao painel, em forma de arquivo, ou de um repositório no GitHub no qual o seu usuário seja dono. Um site que você não consegue levar para outra hospedagem é um site que você aluga sem saber.

![Diagrama das quatro camadas de um site: domínio registrado no Registro.br, DNS apontando para o servidor, hospedagem guardando os arquivos e o rastreamento enviando eventos para as plataformas de anúncio, com o responsável e a fatura de cada uma](/blog/img/quatro-camadas-site-1200x560.webp)

## o DNS é a peça que ninguém menciona

Falta explicar como o endereço encontra o terreno, porque essa ligação não é automática.

Quando alguém digita o seu domínio, o navegador não faz ideia de onde ficam os arquivos. Ele pergunta. Essa pergunta vai para o DNS, que é uma lista telefônica distribuída pelo mundo inteiro, e a resposta é um número, o endereço do servidor onde a sua hospedagem está.

```
$ dig marciordg.com +short
82.25.67.39
```

Essa linha é a coisa mais importante e mais frágil de toda a estrutura. Quem controla a conta do domínio pode trocar esse número em trinta segundos e mandar todo o seu tráfego para outro servidor. E como as respostas de DNS ficam guardadas em cache pelo caminho, uma alteração pode levar horas para chegar em todo mundo, o que produz o efeito confuso de o site funcionar no seu celular e não funcionar no computador do seu sócio ao mesmo tempo.

Também é aqui que mora o e-mail. Os registros de e-mail ficam no mesmo lugar, na mesma configuração de DNS. Já vi migração de hospedagem feita com cuidado no site e sem cuidado nenhum nos registros de e-mail, e o resultado é uma empresa inteira sem receber mensagem por um dia e meio, sem entender o motivo, porque o site abriu normalmente.

## o rastreamento é a quarta peça, e a mais mal explicada

As três primeiras entregam a página. A quarta responde uma pergunta diferente: essa venda veio de onde.

Sem rastreamento você sabe quanto gastou e quanto vendeu, mas não sabe qual anúncio produziu qual venda. E o Meta e o Google não sabem tampouco, o que é pior, porque os dois otimizam a entrega com base no que aprendem de retorno. Anúncio sem retorno de informação é anúncio otimizado no escuro.

Funciona em dois caminhos, e a maioria dos negócios usa só o primeiro.

O primeiro é o pixel, um pedacinho de código que roda dentro do navegador da pessoa. Quando ela chega na página de obrigado, o código dispara e avisa a plataforma. Simples de instalar e frágil pelo mesmo motivo: depende do navegador dela cooperar. Bloqueador de anúncio impede. O Safari limita há anos a validade dos cookies escritos por script, o que faz a pessoa que voltou duas semanas depois parecer uma pessoa nova. Nada disso é falha da instalação, é o navegador funcionando como foi projetado.

O segundo caminho é o servidor. A mesma conversão é enviada da sua hospedagem direto para a plataforma, sem passar pelo navegador. No Meta isso se chama Conversions API. Não é bloqueável por extensão, porque não acontece na máquina do visitante.

Os dois convivem, e é assim que deve ser. Você manda o evento pelos dois caminhos com o mesmo identificador, e a plataforma percebe que é o mesmo acontecimento e conta uma vez só:

```js
// mesmo id nos dois caminhos, para a plataforma nao contar a venda duas vezes
const eventId = crypto.randomUUID();

fbq('track', 'Purchase', { value: 297.00, currency: 'BRL' }, { eventID: eventId });

// e o mesmo eventId vai no envio que o seu servidor faz para a Conversions API
```

O detalhe que quase sempre passa batido: o rastreamento pelo servidor mora na hospedagem. Ele é código que roda no seu servidor, com uma chave de acesso guardada lá. Trocar de hospedagem sem levar essa parte junto é a razão mais comum de o painel de anúncios ficar mudo depois de uma migração que "deu tudo certo".

![Comparação entre o rastreamento pelo navegador e pelo servidor, mostrando o caminho do pixel sendo interrompido por bloqueador e limite de cookie, e o caminho da Conversions API saindo direto da hospedagem para a plataforma](/blog/img/rastreamento-navegador-servidor-1200x560.webp)

Uma ressalva honesta, porque isso costuma ser vendido como solução mágica: enviar pelo servidor recupera parte do que se perde, não tudo. A qualidade do que chega depende dos dados que você tem da pessoa para fazer a correspondência, e isso esbarra em consentimento e na LGPD. Quem promete recuperação total está vendendo, não explicando.

## o que quebra quando cada peça falha

Vale guardar o mapa, porque o sintoma raramente aponta para a peça certa.

Domínio vencido ou apontado para outro lugar: o site inteiro some para todo mundo, e o e-mail some junto. É o pior dos quatro e o mais barato de evitar.

Hospedagem fora do ar: o domínio continua seu, o site continua existindo, e o visitante vê erro ou espera para sempre. Migrar resolve, desde que você tenha os arquivos.

Arquivos perdidos: nada quebra hoje. Você descobre no dia em que precisa mudar alguma coisa e não existe nada para mudar. É o único que não dá sintoma antes de doer.

Rastreamento quebrado: o site funciona perfeitamente, as vendas continuam entrando, e o painel de anúncios mostra menos conversão do que existe. Aí você desliga uma campanha que estava dando lucro. É o mais caro justamente porque não parece uma falha técnica, parece um resultado ruim.

## o que estar no seu nome significa na prática

Não é uma frase de contrato, é uma lista de quatro acessos.

A conta do registrador do domínio, com o e-mail de recuperação sendo um e-mail que você lê, e o titular do registro no seu CNPJ.

A conta da hospedagem, pelo mesmo critério. Se você paga no seu cartão e não sabe o login, isso não é acesso.

O código do site em algum lugar de onde você consiga baixar. Repositório com você como dono, ou um backup em arquivo que alguém já testou restaurar em outro servidor.

O Gerenciador de Negócios do Meta e a conta do Google Ads no seu nome, com a agência adicionada como parceira. Esse é o formato certo. Agência dona da conta e você como convidado é o arranjo que produz aquela mensagem que ninguém quer receber.

Nada disso impede terceirizar. Eu mesmo opero domínio e servidor de clientes todo dia. A diferença entre operar e possuir é que na primeira você pode me demitir numa terça-feira e na quarta o site continua no ar.

## por que isso continua confuso

A confusão não é burrice de quem compra. Ela é produto de como isso é vendido.

Quatro serviços de naturezas diferentes, com quatro empresas por trás, empacotados numa única linha de orçamento chamada "site". Enquanto tudo funciona, a simplificação é gentil, ninguém precisa saber o que é um registro DNS para vender. Ela só cobra o preço quando alguma peça precisa trocar de mão, e nessa hora a conta de dois anos de simplificação chega inteira de uma vez.

O trabalho de entender as quatro leva uma tarde. Ele não deixa o site mais rápido nem o anúncio mais barato. Ele só garante que a coisa que você pagou para construir continue sendo sua depois que a relação com quem construiu acabar, e essa é uma garantia que só se descobre valiosa quando não se tem.
