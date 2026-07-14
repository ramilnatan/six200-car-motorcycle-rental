import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, ChevronDown, Search } from 'lucide-react'
import { PICKUP_LOCATIONS } from '../../constants'

export default function HeroSection() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ location:'', pickup_date:'', return_date:'', vehicle_type:'all' })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (form.vehicle_type !== 'all') p.set('type', form.vehicle_type)
    if (form.pickup_date) p.set('from', form.pickup_date)
    if (form.return_date) p.set('to', form.return_date)
    navigate(`/vehicles?${p.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Premium vehicles"
          className="w-full h-full object-cover"
          style={{ animation: 'slowZoom 20s ease-in-out infinite alternate' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Premium Vehicle Rental Service
        </div>

        <h1
          className="font-display font-black text-white tracking-tight leading-none mb-4 whitespace-nowrap origin-center transition-transform duration-300 ease-in-out hover:scale-105 cursor-default"
          style={{ fontSize: 'clamp(1.5rem, 6vw, 5rem)' }}
        >
          Rent <span className="text-white/40">•</span> Explore <span className="text-white/40">•</span> Experience
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-white/75 max-w-2xl leading-relaxed mb-10">
          Premium Car & Motorcycle Rentals for Business, Family Trips, Vacation, and Adventure.
        </p>

        <div className="w-full max-w-4xl">
          <form onSubmit={handleSearch}>
            <div className="glass rounded-2xl p-4 shadow-luxury-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <label className="label text-gray-700">Pick-up Location</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select value={form.location} onChange={(e) => setForm({...form,location:e.target.value})} className="input-field pl-9 appearance-none cursor-pointer">
                      <option value="">Select location</option>
                      {PICKUP_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="label text-gray-700">Pick-up Date</label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" value={form.pickup_date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setForm({...form,pickup_date:e.target.value})} className="input-field pl-9" />
                  </div>
                </div>
                <div>
                  <label className="label text-gray-700">Return Date</label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" value={form.return_date} min={form.pickup_date||new Date().toISOString().split('T')[0]} onChange={(e) => setForm({...form,return_date:e.target.value})} className="input-field pl-9" />
                  </div>
                </div>
                <div>
                  <label className="label text-gray-700">Vehicle Type</label>
                  <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                      <select value={form.vehicle_type} onChange={(e) => setForm({...form,vehicle_type:e.target.value})} className="input-field appearance-none cursor-pointer">
                        <option value="all">All Vehicles</option>
                        <option value="car">Cars</option>
                        <option value="motorcycle">Motorcycles</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <button type="submit" className="flex-shrink-0 w-11 h-11 bg-[#111111] text-white rounded-xl hover:bg-[#2A2A2A] transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-6 mt-8">
          <span className="text-white/50 text-sm">Popular:</span>
          {['SUV','Luxury','Sport Bike','Adventure'].map((tag) => (
            <button key={tag} onClick={() => navigate(`/vehicles?category=${tag.toLowerCase().replace(' ','_')}`)}
              className="text-sm text-white/70 hover:text-white transition-colors duration-200 underline underline-offset-4 decoration-white/30 hover:decoration-white/60">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="text-white/50" />
      </div>
    </section>
  )
}
