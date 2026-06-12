import { useState, useEffect } from 'react'
import useStore from '../store/useStore'

const BASE = import.meta.env.BASE_URL

const PHOTOS = [
  'hero-church.jpg',
  'waterfall-couple.jpg',
  'black-beach.jpg',
  'reykjavik.jpg',
  'waterfall-behind.jpg',
  'waterfall-reflection.jpg',
]

export { PHOTOS }

export default function BackgroundPhoto() {
  const bgEnabled = useStore((s) => s.bgEnabled)
  const bgSelectedPhoto = useStore((s) => s.bgSelectedPhoto)
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!bgEnabled || bgSelectedPhoto !== 'auto') return
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIdx((i) => (i + 1) % PHOTOS.length)
        setFading(false)
      }, 1000)
    }, 28000)
    return () => clearInterval(id)
  }, [bgEnabled, bgSelectedPhoto])

  if (!bgEnabled) return null

  const photo = bgSelectedPhoto === 'auto' ? PHOTOS[idx] : bgSelectedPhoto

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `url(${BASE}images/${photo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fading ? 0 : 0.08,
        transition: 'opacity 1s ease-in-out',
      }}
    />
  )
}
