import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Vehicle, VehicleFilters } from '../types'
import VehicleCard from '../components/vehicles/VehicleCard'
import { VehicleCardSkeleton } from '../components/common/Skeleton'
import { CAR_CATEGORIES, MOTORCYCLE_CATEGORIES } from '../constants'

const DEFAULT_FILTERS: VehicleFilters = {
  vehicle_type:'all', category:'', transmission:'all',
  min_price:0, max_price:10000, availability_status:'all', sort:'price_asc',
}

export default function VehiclesPage() {
  const [searchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<VehicleFilters>({
    ...DEFAULT_FILTERS,
    vehicle_type: (searchParams.get('type') as VehicleFilters['vehicle_type']) ?? 'all',
    category: searchParams.get('category') ?? '',
  })

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase.from('vehicles').select('*')
    if (filters.vehicle_type !== 'all') query = query.eq('vehicle_type', filters.vehicle_type)
    if (filters.category) query = query.eq('category', filters.category)
    if (filters.transmission !== 'all') query = query.eq('transmission', filters.transmission)
    if (filters.availability_status !== 'all') query = query.eq('availability_status', filters.availability_status)
    if (filters.max_price < 10000) query = query.lte('price_per_day', filters.max_price)
    if (filters.sort === 'price_asc') query = query.order('price_per_day',{ascending:true})
    else if (filters.sort === 'price_desc') query = query.order('price_per_day',{ascending:false})
    else if (filters.sort === 'newest') query = query.order('created_at',{ascending:false})
    else query = query.order('is_featured',{ascending:false})
    const {data, error} = await query
    if (!error) setVehicles((data as Vehicle[]) ?? [])
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  const displayed = search
    ? vehicles.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()))
    : vehicles

  const categories = filters.vehicle_type==='car' ? CAR_CATEGORIES : filters.vehicle_type==='motorcycle' ? MOTORCYCLE_CATEGORIES : [...CAR_CATEGORIES,...MOTORCYCLE_CATEGORIES]

  const activeCount = [filters.vehicle_type!=='all', filters.category!=='', filters.transmission!=='all', filters.availability_status!=='all', filters.max_price<10000].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20">
      <div className="bg-white border-b border-[#F0F0F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="section-heading mb-2">Our Vehicle Fleet</h1>
          <p className="section-subheading">{loading ? 'Loading vehicles...' : `${displayed.length} vehicle${displayed.length!==1?'s':''} available`}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#111111]">Filters</h3>
                {activeCount > 0 && (
                  <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
                    <X size={12}/>Reset ({activeCount})
                  </button>
                )}
              </div>
              <div>
                <label className="label">Vehicle Type</label>
                <div className="flex gap-2">
                  {(['all','car','motorcycle'] as const).map(t => (
                    <button key={t} onClick={() => setFilters({...filters,vehicle_type:t,category:''})}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${filters.vehicle_type===t?'bg-[#111111] text-white border-[#111111]':'bg-white text-gray-500 border-[#E5E5E5] hover:border-[#111111]'}`}>
                      {t==='all'?'All':t==='car'?'Cars':'Motos'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Category</label>
                <div className="relative">
                  <select value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})} className="input-field appearance-none cursor-pointer text-sm">
                    <option value="">All Categories</option>
                    {categories.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                </div>
              </div>
              <div>
                <label className="label">Transmission</label>
                <div className="flex gap-2">
                  {(['all','automatic','manual'] as const).map(t => (
                    <button key={t} onClick={()=>setFilters({...filters,transmission:t})}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${filters.transmission===t?'bg-[#111111] text-white border-[#111111]':'bg-white text-gray-500 border-[#E5E5E5] hover:border-[#111111]'}`}>
                      {t==='all'?'All':t==='automatic'?'Auto':'Manual'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Availability</label>
                <div className="relative">
                  <select value={filters.availability_status} onChange={e=>setFilters({...filters,availability_status:e.target.value as VehicleFilters['availability_status']})} className="input-field appearance-none cursor-pointer text-sm">
                    <option value="all">All Status</option>
                    <option value="available">Available Now</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                </div>
              </div>
              <div>
                <label className="label">Max Price: ₱{filters.max_price.toLocaleString()}/day</label>
                <input type="range" min={0} max={10000} step={100} value={filters.max_price} onChange={e=>setFilters({...filters,max_price:Number(e.target.value)})} className="w-full accent-[#111111] mt-1"/>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₱0</span><span>₱10,000</span></div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" placeholder="Search vehicles..." value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-10"/>
                {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={16}/></button>}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select value={filters.sort} onChange={e=>setFilters({...filters,sort:e.target.value as VehicleFilters['sort']})} className="input-field appearance-none cursor-pointer pr-8 text-sm">
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                </div>
                <button onClick={()=>setShowFilters(!showFilters)}
                  className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${showFilters||activeCount>0?'bg-[#111111] text-white border-[#111111]':'bg-white text-gray-600 border-[#E5E5E5]'}`}>
                  <SlidersHorizontal size={16}/>Filters{activeCount>0&&<span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">{activeCount}</span>}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">{Array.from({length:6}).map((_,i)=><VehicleCardSkeleton key={i}/>)}</div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-[#F0F0F0]">
                <Search size={24} className="text-gray-300 mx-auto mb-4"/>
                <h3 className="font-bold text-[#111111] text-lg mb-2">No vehicles found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={()=>{setFilters(DEFAULT_FILTERS);setSearch('')}} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayed.map(v=><VehicleCard key={v.id} vehicle={v}/>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
