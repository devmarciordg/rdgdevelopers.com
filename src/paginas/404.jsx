import CabecalhoPagina from '../components/CabecalhoPagina.jsx'

export const meta = {
  titulo: 'Página não encontrada',
  descricao: 'Esta página não existe ou mudou de endereço.',
  noindex: true,
}

export default function NaoEncontrada() {
  return (
    <CabecalhoPagina rotulo="Erro 404" titulo="Esta página não existe" sub="O endereço pode ter mudado ou ter sido digitado errado.">
      <p style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginTop: '2rem' }}>
        <a className="btn" href="/">Voltar ao início</a>
        <a className="btn ghost" href="/servicos">Ver serviços</a>
      </p>
    </CabecalhoPagina>
  )
}
