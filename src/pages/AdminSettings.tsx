import { useEffect, useState, useCallback } from 'react'
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/common/ImageUpload'
import { Skeleton } from '../components/common/Skeleton'

const HERO_KEY = 'hero_image_url'
const CTA_KEY = 'cta_image_url'

interface SettingState {
  current: string | null
  pending: string | null
  saving: boolean
  saved: boolean
  error: string | null
}

function useSetting(key: string) {
  const [state, setState] = useState<SettingState>({
    current: null,
    pending: null,
    saving: false,
    saved: false,
    error: null,
  })

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle()

      setState((s) => ({
        ...s,
        current: data?.value ?? null,
        pending: data?.value ?? null,
        error: err?.message ?? null,
      }))
    }
    load()
  }, [key])

  const handleUpload = useCallback((url: string) => {
    setState((s) => ({ ...s, pending: url, saved: false }))
  }, [])

  async function handleSave() {
    if (state.pending === state.current) return
    setState((s) => ({ ...s, saving: true, error: null, saved: false }))

    const { error: err } = await supabase
      .from('site_settings')
      .upsert({ key, value: state.pending, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (err) {
      setState((s) => ({ ...s, saving: false, error: err.message }))
    } else {
      setState((s) => ({ ...s, current: s.pending, saving: false, saved: true }))
      setTimeout(() => setState((s) => ({ ...s, saved: false })), 3000)
    }
  }

  return { state, handleUpload, handleSave }
}

function SettingSection({
  title,
  description,
  label,
  loading,
  state,
  onUpload,
  onSave,
}: {
  title: string
  description: string
  label: string
  loading: boolean
  state: SettingState
  onUpload: (url: string) => void
  onSave: () => void
}) {
  const hasChanges = state.pending !== state.current

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
      <h2 className="font-bold text-[#111111] mb-1">{title}</h2>
      <p className="text-sm text-gray-400 mb-5">{description}</p>

      {loading ? (
        <Skeleton className="h-44 rounded-2xl" />
      ) : (
        <ImageUpload value={state.pending} onUpload={onUpload} label={label} />
      )}

      {!loading && (
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={onSave}
            disabled={!hasChanges || state.saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#2A2A2A] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {state.saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {state.saving ? 'Saving…' : 'Save Changes'}
          </button>

          {state.saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <CheckCircle2 size={15} /> Saved
            </span>
          )}

          {state.error && (
            <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
              <AlertCircle size={15} /> {state.error}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const hero = useSetting(HERO_KEY)
  const cta = useSetting(CTA_KEY)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] font-display">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage homepage content and site-wide configuration.</p>
      </div>

      <SettingSection
        title="Homepage Hero"
        description="The background image displayed at the top of the homepage."
        label="Hero Background Image"
        loading={loading}
        state={hero.state}
        onUpload={hero.handleUpload}
        onSave={hero.handleSave}
      />

      <SettingSection
        title="CTA Section"
        description="The background image displayed behind the call-to-action section near the bottom of the homepage."
        label="CTA Background Image"
        loading={loading}
        state={cta.state}
        onUpload={cta.handleUpload}
        onSave={cta.handleSave}
      />
    </div>
  )
}
