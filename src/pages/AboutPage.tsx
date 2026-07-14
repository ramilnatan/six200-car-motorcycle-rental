import { Target, Eye, Users, Wrench, Heart } from 'lucide-react'

const team = [
  { name:'Kenneth Barote', role:'Founder & CEO', image:'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300', bio:'Visionary leader with 15+ years in transportation and logistics.' },
  { name:'Karen Encarguez Barote', role:'Operations Manager', image:'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300', bio:'Expert in fleet management and customer service excellence.' },
  { name:'Carlos Reyes', role:'Head of Fleet', image:'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300', bio:'Certified mechanic ensuring every vehicle meets premium standards.' },
  { name:'Ana dela Cruz', role:'Customer Relations', image:'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300', bio:'Dedicated to creating memorable experiences for every customer.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="relative py-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src="https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" className="w-full h-full object-cover"/></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-6">About Six200</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">Born from a passion for quality transportation and a commitment to delivering world-class service.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">Who We Are</p>
              <h2 className="section-heading mb-5">The Six200 Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>Six200 Car & Motorcycle Rental was founded with a simple yet powerful vision: to make premium vehicle rental accessible, reliable, and enjoyable for everyone across Negros Oriental.</p>
                <p>What started as a small fleet of carefully selected vehicles has grown into a comprehensive rental service offering over 10 premium cars and motorcycles. Our name "Six200" represents our commitment — 6 days a week, 200% dedication.</p>
                <p>Today, we serve hundreds of satisfied customers monthly — from business travelers to adventurers seeking rugged motorcycles for mountain exploration.</p>
              </div>
            </div>
            <div className="reveal">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden aspect-square"><img src="https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover"/></div>
                <div className="rounded-2xl overflow-hidden aspect-square mt-8"><img src="https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover"/></div>
                <div className="rounded-2xl overflow-hidden aspect-square -mt-4"><img src="https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover"/></div>
                <div className="rounded-2xl overflow-hidden aspect-square mt-4"><img src="https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover"/></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{icon:Target,title:'Our Mission',content:'To provide premium, reliable, and affordable vehicle rental services that empower every journey — whether for business, leisure, or adventure. We are committed to excellence in every interaction.'},{icon:Eye,title:'Our Vision',content:'To become the most trusted and preferred vehicle rental brand in the Philippines, recognized for our premium fleet, exceptional service, and commitment to customer satisfaction.'}].map((val,i)=>{
              const Icon = val.icon
              return (
                <div key={val.title} className={`bg-white rounded-2xl p-8 border border-[#F0F0F0] reveal reveal-delay-${(i+1)*200}`}>
                  <div className="w-12 h-12 rounded-xl bg-[#111111] flex items-center justify-center mb-5"><Icon size={22} className="text-white"/></div>
                  <h3 className="font-bold text-[#111111] text-xl mb-3">{val.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{val.content}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto reveal">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6"><Heart size={24} className="text-red-500 fill-red-500"/></div>
            <h2 className="section-heading mb-5">Our Commitment to You</h2>
            <p className="text-gray-600 leading-relaxed">Every vehicle in our fleet undergoes rigorous safety and maintenance checks before your rental. We provide comprehensive insurance, 24/7 roadside assistance, and dedicated customer support throughout your journey.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[{icon:Wrench,label:'Quality Standards',desc:'Every vehicle inspected before each rental'},{icon:Users,label:'Trained Staff',desc:'Professional, courteous service team'},{icon:Target,label:'Customer Focus',desc:'Your experience is our top priority'},{icon:Heart,label:'Community',desc:'Proudly serving the Philippines'}].map(({icon:Icon,label,desc},i)=>(
              <div key={label} className={`reveal reveal-delay-${(i+1)*100}`}>
                <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] flex items-center justify-center mx-auto mb-3"><Icon size={20} className="text-[#111111]"/></div>
                <h4 className="font-bold text-[#111111] text-sm mb-1">{label}</h4>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">The People</p>
            <h2 className="section-heading">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member,i)=>(
              <div key={member.name} className={`bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden group hover:shadow-luxury-lg hover:-translate-y-1 transition-all duration-300 reveal reveal-delay-${(i+1)*100}`}>
                <div className="aspect-square overflow-hidden"><img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/></div>
                <div className="p-4"><h4 className="font-bold text-[#111111] text-sm">{member.name}</h4><p className="text-xs text-primary-600 font-semibold mb-1.5">{member.role}</p><p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
