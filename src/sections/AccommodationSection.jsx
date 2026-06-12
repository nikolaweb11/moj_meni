import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Wifi, Phone, MapPin } from 'lucide-react'
import useStore from '../store/useStore'

const inp = 'border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white placeholder-slate-400 w-full'

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

export default function AccommodationSection({ trip }) {
  const addAccommodation = useStore((s) => s.addAccommodation)
  const updateAccommodation = useStore((s) => s.updateAccommodation)
  const deleteAccommodation = useStore((s) => s.deleteAccommodation)

  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const accommodations = trip.accommodations || []

  const handleAdd = () => {
    if (!form.name) return
    addAccommodation(trip.id, form)
    setForm(EMPTY)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800">🏨 Smeštaj</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-sm bg-emerald-500 text-white px-3 py-1.5 rounded-full hover:bg-emerald-600 transition-colors">
          <Plus size={14} /> Dodaj smeštaj
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-700">Novi smeštaj</h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Tip smeštaja</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={inp}>
                {TYPES.map((t) => <option key={t} value={t}>{TYPE_EMOJI[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Naziv *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Hotel Roma" className={inp} />
            </div>
          </div>

          <div>
            <label className="label">Adresa</label>
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
              <label className="label">Rezervacioni kod</label>
              <input type="text" value={form.bookingRef} onChange={(e) => setForm((f) => ({ ...f, bookingRef: e.target.value }))} placeholder="npr. Booking.com ref" className={inp} />
            </div>
            <div>
              <label className="label">Potvrdni broj</label>
              <input type="text" value={form.confirmationNumber} onChange={(e) => setForm((f) => ({ ...f, confirmationNumber: e.target.value }))} placeholder="Broj potvrde" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="label">Tip sobe</label>
              <input type="text" value={form.roomType} onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))} placeholder="npr. Deluxe Double" className={inp} />
            </div>
            <div>
              <label className="label">Sprat</label>
              <input type="text" value={form.floor} onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))} placeholder="npr. 3" className={inp} />
            </div>
            <div>
              <label className="label">Broj sobe</label>
              <input type="text" value={form.roomNumber} onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))} placeholder="npr. 312" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-blue-50 rounded-xl p-3">
            <div>
              <label className="label">📶 WiFi mreža</label>
              <input type="text" value={form.wifiNetwork} onChange={(e) => setForm((f) => ({ ...f, wifiNetwork: e.target.value }))} placeholder="Naziv WiFi mreže" className={inp} />
            </div>
            <div>
              <label className="label">🔐 WiFi lozinka</label>
              <input type="text" value={form.wifiPassword} onChange={(e) => setForm((f) => ({ ...f, wifiPassword: e.target.value }))} placeholder="Lozinka" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Telefon recepcije</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+39 06 123 4567" className={inp} />
            </div>
            <div>
              <label className="label">Website</label>
              <input type="text" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="www.hotel.com" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Ukupna cena</label>
              <input type="text" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} placeholder="npr. 350 EUR" className={inp} />
            </div>
            <div>
              <label className="label">Sadržaji / amenities</label>
              <input type="text" value={form.amenities} onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))} placeholder="Bazen, spa, doručak..." className={inp} />
            </div>
          </div>

          <div>
            <label className="label">Napomene</label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Posebni zahtevi, parking, kasni check-in..." className={`${inp} resize-none`} />
          </div>

          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-emerald-500 text-white text-sm py-2.5 rounded-xl hover:bg-emerald-600 font-medium">Sačuvaj smeštaj</button>
            <button onClick={() => setShowForm(false)} className="px-4 border border-slate-200 text-slate-600 text-sm py-2.5 rounded-xl hover:bg-slate-50">Otkaži</button>
          </div>
        </div>
      )}

      {accommodations.length === 0 && !showForm && (
        <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-2">🏨</div>
          <p className="text-slate-400 text-sm">Nema unetog smeštaja</p>
        </div>
      )}

      <div className="space-y-3">
        {accommodations.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {TYPE_EMOJI[a.type] || '🏨'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800">{a.name}</div>
                <div className="text-xs text-slate-400">
                  Check-in: {a.checkIn} {a.checkInTime} · Check-out: {a.checkOut} {a.checkOutTime}
                </div>
                {a.address && <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} />{a.address}</div>}
              </div>
              {expanded === a.id ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
            </div>

            {expanded === a.id && (
              <div className="border-t border-slate-100 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {a.bookingRef && <D label="Rezervacioni kod" value={a.bookingRef} />}
                  {a.confirmationNumber && <D label="Potvrdni broj" value={a.confirmationNumber} />}
                  {a.roomType && <D label="Tip sobe" value={a.roomType} />}
                  {a.roomNumber && <D label="Soba" value={`Sprat ${a.floor || '?'}, br. ${a.roomNumber}`} />}
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
                <div className="pt-1 border-t border-slate-50">
                  <button onClick={() => deleteAccommodation(trip.id, a.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600">
                    <Trash2 size={12} /> Obriši smeštaj
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function D({ label, value }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-medium text-slate-700">{value}</div>
    </div>
  )
}
