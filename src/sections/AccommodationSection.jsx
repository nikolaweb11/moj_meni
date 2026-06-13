import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Wifi, MapPin, Moon, AlertTriangle } from 'lucide-react'
import { differenceInDays, parseISO, isWithinInterval, addDays, format, isValid } from 'date-fns'
import useStore from '../store/useStore'
import { useAccommodationSuggestions, getAccommodationTips } from '../hooks/useSuggestions'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white placeholder-slate-400 w-full'

const EMPTY = {
  type: 'hotel', name: '', address: '',
  checkIn: '', checkInTime: '14:00',
  checkOut: '', checkOutTime: '11:00',
  bookingRef: '', confirmationNumber: '',
  phone: '', website: '',
  roomType: '', floor: '', roomNumber: '',
  wifiNetwork: '', wifiPassword: '',
  cost: '', currency: 'EUR',
  notes: '', amenities: '',
}

const TYPES = ['hotel', 'airbnb', 'hostel', 'villa', 'apartman', 'resort']
const TYPE_EMOJI = { hotel: '🏨', airbnb: '🏠', hostel: '🛏️', villa: '🏡', apartman: '🏢', resort: '🏖️' }
const TYPE_LABEL = { hotel: 'Hotel', airbnb: 'Airbnb', hostel: 'Hostel', villa: 'Vila', apartman: 'Apartman', resort: 'Resort' }

const PALETTE = ['#2D4A3E', '#8B5E3C', '#C4932A', '#4A5568', '#6B46C1', '#0D7377']

function nightsCount(checkIn, checkOut) {
  try {
    const d = differenceInDays(parseISO(checkOut), parseISO(checkIn))
    return d > 0 ? d : null
  } catch { return null }
}

export default function AccommodationSection({ trip }) {
  const addAccommodation = useStore((s) => s.addAccommodation)
  const updateAccommodation = useStore((s) => s.updateAccommodation)
  const deleteAccommodation = useStore((s) => s.deleteAccommodation)

  const [tab, setTab] = useState('mine')
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const accommodations = [...(trip.accommodations || [])].sort((a, b) => {
    if (!a.checkIn) return 1
    if (!b.checkIn) return -1
    return a.checkIn < b.checkIn ? -1 : 1
  })

  const handleAdd = () => {
    if (!form.name) return
    addAccommodation(trip.id, form)
    setForm(EMPTY)
    setShowForm(false)
  }

  const totalNights = accommodations.reduce((s, a) => s + (nightsCount(a.checkIn, a.checkOut) || 0), 0)

  // Build gap analysis
  const gaps = []
  if (trip.startDate && trip.endDate && accommodations.length > 0) {
    const tripStart = parseISO(trip.startDate)
    const tripEnd = parseISO(trip.endDate)
    const numDays = differenceInDays(tripEnd, tripStart) + 1

    for (let i = 0; i < numDays; i++) {
      const day = addDays(tripStart, i)
      const covered = accommodations.some((a) => {
        if (!a.checkIn || !a.checkOut) return false
        try {
          return isWithinInterval(day, { start: parseISO(a.checkIn), end: addDays(parseISO(a.checkOut), -1) })
        } catch { return false }
      })
      if (!covered) gaps.push(format(day, 'dd.MM'))
    }
  }

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-linen shadow-sm">
        <button
          onClick={() => setTab('mine')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'mine' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}
        >
          🏨 Moj smeštaj
        </button>
        <button
          onClick={() => setTab('suggest')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'suggest' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}
        >
          💡 Predlozi
        </button>
      </div>

      {/* Predlozi tab */}
      {tab === 'suggest' && (
        <AccommodationSuggestions destination={trip.destination} />
      )}

      {tab === 'mine' && <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">🏨 Smeštaj tokom putovanja</h2>
          {accommodations.length > 0 && (
            <p className="text-xs text-mist mt-0.5">
              {accommodations.length} {accommodations.length === 1 ? 'lokacija' : 'lokacije'}
              {totalNights > 0 ? ` · ${totalNights} noći ukupno` : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 text-sm bg-forest text-white px-3 py-1.5 rounded-full hover:bg-forest-light transition-colors font-medium"
        >
          <Plus size={14} /> Dodaj smeštaj
        </button>
      </div>

      {/* Gap warning */}
      {gaps.length > 0 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <AlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            <strong>Nedostaje smeštaj za:</strong> {gaps.slice(0, 6).join(', ')}{gaps.length > 6 ? ` i još ${gaps.length - 6}` : ''} — nepokriveni datumi putovanja
          </p>
        </div>
      )}

      {/* Timeline when 2+ accommodations */}
      {accommodations.length >= 2 && trip.startDate && trip.endDate && (
        <AccommodationTimeline trip={trip} accommodations={accommodations} />
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen space-y-3">
          <h3 className="font-display font-semibold text-ink">Novi smeštaj</h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-mist mb-1 block">Tip smeštaja</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={inp}>
                {TYPES.map((t) => <option key={t} value={t}>{TYPE_EMOJI[t]} {TYPE_LABEL[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Naziv *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Hotel Roma" className={inp} autoFocus />
            </div>
          </div>

          <div>
            <label className="text-xs text-mist mb-1 block">Adresa</label>
            <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Via Roma 1, 00100 Roma" className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 bg-green-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-green-700">🔑 Check-in</p>
              <input type="date" value={form.checkIn} onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))} className={inp} />
              <input type="time" value={form.checkInTime} onChange={(e) => setForm((f) => ({ ...f, checkInTime: e.target.value }))} className={inp} />
            </div>
            <div className="space-y-2 bg-rose-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-rose-700">🚪 Check-out</p>
              <input type="date" value={form.checkOut} onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))} className={inp} />
              <input type="time" value={form.checkOutTime} onChange={(e) => setForm((f) => ({ ...f, checkOutTime: e.target.value }))} className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-mist mb-1 block">Rezervacioni kod</label>
              <input type="text" value={form.bookingRef} onChange={(e) => setForm((f) => ({ ...f, bookingRef: e.target.value }))} placeholder="npr. Booking.com ref" className={inp} />
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Potvrdni broj</label>
              <input type="text" value={form.confirmationNumber} onChange={(e) => setForm((f) => ({ ...f, confirmationNumber: e.target.value }))} placeholder="Broj potvrde" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-mist mb-1 block">Tip sobe</label>
              <input type="text" value={form.roomType} onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))} placeholder="Deluxe Double" className={inp} />
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Sprat</label>
              <input type="text" value={form.floor} onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))} placeholder="3" className={inp} />
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Broj sobe</label>
              <input type="text" value={form.roomNumber} onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))} placeholder="312" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-blue-50 rounded-xl p-3">
            <div>
              <label className="text-xs text-mist mb-1 block">📶 WiFi mreža</label>
              <input type="text" value={form.wifiNetwork} onChange={(e) => setForm((f) => ({ ...f, wifiNetwork: e.target.value }))} placeholder="Naziv mreže" className={inp} />
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">🔐 WiFi lozinka</label>
              <input type="text" value={form.wifiPassword} onChange={(e) => setForm((f) => ({ ...f, wifiPassword: e.target.value }))} placeholder="Lozinka" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-mist mb-1 block">Telefon recepcije</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+39 06 123 4567" className={inp} />
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Website</label>
              <input type="text" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="www.hotel.com" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-mist mb-1 block">Ukupna cena</label>
              <input type="text" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} placeholder="350 EUR" className={inp} />
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Sadržaji / amenities</label>
              <input type="text" value={form.amenities} onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))} placeholder="Bazen, spa, doručak..." className={inp} />
            </div>
          </div>

          <div>
            <label className="text-xs text-mist mb-1 block">Napomene</label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Posebni zahtevi, parking, kasni check-in..." className={`${inp} resize-none`} />
          </div>

          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-forest text-white text-sm py-2.5 rounded-xl hover:bg-forest-light font-medium transition-colors">Sačuvaj smeštaj</button>
            <button onClick={() => setShowForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2.5 rounded-xl hover:bg-parchment">Otkaži</button>
          </div>
        </div>
      )}

      {accommodations.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-linen">
          <div className="text-4xl mb-2">🏨</div>
          <p className="font-display font-semibold text-ink-light">Nema unetog smeštaja</p>
          <p className="text-sm text-mist mt-1 mb-4">Dodajte hotel, airbnb ili vilu</p>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-light transition-colors">
            <Plus size={15} /> Dodaj smeštaj
          </button>
        </div>
      )}

      <div className="space-y-3">
        {accommodations.map((a, idx) => {
          const nights = nightsCount(a.checkIn, a.checkOut)
          const color = PALETTE[idx % PALETTE.length]
          return (
            <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-linen overflow-hidden">
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-parchment/50 transition-colors"
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: color + '18' }}>
                  {TYPE_EMOJI[a.type] || '🏨'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold text-ink">{a.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: color }}>
                      {TYPE_LABEL[a.type] || a.type}
                    </span>
                    {nights && (
                      <span className="flex items-center gap-0.5 text-xs text-mist">
                        <Moon size={10} />{nights} {nights === 1 ? 'noć' : 'noći'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-mist mt-0.5">
                    {a.checkIn && <span>Check-in: {a.checkIn} {a.checkInTime}</span>}
                    {a.checkIn && a.checkOut && <span className="mx-1">·</span>}
                    {a.checkOut && <span>Check-out: {a.checkOut} {a.checkOutTime}</span>}
                  </div>
                  {a.address && <div className="text-xs text-mist flex items-center gap-1 mt-0.5"><MapPin size={10} />{a.address}</div>}
                </div>
                {expanded === a.id ? <ChevronUp size={15} className="text-mist flex-shrink-0" /> : <ChevronDown size={15} className="text-mist flex-shrink-0" />}
              </div>

              {expanded === a.id && (
                <div className="border-t border-linen p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {a.bookingRef && <D label="Rezervacioni kod" value={a.bookingRef} />}
                    {a.confirmationNumber && <D label="Potvrdni broj" value={a.confirmationNumber} />}
                    {a.roomType && <D label="Tip sobe" value={a.roomType} />}
                    {a.roomNumber && <D label="Soba" value={`${a.floor ? `Sprat ${a.floor}, ` : ''}br. ${a.roomNumber}`} />}
                    {a.phone && <D label="Recepcija" value={a.phone} />}
                    {a.website && <D label="Website" value={a.website} />}
                    {a.cost && <D label="Cena" value={a.cost} />}
                    {a.amenities && <D label="Sadržaji" value={a.amenities} />}
                  </div>
                  {(a.wifiNetwork || a.wifiPassword) && (
                    <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3">
                      <Wifi size={16} className="text-blue-500 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium text-blue-800">{a.wifiNetwork || 'WiFi'}</div>
                        {a.wifiPassword && <div className="text-blue-600 font-mono text-xs mt-0.5">{a.wifiPassword}</div>}
                      </div>
                    </div>
                  )}
                  {a.notes && <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-800">{a.notes}</div>}
                  <div className="pt-1 border-t border-linen">
                    <button onClick={() => deleteAccommodation(trip.id, a.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={12} /> Obriši smeštaj
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      </>}
    </div>
  )
}

function AccommodationSuggestions({ destination }) {
  const { loading, suggestions } = useAccommodationSuggestions(destination)
  const tips = getAccommodationTips(destination)

  return (
    <div className="space-y-4">
      <div className="bg-forest/5 rounded-2xl p-4 border border-forest/15">
        <p className="text-sm font-semibold text-forest mb-0.5">💡 Predlozi za smeštaj — {destination}</p>
        <p className="text-xs text-mist">Saveti o kvartovima, tipovima smeštaja i rezervacijama</p>
      </div>

      {/* Static tips */}
      <div className="bg-white rounded-2xl border border-linen shadow-sm p-4 space-y-2">
        <p className="text-xs font-semibold text-ink-light uppercase tracking-wider mb-3">Saveti za smeštaj</p>
        {tips.map((tip, i) => (
          <div key={i} className="flex gap-2 text-xs text-ink-light">
            <span className="text-forest mt-0.5 flex-shrink-0">•</span>
            <span className="leading-relaxed">{tip}</span>
          </div>
        ))}
      </div>

      {/* Wikipedia results */}
      <div>
        <p className="text-xs font-semibold text-mist uppercase tracking-wider mb-2 px-1">Kvartovi i oblasti (Wikipedia)</p>
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-linen/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}
        {!loading && suggestions.length === 0 && (
          <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-linen">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-mist text-sm">Nema Wikipedia rezultata za ovu destinaciju</p>
          </div>
        )}
        {!loading && suggestions.length > 0 && (
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-linen shadow-sm p-3 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-sm flex-shrink-0">
                  {s.type === 'neighborhood' ? '🗺️' : '🏨'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm">{s.name}</p>
                  <p className="text-xs text-mist mt-0.5 line-clamp-2 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
        <p className="text-xs text-amber-700">
          <strong>Preporučene platforme:</strong> Booking.com, Airbnb, Hotels.com, Hostelworld. Uvek proverite recenzije pre rezervacije.
        </p>
      </div>
    </div>
  )
}

function AccommodationTimeline({ trip, accommodations }) {
  const tripStart = parseISO(trip.startDate)
  const tripEnd = parseISO(trip.endDate)
  const numDays = differenceInDays(tripEnd, tripStart) + 1

  const days = Array.from({ length: numDays }, (_, i) => addDays(tripStart, i))

  function getAccForDay(day) {
    return accommodations.findIndex((a) => {
      if (!a.checkIn || !a.checkOut) return false
      try {
        return isWithinInterval(day, { start: parseISO(a.checkIn), end: addDays(parseISO(a.checkOut), -1) })
      } catch { return false }
    })
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-linen shadow-sm">
      <p className="text-xs font-semibold text-mist uppercase tracking-wider mb-3">Raspored smeštaja</p>
      <div className="flex gap-0.5 overflow-x-auto pb-1">
        {days.map((day, i) => {
          const accIdx = getAccForDay(day)
          const color = accIdx >= 0 ? PALETTE[accIdx % PALETTE.length] : '#E8DED4'
          return (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[28px]">
              <div className="w-full h-6 rounded-md" style={{ backgroundColor: color, opacity: accIdx >= 0 ? 0.85 : 0.4 }} title={accIdx >= 0 ? accommodations[accIdx].name : 'Bez smeštaja'} />
              <span className="text-[9px] text-mist">{i + 1}</span>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        {accommodations.map((a, idx) => (
          <div key={a.id} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }} />
            <span className="text-xs text-ink-light">{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function D({ label, value }) {
  return (
    <div>
      <div className="text-xs text-mist">{label}</div>
      <div className="font-medium text-ink text-sm">{value}</div>
    </div>
  )
}
