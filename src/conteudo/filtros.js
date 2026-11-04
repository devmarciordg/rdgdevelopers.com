// Filtros de /projetos: usados no build (opções e contagem iniciais) e na ilha islands/filtros.js. Sem dependência do DOM.
export const FACETAS = [['servico', 'Serviço'], ['setor', 'Setor'], ['nicho', 'Nicho'], ['tipo', 'Tipo']]

// Valores de cada card; serviço pode ter mais de um, separado por |
export const valoresDoCase = (p) => ({
  servico: p.servicos.map((s) => s.titulo).join('|'),
  setor: p.setor,
  nicho: p.segmento,
  tipo: p.cliente ? 'Cliente' : 'Case de estudo',
})

export const casa = (card, filtros) => Object.entries(filtros).every(([k, v]) => !v || card[k].split('|').includes(v))

/** Quantos cards sobram ao escolher o valor v na faceta k, mantendo os demais filtros. */
export const contar = (cards, filtros, k, v) => cards.filter((c) => casa(c, { ...filtros, [k]: v })).length

export const opcoes = (cards, k) => [...new Set(cards.flatMap((c) => c[k].split('|')))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
