// Subconjunto de JSON Schema (o que content/_schemas usa), sem dependência.
// O painel pode validar os mesmos arquivos com Ajv; o site não precisa dele.

const tipoDe = (v) => (Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : v === null ? 'null' : typeof v)
const dataValida = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().startsWith(s)

/** @returns {{ caminho: string, msg: string }[]} */
export function validar(valor, schema, raiz = schema, caminho = '') {
  if (schema.$ref) return validar(valor, schema.$ref.split('/').slice(1).reduce((o, k) => o[k], raiz), raiz, caminho)
  const erros = []
  const erro = (msg) => erros.push({ caminho: caminho || '(raiz)', msg })
  const tipo = tipoDe(valor)

  if (schema.type && !(schema.type === tipo || (schema.type === 'number' && tipo === 'integer'))) {
    erro(`esperado ${schema.type}, veio ${tipo}`)
    return erros
  }
  if (schema.enum && !schema.enum.includes(valor)) erro(`"${valor}" não é válido. Use: ${schema.enum.join(', ')}`)

  if (tipo === 'string') {
    if (schema.minLength && valor.length < schema.minLength) erro(`tem ${valor.length} caracteres, mínimo ${schema.minLength}`)
    if (schema.maxLength && valor.length > schema.maxLength) erro(`tem ${valor.length} caracteres, máximo ${schema.maxLength}`)
    if (schema.pattern && !new RegExp(schema.pattern).test(valor)) erro(`"${valor}" fora do formato ${schema.pattern}`)
    if (schema.format === 'date' && !dataValida(valor)) erro(`"${valor}" não é uma data AAAA-MM-DD válida`)
  }

  if (tipo === 'array') {
    if (schema.minItems && valor.length < schema.minItems) erro(`tem ${valor.length} itens, mínimo ${schema.minItems}`)
    if (schema.maxItems !== undefined && valor.length > schema.maxItems) erro(`tem ${valor.length} itens, máximo ${schema.maxItems}`)
    if (schema.uniqueItems && new Set(valor.map((x) => JSON.stringify(x))).size !== valor.length) erro('tem itens repetidos')
    if (schema.items) valor.forEach((x, i) => erros.push(...validar(x, schema.items, raiz, `${caminho}[${i}]`)))
  }

  if (tipo === 'object') {
    const props = schema.properties ?? {}
    for (const k of schema.required ?? []) if (!(k in valor)) erros.push({ caminho: caminho ? `${caminho}.${k}` : k, msg: 'obrigatório' })
    for (const [k, v] of Object.entries(valor)) {
      const sub = caminho ? `${caminho}.${k}` : k
      if (props[k]) erros.push(...validar(v, props[k], raiz, sub))
      else if (schema.additionalProperties === false) erros.push({ caminho: sub, msg: 'campo desconhecido' })
    }
  }
  return erros
}
