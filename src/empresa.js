// Fonte única dos dados legais: rodapé, schema e páginas legais leem daqui.
export const empresa = {
  nome: 'RDG Developers',
  razaoSocial: 'MARCIO RDG DESENVOLVIMENTO DE SOFTWARE LTDA',
  cnpj: '64.014.391/0001-86',
  endereco: 'Rua Capistrano de Abreu, 75, Altinópolis, Governador Valadares/MG, CEP 35053-080',
  email: 'contato@rdgdevelopers.com',
  emailPrivacidade: 'privacidade@rdgdevelopers.com',
  encarregado: 'Márcio Patrick Rodrigues Dias',
  whatsapp: '(33) 99914-7537',
  // shortcut: URL do webhook n8n ainda não definida; preencher antes do deploy
  webhookLead: '',
  whatsappLink:'https://wa.me/5533999147537?text=' + encodeURIComponent('Olá! Vim pelo site da RDG.'),
}
