import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import type { Review } from '../../types'

const FALLBACK: Review[] = [
  { id:'1', customer_name:'Maria Santos', customer_photo:'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', rating:5, comment:'Absolutely fantastic experience! The Land Cruiser was spotless and the service was top-notch. Will definitely rent again!', vehicle_id:null, is_approved:true, created_at:'' },
  { id:'2', customer_name:'Juan dela Cruz', customer_photo:'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', rating:5, comment:'Best rental experience I have had. The BMW was in perfect condition and the booking process was seamless. Highly recommended!', vehicle_id:null, is_approved:true, created_at:'' },
  { id:'3', customer_name:'Ana Reyes', customer_photo:'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200', rating:5, comment:'The Honda ADV was perfect for exploring the city. Very well maintained and the helmet provided was high quality. 5 stars!', vehicle_id:null, is_approved:true, created_at:'' },
  { id:'4', customer_name:'Carlos Mendoza', customer_photo:'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200', rating:5, comment:'Rented the Kawasaki Z900 for a weekend ride. Absolute beast! Six200 team was professional and responsive. 10/10!', vehicle_id:null, is_approved:true, created_at:'' },
  { id:'5', customer_name:'Sofia Lim', customer_photo:'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200', rating:4, comment:'Great service and well-maintained vehicles. The Innova was perfect for our family vacation. Pickup and return were hassle-free.', vehicle_id:null, is_approved:true, created_at:'' },
]

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null)

  useEffect(() => {
    supabase.from('reviews').select('*').eq('is_approved',true).order('created_at',{ascending:false}).limit(10)
      .then(({data}) => { if ((data as Review[])?.length) setReviews(data as Review[]) })
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c+1)%reviews.length), 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [reviews.length])

  function go(dir: number) {
    if (timerRef.current) clearInterval(timerRef.current)
    setCurrent(c => (c+dir+reviews.length)%reviews.length)
  }

  const review = reviews[current]

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 reveal">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="section-heading">What Our Customers Say</h2>
          <p className="section-subheading mt-3">Real experiences from satisfied customers across the Philippines.</p>
        </div>
        <div className="max-w-3xl mx-auto reveal">
          <motion.div
            initial="rest"
            animate="rest"
            whileHover="hover"
            variants={{
              rest: { y: 0, scale: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderColor: '#F0F0F0' },
              hover: {
                y: -8,
                scale: 1.02,
                boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(14,128,239,0.15)',
                borderColor: 'rgba(14,128,239,0.25)',
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="relative bg-[#F7F7F7] rounded-3xl p-8 md:p-12 text-center overflow-hidden border"
            style={{ willChange: 'transform' }}
          >
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
            <div className="relative z-20">
              <motion.div
                variants={{
                  rest: { scale: 1, rotate: 0 },
                  hover: { scale: 1.1, rotate: 8, transition: { duration: 0.4 } },
                }}
                className="absolute top-6 left-8 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <Quote size={18} className="text-primary-600" />
              </motion.div>
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({length:5}).map((_,i) => <Star key={i} size={18} className={i<review.rating?'fill-amber-400 text-amber-400':'fill-gray-200 text-gray-200'} />)}
              </div>
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="text-lg md:text-xl text-[#2A2A2A] font-medium leading-relaxed mb-8 italic"
                >
                  "{review.comment}"
                </motion.blockquote>
              </AnimatePresence>
              <div className="flex items-center justify-center gap-3">
                {review.customer_photo
                  ? <img src={review.customer_photo} alt={review.customer_name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-luxury" />
                  : <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">{review.customer_name.charAt(0)}</div>
                }
                <div className="text-left">
                  <p className="font-bold text-[#111111] text-sm">{review.customer_name}</p>
                  <p className="text-xs text-gray-400">Verified Customer</p>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => go(-1)} className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-[#111111] hover:border-[#111111] hover:text-white transition-all duration-200"><ChevronLeft size={16}/></button>
            <div className="flex items-center gap-2">
              {reviews.map((_,i) => <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all duration-300 ${i===current?'w-6 h-2 bg-[#111111]':'w-2 h-2 bg-[#D9D9D9]'}`} />)}
            </div>
            <button onClick={() => go(1)} className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-[#111111] hover:border-[#111111] hover:text-white transition-all duration-200"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </section>
  )
}
