import { useState } from 'react'
import { Plus, Trash2, Check, Star, MapPin, Clock, DollarSign } from 'lucide-react'
import useStore from '../store/useStore'

const inp = 'border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white placeholder-slate-400 w-full'

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

const EMPTY = { name: '', category: 'restaurant', address: '', hours: '', priceLevel: '2', rating: '', notes: '', website: '', phone: '', mustSee: false, tip: '' }

export default function PlacesSection({ trip }) {
  const addPlace = useStore((s) => s.addPlace)
  const updatePlace = useStore((s) => s.updatePlace)
  const deletePlace = useStore((s) => s.deletePlace)

  const places = trip.places || []
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [filter, setFilter] = useState('all')
  const [filterCat, setFilterCat] = useState('all')

  const filtered = places.filter((p) => {
    if (filter === 'visited') return p.visited
    if (filter === 'pending') return !p.visited
    if (filterCat !== 'all') return p.category === filterCat
    return true
  })

  const handleAdd = () => {
    if (!form.name.trim()) return
    addPlace(trip.id, { ...form, name: form.name.trim() })
    setForm(EMPTY)
    setShowForm(false)
  }

  const visitedCount = places.filter((p) => p.visited).length
  const mustSeeCount = places.filter((p) => p.mustSee && !p.visited).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800">📍 Mesta, restorani & foto spotovi</h2>
          <p className="text-xs text-slate-400 mt-0.5">{visitedCount}/{places.length} posećeno {mustSeeCount > 0 && `· ${mustSeeCount} must-see preostalo`}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-sm bg-amber-500 text-white px-3 py-1.5 rounded-full hover:bg-amber-600 transition-colors">
          <Plus size={14} /> Dodaj
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-700">Novo mesto</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Naziv *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="npr. Trevi fontana" className={inp} autoFocus />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Kategorija</label>
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
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${form.priceLevel === p.id ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
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
          <textarea value={form.tip} onChange={(e) => setForm((f) => ({ ...f, tip: e.target.value }))} rows={1} placeholder="💡 Pro tip (npr. Dođi pre 8h da nema reda)" className={`${inp} resize-none`} />
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={form.mustSee} onChange={(e) => setForm((f) => ({ ...f, mustSee: e.target.checked }))} className="rounded" />
            ⭐ Must-see / Ne sme da se propusti
          </label>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-amber-500 text-white text-sm py-2.5 rounded-xl hover:bg-amber-600 font-medium">Dodaj mesto</button>
            <button onClick={() => setShowForm(false)} className="px-4 border border-slate-200 text-slate-600 text-sm py-2.5 rounded-xl hover:bg-slate-50">Otkaži</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {[['all','Sve'],['pending','Neposećeno'],['visited','Posećeno']].map(([val, label]) => (
            <button key={val} onClick={() => { setFilter(val); setFilterCat('all') }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === val && filterCat === 'all' ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => { setFilterCat(c.id); setFilter('all') }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === c.id ? 'bg-slate-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {c.emoji}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-slate-400 text-sm">Nema mesta u ovoj kategoriji</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((place) => {
            const cat = CATEGORIES.find((c) => c.id === place.category) || CATEGORIES.at(-1)
            return (
              <div key={place.id} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${place.visited ? 'border-green-200 opacity-75' : place.mustSee ? 'border-amber-300' : 'border-slate-100 hover:shadow-md'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{cat.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-slate-800 ${place.visited ? 'line-through text-slate-400' : ''}`}>{place.name}</span>
                      {place.mustSee && !place.visited && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⭐ Must-see</span>}
                      {place.visited && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Posećeno</span>}
                    </div>
                    {place.address && <div className="flex items-center gap-1 text-xs text-slate-400 mt-1"><MapPin size={10} />{place.address}</div>}
                    <div className="flex flex-wrap gap-3 mt-1">
                      {place.hours && <span className="text-xs text-slate-400 flex items-center gap-0.5"><Clock size={10} />{place.hours}</span>}
                      {place.priceLevel && <span className="text-xs text-amber-600 font-medium">{PRICE_LEVELS.find((p) => p.id === place.priceLevel)?.label}</span>}
                      {place.rating && <span className="text-xs text-slate-400">{place.rating}</span>}
                      {place.phone && <span className="text-xs text-blue-500">{place.phone}</span>}
                    </div>
                    {place.notes && <p className="text-xs text-slate-500 mt-1">{place.notes}</p>}
                    {place.tip && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 mt-1">💡 {place.tip}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => updatePlace(trip.id, place.id, { visited: !place.visited })}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${place.visited ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-slate-100 text-slate-400 hover:bg-green-100 hover:text-green-600'}`}
                      title={place.visited ? 'Označi kao neposećeno' : 'Označi kao posećeno'}
                    >
                      <Check size={13} />
                    </button>
                    <button onClick={() => deletePlace(trip.id, place.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
