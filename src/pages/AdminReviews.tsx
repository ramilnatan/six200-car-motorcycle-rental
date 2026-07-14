import { useEffect, useState } from 'react'
import { Check, Trash2, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Review } from '../types'
import { Skeleton } from '../components/common/Skeleton'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all'|'pending'|'approved'>('all')

  async function load() {
    setLoading(true)
    const {data} = await supabase.from('reviews').select('*').order('created_at',{ascending:false})
    setReviews((data as Review[]) ?? [])
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  async function toggleApproval(id: string, current: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('reviews') as any).update({is_approved:!current}).eq('id',id)
    load()
  }
  async function deleteReview(id: string) {
    await supabase.from('reviews').delete().eq('id',id)
    load()
  }

  const displayed = filter==='all' ? reviews : filter==='approved' ? reviews.filter(r=>r.is_approved) : reviews.filter(r=>!r.is_approved)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#111111] font-display">Reviews</h1>
      <div className="flex items-center gap-2">
        {(['all','pending','approved'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter===f?'bg-[#111111] text-white':'bg-white text-gray-500 border border-[#E5E5E5] hover:border-[#111111]'}`}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      {loading ? <div className="space-y-3">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-28 rounded-2xl"/>)}</div>
        : displayed.length===0 ? <div className="bg-white rounded-2xl border border-[#F0F0F0] py-16 text-center text-gray-400 text-sm">No reviews in this category.</div>
        : <div className="space-y-3">
          {displayed.map(r=>(
            <div key={r.id} className="bg-white rounded-2xl border border-[#F0F0F0] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {r.customer_photo?<img src={r.customer_photo} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>:<div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center text-gray-500 font-bold flex-shrink-0">{r.customer_name.charAt(0)}</div>}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[#111111] text-sm">{r.customer_name}</p>
                      <div className="flex items-center gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={11} className={i<r.rating?'fill-amber-400 text-amber-400':'fill-gray-200 text-gray-200'}/>)}</div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.is_approved?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{r.is_approved?'Approved':'Pending'}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={()=>toggleApproval(r.id,r.is_approved)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${r.is_approved?'bg-gray-100 text-gray-600 hover:bg-gray-200':'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                    <Check size={12}/>{r.is_approved?'Unapprove':'Approve'}
                  </button>
                  <button onClick={()=>deleteReview(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
}
