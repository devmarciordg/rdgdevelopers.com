// Fonte única dos dados legais: rodapé, schema e páginas legais leem daqui.
const local = { rua: 'Rua Capistrano de Abreu, 75', bairro: 'Altinópolis', cidade: 'Governador Valadares', uf: 'MG', cep: '35053-080' }

export const empresa = {
  nome: 'RDG Developers',
  razaoSocial: 'MARCIO RDG DESENVOLVIMENTO DE SOFTWARE LTDA',
  cnpj: '64.014.391/0001-86',
  local,
  endereco: `${local.rua}, ${local.bairro}, ${local.cidade}/${local.uf}, CEP ${local.cep}`,
  email: 'contato@rdgdevelopers.com',
  emailPrivacidade: 'privacidade@rdgdevelopers.com',
  encarregado: 'Márcio Patrick Rodrigues Dias',
  whatsapp: '(33) 99914-7537',
  telefone: '+5533999147537',
  // Mesmo horário do openingHoursSpecification em schema.js
  horario: 'Segunda a sexta, das 09:00 às 17:00',
  // shortcut: URL do webhook n8n ainda não definida; preencher antes do deploy
  webhookLead: '',
  whatsappLink:'https://wa.me/5533999147537?text=' + encodeURIComponent('Olá! Vim pelo site da RDG.'),
}
