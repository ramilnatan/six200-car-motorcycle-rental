import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Vehicle } from '../../types'
import VehicleCard from '../vehicles/VehicleCard'
import { VehicleCardSkeleton } from '../common/Skeleton'

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<'all'|'car'|'motorcycle'>('all')

  useEffect(() => {
    supabase.from('vehicles').select('*').eq('is_featured', true).order('created_at',{ascending:false}).limit(8)
      .then(({data}) => { setVehicles((data as Vehicle[]) ?? []); setLoading(false) })
  }, [])

  const filtered = activeType === 'all' ? vehicles : vehicles.filter(v => v.vehicle_type === activeType)

  return (
    <section className="bg-[#F7F7F7] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal">
          <div>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Our Fleet</p>
            <h2 className="section-heading">Featured Vehicles</h2>
            <p className="section-subheading mt-2 max-w-xl">Hand-picked premium cars and motorcycles maintained to the highest standards.</p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-white rounded-full border border-[#E5E5E5]">
            {(['all','car','motorcycle'] as const).map((t) => (
              <button key={t} onClick={() => setActiveType(t)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeType===t ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-500 hover:text-[#111111]'}`}>
                {t==='all'?'All':t==='car'?'Cars':'Motorcycles'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({length:8}).map((_,i) => <VehicleCardSkeleton key={i} />)
            : filtered.map((v,i) => (
              <div key={v.id} className={`reveal reveal-delay-${Math.min((i%4+1)*100,400)}`}>
                <VehicleCard vehicle={v} />
              </div>
            ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16"><p className="text-gray-400 text-lg">No featured vehicles in this category.</p></div>
        )}

        <div className="text-center mt-10 reveal">
          <Link to="/vehicles" className="btn-primary inline-flex">View All Vehicles<ArrowRight size={16}/></Link>
        </div>
      </div>
    </section>
  )
}
