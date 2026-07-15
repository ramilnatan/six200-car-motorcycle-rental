import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Check, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Vehicle } from '../types'
import { Skeleton } from '../components/common/Skeleton'
import ImageUpload from '../components/common/ImageUpload'
import { CAR_CATEGORIES, MOTORCYCLE_CATEGORIES } from '../constants'

type Mode = 'add' | 'edit' | null

const EMPTY: Partial<Vehicle> = {
  vehicle_type:'car', name:'', category:'sedan', transmission:'automatic', fuel_type:'gasoline',
  seats:5, engine_cc:null, luggage_capacity:2, helmet_included:false, top_box:false,
  price_per_day:0, photo_url:'', gallery_urls:[], availability_status:'available',
  mileage_limit:200, features:[], description:'', is_featured:false,
}

const sb: Record<string,string> = { available:'bg-emerald-100 text-emerald-700', booked:'bg-amber-100 text-amber-700', maintenance:'bg-gray-100 text-gray-600' }

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Mode>(null)
  const [form, setForm] = useState<Partial<Vehicle>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [featInput, setFeatInput] = useState('')

  async function load() {
    setLoading(true)
    const {data} = await supabase.from('vehicles').select('*').order('created_at',{ascending:false})
    setVehicles((data as Vehicle[]) ?? [])
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  function openAdd() { setForm(EMPTY); setFeatInput(''); setModal('add') }
  function openEdit(v: Vehicle) { setForm({...v}); setFeatInput(v.features?.join(', ')||''); setModal('edit') }

  async function save() {
    setSaving(true)
    const payload = { ...form, features: featInput.split(',').map(f=>f.trim()).filter(Boolean) }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (modal === 'add') { await (supabase.from('vehicles') as any).insert(payload) }
    else if (form.id) {
      const { id, created_at, ...update } = payload as Vehicle
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('vehicles') as any).update(update).eq('id', id)
    }
    setSaving(false); setModal(null); load()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await supabase.from('vehicles').delete().eq('id', deleteId)
    setDeleteId(null); load()
  }

  const cats = form.vehicle_type === 'car' ? CAR_CATEGORIES : MOTORCYCLE_CATEGORIES

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111111] font-display">Vehicles</h1>
        <button onClick={openAdd} className="btn-primary"><Plus size={16}/>Add Vehicle</button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        {loading ? <div className="p-4 space-y-3">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-16"/>)}</div>
          : vehicles.length === 0 ? <div className="text-center py-16 text-gray-400"><p className="mb-3">No vehicles yet.</p><button onClick={openAdd} className="btn-primary">Add Your First Vehicle</button></div>
          : <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F7F7] border-b border-[#F0F0F0]">
                <tr>{['Vehicle','Category','Transmission','Price/Day','Status','Featured','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {vehicles.map(v=>(
                  <tr key={v.id} className="hover:bg-[#F7F7F7] transition-colors duration-150">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {v.photo_url?<img src={v.photo_url} alt="" className="w-10 h-8 rounded-lg object-cover flex-shrink-0"/>:<div className="w-10 h-8 rounded-lg bg-[#F0F0F0] flex-shrink-0"/>}
                        <div><p className="font-semibold text-[#111111]">{v.name}</p><p className="text-xs text-gray-400 capitalize">{v.vehicle_type}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{v.category}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{v.transmission}</td>
                    <td className="px-4 py-3 font-semibold">₱{v.price_per_day.toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${sb[v.availability_status]??''}`}>{v.availability_status}</span></td>
                    <td className="px-4 py-3">{v.is_featured?<Check size={16} className="text-emerald-500"/>:<X size={16} className="text-gray-300"/>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={()=>openEdit(v)} className="p-1.5 rounded-lg hover:bg-[#F0F0F0] text-gray-500 hover:text-[#111111] transition-colors"><Edit2 size={14}/></button>
                        <button onClick={()=>setDeleteId(v.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
              <h2 className="font-bold text-[#111111]">{modal==='add'?'Add New Vehicle':'Edit Vehicle'}</h2>
              <button onClick={()=>setModal(null)} className="p-2 rounded-lg hover:bg-[#F7F7F7]"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Vehicle Type</label>
                  <select value={form.vehicle_type} onChange={e=>setForm({...form,vehicle_type:e.target.value as 'car'|'motorcycle',category:e.target.value==='car'?'sedan':'scooter'})} className="input-field">
                    <option value="car">Car</option><option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-field">
                    {cats.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="label">Vehicle Name</label><input type="text" value={form.name??''} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" placeholder="e.g. Toyota Land Cruiser 300"/></div>
                <div>
                  <label className="label">Transmission</label>
                  <select value={form.transmission} onChange={e=>setForm({...form,transmission:e.target.value as 'automatic'|'manual'})} className="input-field">
                    <option value="automatic">Automatic</option><option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="label">Fuel Type</label>
                  <select value={form.fuel_type} onChange={e=>setForm({...form,fuel_type:e.target.value as Vehicle['fuel_type']})} className="input-field">
                    <option value="gasoline">Gasoline</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option>
                  </select>
                </div>
                {form.vehicle_type==='car'?(
                  <>
                    <div><label className="label">Seats</label><input type="number" value={form.seats??''} onChange={e=>setForm({...form,seats:Number(e.target.value)})} className="input-field"/></div>
                    <div><label className="label">Luggage Capacity (bags)</label><input type="number" value={form.luggage_capacity??''} onChange={e=>setForm({...form,luggage_capacity:Number(e.target.value)})} className="input-field"/></div>
                  </>
                ):(
                  <>
                    <div><label className="label">Engine CC</label><input type="number" value={form.engine_cc??''} onChange={e=>setForm({...form,engine_cc:Number(e.target.value)})} className="input-field"/></div>
                    <div>
                      <label className="label">Extras</label>
                      <div className="flex flex-col gap-2 pt-1">
                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.helmet_included} onChange={e=>setForm({...form,helmet_included:e.target.checked})} className="accent-[#111111]"/>Helmet Included</label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.top_box} onChange={e=>setForm({...form,top_box:e.target.checked})} className="accent-[#111111]"/>Top Box Included</label>
                      </div>
                    </div>
                  </>
                )}
                <div><label className="label">Price Per Day (₱)</label><input type="number" value={form.price_per_day??''} onChange={e=>setForm({...form,price_per_day:Number(e.target.value)})} className="input-field"/></div>
                <div><label className="label">Mileage Limit (km/day)</label><input type="number" value={form.mileage_limit??''} onChange={e=>setForm({...form,mileage_limit:Number(e.target.value)})} className="input-field"/></div>
                <div>
                  <label className="label">Status</label>
                  <select value={form.availability_status} onChange={e=>setForm({...form,availability_status:e.target.value as Vehicle['availability_status']})} className="input-field">
                    <option value="available">Available</option><option value="booked">Booked</option><option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex items-end"><label className="flex items-center gap-2 text-sm cursor-pointer pb-1"><input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})} className="accent-[#111111] w-4 h-4"/>Featured on homepage</label></div>
                <div className="col-span-2">
                  <ImageUpload
                    value={form.photo_url ?? null}
                    onUpload={(url) => setForm({ ...form, photo_url: url })}
                  />
                </div>
                <div className="col-span-2"><label className="label">Features (comma-separated)</label><input type="text" value={featInput} onChange={e=>setFeatInput(e.target.value)} className="input-field" placeholder="Air Conditioning, GPS, Bluetooth"/></div>
                <div className="col-span-2"><label className="label">Description</label><textarea value={form.description??''} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="input-field resize-none"/></div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-[#F0F0F0]">
              <button onClick={()=>setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={save} disabled={saving||!form.name} className="btn-primary flex-1 justify-center disabled:opacity-50">
                {saving?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<Upload size={15}/>}
                {modal==='add'?'Add Vehicle':'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-500"/></div>
            <h3 className="font-bold text-[#111111] text-lg mb-2">Delete Vehicle?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors duration-200">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
