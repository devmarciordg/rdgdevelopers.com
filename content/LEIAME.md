# Conteúdo do site

Tudo aqui é lido só no build e vira HTML estático. É o que o futuro painel admin vai editar: o painel grava estes arquivos (commit no GitHub), o CI valida e gera o site. Nada é gravado direto no servidor.

| Caminho | O que é | Esquema |
|---|---|---|
| `blog/<slug>.md` | Post. O nome do arquivo é a URL: `/blog/<slug>` | `_schemas/post.schema.json` |
| `taxonomia.json` | Temas (1 por post) e tags (1 a 3 por post) | `_schemas/taxonomia.schema.json` |
| `autores.json` | Autores dos posts | `_schemas/autores.schema.json` |
| `projetos/<id>.json` | Projetos de `/projetos` e da home | `_schemas/projeto.schema.json` |
| `termos-vetados.json` | Termos que soam como promessa de resultado | |

Os esquemas seguem o JSON Schema e têm título e descrição em português em cada campo: o painel pode montar o formulário e os textos de ajuda a partir deles.

## Conferir antes de publicar

- `npm run validar` confere tudo em menos de 1 segundo e lista todos os erros com arquivo, linha e campo.
- O build (`npm run build`) roda a mesma validação e falha se houver erro.

## Post

```md
---
titulo: Meta CAPI para clínicas: como medir lead de verdade
descricao: O que é a API de Conversões da Meta, como ela se soma ao pixel e quais eventos medir numa clínica.
status: publicado
publicado: 2026-10-26
autores: [marcio]
tema: trafego-e-dados
tags: [meta-capi, clinicas, lgpd]
---

Texto em Markdown.
```

O build calcula sozinho a rota, o tempo de leitura, o sumário (com 3 ou mais `##`), o "Leia também", o schema e o feed. Nada disso é digitado.

Campos opcionais:
- `atualizado`: só quando o conteúdo mudar de verdade.
- `relacionados`: escolhe à mão o "Leia também".
- `cliente_citado` e `autorizacao_cliente`: andam juntos.
- `autores`: de 1 a 4 pessoas de `autores.json`, na ordem em que aparecem. Cadastre e edite pelo painel (botão "Autores"): nome, endereço, cargo, página e foto. A foto é recortada em quadrado no centro, reduzida para 112px e salva em `src/assets/autores/<slug>.webp`; sem foto, o site mostra as iniciais. O endereço (slug) não muda depois de criado, porque os posts citam o autor por ele.
- `termos_liberados`: ver abaixo.

## Markdown aceito

Só o que o site sabe mostrar. O resto é erro no build, nunca HTML solto.

- `## Seção` e `### Subseção`. O título principal vem do campo `titulo`.
- Parágrafo, `**negrito**`, `*itálico*`, `` `código` ``.
- Link: `[texto](/caminho-interno)` ou `[texto](https://...)`.
- Listas `- item` e `1. item` (um nível). Linha seguinte com 2 espaços continua o item.
- Citação: `> texto`.
- Código em bloco com ```` ```json ```` (a linguagem é opcional e aparece como rótulo).
- Destaques: `:::nota`, `:::aviso` ou `:::dica`, o texto, e `:::` para fechar.

## Regras que o build impõe

- **Tag e tema:** só os cadastrados em `taxonomia.json`. Uma tag ganha página (`/blog/tag/<slug>`) com 2 ou mais posts publicados e `descricao` preenchida. Sem isso, aparece como texto.
- **Datas:** `publicado` não pode ser futura, e `atualizado` não pode ser anterior a `publicado`.
- **Promessa de resultado (CDC e CONAR):** termo de `termos-vetados.json` bloqueia o post. Se o contexto não promete nada (ex.: "não é um lead garantido"), libere o termo no próprio post com `termos_liberados: [garantido]`. A liberação fica visível no histórico.
- **Cliente:** citar cliente exige autorização registrada. Nunca use dado de paciente ou de cliente final.
- **Rascunho:** `status: rascunho` não vira página, nem entra na lista, no sitemap ou no feed. Mas o arquivo fica no repositório, então se o repositório for público o texto é visível lá.

## Painel /admin

Em `rdgdevelopers.com/admin` dá para escrever, editar e publicar post pelo navegador, sem instalar nada.

- **Token:** em GitHub, Settings > Developer settings > Fine-grained tokens, crie um token só para o repositório `devmarciordg/rdgdevelopers.com`, com a permissão **Contents: Read and write** e validade de 90 dias. Vencido, crie outro.
- **Onde ele fica:** só nesta aba do navegador (some ao fechar). Marcando "Lembrar neste navegador", fica gravado no navegador até você clicar em sair. Não marque em computador compartilhado.
- **O que o painel faz:** valida o post com as mesmas regras do build e grava os arquivos em `content/` com um commit na `main`. O CI valida de novo e gera o site.
- **Rascunho:** o repositório é público, então um post com `status: rascunho` gravado pelo painel já pode ser lido no GitHub.
- **Quando aparece no site:** só depois que o deploy rodar. O commit gravado não muda o site na hora.

## Imagens nos posts

- No painel, o botão **Imagem** do editor escolhe o arquivo, reduz para no máximo 1600px de largura, converte para WebP e pede a descrição (obrigatória, para quem usa leitor de tela) e uma legenda opcional. A imagem vai para `public/blog/img/` no mesmo commit do post.
- No texto ela fica numa linha só: `![descrição](/blog/img/nome-1600x800.webp "legenda")`. A largura e a altura no fim do nome reservam o espaço da imagem na página (sem pulo de layout). Imagem no meio de um parágrafo, sem descrição ou fora de `/blog/img/` é erro.
- O build falha se um post citar uma imagem que não existe.
- **Galeria** (botão "Imagens" na lista de posts): mostra todas as imagens, em que post cada uma é usada (posts do repositório, publicados ou rascunhos, e rascunhos guardados no navegador) e apaga de uma vez as sem uso, num commit só, depois de confirmar.
- O repositório é público: não suba imagem com dado de paciente, cliente final ou conversa com pessoa identificável.
