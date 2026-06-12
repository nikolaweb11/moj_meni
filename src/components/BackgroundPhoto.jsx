import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL

export const ALL_PHOTOS = Array.from({ length: 63 }, (_, i) =>
  `${BASE}images/p${String(i + 1).padStart(2, '0')}.jpg`
)

export default function BackgroundPhoto() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * ALL_PHOTOS.length))
  const [fading, setFading] = useState(false)

  const advance = useCallback(() => {
    setFading(true)
    setTimeout(() => {
      setIdx((i) => {
        let next
        do { next = Math.floor(Math.random() * ALL_PHOTOS.length) } while (next === i)
        return next
      })
      setFading(false)
    }, 900)
  }, [])

  useEffect(() => {
    const id = setInterval(advance, 60000)
    return () => clearInterval(id)
  }, [advance])

  const url = ALL_PHOTOS[idx]
  const opacity = fading ? 0 : 1

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity, transition: 'opacity 0.9s ease-in-out' }}
    >
      {/* Blurred cover layer — fills any gaps around the contained image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(24px)',
          transform: 'scale(1.1)',
          opacity: 0.18,
        }}
      />
      {/* Full image layer — always shows the whole photo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${url})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.22,
        }}
      />
    </div>
  )
}
