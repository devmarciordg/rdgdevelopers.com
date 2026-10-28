---
titulo: Caixeiro viajante: onde a força bruta morre no seu código
descricao: O problema do caixeiro viajante na prática: por que a força bruta trava com poucas cidades e como Held-Karp e 2-opt chegam a rotas boas em tempo útil.
status: publicado
publicado: 2026-08-18
autores: [marcio]
tema: bastidores-tecnicos
tags: [algoritmos]
---

O primeiro instinto de quase todo mundo diante do caixeiro viajante é o mesmo: testar todas as ordens possíveis e ficar com a menor. É um instinto correto no sentido de que funciona, produz a resposta certa, e é fácil de escrever. Vinte linhas resolvem.

O problema é que ele funciona até um número de cidades tão pequeno que chega a ser constrangedor. Não estou falando de milhares. Estou falando de doze.

Este artigo é sobre esse muro. Onde exatamente ele fica, o que acontece quando você troca o algoritmo por um exponencial de verdade, e por que a saída não é ficar mais esperto na busca do ótimo. Todos os tempos aqui foram medidos na minha máquina, não copiados de lugar nenhum. O script está em `scripts/bench_tsp.py` e roda em qualquer lugar com Python 3.

## O problema, dito com precisão

Dadas n cidades e a distância entre cada par delas, encontre o ciclo de menor comprimento que visita cada cidade exatamente uma vez e volta ao começo.

Repare no que essa definição não diz. Ela não pede uma rota boa. Pede a menor. Essa palavra é o que separa um problema de ordenação, que você resolve em `O(n log n)` sem pensar, de um problema que ninguém sabe resolver rápido.

O caixeiro viajante é NP-difícil. A versão de decisão, "existe rota com custo menor que k", está na lista original de Karp de 1972. Na prática isso significa que ninguém conhece algoritmo de tempo polinomial para ele, e que descobrir um resolveria de uma vez todos os outros problemas NP-completos. Não é que seja difícil. É que a dificuldade dele está amarrada à de centenas de outros.

Vale dizer o que NP-difícil não significa, porque a leitura preguiçosa é comum: não significa impossível, nem significa que instâncias grandes sejam inatacáveis. Volto nesse ponto mais adiante, com um caso de 85.900 cidades resolvido até a otimalidade.

## Quantas rotas existem, exatamente

Fixando a cidade de partida, sobram `(n-1)!` ordens. Como percorrer o ciclo ao contrário dá o mesmo comprimento, o número de rotas realmente distintas é `(n-1)!/2`.

Esses números crescem de um jeito que a intuição não acompanha:

```
   n         (n-1)!/2 rotas       n^2 * 2^n passos
   5                     12                    800
  10                181,440                102,400
  15         43,589,145,600              7,372,800
  20 60,822,550,204,416,000            419,430,400
  25 310,224,200,866,619,719,680,000         20,971,520,000
  30 4,420,880,996,869,850,977,271,808,000,000        966,367,641,600
```

A coluna da direita é a contagem de operações do Held-Karp, que eu explico daqui a pouco. Guarde a comparação em 25 cidades: 3,1 × 10²³ rotas contra 2,1 × 10¹⁰ passos. Treze ordens de grandeza de diferença, e as duas abordagens dão exatamente a mesma resposta.

## O muro, medido

Aqui estão os tempos que eu obtive. Pontos aleatórios num quadrado de 100 por 100, semente fixa em 42, Python 3.12 num Intel de décima geração:

```
   n      forca bruta        held-karp
  10           0.561s           0.003s
  11           5.617s           0.008s
  12          61.859s           0.017s
  15                -           0.228s
  18                -           2.753s
  20                -          14.129s
  21                -          31.003s
```

Força bruta em 12 cidades: um minuto e dois segundos. Onze cidades levam 5,6 segundos. Dez levam meio segundo.

O padrão é o multiplicador. Cada cidade nova multiplica o tempo por `n-1`, porque é exatamente isso que o fatorial faz. Partindo dos 61,9 segundos medidos em doze, dá para projetar o resto:

```
n=13         742.8 s          (12 minutos)
n=15           1.6 dias
n=17             1 ano
n=20         5,978 anos
n=21       119,552 anos
n=25 30,488,540,435 anos      (o dobro da idade do universo)
```

Deixo explícito que da linha `n=13` para baixo são projeções aritméticas, não medições. Medir n=15 tomaria um dia e meio da máquina e não acrescentaria nada que o multiplicador já não diga.

O que me interessa nessa tabela não é o absurdo do final. É como o muro chega perto. Doze cidades é uma rota de entrega de bairro. É um vendedor visitando clientes numa manhã. É um número que qualquer pessoa consideraria pequeno, e a solução ingênua já não termina antes do café esfriar.

![Comparação de tempo até a rota ótima entre força bruta e Held-Karp, mostrando que o limite prático passa de 12 para 21 cidades](/blog/img/muro-fatorial-tsp-1200x620.webp)

## Trocar fatorial por exponencial

O Held-Karp, publicado em 1962, resolve o mesmo problema exato com programação dinâmica sobre subconjuntos. A ideia é que muita coisa está sendo recalculada.

Pense assim: se você já sabe qual é o caminho mais curto que sai da cidade 0, passa pelo conjunto `{3, 7, 9}` e termina em 7, essa informação vale para todas as continuações possíveis. A força bruta joga fora esse resultado e recalcula do zero em cada permutação que compartilha o mesmo prefixo. O Held-Karp guarda.

O estado é o par `(conjunto já visitado, cidade atual)`. São `2^n` conjuntos vezes `n` cidades, e cada transição olha `n` destinos, o que dá `O(n² · 2^n)` de tempo e `O(n · 2^n)` de memória.

```python
def held_karp(d: list[list[float]]) -> tuple[float, list[int]]:
    """Programação dinâmica sobre subconjuntos. A cidade 0 é sempre o início,
    então os bits do 'mascara' representam as cidades 1..n-1."""
    n = len(d)
    total = 1 << (n - 1)
    INF = float('inf')
    dp = [[INF] * (n - 1) for _ in range(total)]
    pai = [[-1] * (n - 1) for _ in range(total)]

    # Caso base: sair de 0 e parar na cidade j.
    for j in range(n - 1):
        dp[1 << j][j] = d[0][j + 1]

    for mascara in range(total):
        linha = dp[mascara]
        for j in range(n - 1):
            atual = linha[j]
            # Estado inalcançável ou j fora do conjunto: nada a estender.
            if atual == INF or not (mascara >> j) & 1:
                continue
            for k in range(n - 1):
                if (mascara >> k) & 1:
                    continue
                nova = mascara | (1 << k)
                cand = atual + d[j + 1][k + 1]
                if cand < dp[nova][k]:
                    dp[nova][k] = cand
                    pai[nova][k] = j

    # Fecha o ciclo voltando para a cidade 0.
    cheia = total - 1
    melhor_custo, ultimo = INF, -1
    for j in range(n - 1):
        c = dp[cheia][j] + d[j + 1][0]
        if c < melhor_custo:
            melhor_custo, ultimo = c, j

    rota = []
    mascara, j = cheia, ultimo
    while j != -1:
        rota.append(j + 1)
        anterior = pai[mascara][j]
        mascara ^= 1 << j
        j = anterior
    rota.append(0)
    rota.reverse()
    return melhor_custo, rota
```

A parte que costuma travar a leitura é a máscara de bits. Ela é só um inteiro onde o bit `j` ligado significa "a cidade `j+1` já foi visitada". Com 20 cidades, o conjunto visitado cabe num inteiro de 19 bits, e testar pertinência é um `and`. É a estrutura de dados mais barata possível para conjunto de tamanho conhecido e pequeno, e é por isso que o algoritmo funciona na prática apesar do tamanho da tabela.

Em doze cidades, o Held-Karp levou 0,017 segundo contra 61,859 da força bruta. Cerca de 3.600 vezes mais rápido, com a resposta idêntica. Conferi que os dois batem em todas as instâncias onde ambos rodaram, e batem.

E aqui está o ponto que eu queria chegar: isso é uma vitória enorme e não muda o veredito.

O muro saiu de 12 e foi para 21. Em 21 cidades já são 31 segundos, e cada cidade nova dobra isso, com folga. Em 25 cidades a memória estoura antes do tempo: a tabela precisaria de `2^24 × 24` posições, mais de 400 milhões de células, o que em Python significa dezenas de gigabytes. Uma implementação em C mudaria as constantes e talvez levasse o teto para perto de 30. Não mudaria a forma da curva.

Trocar fatorial por exponencial compra cerca de nove cidades. É muito quando você precisa de dezoito. É nada quando você precisa de duzentas.

## A pergunta errada

O reflexo seguinte é procurar um algoritmo exato mais esperto. É reflexo bom, e ele já foi seguido por gente muito mais competente do que eu por sessenta anos. O que apareceu foi outra coisa: a percepção de que quase ninguém precisa do ótimo.

Se você está roteirizando entregas, uma rota 1% pior que a ótima é indistinguível de ótima na prática. O trânsito vai variar mais que isso. O motorista vai parar para almoçar. Um cliente não vai atender. A precisão do modelo é menor que a precisão da resposta.

Então a pergunta deixa de ser "qual é a rota mínima" e passa a ser "qual a melhor rota que eu consigo dentro de um orçamento de tempo". Essa é uma pergunta de engenharia, e tem resposta.

## A heurística mais ingênua é ruim, e vale medir o quanto

O vizinho mais próximo é o que qualquer pessoa faria à mão: da cidade atual, vá para a mais perto ainda não visitada. Repita.

```python
def vizinho_mais_proximo(d, inicio=0):
    n = len(d)
    visitado = [False] * n
    rota = [inicio]
    visitado[inicio] = True
    atual = inicio
    for _ in range(n - 1):
        melhor, melhor_d = -1, float('inf')
        linha = d[atual]
        for j in range(n):
            if not visitado[j] and linha[j] < melhor_d:
                melhor, melhor_d = j, linha[j]
        rota.append(melhor)
        visitado[melhor] = True
        atual = melhor
    return rota
```

É `O(n²)`, roda instantaneamente, e produz rota feia. Nas minhas instâncias, comparando com o ótimo que o Held-Karp encontrou:

```
   n   vizinho +%     2-opt +%    tempo 2-opt
  12        12.2%         0.0%        0.0000s
  15        16.1%         0.0%        0.0000s
  18        30.7%         0.4%        0.0001s
  21        30.6%         0.3%        0.0001s
```

Trinta por cento acima do ótimo em dezoito cidades. O defeito é estrutural, não azar: o algoritmo é guloso e sem arrependimento. Ele vai comendo os vizinhos fáceis e deixa para o fim as cidades isoladas que ninguém quis, e aí precisa atravessar o mapa inteiro para buscá-las. O último trecho de uma rota de vizinho mais próximo costuma ser um zigue-zague constrangedor.

Existe teorema para isso. Rosenkrantz, Stearns e Lewis mostraram em 1977 que, para instâncias métricas, a razão do vizinho mais próximo cresce como `O(log n)`. Ou seja, não existe constante que limite o quão ruim ele pode ficar: piora com o tamanho.

## O 2-opt, que é quase tudo o que você precisa

O que salva a situação é uma ideia de 1958, de Croes. Pegue duas arestas da rota, remova as duas, e religue as pontas do outro jeito possível. Se ficar mais curto, fique com a troca. Repita até não achar mais nenhuma melhoria.

![Diagrama da troca do 2-opt, mostrando duas arestas que se cruzam antes e as mesmas cidades religadas sem cruzamento depois](/blog/img/troca-2-opt-1200x560.webp)

Em plano euclidiano isso tem uma interpretação geométrica limpa: qualquer rota cujos caminhos se cruzam pode ser encurtada desfazendo o cruzamento. A desigualdade triangular garante. Uma rota ótima nunca se cruza, e o 2-opt é exatamente a operação que remove cruzamento.

O detalhe de implementação que importa é não recalcular o comprimento da rota inteira a cada tentativa. A diferença depende só das quatro cidades envolvidas:

```python
def dois_opt(rota, d, limite_s=60.0):
    n = len(rota)
    inicio = time.perf_counter()
    melhorou = True
    while melhorou:
        melhorou = False
        for i in range(1, n - 1):
            a, b = rota[i - 1], rota[i]
            for j in range(i + 1, n):
                c = rota[j]
                e = rota[(j + 1) % n]
                if b == e:
                    continue
                # Só as quatro arestas mudam: comparar o delta é O(1).
                # Recalcular custo(rota) aqui dentro seria O(n) e transformaria
                # o laço em O(n^3) por passada, sem necessidade nenhuma.
                delta = (d[a][c] + d[b][e]) - (d[a][b] + d[c][e])
                if delta < -1e-9:
                    rota[i:j + 1] = reversed(rota[i:j + 1])
                    melhorou = True
                    b = rota[i]
            if time.perf_counter() - inicio > limite_s:
                return rota
    return rota
```

Duas decisões merecem comentário. O `delta` avaliado em tempo constante é o que torna a coisa viável; calcular o custo total dentro do laço interno seria `O(n³)` por passada e mataria a heurística no berço. E o `limite_s` existe porque em instância grande o 2-opt pode ficar muito tempo caçando melhorias marginais. Ter um orçamento explícito é o que transforma "roda até convergir" em algo que você pode colocar numa requisição HTTP.

Volte à tabela anterior e olhe a coluna do 2-opt. Em doze e quinze cidades ele achou o ótimo. Em dezoito e vinte e uma ficou a 0,4% e 0,3%. Em um décimo de milissegundo.

Comparado com os 31 segundos que o Held-Karp levou para provar o ótimo em 21 cidades, isso é uma diferença de mais de trezentas mil vezes no tempo, para uma rota 0,3% pior. Se você tem um caso de uso em que esses 0,3% importam mais que trezentas mil vezes de tempo, ele existe e é legítimo, mas é raro.

## E quando são duas mil cidades

Aqui não existe mais ótimo conhecido para comparar, então a medida passa a ser quanto o 2-opt melhora sobre o ponto de partida:

```
     n      vizinho        2-opt      ganho    tempo total
    50        714.5        608.9      14.8%         0.001s
   100       1062.8        858.8      19.2%         0.004s
   500       2028.5       1798.7      11.3%         0.174s
  1000       2900.5       2504.1      13.7%         0.996s
  2000       3974.5       3500.5      11.9%         5.819s
```

Duas mil cidades em menos de seis segundos, em Python puro, sem biblioteca. Esse é o mesmo problema que, no caminho exato, ficaria além da idade do universo com vinte e cinco.

Uma ressalva honesta sobre esses números: o ganho de 12% a 19% é sobre o vizinho mais próximo, não sobre o ótimo. Não sei a que distância do ótimo essas rotas estão, porque calcular o ótimo em 2000 cidades exige um solver de verdade, não um script de benchmark. Pela literatura, 2-opt costuma ficar em torno de 5% acima do ótimo em instâncias euclidianas aleatórias, mas isso é referência de terceiro, não medição minha, e eu trato as duas coisas de forma diferente.

## O que a teoria garante, e o que ela não garante

Existe um resultado famoso de 1976, de Christofides, que dá garantia para TSP métrico: a rota produzida nunca passa de 1,5 vez o ótimo. É construída com árvore geradora mínima, emparelhamento perfeito de peso mínimo sobre os vértices de grau ímpar, e circuito euleriano. Por quase cinquenta anos esse 1,5 ficou imbatido.

Em 2020, Karlin, Klein e Oveis Gharan furaram o teto pela primeira vez, com um algoritmo que garante `1,5 - ε`. O detalhe delicioso é o tamanho do épsilon: da ordem de `10^-36`. É um marco teórico enorme e um ganho prático de zero.

Vale entender o que uma garantia dessas quer dizer, porque é fácil ler errado. Ela é sobre o pior caso. Diz que existe um limite que nenhuma instância consegue estourar. Não diz que o algoritmo é bom no caso médio, e na prática o 2-opt, que não tem garantia constante nenhuma, costuma produzir rotas melhores que Christofides em instâncias reais. Garantia teórica e desempenho típico são eixos diferentes, e confundir os dois leva a escolher o algoritmo errado com muita confiança.

Quando o assunto é qualidade de verdade, o estado da arte prático é a família Lin-Kernighan, de 1973, e a implementação LKH do Helsgaun. Ela faz trocas de profundidade variável em vez de sempre duas arestas, e chega rotineiramente a frações de por cento do ótimo em instâncias grandes.

## NP-difícil não quer dizer impossível

O Concorde, solver desenvolvido por Applegate, Bixby, Chvátal e Cook, resolveu em 2006 a instância pla85900, com 85.900 cidades, provando otimalidade. Não é uma boa rota. É a melhor rota que existe, com prova.

Isso não contradiz nada do que está acima. O Concorde não roda um algoritmo polinomial: ele usa branch and cut, relaxação linear, planos de corte, e uma quantidade absurda de engenharia para podar o espaço de busca. O tempo de execução continua exponencial no pior caso. O que ele faz é evitar o pior caso na maioria das instâncias que aparecem na vida real, porque instância real não é adversarial.

Guardo essa história porque ela desfaz duas conclusões preguiçosas de uma vez. A primeira é a de que NP-difícil significa desistir. A segunda, oposta e igualmente errada, é a de que sempre dá para arrumar um jeito. O que existe é uma faixa larga entre os dois extremos, e saber onde o seu problema cai nessa faixa é o trabalho.

## Por que isso aparece no seu dia

Você provavelmente não vai implementar caixeiro viajante este ano. Mas a estrutura da decisão é a mesma que você toma toda semana, e o TSP é onde ela fica visível porque os números são grotescos.

Quando você põe um índice numa tabela, está trocando uma varredura completa por uma busca em árvore, o que é a mesma natureza de troca do fatorial pelo exponencial: uma classe de custo por outra melhor. Quando você põe um `LIMIT` numa consulta que poderia devolver tudo, está admitindo que a resposta parcial serve. Quando você aceita um cache que pode estar alguns segundos desatualizado, está trocando exatidão por tempo, exatamente como o 2-opt troca 0,3% de qualidade por trezentas mil vezes de velocidade.

A diferença é que no caixeiro viajante ninguém finge que a força bruta é aceitável, porque o custo aparece na primeira execução. Numa aplicação web, a versão ingênua roda em 40 milissegundos com os cem registros do ambiente de desenvolvimento e só mostra o que é quando chega em produção com cem mil.

O reflexo que eu tento manter é perguntar qual é a curva antes de perguntar qual é o tempo. Um número medido hoje diz pouco sozinho. `O(n²)` com n valendo 50 é rápido. O mesmo `O(n²)` com n valendo 5.000 é dez mil vezes mais lento, e a mudança de n raramente é uma decisão de engenharia: ela vem do negócio dando certo.

## Onde meus números não valem

Termino delimitando o que eu medi, porque generalizar benchmark é o jeito mais fácil de transformar dado em achismo.

São pontos aleatórios uniformes num quadrado, com distância euclidiana e uma única semente. Instância real de roteirização não se parece com isso: endereços vêm em aglomerados, a distância que importa é a da malha viária e não a linha reta, e a matriz costuma ser assimétrica, porque a ida por uma via de mão única não custa o mesmo que a volta. Cada uma dessas diferenças muda o comportamento das heurísticas, geralmente para pior.

Python também é lento, e isso infla todos os tempos absolutos por uma constante de talvez cinquenta vezes contra C. O que a constante não toca é a inclinação da curva, que é o único motivo pelo qual esses números significam alguma coisa. Se você reimplementar o benchmark em C e o muro da força bruta subir de 12 para 14 cidades, o argumento continua idêntico.

E o problema de verdade de quem tem frota nem é o caixeiro viajante. É o problema de roteamento de veículos, com capacidade de carga, janela de horário de entrega, jornada de motorista e vários veículos ao mesmo tempo. O TSP é o núcleo simplificado disso, o caso de um veículo sem restrição nenhuma. Se o caso mais simples já não tem solução exata viável em vinte e cinco pontos, dá para calibrar a expectativa sobre o resto.
