import { useMemo } from 'react'

interface ContactMapProps {
  /** Full business address — used to build the embed URL automatically. */
  address?: string
  /** A full Google Maps embed URL — takes precedence over `address`. */
  mapEmbedUrl?: string
  /** Height of the map container. Default: h-56 (14rem). */
  className?: string
  title?: string
}

function buildEmbedUrl(address: string): string {
  const encoded = encodeURIComponent(address)
  return `https://www.google.com/maps?q=${encoded}&output=embed`
}

export default function ContactMap({
  address,
  mapEmbedUrl,
  className = 'h-56',
  title = 'Business Location',
}: ContactMapProps) {
  const src = useMemo(() => {
    if (mapEmbedUrl) return mapEmbedUrl
    if (address) return buildEmbedUrl(address)
    return ''
  }, [mapEmbedUrl, address])

  if (!src) return null

  return (
    <div className={`rounded-2xl overflow-hidden bg-[#F7F7F7] border border-[#F0F0F0] ${className}`}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    </div>
  )
}
