import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const FALLBACK_CTA = 'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1920'

export default function CTASection() {
  const [ctaImage, setCtaImage] = useState(FALLBACK_CTA)

  useEffect(() => {
    async function loadCta() {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'cta_image_url')
        .maybeSingle()
      if (data?.value) setCtaImage(data.value)
    }
    loadCta()
  }, [])

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={ctaImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#111111]/82" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
        <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4">Start Your Journey</p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
          Ready for Your<br/>Next Journey?
        </h2>
         <p 
          className="text-lg max-w-xl mx-auto mb-10" 
          style={{ color: '#000000', textShadow: '0 2px 8px rgba(255,255,255,0.5)' }}
          >
          Explore Dumaguete, Negros Oriental in style. Choose from our premium fleet and            experience the road like never before.
          </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking" className="btn-primary bg-white text-[#111111] hover:bg-white/90 shadow-luxury-xl">
            Book Your Vehicle Today<ArrowRight size={16}/>
          </Link>
          <Link to="/vehicles" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:border-white/50">
            Browse Our Fleet
          </Link>
        </div>
      </div>
    </section>
  )
}
