import { useEffect, useState, useCallback } from 'react'
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/common/ImageUpload'
import { Skeleton } from '../components/common/Skeleton'

const HERO_KEY = 'hero_image_url'

export default function AdminSettings() {
  const [heroUrl, setHeroUrl] = useState<string | null>(null)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', HERO_KEY)
        .maybeSingle()

      if (err) {
        setError(err.message)
      } else {
        setHeroUrl(data?.value ?? null)
        setPendingUrl(data?.value ?? null)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleUpload = useCallback((url: string) => {
    setPendingUrl(url)
    setSaved(false)
  }, [])

  async function handleSave() {
    if (pendingUrl === heroUrl) return
    setSaving(true)
    setError(null)
    setSaved(false)

    const { error: err } = await supabase
      .from('site_settings')
      .upsert({ key: HERO_KEY, value: pendingUrl, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (err) {
      setError(err.message)
    } else {
      setHeroUrl(pendingUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const hasChanges = pendingUrl !== heroUrl

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] font-display">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage homepage content and site-wide configuration.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
        <h2 className="font-bold text-[#111111] mb-1">Homepage Hero</h2>
        <p className="text-sm text-gray-400 mb-5">The background image displayed at the top of the homepage.</p>

        {loading ? (
          <Skeleton className="h-44 rounded-2xl" />
        ) : (
          <ImageUpload
            value={pendingUrl}
            onUpload={handleUpload}
            label="Hero Background Image"
          />
        )}

        {!loading && (
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#2A2A2A] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>

            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <CheckCircle2 size={15} /> Saved
              </span>
            )}

            {error && (
              <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
                <AlertCircle size={15} /> {error}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
