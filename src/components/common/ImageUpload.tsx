import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { Upload, X, ImagePlus, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ImageUploadProps {
  value: string | null
  onUpload: (publicUrl: string) => void
  bucket?: string
  label?: string
  className?: string
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export default function ImageUpload({
  value,
  onUpload,
  bucket = 'vehicle-images',
  label = 'Vehicle Photo',
  className = '',
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setPreviewUrl(null)
    setProgress(0)
    setUploadState('idle')
    setErrorMsg(null)
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setErrorMsg('Please select a JPG, PNG, or WebP image.')
        setUploadState('error')
        return
      }
      if (file.size > MAX_SIZE) {
        setErrorMsg('Image must be under 5 MB.')
        setUploadState('error')
        return
      }

      setErrorMsg(null)
      setUploadState('uploading')
      setProgress(0)

      const localPreview = URL.createObjectURL(file)
      setPreviewUrl(localPreview)

      // Simulate progress while uploading (supabase-js doesn't expose progress events)
      let prog = 0
      const progInterval = setInterval(() => {
        prog = Math.min(prog + Math.random() * 15, 90)
        setProgress(Math.round(prog))
      }, 200)

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 40)
      const path = `${Date.now()}-${safeName}.${ext}`

      try {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            upsert: true,
            contentType: file.type,
          })

        clearInterval(progInterval)

        if (error) throw error

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
        onUpload(urlData.publicUrl)
        setUploadState('success')
        setProgress(100)
      } catch (err) {
        clearInterval(progInterval)
        const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.'
        setErrorMsg(msg)
        setUploadState('error')
        URL.revokeObjectURL(localPreview)
        setPreviewUrl(null)
      }
    },
    [bucket, onUpload],
  )

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      e.target.value = ''
    },
    [handleFile],
  )

  const displayUrl = previewUrl ?? value
  const showCurrent = Boolean(displayUrl)

  return (
    <div className={className}>
      <label className="label">{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onInputChange}
        className="hidden"
      />

      {/* Upload zone / preview */}
      {!showCurrent && uploadState !== 'uploading' && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 p-8 text-center
            ${isDragging
              ? 'border-primary-500 bg-primary-50 scale-[1.01]'
              : uploadState === 'error'
                ? 'border-red-300 bg-red-50/50'
                : 'border-[#D9D9D9] bg-[#F7F7F7] hover:border-primary-400 hover:bg-primary-50/30'
            }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragging ? 'bg-primary-100 text-primary-600' : 'bg-white text-gray-400 shadow-sm'}`}>
              <ImagePlus size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111111]">
                {isDragging ? 'Drop image here' : 'Drag & drop or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP — max 5 MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Uploading state */}
      {uploadState === 'uploading' && (
        <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin flex-shrink-0" />
            <span className="text-sm font-medium text-[#111111]">Uploading image…</span>
          </div>
          <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{progress}%</p>
        </div>
      )}

      {/* Preview with current/uploaded image */}
      {showCurrent && uploadState !== 'uploading' && (
        <div className="relative rounded-2xl border border-[#F0F0F0] bg-white overflow-hidden group">
          <div className="relative h-44 bg-[#F7F7F7]">
            <img src={displayUrl ?? undefined} alt="Vehicle preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {uploadState === 'success' && (
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle2 size={16} className="text-white" />
              </div>
            )}

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#111111] hover:bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <RefreshCw size={12} />
                Change Image
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onUpload('')
                  reset()
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-red-500 hover:bg-red-50 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <X size={12} />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {uploadState === 'error' && errorMsg && (
        <div className="mt-2 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
            <button
              onClick={() => {
                reset()
                inputRef.current?.click()
              }}
              className="text-xs text-red-500 font-semibold underline mt-1 hover:text-red-600"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
