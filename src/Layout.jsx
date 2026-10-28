import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFlutuante from './components/WhatsAppFlutuante.jsx'
import CookieBanner from './components/CookieBanner.jsx'

export default function Layout({ children, convite }) {
  return (
    <>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer convite={convite} />
      <WhatsAppFlutuante />
      <CookieBanner />
    </>
  )
}
