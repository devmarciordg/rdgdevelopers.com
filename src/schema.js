// Geradores de JSON-LD (schema.org). Use em `meta.schema` de cada página.
import { empresa } from './empresa.js'
import { SITE } from './head.js'

const ORG_ID = `${SITE}/#organizacao`

export const organizacao = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ORG_ID,
  name: empresa.nome,
  legalName: empresa.razaoSocial,
  taxID: empresa.cnpj,
  url: `${SITE}/`,
  logo: `${SITE}/favicon.svg`,
  image: `${SITE}/og.png`,
  email: empresa.email,
  telephone: empresa.telefone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${empresa.local.rua}, ${empresa.local.bairro}`,
    addressLocality: empresa.local.cidade,
    addressRegion: empresa.local.uf,
    postalCode: empresa.local.cep,
    addressCountry: 'BR',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
})

// itens: [['Serviços', '/servicos'], ['Tráfego pago', '/servicos/trafego-pago']]
export const breadcrumb = (itens) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Início', '/'], ...itens].map(([name, rota], i) => ({
    '@type': 'ListItem', position: i + 1, name, item: SITE + rota,
  })),
})

export const servico = ({ nome, descricao, rota }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: nome,
  description: descricao,
  url: SITE + rota,
  provider: { '@id': ORG_ID },
  areaServed: { '@type': 'Country', name: 'Brasil' },
})

// perguntas: [{ pergunta, resposta }]
export const faq = (perguntas) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: perguntas.map((p) => ({
    '@type': 'Question', name: p.pergunta, acceptedAnswer: { '@type': 'Answer', text: p.resposta },
  })),
})

// Post do blog, a partir do objeto de src/conteudo (nada aqui é digitado à mão)
export const artigo = (p) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: p.titulo,
  description: p.descricao,
  url: SITE + p.rota,
  mainEntityOfPage: SITE + p.rota,
  image: `${SITE}/og.png`,
  datePublished: p.publicado,
  dateModified: p.atualizado ?? p.publicado,
  inLanguage: 'pt-BR',
  articleSection: p.tema.nome,
  keywords: p.tags.map((t) => t.nome).join(', '),
  wordCount: p.palavras,
  author: p.autores.map((a) => (a.organizacao ? { '@id': ORG_ID } : { '@type': 'Person', name: a.nome, url: SITE + a.url })),
  publisher: { '@id': ORG_ID },
})

// Listagem do blog (geral, tema ou tag)
// Case de cliente: CreativeWork sobre o cliente. Sem Review nem Rating: os números ficam só no HTML, com o aviso
export const caso = (p) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: p.titulo,
  description: p.resumo,
  url: SITE + p.rota,
  inLanguage: 'pt-BR',
  about: { '@type': 'Organization', name: p.cliente },
  creator: { '@id': ORG_ID },
})

export const colecao = ({ titulo, descricao, rota, posts }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: titulo,
  description: descricao,
  url: SITE + rota,
  inLanguage: 'pt-BR',
  isPartOf: { '@id': ORG_ID },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + p.rota, name: p.titulo })),
  },
})
