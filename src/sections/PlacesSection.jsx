import { useState, useRef } from 'react'
import { Plus, Trash2, Check, MapPin, Clock, Upload, Link as LinkIcon, Image, Lightbulb } from 'lucide-react'
import useStore from '../store/useStore'
import { usePlaceSuggestions } from '../hooks/useSuggestions'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white placeholder-mist w-full'

const CATEGORIES = [
  { id: 'attraction', label: 'Atrakcija', emoji: '🏛️' },
  { id: 'restaurant', label: 'Restoran', emoji: '🍽️' },
  { id: 'cafe', label: 'Cafe / Bar', emoji: '☕' },
  { id: 'photospot', label: 'Foto spot', emoji: '📸' },
  { id: 'shopping', label: 'Kupovina', emoji: '🛍️' },
  { id: 'beach', label: 'Plaža', emoji: '🏖️' },
  { id: 'nightlife', label: 'Noćni život', emoji: '🎶' },
  { id: 'nature', label: 'Priroda', emoji: '🌿' },
  { id: 'other', label: 'Ostalo', emoji: '📍' },
]

const PRICE_LEVELS = [
  { id: '1', label: '€', title: 'Jeftino' },
  { id: '2', label: '€€', title: 'Srednje' },
  { id: '3', label: '€€€', title: 'Skuplje' },
  { id: '4', label: '€€€€', title: 'Luksuz' },
]

const EMPTY = { name: '', category: 'restaurant', address: '', hours: '', priceLevel: '2', rating: '', notes: '', website: '', phone: '', mustSee: false, tip: '', photoUrl: '' }

function compressImage(file, cb) {
  if (file.size > 10 * 1024 * 1024) { alert('Slika je prevelika (max 10MB).'); return }
  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = document.createElement('img')
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX = 800
      let w = img.width, h = img.height
      if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX }
      else if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      cb(canvas.toDataURL('image/jpeg', 0.78))
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

export default function PlacesSection({ trip }) {
  const addPlace = useStore((s) => s.addPlace)
  const updatePlace = useStore((s) => s.updatePlace)
  const deletePlace = useStore((s) => s.deletePlace)

  const places = trip.places || []
  const [viewTab, setViewTab] = useState('my')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [filter, setFilter] = useState('all')
  const [filterCat, setFilterCat] = useState('all')
  const [photoTab, setPhotoTab] = useState('upload')
  const [added, setAdded] = useState(new Set())
  const fileRef = useRef()

  const { loading: sugLoading, places: sugPlaces } = usePlaceSuggestions(trip.destination)

  const filtered = places.filter((p) => {
    if (filter === 'visited') return p.visited
    if (filter === 'pending') return !p.visited
    if (filterCat !== 'all') return p.category === filterCat
    return true
  })

  const handleAdd = () => {
    if (!form.name.trim()) return
    addPlace(trip.id, { ...form, name: form.name.trim() })
    setForm(EMPTY); setShowForm(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    compressImage(file, (dataUrl) => setForm((f) => ({ ...f, photoUrl: dataUrl })))
    e.target.value = ''
  }

  const visitedCount = places.filter((p) => p.visited).length
  const mustSeeCount = places.filter((p) => p.mustSee && !p.visited).length

  function handleAddSuggestion(p) {
    addPlace(trip.id, {
      name: p.name, category: p.category, address: '', priceLevel: p.priceLevel || '2',
      notes: p.description?.slice(0, 200) || '', mustSee: false, tip: '',
      photoUrl: p.imageUrl || '', rating: '', hours: '', website: '', phone: '',
    })
    setAdded((prev) => new Set([...prev, p.id]))
  }

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-linen shadow-sm">
        <button onClick={() => setViewTab('my')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${viewTab === 'my' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}>
          📍 Moja lista
        </button>
        <button onClick={() => setViewTab('suggest')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${viewTab === 'suggest' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}>
          <Lightbulb size={14} /> Predlozi
        </button>
      </div>

      {/* SUGGESTIONS TAB */}
      {viewTab === 'suggest' && (
        <div className="space-y-3">
          <p className="text-xs text-mist">Predlozi za <strong className="text-ink">{trip.destination}</strong> — izvor: Wikipedia. Kliknite &ldquo;Dodaj&rdquo; da dodate na svoju listu.</p>
          {sugLoading && (
            <div className="space-y-2">
              {[1,2,3,4].map((i) => <div key={i} className="h-20 bg-linen rounded-2xl animate-pulse" />)}
            </div>
          )}
          {!sugLoading && sugPlaces.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-linen">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-mist text-sm">Nema predloga za ovu destinaciju</p>
            </div>
          )}
          {!sugLoading && sugPlaces.map((p) => {
            const cat = CATEGORIES.find((c) => c.id === p.category) || CATEGORIES.at(-1)
            const isAdded = added.has(p.id)
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-linen shadow-sm overflow-hidden flex gap-3 p-3">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center text-2xl flex-shrink-0">{cat.emoji}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink text-sm truncate">{p.name}</p>
                      <span className="text-[10px] text-mist bg-linen px-1.5 py-0.5 rounded-full">{cat.emoji} {cat.label}</span>
                    </div>
                    <button
                      onClick={() => handleAddSuggestion(p)}
                      disabled={isAdded}
                      className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${isAdded ? 'bg-green-100 text-green-700' : 'bg-forest text-white hover:bg-forest-light'}`}
                    >
                      {isAdded ? '✓ Dodato' : 'Dodaj'}
                    </button>
                  </div>
                  <p className="text-xs text-mist mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MY LIST TAB */}
      {viewTab === 'my' && <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">📍 Mesta, restorani & foto spotovi</h2>
          <p className="text-xs text-mist mt-0.5">{visitedCount}/{places.length} posećeno{mustSeeCount > 0 ? ` · ${mustSeeCount} must-see preostalo` : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-sm bg-gold text-[#131918] px-3 py-1.5 rounded-full hover:bg-gold-light transition-colors font-semibold">
          <Plus size={14} /> Dodaj
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen space-y-3">
          <h3 className="font-semibold text-ink">Novo mesto</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-mist mb-1 block">Naziv *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="npr. Trevi fontana" className={inp} autoFocus />
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Kategorija</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
          </div>
          <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Adresa" className={inp} />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} placeholder="Radno vreme" className={inp} />
            <div className="flex gap-1">
              {PRICE_LEVELS.map((p) => (
                <button key={p.id} type="button" onClick={() => setForm((f) => ({ ...f, priceLevel: p.id }))} title={p.title}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${form.priceLevel === p.id ? 'bg-gold text-white' : 'bg-linen text-mist hover:bg-linen'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} placeholder="Ocena (npr. 4.8 ⭐)" className={inp} />
            <input type="text" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="Website / Instagram" className={inp} />
          </div>
          <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Telefon za rezervaciju" className={inp} />
          <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Opis, šta poručiti, posebni saveti..." className={`${inp} resize-none`} />
          <textarea value={form.tip} onChange={(e) => setForm((f) => ({ ...f, tip: e.target.value }))} rows={1} placeholder="💡 Pro tip" className={`${inp} resize-none`} />
          <div>
            <label className="text-xs text-mist mb-2 block flex items-center gap-1"><Image size={12} /> Fotografija mesta (opciono)</label>
            <div className="flex gap-1 mb-2">
              <button onClick={() => setPhotoTab('upload')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${photoTab === 'upload' ? 'bg-forest text-white' : 'bg-parchment text-mist border border-linen'}`}>
                <Upload size={11} /> Upload
              </button>
              <button onClick={() => setPhotoTab('url')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${photoTab === 'url' ? 'bg-forest text-white' : 'bg-parchment text-mist border border-linen'}`}>
                <LinkIcon size={11} /> URL
              </button>
            </div>
            {photoTab === 'upload' ? (
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                {form.photoUrl ? (
                  <div className="relative">
                    <img src={form.photoUrl} alt="" className="w-full h-32 object-cover rounded-xl" />
                    <button onClick={() => setForm((f) => ({ ...f, photoUrl: '' }))} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">×</button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-linen rounded-xl py-4 text-sm text-mist hover:border-forest hover:text-forest transition-colors flex flex-col items-center gap-1">
                    <Upload size={18} /><span>Izaberi fotografiju</span>
                  </button>
                )}
              </div>
            ) : (
              <input type="text" value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} placeholder="URL fotografije" className={inp} />
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-light cursor-pointer">
            <input type="checkbox" checked={form.mustSee} onChange={(e) => setForm((f) => ({ ...f, mustSee: e.target.checked }))} className="rounded" />
            ⭐ Must-see / Ne sme da se propusti
          </label>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-gold text-[#131918] text-sm py-2.5 rounded-xl hover:bg-gold-light font-semibold">Dodaj mesto</button>
            <button onClick={() => setShowForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2.5 rounded-xl hover:bg-parchment">Otkaži</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {[['all','Sve'],['pending','Neposećeno'],['visited','Posećeno']].map(([val, label]) => (
            <button key={val} onClick={() => { setFilter(val); setFilterCat('all') }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === val && filterCat === 'all' ? 'bg-gold text-white' : 'bg-white border border-linen text-ink-light hover:border-gold'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => { setFilterCat(c.id); setFilter('all') }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === c.id ? 'bg-ink text-white' : 'bg-white border border-linen text-ink-light hover:border-ink'}`}>
              {c.emoji}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-linen">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-mist text-sm">Nema mesta u ovoj kategoriji</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((place) => {
            const cat = CATEGORIES.find((c) => c.id === place.category) || CATEGORIES.at(-1)
            return (
              <div key={place.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all ${place.visited ? 'border-green-200 opacity-75' : place.mustSee ? 'border-gold/50' : 'border-linen hover:shadow-md'}`}>
                {place.photoUrl && (
                  <img src={place.photoUrl} alt={place.name} className="w-full h-40 object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                )}
                <div className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{cat.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-ink ${place.visited ? 'line-through text-mist' : ''}`}>{place.name}</span>
                      {place.mustSee && !place.visited && <span className="text-xs bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full font-medium">⭐ Must-see</span>}
                      {place.visited && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Posećeno</span>}
                    </div>
                    {place.address && <div className="flex items-center gap-1 text-xs text-mist mt-1"><MapPin size={10} />{place.address}</div>}
                    <div className="flex flex-wrap gap-3 mt-1">
                      {place.hours && <span className="text-xs text-mist flex items-center gap-0.5"><Clock size={10} />{place.hours}</span>}
                      {place.priceLevel && <span className="text-xs text-gold-dark font-medium">{PRICE_LEVELS.find((p) => p.id === place.priceLevel)?.label}</span>}
                      {place.rating && <span className="text-xs text-mist">{place.rating}</span>}
                    </div>
                    {place.notes && <p className="text-xs text-ink-light mt-1">{place.notes}</p>}
                    {place.tip && <p className="text-xs text-gold-dark bg-gold/10 rounded-lg px-2 py-1 mt-1">💡 {place.tip}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => updatePlace(trip.id, place.id, { visited: !place.visited })} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${place.visited ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-parchment text-mist hover:bg-green-100 hover:text-green-600'}`}>
                      <Check size={13} />
                    </button>
                    <button onClick={() => deletePlace(trip.id, place.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-mist hover:text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      </>}
    </div>
  )
}
