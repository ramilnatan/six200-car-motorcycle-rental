import { useEffect, useState } from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Car, CalendarCheck, Star, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

const navItems = [
  { path:'/admin/dashboard', icon:LayoutDashboard, label:'Dashboard' },
  { path:'/admin/vehicles',  icon:Car,             label:'Vehicles' },
  { path:'/admin/bookings',  icon:CalendarCheck,   label:'Bookings' },
  { path:'/admin/reviews',   icon:Star,            label:'Reviews' },
  { path:'/admin/settings',  icon:Settings,        label:'Settings' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<{email?:string}|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      if (!data.session) navigate('/admin')
      else setUser(data.session.user)
      setLoading(false)
    })
    const {data:listener} = supabase.auth.onAuthStateChange((_,session) => {
      if (!session) navigate('/admin')
      else setUser(session.user)
    })
    return () => listener.subscription.unsubscribe()
  }, [navigate])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#111111]/20 border-t-[#111111] rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#111111] z-40 flex flex-col transform transition-transform duration-300 ${sidebarOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><Car size={16} className="text-white"/></div>
            <div><span className="block text-sm font-bold text-white font-display">Six200</span><span className="block text-[10px] text-white/40 uppercase tracking-widest">Admin</span></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const active = location.pathname.startsWith(item.path)
            return (
              <Link key={item.path} to={item.path} onClick={()=>setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active?'bg-white/10 text-white':'text-white/50 hover:bg-white/5 hover:text-white/80'}`}>
                <Icon size={16}/>{item.label}{active&&<ChevronRight size={14} className="ml-auto"/>}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 py-2 mb-2"><p className="text-xs text-white/40">Signed in as</p><p className="text-xs text-white/70 font-medium truncate">{user?.email}</p></div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full">
            <LogOut size={16}/>Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 lg:pl-64">
        <header className="bg-white border-b border-[#F0F0F0] px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors duration-200">
            {sidebarOpen?<X size={20}/>:<Menu size={20}/>}
          </button>
          <div className="text-sm font-medium text-[#111111] capitalize">
            {navItems.find(n=>location.pathname.startsWith(n.path))?.label ?? 'Admin'}
          </div>
          <Link to="/" className="text-xs text-gray-400 hover:text-[#111111] transition-colors duration-200">← Back to Site</Link>
        </header>
        <main className="p-4 sm:p-6"><Outlet/></main>
      </div>
    </div>
  )
}
