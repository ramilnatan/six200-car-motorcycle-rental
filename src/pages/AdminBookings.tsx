import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Skeleton } from '../components/common/Skeleton'

interface Booking { id:string; customer_name:string; contact_number:string; email:string; pickup_date:string; return_date:string; pickup_location:string; with_driver:boolean; status:string; total_amount:number|null; created_at:string; vehicles:{name:string}|null }

const sc: Record<string,string> = {pending:'bg-amber-100 text-amber-700',confirmed:'bg-blue-100 text-blue-700',completed:'bg-emerald-100 text-emerald-700',cancelled:'bg-red-100 text-red-700'}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  async function load() {
    setLoading(true)
    const {data} = await supabase.from('bookings').select('*, vehicles(name)').order('created_at',{ascending:false})
    setBookings((data as unknown as Booking[]) ?? [])
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  async function updateStatus(id: string, status: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('bookings') as any).update({status}).eq('id',id)
    load()
  }

  const displayed = filter==='all' ? bookings : bookings.filter(b=>b.status===filter)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#111111] font-display">Bookings</h1>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all','pending','confirmed','completed','cancelled'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${filter===s?'bg-[#111111] text-white':'bg-white text-gray-500 border border-[#E5E5E5] hover:border-[#111111]'}`}>
            {s.charAt(0).toUpperCase()+s.slice(1)}{s!=='all'&&<span className="ml-2 text-xs opacity-60">{bookings.filter(b=>b.status===s).length}</span>}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        {loading ? <div className="p-4 space-y-3">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-16"/>)}</div>
          : displayed.length===0 ? <div className="text-center py-16 text-gray-400 text-sm">No bookings in this category.</div>
          : <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F7F7] border-b border-[#F0F0F0]">
                <tr>{['Customer','Vehicle','Dates','Location','Amount','Status','Action'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {displayed.map(b=>(
                  <tr key={b.id} className="hover:bg-[#F7F7F7] transition-colors duration-150">
                    <td className="px-4 py-3"><p className="font-semibold text-[#111111]">{b.customer_name}</p><p className="text-xs text-gray-400">{b.email}</p><p className="text-xs text-gray-400">{b.contact_number}</p></td>
                    <td className="px-4 py-3"><p className="font-medium text-[#111111]">{b.vehicles?.name??'—'}</p>{b.with_driver&&<p className="text-xs text-primary-600">+ Driver</p>}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600"><p>{b.pickup_date}</p><p>→ {b.return_date}</p></td>
                    <td className="px-4 py-3 text-gray-600 max-w-32 truncate">{b.pickup_location}</td>
                    <td className="px-4 py-3 font-semibold">{b.total_amount?`₱${b.total_amount.toLocaleString()}`:'—'}</td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${sc[b.status]??'bg-gray-100 text-gray-500'}`}>{b.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select value={b.status} onChange={e=>updateStatus(b.id,e.target.value)} className="text-xs pl-2 pr-6 py-1.5 rounded-lg border border-[#E5E5E5] bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
      </div>
    </div>
  )
}
