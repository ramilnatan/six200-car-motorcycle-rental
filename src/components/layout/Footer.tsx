import { Link } from 'react-router-dom'
import { Car, Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"><Car size={18} className="text-white" /></div>
              <div><span className="text-lg font-bold tracking-tight font-display">Six200</span><span className="block text-[10px] font-medium tracking-widest uppercase text-white/50">Car & Motorcycle Rental</span></div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">Premium car and motorcycle rentals for business, family trips, vacation, and adventure.</p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"><Icon size={16} /></a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[['/', 'Home'],['/vehicles','Browse Vehicles'],['/booking','Book a Vehicle'],['/about','About Us'],['/contact','Contact Us'],['/admin','Admin Portal']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-white/60 hover:text-white transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">Services</h4>
            <ul className="space-y-3">
              {['Self Drive Rental','With Driver Service','Airport Transfer','Long-Term Rental','Corporate Fleet','Motorcycle Rental','Adventure Packages','Wedding & Events'].map((s) => (
                <li key={s}><span className="text-sm text-white/60">{s}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><MapPin size={16} className="text-white/40 mt-0.5 flex-shrink-0" /><span className="text-sm text-white/60">EJ Blanco St. Piapi, Dumaguete City,<br/>Negros Oriental, Philippines</span></li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-white/40 flex-shrink-0" /><a href="tel:+639123456789" className="text-sm text-white/60 hover:text-white transition-colors duration-200">+63 928 777 7610</a></li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-white/40 flex-shrink-0" /><a href="mailto:info@six200rental.com" className="text-sm text-white/60 hover:text-white transition-colors duration-200">info@six200rental.com</a></li>
              <li className="flex items-start gap-3"><Clock size={16} className="text-white/40 mt-0.5 flex-shrink-0" /><div className="text-sm text-white/60"><p>Mon–Sat: 7:00 AM – 8:00 PM</p><p>Sunday: 8:00 AM – 6:00 PM</p><p className="text-primary-400 font-medium mt-1">24/7 Emergency Support</p></div></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">© {new Date().getFullYear()} Six200 Car & Motorcycle Rental. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-white/40">Privacy Policy</span>
              <span className="text-xs text-white/40">Terms of Service</span>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-white/30 flex items-center justify-center gap-1.5">
              Designed & Developed with <Heart size={11} className="text-red-400/60 fill-red-400/60" /> by{' '}
              <span className="text-white/50 font-medium">Engr. Ramil V. Natan</span>
              &nbsp;·&nbsp;Powered by <span className="text-white/50 font-medium">Salve</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
