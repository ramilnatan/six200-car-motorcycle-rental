import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, CalendarCheck, Clock, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Skeleton } from '../components/common/Skeleton'

interface Stats { totalVehicles:number; availableVehicles:number; bookedVehicles:number; pendingBookings:number; confirmedBookings:number; completedBookings:number; cancelledBookings:number; totalRevenue:number }
interface RecentBooking { id:string; customer_name:string; status:string; created_at:string; total_amount:number|null; vehicles:{name:string}|null }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats|null>(null)
  const [recent, setRecent] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [vRes, bRes, rRes] = await Promise.all([
        supabase.from('vehicles').select('availability_status'),
        supabase.from('bookings').select('status, total_amount'),
        supabase.from('bookings').select('id, customer_name, status, created_at, total_amount, vehicles(name)').order('created_at',{ascending:false}).limit(8),
      ])
      const v: any[] = vRes.data ?? []
      const b: any[] = bRes.data ?? []
      setStats({
        totalVehicles: v.length,
        availableVehicles: v.filter(x=>x.availability_status==='available').length,
        bookedVehicles: v.filter(x=>x.availability_status==='booked').length,
        pendingBookings: b.filter(x=>x.status==='pending').length,
        confirmedBookings: b.filter(x=>x.status==='confirmed').length,
        completedBookings: b.filter(x=>x.status==='completed').length,
        cancelledBookings: b.filter(x=>x.status==='cancelled').length,
        totalRevenue: b.filter(x=>x.status==='completed').reduce((s:number,x:any)=>s+(x.total_amount??0),0),
      })
      setRecent((rRes.data as unknown as RecentBooking[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const cards = stats ? [
    {icon:Car,          label:'Total Vehicles',    value:stats.totalVehicles,                     color:'bg-blue-50 text-blue-600',     link:'/admin/vehicles'},
    {icon:CheckCircle,  label:'Available Now',      value:stats.availableVehicles,                 color:'bg-emerald-50 text-emerald-600',link:'/admin/vehicles'},
    {icon:Car,          label:'Booked',             value:stats.bookedVehicles,                    color:'bg-amber-50 text-amber-600',   link:'/admin/vehicles'},
    {icon:Clock,        label:'Pending Bookings',   value:stats.pendingBookings,                   color:'bg-orange-50 text-orange-600', link:'/admin/bookings'},
    {icon:CalendarCheck,label:'Confirmed',          value:stats.confirmedBookings,                 color:'bg-green-50 text-green-600',   link:'/admin/bookings'},
    {icon:Users,        label:'Completed',          value:stats.completedBookings,                 color:'bg-teal-50 text-teal-600',     link:'/admin/bookings'},
    {icon:XCircle,      label:'Cancelled',          value:stats.cancelledBookings,                 color:'bg-red-50 text-red-600',       link:'/admin/bookings'},
    {icon:TrendingUp,   label:'Total Revenue',      value:`₱${stats.totalRevenue.toLocaleString()}`,color:'bg-primary-50 text-primary-600',link:'/admin/bookings'},
  ] : []

  const sc: Record<string,string> = {pending:'bg-amber-100 text-amber-700',confirmed:'bg-blue-100 text-blue-700',completed:'bg-emerald-100 text-emerald-700',cancelled:'bg-red-100 text-red-700'}

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[#111111] font-display">Dashboard</h1><p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's a summary of Six200's activity.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({length:8}).map((_,i)=><Skeleton key={i} className="h-24 rounded-2xl"/>) : cards.map(card=>{
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial="rest"
              animate="rest"
              whileHover="hover"
              variants={{
                rest: { y: 0, scale: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderColor: '#F0F0F0' },
                hover: {
                  y: -10,
                  scale: 1.03,
                  boxShadow: '0 20px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(14,128,239,0.15)',
                  borderColor: 'rgba(14,128,239,0.25)',
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="relative overflow-hidden rounded-2xl border bg-white p-4"
              style={{ willChange: 'transform' }}
            >
              <Link to={card.link} className="relative z-20 block">
                <motion.div
                  variants={{
                    rest: { scale: 1, rotate: 0 },
                    hover: { scale: 1.15, rotate: 8, transition: { duration: 0.35 } },
                  }}
                  className={`relative w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
                >
                  <Icon size={17} />
                </motion.div>
                <motion.p
                  variants={{ rest: { color: '#111111' }, hover: { color: '#0062cc', transition: { duration: 0.3 } } }}
                  className="text-xl font-black"
                >
                  {card.value}
                </motion.p>
                <motion.p
                  variants={{ rest: { y: 0 }, hover: { y: -2, transition: { duration: 0.3 } } }}
                  className="text-xs text-gray-500 mt-0.5"
                >
                  {card.label}
                </motion.p>
              </Link>
              <motion.div
                variants={{ rest: { opacity: 0 }, hover: { opacity: 1, transition: { duration: 0.4 } } }}
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-50/50 via-transparent to-transparent"
              />
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
        })}
      </div>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <h2 className="font-bold text-[#111111]">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-xs text-primary-600 font-semibold hover:underline">View All</Link>
        </div>
        {loading ? <div className="p-4 space-y-3">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-12"/>)}</div>
          : recent.length===0 ? <div className="text-center py-10 text-gray-400 text-sm">No bookings yet.</div>
          : <div className="divide-y divide-[#F0F0F0]">
            {recent.map(b=>(
              <div key={b.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#F7F7F7] transition-colors duration-150">
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-[#111111] truncate">{b.customer_name}</p><p className="text-xs text-gray-400">{b.vehicles?.name??'Unknown vehicle'}</p></div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${sc[b.status]??'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                <span className="text-sm font-semibold text-[#111111] text-right w-24 flex-shrink-0">{b.total_amount?`₱${b.total_amount.toLocaleString()}`:'—'}</span>
              </div>
            ))}
          </div>}
      </div>
    </div>
  )
}
