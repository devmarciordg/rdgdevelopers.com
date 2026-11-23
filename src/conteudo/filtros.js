// Filtros de /projetos: usados no build (opções e contagem iniciais) e na ilha islands/filtros.js. Sem dependência do DOM.
// Nicho e tipo ficam de fora: nicho tem quase um valor por case, e a tag no card já marca o case de estudo
export const FACETAS = [['servico', 'Serviço'], ['setor', 'Setor']]

// Valores de cada card; serviço pode ter mais de um, separado por |
export const valoresDoCase = (p) => ({
  servico: p.servicos.map((s) => s.titulo).join('|'),
  setor: p.setor,
})

export const casa = (card, filtros) => Object.entries(filtros).every(([k, v]) => !v || card[k].split('|').includes(v))

/** Quantos cards sobram ao escolher o valor v na faceta k, mantendo os demais filtros. */
export const contar = (cards, filtros, k, v) => cards.filter((c) => casa(c, { ...filtros, [k]: v })).length

export const opcoes = (cards, k) => [...new Set(cards.flatMap((c) => c[k].split('|')))].sort((a, b) => a.localeCompare(b, 'pt-BR'))

// Busca de tags do blog (ilha islands/buscaTags.js): o post precisa ter todas as tags escolhidas
export const temTags = (tags, escolhidas) => escolhidas.every((t) => tags.includes(t))

const semAcento = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
export const casaBusca = (nome, busca) => semAcento(nome).includes(semAcento(busca.trim()))
