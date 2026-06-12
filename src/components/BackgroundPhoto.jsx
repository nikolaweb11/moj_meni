import { useState, useEffect, useCallback } from 'react'
import useStore from '../store/useStore'

const BASE = import.meta.env.BASE_URL

export const DEFAULT_PHOTOS = [
  { id: 'waterfall-couple.jpg', label: 'Vodopad — zajedno', url: null },
  { id: 'waterfall-reflection.jpg', label: 'Odraz vodopada', url: null },
  { id: 'black-beach.jpg', label: 'Crna plaža', url: null },
  { id: 'waterfall-behind.jpg', label: 'Iza vodopada', url: null },
  { id: 'reykjavik.jpg', label: 'Reykjavik', url: null },
  { id: 'hero-church.jpg', label: 'Crna crkva', url: null },
]

function getPhotoUrl(p) {
  return p.url || `${BASE}images/${p.id}`
}

export default function BackgroundPhoto() {
  const bgEnabled = useStore((s) => s.bgEnabled)
  const bgSelectedPhoto = useStore((s) => s.bgSelectedPhoto)
  const userBgPhotos = useStore((s) => s.userBgPhotos)

  const allPhotos = [...DEFAULT_PHOTOS, ...(userBgPhotos || [])]
  const pool = bgSelectedPhoto === 'auto' ? allPhotos : allPhotos.filter((p) => p.id === bgSelectedPhoto)

  const [idx, setIdx] = useState(() => Math.floor(Math.random() * Math.max(pool.length, 1)))
  const [fading, setFading] = useState(false)

  const advance = useCallback(() => {
    setFading(true)
    setTimeout(() => {
      setIdx((i) => {
        const len = pool.length
        if (len <= 1) return 0
        let next
        do { next = Math.floor(Math.random() * len) } while (next === i && len > 1)
        return next
      })
      setFading(false)
    }, 900)
  }, [pool.length])

  useEffect(() => {
    if (!bgEnabled || bgSelectedPhoto !== 'auto') return
    const id = setInterval(advance, 60000)
    return () => clearInterval(id)
  }, [bgEnabled, bgSelectedPhoto, advance])

  if (!bgEnabled || pool.length === 0) return null

  const safeIdx = idx % pool.length
  const photo = pool[safeIdx]

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `url(${getPhotoUrl(photo)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fading ? 0 : 0.22,
        transition: 'opacity 0.9s ease-in-out',
      }}
    />
  )
}
