import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Fuel, Settings, Zap, Package, Shield, Star, ChevronRight, Calendar, Calculator, Check, MapPin, ChevronLeft, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Vehicle } from '../types'
import LazyImage from '../components/common/LazyImage'
import { Skeleton } from '../components/common/Skeleton'

function daysDiff(from: string, to: string) {
  if (!from || !to) return 0
  return Math.max(Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000), 0)
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [calcPickup, setCalcPickup] = useState('')
  const [calcReturn, setCalcReturn] = useState('')
  const [withDriver, setWithDriver] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase.from('vehicles').select('*').eq('id', id).maybeSingle()
      .then(({ data }) => { setVehicle(data as Vehicle | null); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Skeleton className="h-96" /><div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-5 w-1/2" /><Skeleton className="h-32" /></div>
      </div>
    </div>
  )

  if (!vehicle) return (
    <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
      <div className="text-center"><h2 className="text-2xl font-bold mb-3">Vehicle Not Found</h2><Link to="/vehicles" className="btn-primary">Browse All Vehicles</Link></div>
    </div>
  )

  const images = [vehicle.photo_url ?? '', ...(vehicle.gallery_urls ?? [])].filter(Boolean)
  const days = daysDiff(calcPickup, calcReturn)
  const driverFee = withDriver && vehicle.vehicle_type === 'car' ? days * 800 : 0
  const subtotal = days * vehicle.price_per_day + driverFee
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const specs = vehicle.vehicle_type === 'car'
    ? [
        { icon: Users,    label:'Seats',            value: vehicle.seats ? `${vehicle.seats} Passengers` : 'N/A' },
        { icon: Settings, label:'Transmission',      value: vehicle.transmission === 'automatic' ? 'Automatic' : 'Manual' },
        { icon: Fuel,     label:'Fuel Type',         value: vehicle.fuel_type.charAt(0).toUpperCase()+vehicle.fuel_type.slice(1) },
        { icon: Check,    label:'Air Conditioning',  value: 'Included' },
        { icon: Package,  label:'Luggage Capacity',  value: vehicle.luggage_capacity ? `${vehicle.luggage_capacity} bags` : 'N/A' },
        { icon: MapPin,   label:'Mileage Limit',     value: vehicle.mileage_limit ? `${vehicle.mileage_limit} km/day` : 'Unlimited' },
      ]
    : [
        { icon: Zap,      label:'Engine',            value: vehicle.engine_cc ? `${vehicle.engine_cc}cc` : 'N/A' },
        { icon: Settings, label:'Transmission',      value: vehicle.transmission === 'automatic' ? 'Automatic' : 'Manual' },
        { icon: Fuel,     label:'Fuel Type',         value: vehicle.fuel_type.charAt(0).toUpperCase()+vehicle.fuel_type.slice(1) },
        { icon: Shield,   label:'Helmet',            value: vehicle.helmet_included ? 'Included' : 'Not Included' },
        { icon: Package,  label:'Top Box',           value: vehicle.top_box ? 'Included' : 'Not Included' },
        { icon: MapPin,   label:'Mileage Limit',     value: vehicle.mileage_limit ? `${vehicle.mileage_limit} km/day` : 'Unlimited' },
      ]

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#111111]">Home</Link><ChevronRight size={14}/>
          <Link to="/vehicles" className="hover:text-[#111111]">Vehicles</Link><ChevronRight size={14}/>
          <span className="text-[#111111] font-medium">{vehicle.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#111111] transition-colors duration-200">
              <ArrowLeft size={16}/>Back to vehicles
            </button>

            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden cursor-zoom-in" style={{aspectRatio:'16/9'}} onClick={() => setLightbox(true)}>
                <LazyImage src={images[activeImage] ?? ''} alt={vehicle.name} className="w-full h-full"/>
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                  {activeImage+1} / {images.length}
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {images.map((img,i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage===i?'border-[#111111]':'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{vehicle.vehicle_type === 'car' ? 'Car' : 'Motorcycle'}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500 capitalize">{vehicle.category}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-[#111111] font-display">{vehicle.name}</h1>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({length:5}).map((_,i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400"/>)}
                    <span className="text-xs text-gray-400 ml-1">5.0 (12 reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Starting from</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#111111]">₱{vehicle.price_per_day.toLocaleString()}</span>
                    <span className="text-sm text-gray-400">/day</span>
                  </div>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${vehicle.availability_status==='available'?'bg-emerald-50 text-emerald-700 border border-emerald-200':vehicle.availability_status==='booked'?'bg-amber-50 text-amber-700 border border-amber-200':'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${vehicle.availability_status==='available'?'bg-emerald-500 animate-pulse':'bg-gray-400'}`}/>
                {vehicle.availability_status==='available'?'Available Now':vehicle.availability_status==='booked'?'Currently Booked':'Under Maintenance'}
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{vehicle.description}</p>
            </div>

            <div>
              <h2 className="font-bold text-[#111111] text-lg mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((spec) => {
                  const Icon = spec.icon
                  return (
                    <div key={spec.label} className="flex items-center gap-3 p-3.5 bg-[#F7F7F7] rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm"><Icon size={15} className="text-[#111111]"/></div>
                      <div><p className="text-xs text-gray-400">{spec.label}</p><p className="text-xs font-semibold text-[#111111]">{spec.value}</p></div>
                    </div>
                  )
                })}
              </div>
            </div>

            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h2 className="font-bold text-[#111111] text-lg mb-4">Features & Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map(f => (
                    <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F7F7] rounded-full text-xs font-medium text-[#2A2A2A]">
                      <Check size={11} className="text-emerald-500"/>{f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-luxury p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center"><Calculator size={15} className="text-white"/></div>
                  <h3 className="font-bold text-[#111111]">Rental Calculator</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="label">Pick-up Date</label>
                    <div className="relative"><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input type="date" value={calcPickup} min={new Date().toISOString().split('T')[0]} onChange={e=>setCalcPickup(e.target.value)} className="input-field pl-9 text-sm"/>
                    </div>
                  </div>
                  <div>
                    <label className="label">Return Date</label>
                    <div className="relative"><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input type="date" value={calcReturn} min={calcPickup||new Date().toISOString().split('T')[0]} onChange={e=>setCalcReturn(e.target.value)} className="input-field pl-9 text-sm"/>
                    </div>
                  </div>
                  {vehicle.vehicle_type === 'car' && (
                    <label className="flex items-center gap-3 p-3 bg-[#F7F7F7] rounded-xl cursor-pointer">
                      <input type="checkbox" checked={withDriver} onChange={e=>setWithDriver(e.target.checked)} className="w-4 h-4 accent-[#111111] rounded"/>
                      <div><p className="text-sm font-semibold text-[#111111]">With Driver</p><p className="text-xs text-gray-400">+₱800/day</p></div>
                    </label>
                  )}
                </div>
                {days > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#F0F0F0] space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">{days} day{days>1?'s':''} × ₱{vehicle.price_per_day.toLocaleString()}</span><span className="font-medium">₱{(days*vehicle.price_per_day).toLocaleString()}</span></div>
                    {driverFee > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Driver fee</span><span className="font-medium">₱{driverFee.toLocaleString()}</span></div>}
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Service fee (5%)</span><span className="font-medium">₱{tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-[#F0F0F0]"><span>Total</span><span className="text-primary-600">₱{total.toFixed(2)}</span></div>
                  </div>
                )}
                {vehicle.availability_status === 'available'
                  ? <Link to={`/booking?vehicle=${vehicle.id}&pickup=${calcPickup}&return=${calcReturn}&driver=${withDriver}`} className="btn-primary w-full mt-4 justify-center">Book Now</Link>
                  : <button disabled className="w-full mt-4 py-3 rounded-full bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed">Not Available</button>
                }
                <Link to="/contact" className="btn-secondary w-full mt-2 justify-center">Send Inquiry</Link>
              </div>
              <div className="bg-[#F7F7F7] rounded-2xl p-4 space-y-3">
                {[{icon:Shield,text:'Fully insured coverage included'},{icon:Check,text:'No hidden fees or charges'},{icon:Calendar,text:'Free cancellation 24h before'}].map(({icon:Icon,text}) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-gray-600"><Icon size={14} className="text-emerald-500 flex-shrink-0"/>{text}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={()=>setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={()=>setLightbox(false)}><X size={28}/></button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            onClick={e=>{e.stopPropagation();setActiveImage(a=>(a-1+images.length)%images.length)}}><ChevronLeft size={20}/></button>
          <img src={images[activeImage]} alt={vehicle.name} className="max-w-full max-h-[85vh] object-contain rounded-xl" onClick={e=>e.stopPropagation()}/>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            onClick={e=>{e.stopPropagation();setActiveImage(a=>(a+1)%images.length)}}><ChevronRight size={20}/></button>
        </div>
      )}
    </div>
  )
}
