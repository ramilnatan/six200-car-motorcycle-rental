import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Car, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md border-b border-[#F0F0F0] shadow-sm'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${transparent ? 'bg-white/20 backdrop-blur-sm' : 'bg-[#111111]'}`}>
              <Car size={18} className="text-white" />
            </div>
            <div>
              <span className={`text-lg font-bold tracking-tight font-display transition-colors duration-300 ${transparent ? 'text-white' : 'text-[#111111]'}`}>Six200</span>
              <span className={`block text-[10px] font-medium tracking-widest uppercase transition-colors duration-300 ${transparent ? 'text-white/70' : 'text-gray-400'}`}>Car & Motorcycle Rental</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.href
              return (
                <Link key={link.href} to={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active ? (transparent ? 'bg-white/20 text-white' : 'bg-[#F7F7F7] text-[#111111]') : (transparent ? 'text-white/85 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-[#111111] hover:bg-[#F7F7F7]')}`}>
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+639123456789" className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${transparent ? 'text-white/85 hover:text-white' : 'text-gray-600 hover:text-[#111111]'}`}>
              <Phone size={14} /><span>+63 928 777 7610</span>
            </a>
            <Link to="/booking" className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${transparent ? 'bg-white text-[#111111] hover:bg-white/90 shadow-lg' : 'bg-[#111111] text-white hover:bg-[#2A2A2A] shadow-luxury'}`}>
              Book Now
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${transparent ? 'text-white hover:bg-white/10' : 'text-[#111111] hover:bg-[#F7F7F7]'}`} aria-label="Toggle menu">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-[#F0F0F0] px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === link.href ? 'bg-[#F7F7F7] text-[#111111]' : 'text-gray-600 hover:bg-[#F7F7F7] hover:text-[#111111]'}`}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#F0F0F0] mt-3">
            <Link to="/booking" className="block text-center px-4 py-3 bg-[#111111] text-white rounded-xl text-sm font-semibold hover:bg-[#2A2A2A] transition-colors duration-200">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
