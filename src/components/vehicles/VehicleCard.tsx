import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Fuel, Settings, Zap, Heart, Star, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Vehicle } from '../../types'
import LazyImage from '../common/LazyImage'

const categoryLabels: Record<string, string> = {
  sedan:'Sedan', suv:'SUV', van:'Van', pickup:'Pickup', luxury:'Luxury',
  scooter:'Scooter', standard:'Standard', sport:'Sport Bike', adventure:'Adventure', touring:'Touring',
}

const statusConfig: Record<string, { label:string; color:string }> = {
  available: { label:'Available', color:'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  booked:    { label:'Booked',    color:'bg-amber-50 text-amber-700 border border-amber-200' },
  maintenance:{ label:'Maintenance', color:'bg-gray-100 text-gray-600 border border-gray-200' },
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [wishlisted, setWishlisted] = useState(false)
  const status = statusConfig[vehicle.availability_status] ?? statusConfig.available

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={{
        rest: { y: 0, scale: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderColor: '#F0F0F0' },
        hover: {
          y: -12,
          scale: 1.03,
          boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 0 0 1px rgba(14,128,239,0.15)',
          borderColor: 'rgba(14,128,239,0.25)',
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className="relative overflow-hidden rounded-2xl border bg-white"
      style={{ willChange: 'transform' }}
    >
      <div className="relative overflow-hidden h-52">
        <LazyImage src={vehicle.photo_url ?? ''} alt={vehicle.name} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</div>
        <button onClick={() => setWishlisted(!wishlisted)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${wishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}>
          <Heart size={14} className={wishlisted ? 'fill-white' : ''} />
        </button>
        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full">
          <span className="text-xs text-white font-medium">{categoryLabels[vehicle.category] ?? vehicle.category}</span>
        </div>
      </div>

      <div className="p-5">
        <motion.h3
          variants={{
            rest: { color: '#111111' },
            hover: { color: '#0062cc', transition: { duration: 0.3 } },
          }}
          className="font-bold text-[#111111] text-base leading-tight mb-1"
        >
          {vehicle.name}
        </motion.h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 mb-3">
          {vehicle.vehicle_type === 'car' && vehicle.seats && <span className="flex items-center gap-1"><Users size={12}/>{vehicle.seats} seats</span>}
          {vehicle.vehicle_type === 'motorcycle' && vehicle.engine_cc && <span className="flex items-center gap-1"><Zap size={12}/>{vehicle.engine_cc}cc</span>}
          <span className="flex items-center gap-1"><Settings size={12}/>{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
          <span className="flex items-center gap-1"><Fuel size={12}/>{vehicle.fuel_type.charAt(0).toUpperCase()+vehicle.fuel_type.slice(1)}</span>
        </div>
        <div className="flex items-center gap-1 mb-4">
          {Array.from({length:5}).map((_,i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
          <span className="text-xs text-gray-400 ml-1">5.0</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-gray-400">From</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#111111]">₱{vehicle.price_per_day.toLocaleString()}</span>
              <span className="text-xs text-gray-400">/day</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/vehicles/${vehicle.id}`} className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#111111] transition-colors duration-200">
              Details<ChevronRight size={14}/>
            </Link>
            {vehicle.availability_status === 'available'
              ? <Link to={`/booking?vehicle=${vehicle.id}`} className="px-4 py-2 bg-[#111111] text-white rounded-full text-xs font-semibold hover:bg-[#2A2A2A] transition-all duration-200 hover:-translate-y-0.5">Book Now</Link>
              : <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-full text-xs font-semibold cursor-not-allowed">Unavailable</span>
            }
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <motion.div
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1, transition: { duration: 0.4 } } }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-50/50 via-transparent to-transparent"
      />
      {/* Shimmer sweep */}
      <motion.div
        variants={{
          rest: { x: '-150%', opacity: 0 },
          hover: { x: '150%', opacity: 1, transition: { duration: 0.7, ease: 'easeInOut' } },
        }}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
          width: '60%',
          height: '100%',
        }}
      />
    </motion.div>
  )
}
