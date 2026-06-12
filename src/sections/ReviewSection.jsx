import { useState, useRef } from 'react'
import { Save, Check, Star, Camera, Trash2, Plus, Image } from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'
import useStore from '../store/useStore'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist w-full'

const RATING_ASPECTS = [
  { key: 'hotel', label: 'Smeštaj', emoji: '🏨' },
  { key: 'food', label: 'Hrana', emoji: '🍽️' },
  { key: 'transport', label: 'Prevoz', emoji: '✈️' },
  { key: 'activities', label: 'Aktivnosti', emoji: '🎯' },
  { key: 'valueForMoney', label: 'Vrednost za novac', emoji: '💰' },
]

const WOULD_GO_AGAIN = [
  { id: 'yes', label: 'Definitivno da!', emoji: '🤩', color: 'bg-green-100 text-green-700 border-green-300' },
  { id: 'maybe', label: 'Možda', emoji: '🤔', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'no', label: 'Ne bih', emoji: '😕', color: 'bg-red-100 text-red-700 border-red-300' },
]

function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0)
  const sz = size === 'sm' ? 18 : 24
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star === value ? 0 : star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={sz}
            className={`transition-colors ${
              star <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-mist'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function ratingLabel(r) {
  return ['', 'Loše', 'Ispod proseka', 'Prosečno', 'Odlično', 'Savršeno!'][r] || ''
}

export default function ReviewSection({ trip }) {
  const updateReview = useStore((s) => s.updateReview)
  const addReviewPhoto = useStore((s) => s.addReviewPhoto)
  const deleteReviewPhoto = useStore((s) => s.deleteReviewPhoto)
  const couple = useStore((s) => s.couple)

  const review = trip.review || {}
  const [form, setForm] = useState({
    overallRating: review.overallRating || 0,
    summary: review.summary || '',
    bestMoment: review.bestMoment || '',
    wouldChange: review.wouldChange || '',
    wouldGoAgain: review.wouldGoAgain || '',
    ratings: {
      hotel: review.ratings?.hotel || 0,
      food: review.ratings?.food || 0,
      transport: review.ratings?.transport || 0,
      activities: review.ratings?.activities || 0,
      valueForMoney: review.ratings?.valueForMoney || 0,
    },
  })
  const [saved, setSaved] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoCaption, setPhotoCaption] = useState('')
  const [showPhotoForm, setShowPhotoForm] = useState(false)
  const [uploadPreview, setUploadPreview] = useState(null)
  const fileRef = useRef()

  const photos = review.photos || []
  const expenses = trip.expenses || []
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const currency = trip.budget?.currency || 'EUR'
  const numDays = differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1
  const placesVisited = (trip.places || []).filter((p) => p.visited).length
  const activitiesDone = (trip.itinerary || []).reduce((s, d) => s + d.activities.filter((a) => a.done).length, 0)
  const memoriesCount = (trip.memories || []).length

  const handleSave = () => {
    updateReview(trip.id, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleAddUrl = () => {
    if (!photoUrl.trim()) return
    addReviewPhoto(trip.id, { url: photoUrl.trim(), caption: photoCaption.trim(), type: 'url' })
    setPhotoUrl('')
    setPhotoCaption('')
    setShowPhotoForm(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Slika je prevelika (max 2MB). Koristite manji fajl ili nalepite URL sa Google Photos.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      // Compress via canvas
      const img = document.createElement('img')
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 800
        let w = img.width, h = img.height
        if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX }
        else if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        const compressed = canvas.toDataURL('image/jpeg', 0.75)
        addReviewPhoto(trip.id, { url: compressed, caption: '', type: 'upload' })
        setUploadPreview(null)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const avgRating = (() => {
    const vals = Object.values(form.ratings).filter((v) => v > 0)
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null
  })()

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-terra to-purple-600 rounded-2xl p-5 text-white">
        <div className="text-sm font-medium text-terra-light mb-1">Putovanje završeno</div>
        <h2 className="text-xl font-extrabold mb-1">{trip.title}</h2>
        <div className="text-terra-light text-sm">{trip.destination} · {numDays} dana</div>
        <div className="grid grid-cols-4 gap-3 mt-4">
          <MiniStat value={totalSpent > 0 ? `${totalSpent.toFixed(0)} ${currency}` : '—'} label="Potrošeno" />
          <MiniStat value={activitiesDone} label="Aktivnosti" />
          <MiniStat value={placesVisited} label="Mesta" />
          <MiniStat value={memoriesCount} label="Uspomena" />
        </div>
      </div>

      {/* Overall rating */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ink">Opšta ocena putovanja</h3>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              saved ? 'bg-green-100 text-green-700' : 'bg-terra text-white hover:bg-terra-light'
            }`}
          >
            {saved ? <><Check size={13} /> Sačuvano</> : <><Save size={13} /> Sačuvaj</>}
          </button>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <StarRating value={form.overallRating} onChange={(v) => setForm((f) => ({ ...f, overallRating: v }))} />
          {form.overallRating > 0 && (
            <span className="text-amber-500 font-bold text-lg">{form.overallRating}/5</span>
          )}
        </div>
        {form.overallRating > 0 && (
          <p className="text-sm text-mist">{['', '😕 Loše', '😐 Ispod proseka', '🙂 Solidno', '😊 Odlično', '🤩 Savršeno putovanje!'][form.overallRating]}</p>
        )}
      </div>

      {/* Category ratings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <h3 className="font-bold text-ink mb-4">Ocene po kategorijama</h3>
        <div className="space-y-3">
          {RATING_ASPECTS.map((aspect) => (
            <div key={aspect.key} className="flex items-center gap-3">
              <span className="text-xl w-7">{aspect.emoji}</span>
              <span className="text-sm text-ink-light w-36">{aspect.label}</span>
              <StarRating
                size="sm"
                value={form.ratings[aspect.key]}
                onChange={(v) => setForm((f) => ({ ...f, ratings: { ...f.ratings, [aspect.key]: v } }))}
              />
              {form.ratings[aspect.key] > 0 && (
                <span className="text-xs text-mist">{ratingLabel(form.ratings[aspect.key])}</span>
              )}
            </div>
          ))}
        </div>
        {avgRating && (
          <div className="mt-4 pt-3 border-t border-linen flex items-center gap-2">
            <span className="text-sm text-mist">Prosek kategorija:</span>
            <span className="font-bold text-amber-500">{avgRating} ⭐</span>
          </div>
        )}
      </div>

      {/* Would go again */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <h3 className="font-bold text-ink mb-3">Da li biste ponovo?</h3>
        <div className="flex gap-3">
          {WOULD_GO_AGAIN.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setForm((f) => ({ ...f, wouldGoAgain: f.wouldGoAgain === opt.id ? '' : opt.id }))}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                form.wouldGoAgain === opt.id ? opt.color + ' border-current' : 'bg-parchment text-mist border-transparent hover:border-linen'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text reviews */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen space-y-4">
        <h3 className="font-bold text-ink">Vaši utisci</h3>
        <div>
          <label className="text-xs text-mist mb-1.5 block font-medium">📝 Kratki rezime putovanja</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            rows={4}
            placeholder={`Opišite putovanje ukratko — atmosfera, šta vas je oduševilo, kako se sve uklopilo...\n\nPrimer: "Rim nas je potpuno očarao. Svaki kutak gradi priča za sebe..."`}
            className={`${inp} resize-none`}
          />
        </div>
        <div>
          <label className="text-xs text-mist mb-1.5 block font-medium">🌟 Najbolji momenat putovanja</label>
          <textarea
            value={form.bestMoment}
            onChange={(e) => setForm((f) => ({ ...f, bestMoment: e.target.value }))}
            rows={3}
            placeholder="Koji trenutak vam je ostao najdublje u sećanju? Zalazak sunca, poseban restoran, spontana avantura..."
            className={`${inp} resize-none`}
          />
        </div>
        <div>
          <label className="text-xs text-mist mb-1.5 block font-medium">🔄 Šta biste uradili drugačije</label>
          <textarea
            value={form.wouldChange}
            onChange={(e) => setForm((f) => ({ ...f, wouldChange: e.target.value }))}
            rows={3}
            placeholder="Saveti za sledeći put — šta biste promenili, bolje isplanirali, izostavili ili dodali..."
            className={`${inp} resize-none`}
          />
        </div>
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            saved ? 'bg-green-100 text-green-700' : 'bg-terra text-white hover:bg-terra-light'
          }`}
        >
          {saved ? <><Check size={14} /> Sačuvano!</> : <><Save size={14} /> Sačuvaj utiske</>}
        </button>
      </div>

      {/* Photo gallery */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-ink">📸 Foto galerija odmora</h3>
            <p className="text-xs text-mist mt-0.5">{photos.length} fotografija</p>
          </div>
          <button
            onClick={() => setShowPhotoForm(!showPhotoForm)}
            className="flex items-center gap-1 text-sm bg-purple-600 text-white px-3 py-1.5 rounded-full hover:bg-purple-700 transition-colors"
          >
            <Plus size={14} /> Dodaj foto
          </button>
        </div>

        {showPhotoForm && (
          <div className="bg-purple-50 rounded-xl p-4 mb-4 space-y-3">
            {/* File upload */}
            <div>
              <p className="text-xs font-medium text-purple-700 mb-2">📤 Učitaj sa uređaja (max 2MB)</p>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-purple-200 rounded-xl p-4 text-center cursor-pointer hover:border-purple-400 transition-colors"
              >
                <Camera size={20} className="text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-mist">Klikni da odabereš sliku</p>
                <p className="text-xs text-mist">JPG, PNG — max 2MB (automatski se kompresuje)</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-linen" />
              <span className="text-xs text-mist">ili</span>
              <div className="flex-1 h-px bg-linen" />
            </div>

            {/* URL input */}
            <div>
              <p className="text-xs font-medium text-purple-700 mb-2">🔗 Nalepi link (Google Photos, Imgur...)</p>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://... (link do slike)"
                className={inp}
              />
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Opis fotografije (opciono)"
                className={`${inp} mt-2`}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleAddUrl} className="flex-1 bg-purple-600 text-white text-sm py-2 rounded-xl hover:bg-purple-700 font-medium">
                  Dodaj link
                </button>
                <button onClick={() => setShowPhotoForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2 rounded-xl hover:bg-parchment">
                  Otkaži
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">
                <strong>💡 Savet za Google Photos:</strong> Otvori sliku → "Podeli" → "Kopiraj link" → nalepi ovde.
                Fajlovi učitani direktno čuvaju se u browseru (max ~20-30 slika).
              </p>
            </div>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="text-center py-10 bg-parchment rounded-xl border-2 border-dashed border-linen">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-mist text-sm">Nema fotografija</p>
            <p className="text-xs text-mist mt-1">Dodaj slike sa odmora da napraviš galeriju</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-linen aspect-square">
                <img
                  src={photo.url}
                  alt={photo.caption || trip.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-mist text-xs p-2 text-center">Slika nije dostupna</div>'
                  }}
                />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    {photo.caption}
                  </div>
                )}
                <button
                  onClick={() => deleteReviewPhoto(trip.id, photo.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary card — show only if review filled in */}
      {(form.overallRating > 0 || form.summary) && (
        <div className="bg-gradient-to-br from-ink to-ink-light rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-extrabold text-lg">{trip.title}</h3>
              <p className="text-mist text-sm">{trip.destination} · {format(parseISO(trip.startDate), 'dd.MM.yyyy')} — {format(parseISO(trip.endDate), 'dd.MM.yyyy')}</p>
            </div>
            {form.overallRating > 0 && (
              <div className="text-right">
                <div className="text-3xl font-extrabold text-amber-400">{form.overallRating}.0</div>
                <div className="text-xs text-mist">/ 5.0</div>
              </div>
            )}
          </div>
          {form.summary && <p className="text-white/70 text-sm leading-relaxed italic">"{form.summary}"</p>}
          {form.wouldGoAgain && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-sm text-mist">Da li biste ponovo: </span>
              <span className="font-semibold">{WOULD_GO_AGAIN.find((w) => w.id === form.wouldGoAgain)?.emoji} {WOULD_GO_AGAIN.find((w) => w.id === form.wouldGoAgain)?.label}</span>
            </div>
          )}
          <div className="mt-3 text-xs text-mist text-right">{couple.name1} & {couple.name2}</div>
        </div>
      )}
    </div>
  )
}

function MiniStat({ value, label }) {
  return (
    <div className="bg-white/15 rounded-xl p-2.5 text-center">
      <div className="font-extrabold text-base">{value}</div>
      <div className="text-terra-light text-xs">{label}</div>
    </div>
  )
}
