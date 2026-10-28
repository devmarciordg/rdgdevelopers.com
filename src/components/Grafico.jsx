// Barras horizontais em HTML puro (zero JS): uma tabela de verdade, então o leitor de tela lê período e valor.
// Destaque (forma "emphasis"): período com a RDG em branco, o de antes em cinza; valor escrito na ponta de cada barra
export default function Grafico({ g }) {
  const max = Math.max(...g.barras.map((b) => b.valor))
  const dois = g.barras.some((b) => b.rdg) && g.barras.some((b) => !b.rdg)
  return (
    <figure className="grafico">
      <figcaption>
        <h2 className="grafico-titulo">{g.titulo}</h2>
        <p className="grafico-nota">{g.nota}</p>
        {dois && (
          <p className="grafico-legenda">
            <span><i className="g-antes" aria-hidden="true"></i>Antes da RDG</span>
            <span><i className="g-rdg" aria-hidden="true"></i>Com a RDG</span>
          </p>
        )}
      </figcaption>
      <table>
        <thead className="sr-only"><tr><th scope="col">Período</th><th scope="col">Índice</th></tr></thead>
        <tbody>
          {g.barras.map((b) => (
            <tr key={b.rotulo} className={b.rdg ? 'g-rdg' : 'g-antes'}>
              <th scope="row">{b.rotulo}</th>
              <td>
                <span className="g-barra" style={{ '--v': b.valor / max }} aria-hidden="true"></span>
                <span className="g-valor">{b.valor}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
