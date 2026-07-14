import { Shield, DollarSign, Car, Wrench, Headphones, CalendarCheck, MapPin, Star } from 'lucide-react'
import { PremiumCard, PremiumIcon, PremiumHeading, PremiumDesc } from '../common/PremiumCard'

const features = [
  { icon:Car,          title:'Premium Fleet',      desc:'Wide range of well-maintained, late-model cars and motorcycles.', color:'bg-blue-50 text-blue-600' },
  { icon:DollarSign,   title:'Affordable Rates',   desc:'Transparent pricing with no hidden fees. Best value guaranteed.', color:'bg-emerald-50 text-emerald-600' },
  { icon:Shield,       title:'Fully Insured',       desc:'Every vehicle comes with comprehensive insurance coverage.',      color:'bg-purple-50 text-purple-600' },
  { icon:Wrench,       title:'Well Maintained',     desc:'All vehicles undergo rigorous maintenance checks before rental.', color:'bg-orange-50 text-orange-600' },
  { icon:Headphones,   title:'24/7 Support',        desc:'Dedicated team available around the clock for assistance.',      color:'bg-red-50 text-red-600' },
  { icon:CalendarCheck,title:'Easy Booking',        desc:'Simple, fast booking process — reserve your vehicle in minutes.', color:'bg-teal-50 text-teal-600' },
  { icon:MapPin,       title:'Flexible Pick-up',    desc:'Multiple pick-up and return locations across key cities.',       color:'bg-indigo-50 text-indigo-600' },
  { icon:Star,         title:'5-Star Rated',        desc:'Hundreds of happy customers with top-rated reviews.',           color:'bg-amber-50 text-amber-600' },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 reveal">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Why Six200</p>
          <h2 className="section-heading">Why Choose Us?</h2>
          <p className="section-subheading mt-3">We're committed to delivering an exceptional rental experience from booking to return.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f,i) => {
            const Icon = f.icon
            return (
              <div key={f.title} className={`reveal reveal-delay-${Math.min((i%4+1)*100,400)}`}>
                <PremiumCard className="h-full p-6">
                  <PremiumIcon className={`w-11 h-11 rounded-xl mb-4 ${f.color}`}>
                    <Icon size={20} />
                  </PremiumIcon>
                  <PremiumHeading className="font-bold text-sm mb-2">{f.title}</PremiumHeading>
                  <PremiumDesc className="text-xs text-gray-500 leading-relaxed">{f.desc}</PremiumDesc>
                </PremiumCard>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
