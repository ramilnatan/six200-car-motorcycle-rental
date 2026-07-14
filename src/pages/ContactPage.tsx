import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, CheckCircle, MessageCircle } from 'lucide-react'
import ContactMap from '../components/common/ContactMap'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [state, setState] = useState<'idle'|'submitting'|'success'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('submitting')
    await new Promise(r => setTimeout(r, 800))
    setState('success')
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="py-16 bg-[#F7F7F7] border-b border-[#F0F0F0]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Get in Touch</p>
          <h1 className="section-heading mb-3">Contact Us</h1>
          <p className="section-subheading max-w-xl mx-auto">Have questions or need help? Our team is ready to assist you 24/7.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              {[
                { icon:Phone, title:'Phone', lines:['+63 928 777 7610','+63 998 123 4678'] },
                { icon:Mail, title:'Email', lines:['info@six200rental.com','bookings@six200rental.com'] },
                { icon:MessageCircle, title:'WhatsApp', lines:['+63 928 777 7610','Chat with us instantly'] },
                { icon:MapPin, title:'Main Office', lines:['EJ Blanco St., Piapi, Dumaguete City','Negroes Oreintal, Philippines'] },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-4 p-4 bg-[#F7F7F7] rounded-2xl hover:shadow-luxury transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm"><Icon size={18} className="text-[#111111]"/></div>
                    <div><p className="font-bold text-[#111111] text-sm mb-0.5">{item.title}</p>{item.lines.map(l=><p key={l} className="text-xs text-gray-500">{l}</p>)}</div>
                  </div>
                )
              })}
              <div className="p-4 bg-[#F7F7F7] rounded-2xl">
                <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm"><Clock size={18} className="text-[#111111]"/></div><p className="font-bold text-[#111111] text-sm">Business Hours</p></div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between"><span>Monday – Friday</span><span className="font-medium text-[#111111]">7:00 AM – 8:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-medium text-[#111111]">7:00 AM – 7:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="font-medium text-[#111111]">8:00 AM – 6:00 PM</span></div>
                  <div className="flex justify-between text-primary-600 font-medium pt-1 border-t border-[#E5E5E5] mt-2"><span>Emergency Support</span><span>24/7</span></div>
                </div>
              </div>
              <div className="p-4 bg-[#F7F7F7] rounded-2xl">
                <p className="font-bold text-[#111111] text-sm mb-3">Follow Us</p>
                <div className="flex items-center gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors duration-200"><Facebook size={13}/>Facebook</a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity duration-200"><Instagram size={13}/>Instagram</a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <ContactMap
                address="Six200 Rental, Rizal Boulevard, Dumaguete City, Negros Oriental 6200, Philippines"
                className="h-56"
              />
              {state === 'success' ? (
                <div className="bg-white rounded-2xl border border-[#F0F0F0] p-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4"><CheckCircle size={28} className="text-emerald-500"/></div>
                  <h3 className="font-bold text-[#111111] text-xl mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={()=>{setState('idle');setForm({name:'',email:'',phone:'',message:''})}} className="btn-primary">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#F0F0F0] p-6 space-y-4">
                  <h3 className="font-bold text-[#111111] text-lg">Send Us a Message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="label">Your Name</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Juan dela Cruz" className="input-field" required/></div>
                    <div><label className="label">Phone (Optional)</label><input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+63 912 345 6789" className="input-field"/></div>
                  </div>
                  <div><label className="label">Email Address</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="juan@example.com" className="input-field" required/></div>
                  <div><label className="label">Your Message</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={5} placeholder="Tell us how we can help you..." className="input-field resize-none" required/></div>
                  <button type="submit" disabled={state==='submitting'} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
                    {state==='submitting'?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Sending...</>:'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
