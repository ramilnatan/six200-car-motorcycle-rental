import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, User, Phone, Mail, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Vehicle, BookingFormData } from '../types'
import { PICKUP_LOCATIONS } from '../constants'
import LazyImage from '../components/common/LazyImage'

function daysDiff(from: string, to: string) {
  if (!from || !to) return 0
  return Math.max(Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000), 0)
}

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [state, setState] = useState<'idle'|'submitting'|'success'|'error'>('idle')
  const [bookingId, setBookingId] = useState('')
  const [errors, setErrors] = useState<Partial<BookingFormData>>({})

  const [form, setForm] = useState<BookingFormData>({
    customer_name:'', contact_number:'', email:'',
    vehicle_id: searchParams.get('vehicle') ?? '',
    pickup_date: searchParams.get('pickup') ?? '',
    return_date: searchParams.get('return') ?? '',
    pickup_location:'',
    with_driver: searchParams.get('driver') === 'true',
    special_requests:'',
  })

  useEffect(() => {
    if (!form.vehicle_id) return
    supabase.from('vehicles').select('*').eq('id', form.vehicle_id).maybeSingle()
      .then(({data}) => setVehicle(data as Vehicle | null))
  }, [form.vehicle_id])

  const days = daysDiff(form.pickup_date, form.return_date)
  const driverFee = form.with_driver && vehicle?.vehicle_type === 'car' ? days * 800 : 0
  const subtotal = vehicle ? days * vehicle.price_per_day + driverFee : 0
  const tax = subtotal * 0.05
  const total = subtotal + tax

  function validate() {
    const e: Partial<BookingFormData> = {}
    if (!form.customer_name.trim()) e.customer_name = 'Full name is required'
    if (!form.contact_number.trim()) e.contact_number = 'Contact number is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email is required'
    if (!form.pickup_date) e.pickup_date = 'Pick-up date is required'
    if (!form.return_date) e.return_date = 'Return date is required'
    if (!form.pickup_location) e.pickup_location = 'Pick-up location is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !vehicle) return
    setState('submitting')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('bookings') as any).insert({
      customer_name: form.customer_name,
      contact_number: form.contact_number,
      email: form.email,
      vehicle_id: vehicle.id,
      pickup_date: form.pickup_date,
      return_date: form.return_date,
      pickup_location: form.pickup_location,
      with_driver: form.with_driver,
      special_requests: form.special_requests || null,
      status: 'pending',
      total_amount: total > 0 ? total : null,
    }).select('id').single()
    if (error) { setState('error') } else { setBookingId(data.id); setState('success') }
  }

  if (state === 'success') return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-luxury-lg">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6"><CheckCircle size={32} className="text-emerald-500"/></div>
        <h2 className="text-2xl font-bold text-[#111111] mb-3 font-display">Booking Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-2">Your booking reference is:</p>
        <p className="font-mono font-bold text-primary-600 text-lg mb-4 bg-primary-50 px-4 py-2 rounded-xl">#{bookingId.slice(0,8).toUpperCase()}</p>
        <p className="text-gray-500 text-sm mb-8">We've received your request. Our team will contact you at <strong>{form.email}</strong> shortly.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/vehicles')} className="btn-primary w-full justify-center">Browse More Vehicles</button>
          <button onClick={() => navigate('/')} className="btn-secondary w-full justify-center">Return Home</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8"><h1 className="section-heading">Book Your Vehicle</h1><p className="section-subheading mt-1">Fill in the details below to reserve your vehicle.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#F0F0F0] p-6 space-y-5">
              <h2 className="font-bold text-[#111111] text-lg border-b border-[#F0F0F0] pb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <div className="relative"><User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})} placeholder="Juan dela Cruz" className={`input-field pl-9 ${errors.customer_name?'border-red-300':''}`}/>
                  </div>
                  {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>}
                </div>
                <div>
                  <label className="label">Mobile Number</label>
                  <div className="relative"><Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="tel" value={form.contact_number} onChange={e=>setForm({...form,contact_number:e.target.value})} placeholder="+63 912 345 6789" className={`input-field pl-9 ${errors.contact_number?'border-red-300':''}`}/>
                  </div>
                  {errors.contact_number && <p className="text-xs text-red-500 mt-1">{errors.contact_number}</p>}
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <div className="relative"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="juan@example.com" className={`input-field pl-9 ${errors.email?'border-red-300':''}`}/>
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <h2 className="font-bold text-[#111111] text-lg border-b border-[#F0F0F0] pb-4 pt-2">Rental Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Pick-up Date</label>
                  <div className="relative"><Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="date" value={form.pickup_date} min={new Date().toISOString().split('T')[0]} onChange={e=>setForm({...form,pickup_date:e.target.value})} className={`input-field pl-9 ${errors.pickup_date?'border-red-300':''}`}/>
                  </div>
                </div>
                <div>
                  <label className="label">Return Date</label>
                  <div className="relative"><Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="date" value={form.return_date} min={form.pickup_date||new Date().toISOString().split('T')[0]} onChange={e=>setForm({...form,return_date:e.target.value})} className={`input-field pl-9 ${errors.return_date?'border-red-300':''}`}/>
                  </div>
                </div>
              </div>
              <div>
                <label className="label">Pick-up Location</label>
                <div className="relative"><MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <select value={form.pickup_location} onChange={e=>setForm({...form,pickup_location:e.target.value})} className={`input-field pl-9 appearance-none cursor-pointer ${errors.pickup_location?'border-red-300':''}`}>
                    <option value="">Select a location</option>
                    {PICKUP_LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                </div>
                {errors.pickup_location && <p className="text-xs text-red-500 mt-1">{errors.pickup_location}</p>}
              </div>
              {!vehicle && <p className="text-sm text-gray-500 bg-[#F7F7F7] p-3 rounded-xl">No vehicle selected. <a href="/vehicles" className="text-primary-600 font-semibold underline">Browse vehicles</a> to select one.</p>}
              {vehicle?.vehicle_type === 'car' && (
                <label className="flex items-center gap-3 p-4 bg-[#F7F7F7] rounded-xl cursor-pointer border border-transparent hover:border-[#E5E5E5] transition-colors duration-200">
                  <input type="checkbox" checked={form.with_driver} onChange={e=>setForm({...form,with_driver:e.target.checked})} className="w-4 h-4 accent-[#111111] rounded"/>
                  <div><p className="text-sm font-semibold text-[#111111]">Add Professional Driver</p><p className="text-xs text-gray-400">+₱800/day · Experienced, licensed drivers</p></div>
                </label>
              )}
              <div>
                <label className="label">Special Requests (Optional)</label>
                <textarea value={form.special_requests} onChange={e=>setForm({...form,special_requests:e.target.value})} rows={3} placeholder="Any special requirements or notes..." className="input-field resize-none"/>
              </div>
              {state === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0"/>Something went wrong. Please try again.
                </div>
              )}
              <button type="submit" disabled={state==='submitting'||!vehicle} className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {state==='submitting'?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</>:'Confirm Booking'}
              </button>
            </form>
          </div>
          <div>
            <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-luxury p-5 sticky top-24">
              <h3 className="font-bold text-[#111111] mb-4">Booking Summary</h3>
              {vehicle ? (
                <>
                  <div className="flex gap-3 mb-5">
                    <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#F7F7F7]"><LazyImage src={vehicle.photo_url??''} alt={vehicle.name} className="w-full h-full"/></div>
                    <div><p className="font-semibold text-[#111111] text-sm">{vehicle.name}</p><p className="text-xs text-gray-400 capitalize">{vehicle.category}</p><p className="text-xs font-semibold text-primary-600 mt-0.5">₱{vehicle.price_per_day.toLocaleString()}/day</p></div>
                  </div>
                  {days > 0 ? (
                    <div className="space-y-2 text-sm border-t border-[#F0F0F0] pt-4">
                      <div className="flex justify-between text-gray-500"><span>{days} day{days>1?'s':''} × ₱{vehicle.price_per_day.toLocaleString()}</span><span>₱{(days*vehicle.price_per_day).toLocaleString()}</span></div>
                      {driverFee>0&&<div className="flex justify-between text-gray-500"><span>Driver fee</span><span>₱{driverFee.toLocaleString()}</span></div>}
                      <div className="flex justify-between text-gray-500"><span>Service fee (5%)</span><span>₱{tax.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-[#F0F0F0]"><span>Total</span><span className="text-primary-600">₱{total.toFixed(2)}</span></div>
                    </div>
                  ) : <p className="text-xs text-gray-400 text-center py-3">Select dates to see the total.</p>}
                </>
              ) : (
                <div className="text-center py-6"><p className="text-sm text-gray-400">No vehicle selected.</p><a href="/vehicles" className="text-sm text-primary-600 font-semibold hover:underline mt-1 inline-block">Browse Fleet →</a></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
