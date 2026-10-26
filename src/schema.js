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
  telephone: '+55-33-99914-7537',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Capistrano de Abreu, 75, Altinópolis',
    addressLocality: 'Governador Valadares',
    addressRegion: 'MG',
    postalCode: '35053-080',
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

export const artigo = ({ titulo, descricao, rota, data, atualizado = data }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: titulo,
  description: descricao,
  url: SITE + rota,
  datePublished: data,
  dateModified: atualizado,
  inLanguage: 'pt-BR',
  author: { '@type': 'Person', name: 'Márcio Patrick Rodrigues Dias', url: `${SITE}/sobre` },
  publisher: { '@id': ORG_ID },
})
