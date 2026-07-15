import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) setError('Invalid email or password. Please try again.')
    else navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
            onClick={() => navigate('/')}
               className="flex items-center gap-1.5 text-sm text-white/40 hover:text-   white/70 transition-colors duration-200 mb-6"
             >
            <ArrowLeft size={15} />
              Back to Home
         </button>
       <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Car size={20} className="text-white"/></div>
            <div className="text-left"><span className="block text-lg font-bold text-white font-display">Six200</span><span className="block text-[10px] text-white/40 uppercase tracking-widest">Admin Portal</span></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-white/50">Sign in to access the dashboard</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@six200rental.com" required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative"><Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
                <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"/>
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>
            {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400"><AlertCircle size={15} className="flex-shrink-0"/>{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-white text-[#111111] font-bold text-sm rounded-xl hover:bg-white/90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading?<><div className="w-4 h-4 border-2 border-[#111111]/30 border-t-[#111111] rounded-full animate-spin"/>Signing in...</>:'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-white/30 mt-6">Protected admin area. Unauthorized access is prohibited.</p>
      </div>
    </div>
  )
}
