import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollProgress from '../common/ScrollProgress'
import FloatingWhatsApp from '../common/FloatingWhatsApp'
import BackToTop from '../common/BackToTop'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  // Re-initialise observers on every route change
  useScrollReveal()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  )
}
