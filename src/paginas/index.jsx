import Hero from '../components/Hero.jsx'
import ParaQuem from '../components/ParaQuem.jsx'
import Problemas from '../components/Problemas.jsx'
import Servicos from '../components/Servicos.jsx'
import Diferencial from '../components/Diferencial.jsx'
import ComoTrabalhamos from '../components/ComoTrabalhamos.jsx'
import Manutencao from '../components/Manutencao.jsx'
import Projetos from '../components/Projetos.jsx'
import QuemSomos from '../components/QuemSomos.jsx'
import Faq, { perguntas } from '../components/Faq.jsx'
import Contato from '../components/Contato.jsx'
import { organizacao, faq } from '../schema.js'

export const meta = {
  titulo: 'RDG Developers · Sites, tráfego pago e software sob medida',
  descricao: 'Sites rápidos, Perfil no Google, tráfego pago com rastreamento correto, automações e software sob medida para negócio local. Diagnóstico gratuito de 20 minutos.',
  schema: [organizacao(), faq(perguntas)],
}

export default function Home() {
  return (
    <>
      <Hero />
      <ParaQuem />
      <Problemas />
      <Servicos />
      <Diferencial />
      <ComoTrabalhamos />
      <Manutencao />
      <Projetos />
      <QuemSomos />
      <Faq />
      <Contato />
    </>
  )
}
