import { useState } from 'react'
import { differenceInDays, addDays, parseISO, format } from 'date-fns'
import { Plus, Trash2, Check, ChevronDown, ChevronUp, Clock, MapPin, DollarSign, Tag, Lightbulb } from 'lucide-react'
import useStore from '../store/useStore'
import { getItinerarySuggestions } from '../hooks/useSuggestions'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist w-full'

const DAYS_SR = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']
const MONTHS_SR = ['januara','februara','marta','aprila','maja','juna','jula','avgusta','septembra','oktobra','novembra','decembra']
const CATEGORIES = ['Atrakcija','Restoran','Cafe/Bar','Kupovina','Transport','Hotel','Aktivnost','Plaža','Muzej','Slobodno']
const CAT_EMOJI = { 'Atrakcija':'🏛️','Restoran':'🍽️','Cafe/Bar':'☕','Kupovina':'🛍️','Transport':'🚌','Hotel':'🏨','Aktivnost':'🎯','Plaža':'🏖️','Muzej':'🖼️','Slobodno':'🌿' }

const EMPTY_ACT = { time: '', endTime: '', title: '', category: 'Atrakcija', location: '', address: '', cost: '', perPerson: false, reservationCode: '', openingHours: '', dresscode: '', notes: '', photoSpot: false }

function fmtDay(date) {
  return `${DAYS_SR[date.getDay()]}, ${date.getDate()}. ${MONTHS_SR[date.getMonth()]}`
}

export default function ItinerarySection({ trip, numDays }) {
  const addActivity = useStore((s) => s.addActivity)
  const toggleActivity = useStore((s) => s.toggleActivity)
  const deleteActivity = useStore((s) => s.deleteActivity)
  const updateDayMeta = useStore((s) => s.updateDayMeta)

  const [viewTab, setViewTab] = useState('itinerary')
  const [expandedDay, setExpandedDay] = useState(1)
  const [addingDay, setAddingDay] = useState(null)
  const [actForm, setActForm] = useState(EMPTY_ACT)
  const [editingMeta, setEditingMeta] = useState(null)
  const [metaForm, setMetaForm] = useState({ theme: '', notes: '' })
  const [appliedDays, setAppliedDays] = useState(new Set())

  const totalActs = (trip.itinerary || []).reduce((s, d) => s + d.activities.length, 0)
  const doneActs = (trip.itinerary || []).reduce((s, d) => s + d.activities.filter((a) => a.done).length, 0)

  const handleAdd = (day) => {
    if (!actForm.title.trim()) return
    addActivity(trip.id, day, { ...actForm, title: actForm.title.trim() })
    setActForm(EMPTY_ACT)
    setAddingDay(null)
  }

  const handleSaveMeta = (day) => {
    updateDayMeta(trip.id, day, metaForm)
    setEditingMeta(null)
  }

  function applyDay(dayData) {
    dayData.activities.forEach((act) => addActivity(trip.id, dayData.day, { ...act, done: false }))
    updateDayMeta(trip.id, dayData.day, { theme: dayData.theme })
    setAppliedDays((prev) => new Set([...prev, dayData.day]))
  }

  return (
    <div className="space-y-3">
      {/* View toggle */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-linen shadow-sm">
        <button onClick={() => setViewTab('itinerary')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${viewTab === 'itinerary' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}>
          📅 Moj itinerar
        </button>
        <button onClick={() => setViewTab('suggest')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${viewTab === 'suggest' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}>
          <Lightbulb size={14} /> Predlog itinerara
        </button>
      </div>

      {/* SUGGESTIONS TAB */}
      {viewTab === 'suggest' && (
        <ItinerarySuggestions trip={trip} numDays={numDays} appliedDays={appliedDays} applyDay={applyDay} />
      )}

      {viewTab === 'itinerary' && <>
      {totalActs > 0 && (
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-linen flex items-center justify-between">
          <span className="text-sm text-ink-light">Ukupan napredak</span>
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-linen rounded-full overflow-hidden">
              <div className="h-full bg-terra rounded-full" style={{ width: `${(doneActs / totalActs) * 100}%` }} />
            </div>
            <span className="text-sm font-semibold text-ink-light">{doneActs}/{totalActs}</span>
          </div>
        </div>
      )}

      {Array.from({ length: numDays }, (_, i) => i + 1).map((day) => {
        const date = addDays(parseISO(trip.startDate), day - 1)
        const dayData = (trip.itinerary || []).find((d) => d.day === day)
        const activities = dayData?.activities || []
        const isExp = expandedDay === day
        const doneCnt = activities.filter((a) => a.done).length

        return (
          <div key={day} className="bg-white rounded-2xl border border-linen overflow-hidden shadow-sm">
            {/* Day header */}
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-parchment" onClick={() => setExpandedDay(isExp ? null : day)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terra to-purple-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {day}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink text-sm">Dan {day}</span>
                  {dayData?.theme && <span className="text-xs bg-terra/10 text-terra px-2 py-0.5 rounded-full">{dayData.theme}</span>}
                </div>
                <div className="text-xs text-mist">{fmtDay(date)}</div>
              </div>
              <div className="flex items-center gap-2">
                {activities.length > 0 && <span className="text-xs text-mist">{doneCnt}/{activities.length}</span>}
                {isExp ? <ChevronUp size={15} className="text-mist" /> : <ChevronDown size={15} className="text-mist" />}
              </div>
            </div>

            {isExp && (
              <div className="border-t border-linen p-4 space-y-3">
                {/* Day theme/notes edit */}
                {editingMeta === day ? (
                  <div className="bg-purple-50 rounded-xl p-3 space-y-2">
                    <input type="text" value={metaForm.theme} onChange={(e) => setMetaForm((f) => ({ ...f, theme: e.target.value }))} placeholder="Tema dana (npr. Istorijski centar)" className={inp} />
                    <textarea value={metaForm.notes} onChange={(e) => setMetaForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Napomene za dan..." className={`${inp} resize-none`} />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveMeta(day)} className="flex-1 bg-purple-500 text-white text-xs py-1.5 rounded-lg">Sačuvaj</button>
                      <button onClick={() => setEditingMeta(null)} className="px-3 border border-linen text-mist text-xs py-1.5 rounded-lg">Otkaži</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setEditingMeta(day); setMetaForm({ theme: dayData?.theme || '', notes: dayData?.notes || '' }) }} className="text-xs text-purple-500 hover:text-purple-700">
                    {dayData?.theme ? `📌 ${dayData.theme}` : '+ Dodaj temu dana'}
                  </button>
                )}
                {dayData?.notes && !editingMeta && <p className="text-xs text-mist italic">{dayData.notes}</p>}

                {/* Activities */}
                {activities.length === 0 && <p className="text-mist text-sm text-center py-3">Nema aktivnosti</p>}
                <div className="space-y-2">
                  {activities.map((act) => (
                    <div key={act.id} className={`rounded-xl border ${act.done ? 'border-green-200 bg-green-50' : 'border-linen bg-parchment'}`}>
                      <div className="flex items-start gap-3 p-3">
                        <button
                          onClick={() => toggleActivity(trip.id, day, act.id)}
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${act.done ? 'bg-green-500 border-green-500 text-white' : 'border-linen hover:border-terra'}`}
                        >
                          {act.done && <Check size={11} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {act.time && <span className="text-terra text-xs font-bold">{act.time}{act.endTime && ` – ${act.endTime}`}</span>}
                            <span className={`font-medium text-sm ${act.done ? 'line-through text-mist' : 'text-ink'}`}>{act.title}</span>
                            {act.category && <span className="text-xs">{CAT_EMOJI[act.category] || '📌'} {act.category}</span>}
                            {act.photoSpot && <span className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">📸 Foto spot</span>}
                          </div>
                          {act.location && (
                            <div className="flex items-center gap-1 text-xs text-mist mt-1">
                              <MapPin size={10} /> {act.location}
                              {act.address && ` · ${act.address}`}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-3 mt-1">
                            {act.cost && <span className="text-xs text-mist flex items-center gap-0.5"><DollarSign size={10} />{act.cost}{act.perPerson ? '/os.' : ''}</span>}
                            {act.openingHours && <span className="text-xs text-mist flex items-center gap-0.5"><Clock size={10} />{act.openingHours}</span>}
                            {act.reservationCode && <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-mono">{act.reservationCode}</span>}
                            {act.dresscode && <span className="text-xs text-mist">👔 {act.dresscode}</span>}
                          </div>
                          {act.notes && <p className="text-xs text-mist mt-1 italic">{act.notes}</p>}
                        </div>
                        <button onClick={() => deleteActivity(trip.id, day, act.id)} className="text-mist hover:text-red-400 flex-shrink-0">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add form */}
                {addingDay === day ? (
                  <div className="bg-terra/10 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={actForm.title} onChange={(e) => setActForm((f) => ({ ...f, title: e.target.value }))} placeholder="Naziv aktivnosti *" className={inp} autoFocus />
                      <select value={actForm.category} onChange={(e) => setActForm((f) => ({ ...f, category: e.target.value }))} className={inp}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="time" value={actForm.time} onChange={(e) => setActForm((f) => ({ ...f, time: e.target.value }))} placeholder="Vreme" className={inp} />
                      <input type="time" value={actForm.endTime} onChange={(e) => setActForm((f) => ({ ...f, endTime: e.target.value }))} placeholder="Kraj" className={inp} />
                      <input type="text" value={actForm.cost} onChange={(e) => setActForm((f) => ({ ...f, cost: e.target.value }))} placeholder="Cena" className={inp} />
                    </div>
                    <input type="text" value={actForm.location} onChange={(e) => setActForm((f) => ({ ...f, location: e.target.value }))} placeholder="Naziv mesta (npr. Kolizeum)" className={inp} />
                    <input type="text" value={actForm.address} onChange={(e) => setActForm((f) => ({ ...f, address: e.target.value }))} placeholder="Adresa (opciono)" className={inp} />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={actForm.openingHours} onChange={(e) => setActForm((f) => ({ ...f, openingHours: e.target.value }))} placeholder="Radno vreme" className={inp} />
                      <input type="text" value={actForm.reservationCode} onChange={(e) => setActForm((f) => ({ ...f, reservationCode: e.target.value }))} placeholder="Kod rezervacije" className={inp} />
                    </div>
                    <input type="text" value={actForm.dresscode} onChange={(e) => setActForm((f) => ({ ...f, dresscode: e.target.value }))} placeholder="Dress code (opciono)" className={inp} />
                    <textarea value={actForm.notes} onChange={(e) => setActForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Napomene..." className={`${inp} resize-none`} />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-ink-light cursor-pointer">
                        <input type="checkbox" checked={actForm.photoSpot} onChange={(e) => setActForm((f) => ({ ...f, photoSpot: e.target.checked }))} className="rounded" />
                        📸 Foto spot
                      </label>
                      <label className="flex items-center gap-2 text-xs text-ink-light cursor-pointer">
                        <input type="checkbox" checked={actForm.perPerson} onChange={(e) => setActForm((f) => ({ ...f, perPerson: e.target.checked }))} className="rounded" />
                        Cena po osobi
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAdd(day)} className="flex-1 bg-terra text-white text-sm py-2 rounded-xl hover:bg-terra-light font-medium">Dodaj aktivnost</button>
                      <button onClick={() => { setAddingDay(null); setActForm(EMPTY_ACT) }} className="px-4 border border-linen text-ink-light text-sm py-2 rounded-xl hover:bg-parchment">Otkaži</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingDay(day)} className="flex items-center gap-1 text-terra hover:text-terra-light text-sm font-medium">
                    <Plus size={15} /> Dodaj aktivnost
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
      </>}
    </div>
  )
}

function ItinerarySuggestions({ trip, numDays, appliedDays, applyDay }) {
  const suggestions = getItinerarySuggestions(trip.destination, numDays)

  return (
    <div className="space-y-3">
      <div className="bg-forest/5 rounded-2xl p-4 border border-forest/15">
        <p className="text-sm font-semibold text-forest mb-0.5">🗺️ Predlog itinerara za {trip.destination}</p>
        <p className="text-xs text-mist">Kliknite &ldquo;Primeni dan&rdquo; da dodate aktivnosti u vaš itinerar</p>
      </div>
      {suggestions.map((dayData) => {
        const isApplied = appliedDays.has(dayData.day)
        let date = null
        try { date = addDays(parseISO(trip.startDate), dayData.day - 1) } catch {}
        return (
          <div key={dayData.day} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isApplied ? 'border-green-200 opacity-70' : 'border-linen'}`}>
            <div className="flex items-center justify-between px-4 py-3 bg-parchment/50 border-b border-linen">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-sm">
                  {dayData.day}
                </div>
                <div>
                  <p className="text-xs text-mist">{date ? `${['Ned','Pon','Uto','Sre','Čet','Pet','Sub'][date.getDay()]}, ${date.getDate()}. ${['jan','feb','mar','apr','maj','jun','jul','avg','sep','okt','nov','dec'][date.getMonth()]}` : `Dan ${dayData.day}`}</p>
                  <span className="text-xs bg-forest/10 text-forest px-2 py-0.5 rounded-full font-medium">{dayData.theme}</span>
                </div>
              </div>
              <button
                onClick={() => applyDay(dayData)}
                disabled={isApplied}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${isApplied ? 'bg-green-100 text-green-700' : 'bg-forest text-white hover:bg-forest-light'}`}
              >
                {isApplied ? '✓ Primenjeno' : 'Primeni dan'}
              </button>
            </div>
            <div className="divide-y divide-linen/60">
              {dayData.activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                  <span className="text-sm flex-shrink-0 mt-0.5">{CAT_EMOJI[act.category] || '📍'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {act.time && <span className="text-xs text-mist font-mono">{act.time}</span>}
                      <span className="text-sm text-ink">{act.title}</span>
                    </div>
                    {act.notes && <p className="text-xs text-mist mt-0.5">{act.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      <p className="text-xs text-center text-mist pb-2">Predlozi su opšti — prilagodite ih svom stilu putovanja 🌍</p>
    </div>
  )
}
