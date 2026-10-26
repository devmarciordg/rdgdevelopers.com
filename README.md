# rdgdevelopers.com

Site institucional da RDG Developers.

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev), usado só no build como motor de template.
- Cada rota é pré-renderizada em HTML estático. O navegador recebe HTML, um CSS e cerca de 1 KB de JS (ilhas vanilla: formulário e consentimento de cookies).
- Zero dependências de runtime além de `react` e `react-dom`, que não chegam ao navegador.

Meta de qualidade: Lighthouse 100 em Performance, Acessibilidade, Boas práticas e SEO, e WCAG 2.1 AA.

## Requisitos

- Node.js 24 (ver `.nvmrc`)

## Comandos

```bash
npm ci           # instala as dependências travadas no package-lock.json
npm run dev      # servidor local com renderização no servidor, igual ao build
npm run build    # gera dist/: um index.html por rota, sitemap.xml e assets
npm run preview  # serve dist/ como em produção
```

O `build` falha se uma página não tiver `meta.titulo` e `meta.descricao` ou se houver link interno para uma rota inexistente.

## Estrutura

```
index.html               template (head fixo, consentimento, <!--head--> e <!--app-->)
public/                  arquivos servidos como estão (favicon, og.png, robots.txt, fontes)
scripts/prerender.js     gera o HTML de cada rota, o sitemap e confere os links internos
src/
  paginas/               uma página por arquivo; a rota vem do caminho
                         (paginas/servicos/trafego-pago.jsx -> /servicos/trafego-pago)
  components/            seções e blocos reutilizáveis
  styles/                CSS por componente; base.css tem tokens e classes comuns
  islands/               JS vanilla que roda no navegador (auto-inicializa)
  assets/                imagens otimizadas (AVIF/WebP)
  empresa.js             dados legais da empresa (fonte única)
  servicos.js            lista de serviços (fonte única)
  head.js, schema.js     SEO por página e JSON-LD
  entry-server.jsx       renderização no servidor (build e dev)
  cliente.js             única entrada de JS e CSS no navegador
```

## Criar uma página

Crie `src/paginas/<rota>.jsx` exportando o componente padrão e `meta`:

```jsx
import CabecalhoPagina from '../components/CabecalhoPagina.jsx'
import { breadcrumb } from '../schema.js'

export const meta = {
  titulo: 'Título da página',
  descricao: 'Descrição para o Google, até 160 caracteres.',
  schema: [breadcrumb([['Título da página', '/rota']])],
}

export default function Pagina() {
  return <CabecalhoPagina trilha={[['Título da página']]} titulo="Título da página" />
}
```

## Deploy

`npm run build` e publicar `dist/` no servidor. No Caddy, servir `{path}/index.html` e usar `404.html` para rotas inexistentes.

## Licença

Código e conteúdo proprietários da RDG Developers. Todos os direitos reservados. Ver [LICENSE](LICENSE).
A fonte Bebas Neue é distribuída sob a SIL Open Font License 1.1 (`public/fonts/OFL.txt`).
