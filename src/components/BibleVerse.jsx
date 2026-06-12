import { useState, useEffect } from 'react'

const VERSES = [
  { text: 'Ljubav je strpljiva, dobrostiva je; ljubav ne zavidi, ne hvali se, ne uzdiže se.', ref: '1. Kor. 13:4' },
  { text: 'Volite jedni druge kao što sam ja vas volio.', ref: 'Jov. 15:12' },
  { text: 'Dvoje je bolje nego jedno, jer imaju dobru nagradu za trud.', ref: 'Prop. 4:9' },
  { text: 'Ljubav ne prestaje nikada.', ref: '1. Kor. 13:8' },
  { text: 'Moj je voljeni moj, i ja sam njegova.', ref: 'Pes. nad Pes. 2:16' },
  { text: 'Gde ti pođeš, i ja ću poći; gde ti umreš, i ja ću umreti. Tvoj narod biće moj narod.', ref: 'Ruta 1:16' },
  { text: 'Jaka je kao smrt ljubav; tvrda kao pakao ljubomora. Njeni žari — žari su ognjeni.', ref: 'Pes. nad Pes. 8:6' },
  { text: 'Bog je ljubav, i ko ostaje u ljubavi, u Bogu ostaje, i Bog u njemu.', ref: '1. Jov. 4:16' },
  { text: 'Sve podnosite, svemu verujete, svemu se nadate, sve trpite.', ref: '1. Kor. 13:7' },
  { text: 'Blaženi čisti srcem, jer će oni Boga videti.', ref: 'Mat. 5:8' },
]

export default function BibleVerse() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * VERSES.length))
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % VERSES.length)
        setVisible(true)
      }, 700)
    }, 20000)
    return () => clearInterval(id)
  }, [])

  const verse = VERSES[idx]

  return (
    <div
      className="fixed bottom-4 right-4 max-w-[200px] z-30 pointer-events-none select-none"
      style={{ opacity: visible ? 0.5 : 0, transition: 'opacity 0.7s ease-in-out' }}
    >
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-linen shadow-sm">
        <p className="text-[11px] font-display italic text-ink-light leading-relaxed mb-1.5">
          &ldquo;{verse.text}&rdquo;
        </p>
        <p className="text-[9px] text-mist font-medium text-right tracking-wide">{verse.ref}</p>
      </div>
    </div>
  )
}
