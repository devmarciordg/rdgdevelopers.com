// Única entrada de JS no navegador: estilos + ilhas vanilla. O React fica só no build.
import './styles/base.css'
import.meta.glob('./styles/*.css', { eager: true })
import.meta.glob('./islands/*.js', { eager: true })
