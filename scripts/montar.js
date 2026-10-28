// Encaixa head e corpo renderizados no template do index.html
export const montar = (tpl, { head, html }) => tpl.replace('<!--head-->', head).replace('<!--app-->', html)
