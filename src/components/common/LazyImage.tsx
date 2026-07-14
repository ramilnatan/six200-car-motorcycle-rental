import { useState } from 'react'

interface Props { src: string; alt: string; className?: string }

export default function LazyImage({ src, alt, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 bg-gradient-to-r from-[#F0F0F0] via-[#E8E8E8] to-[#F0F0F0] animate-pulse" />}
      <img
        src={error ? 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800' : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
