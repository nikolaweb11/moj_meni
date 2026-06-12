import { useState } from 'react'
import { Plus, Trash2, PlaneTakeoff, PlaneLanding, ChevronDown, ChevronUp, Car, Train, Bus } from 'lucide-react'
import useStore from '../store/useStore'
import { getFlightSuggestions } from '../hooks/useSuggestions'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist w-full'

const EMPTY_FLIGHT = {
  type: 'outbound',
  airline: '', flightNumber: '', bookingRef: '',
  departureAirport: '', departureDate: '', departureTime: '', departureTerminal: '', departureGate: '',
  arrivalAirport: '', arrivalDate: '', arrivalTime: '', arrivalTerminal: '',
  seat: '', baggageAllowance: '', duration: '', notes: '',
}

const EMPTY_TRANSFER = {
  type: 'taxi', from: '', to: '', date: '', time: '', duration: '', bookingRef: '', cost: '', notes: '',
}

export default function FlightsSection({ trip }) {
  const addFlight = useStore((s) => s.addFlight)
  const deleteFlight = useStore((s) => s.deleteFlight)
  const addTransfer = useStore((s) => s.addTransfer)
  const deleteTransfer = useStore((s) => s.deleteTransfer)
  const setRentalCar = useStore((s) => s.setRentalCar)

  const [tab, setTab] = useState('mine')
  const [showFlightForm, setShowFlightForm] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [showCarForm, setShowCarForm] = useState(false)
  const [expandedFlight, setExpandedFlight] = useState(null)
  const [flightForm, setFlightForm] = useState(EMPTY_FLIGHT)
  const [transferForm, setTransferForm] = useState(EMPTY_TRANSFER)
  const [carForm, setCarForm] = useState(
    trip.rentalCar || { company: '', carModel: '', pickupLocation: '', pickupDate: '', pickupTime: '', dropoffLocation: '', dropoffDate: '', dropoffTime: '', bookingRef: '', cost: '', notes: '', fuelPolicy: '', insurance: '' }
  )

  const flights = trip.flights || []
  const transfers = trip.transfers || []

  const handleAddFlight = () => {
    if (!flightForm.departureAirport || !flightForm.arrivalAirport) return
    addFlight(trip.id, flightForm)
    setFlightForm(EMPTY_FLIGHT)
    setShowFlightForm(false)
  }

  const handleAddTransfer = () => {
    if (!transferForm.from || !transferForm.to) return
    addTransfer(trip.id, transferForm)
    setTransferForm(EMPTY_TRANSFER)
    setShowTransferForm(false)
  }

  const handleSaveCar = () => {
    setRentalCar(trip.id, carForm)
    setShowCarForm(false)
  }

  const typeIcons = { taxi: '🚕', bus: '🚌', train: '🚂', shuttle: '🚐', ferry: '⛴️', other: '🚗' }

  return (
    <div className="space-y-5">
      {/* ─── TAB SWITCHER ─── */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-linen shadow-sm">
        <button
          onClick={() => setTab('mine')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'mine' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}
        >
          ✈️ Moji letovi
        </button>
        <button
          onClick={() => setTab('suggest')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'suggest' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}
        >
          💡 Predlozi
        </button>
      </div>

      {/* ─── PREDLOZI TAB ─── */}
      {tab === 'suggest' && (
        <FlightSuggestions destination={trip.destination} />
      )}

      {tab === 'mine' && <>
      {/* ─── FLIGHTS ─── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-ink">✈️ Letovi</h2>
          <button onClick={() => setShowFlightForm(true)} className="flex items-center gap-1 text-sm bg-terra text-white px-3 py-1.5 rounded-full hover:bg-terra-light transition-colors">
            <Plus size={14} /> Dodaj let
          </button>
        </div>

        {showFlightForm && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen mb-4">
            <h3 className="font-semibold text-ink-light mb-4">Novi let</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label">Tip</label>
                  <select value={flightForm.type} onChange={(e) => setFlightForm((f) => ({ ...f, type: e.target.value }))} className={inp}>
                    <option value="outbound">Odlazni</option>
                    <option value="return">Povratni</option>
                    <option value="connecting">Konekcija</option>
                  </select>
                </div>
                <div>
                  <label className="label">Avio-kompanija</label>
                  <input type="text" value={flightForm.airline} onChange={(e) => setFlightForm((f) => ({ ...f, airline: e.target.value }))} placeholder="npr. Air Serbia" className={inp} />
                </div>
                <div>
                  <label className="label">Broj leta</label>
                  <input type="text" value={flightForm.flightNumber} onChange={(e) => setFlightForm((f) => ({ ...f, flightNumber: e.target.value }))} placeholder="npr. JU100" className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1"><PlaneTakeoff size={12} /> Polazak</p>
                  <input type="text" value={flightForm.departureAirport} onChange={(e) => setFlightForm((f) => ({ ...f, departureAirport: e.target.value }))} placeholder="Aerodrom (npr. BEG)" className={inp} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={flightForm.departureDate} onChange={(e) => setFlightForm((f) => ({ ...f, departureDate: e.target.value }))} className={inp} />
                    <input type="time" value={flightForm.departureTime} onChange={(e) => setFlightForm((f) => ({ ...f, departureTime: e.target.value }))} className={inp} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={flightForm.departureTerminal} onChange={(e) => setFlightForm((f) => ({ ...f, departureTerminal: e.target.value }))} placeholder="Terminal" className={inp} />
                    <input type="text" value={flightForm.departureGate} onChange={(e) => setFlightForm((f) => ({ ...f, departureGate: e.target.value }))} placeholder="Gate" className={inp} />
                  </div>
                </div>

                <div className="space-y-2 bg-terra/10 rounded-xl p-3">
                  <p className="text-xs font-semibold text-terra uppercase tracking-wider flex items-center gap-1"><PlaneLanding size={12} /> Dolazak</p>
                  <input type="text" value={flightForm.arrivalAirport} onChange={(e) => setFlightForm((f) => ({ ...f, arrivalAirport: e.target.value }))} placeholder="Aerodrom (npr. FCO)" className={inp} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={flightForm.arrivalDate} onChange={(e) => setFlightForm((f) => ({ ...f, arrivalDate: e.target.value }))} className={inp} />
                    <input type="time" value={flightForm.arrivalTime} onChange={(e) => setFlightForm((f) => ({ ...f, arrivalTime: e.target.value }))} className={inp} />
                  </div>
                  <input type="text" value={flightForm.arrivalTerminal} onChange={(e) => setFlightForm((f) => ({ ...f, arrivalTerminal: e.target.value }))} placeholder="Terminal dolaska" className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label">Sedište</label>
                  <input type="text" value={flightForm.seat} onChange={(e) => setFlightForm((f) => ({ ...f, seat: e.target.value }))} placeholder="npr. 14A, 14B" className={inp} />
                </div>
                <div>
                  <label className="label">Prtljag</label>
                  <input type="text" value={flightForm.baggageAllowance} onChange={(e) => setFlightForm((f) => ({ ...f, baggageAllowance: e.target.value }))} placeholder="npr. 23kg + 8kg" className={inp} />
                </div>
                <div>
                  <label className="label">Trajanje leta</label>
                  <input type="text" value={flightForm.duration} onChange={(e) => setFlightForm((f) => ({ ...f, duration: e.target.value }))} placeholder="npr. 2h 30min" className={inp} />
                </div>
              </div>

              <div>
                <label className="label">Rezervacioni kod (PNR)</label>
                <input type="text" value={flightForm.bookingRef} onChange={(e) => setFlightForm((f) => ({ ...f, bookingRef: e.target.value }))} placeholder="npr. ABC123" className={inp} />
              </div>

              <div>
                <label className="label">Napomene</label>
                <textarea value={flightForm.notes} onChange={(e) => setFlightForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className={`${inp} resize-none`} placeholder="Online check-in, posebna hrana..." />
              </div>

              <div className="flex gap-2">
                <button onClick={handleAddFlight} className="flex-1 bg-terra text-white text-sm py-2.5 rounded-xl hover:bg-terra-light font-medium">Sačuvaj let</button>
                <button onClick={() => setShowFlightForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2.5 rounded-xl hover:bg-parchment">Otkaži</button>
              </div>
            </div>
          </div>
        )}

        {flights.length === 0 && !showFlightForm && (
          <Empty icon="✈️" text="Nema unetih letova" />
        )}

        <div className="space-y-3">
          {flights.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl shadow-sm border border-linen overflow-hidden">
              <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-parchment" onClick={() => setExpandedFlight(expandedFlight === f.id ? null : f.id)}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${f.type === 'return' ? 'bg-terra/10' : 'bg-blue-50'}`}>
                  {f.type === 'return' ? <PlaneLanding size={16} className="text-terra" /> : <PlaneTakeoff size={16} className="text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink text-sm">
                    {f.departureAirport} → {f.arrivalAirport}
                  </div>
                  <div className="text-xs text-mist">
                    {f.airline} {f.flightNumber} · {f.departureDate} {f.departureTime}
                    {f.duration && ` · ${f.duration}`}
                  </div>
                </div>
                {f.bookingRef && <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{f.bookingRef}</span>}
                <div className="flex items-center gap-1">
                  {expandedFlight === f.id ? <ChevronUp size={15} className="text-mist" /> : <ChevronDown size={15} className="text-mist" />}
                </div>
              </div>

              {expandedFlight === f.id && (
                <div className="border-t border-linen p-4 grid grid-cols-2 gap-3 text-sm">
                  <Detail label="Terminal polaska" value={f.departureTerminal} />
                  <Detail label="Gate" value={f.departureGate} />
                  <Detail label="Terminal dolaska" value={f.arrivalTerminal} />
                  <Detail label="Sedište" value={f.seat} />
                  <Detail label="Prtljag" value={f.baggageAllowance} />
                  <Detail label="Datum dolaska" value={`${f.arrivalDate} ${f.arrivalTime}`} />
                  {f.notes && <div className="col-span-2"><Detail label="Napomene" value={f.notes} /></div>}
                  <div className="col-span-2 pt-2 border-t border-linen">
                    <button onClick={() => deleteFlight(trip.id, f.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600">
                      <Trash2 size={12} /> Obriši let
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── TRANSFERS ─── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-ink">🚕 Transferi</h2>
          <button onClick={() => setShowTransferForm(true)} className="flex items-center gap-1 text-sm bg-amber-500 text-white px-3 py-1.5 rounded-full hover:bg-amber-600 transition-colors">
            <Plus size={14} /> Dodaj transfer
          </button>
        </div>

        {showTransferForm && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen mb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Tip</label>
                <select value={transferForm.type} onChange={(e) => setTransferForm((f) => ({ ...f, type: e.target.value }))} className={inp}>
                  {['taxi', 'bus', 'train', 'shuttle', 'ferry', 'other'].map((t) => (
                    <option key={t} value={t}>{typeIcons[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Rezervacioni kod</label>
                <input type="text" value={transferForm.bookingRef} onChange={(e) => setTransferForm((f) => ({ ...f, bookingRef: e.target.value }))} placeholder="Opcionо" className={inp} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={transferForm.from} onChange={(e) => setTransferForm((f) => ({ ...f, from: e.target.value }))} placeholder="Odakle *" className={inp} />
              <input type="text" value={transferForm.to} onChange={(e) => setTransferForm((f) => ({ ...f, to: e.target.value }))} placeholder="Dokle *" className={inp} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input type="date" value={transferForm.date} onChange={(e) => setTransferForm((f) => ({ ...f, date: e.target.value }))} className={inp} />
              <input type="time" value={transferForm.time} onChange={(e) => setTransferForm((f) => ({ ...f, time: e.target.value }))} className={inp} />
              <input type="text" value={transferForm.cost} onChange={(e) => setTransferForm((f) => ({ ...f, cost: e.target.value }))} placeholder="Cena" className={inp} />
            </div>
            <textarea value={transferForm.notes} onChange={(e) => setTransferForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Napomene..." className={`${inp} resize-none`} />
            <div className="flex gap-2">
              <button onClick={handleAddTransfer} className="flex-1 bg-amber-500 text-white text-sm py-2 rounded-xl hover:bg-amber-600 font-medium">Sačuvaj</button>
              <button onClick={() => setShowTransferForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2 rounded-xl hover:bg-parchment">Otkaži</button>
            </div>
          </div>
        )}

        {transfers.length === 0 && !showTransferForm ? (
          <Empty icon="🚕" text="Nema unetih transfera" />
        ) : (
          <div className="space-y-2">
            {transfers.map((t) => (
              <div key={t.id} className="bg-white rounded-xl p-3 shadow-sm border border-linen flex items-center gap-3">
                <span className="text-xl">{typeIcons[t.type] || '🚗'}</span>
                <div className="flex-1">
                  <div className="font-medium text-ink-light text-sm">{t.from} → {t.to}</div>
                  <div className="text-xs text-mist">{t.date} {t.time} {t.cost && `· ${t.cost}`} {t.bookingRef && `· ${t.bookingRef}`}</div>
                  {t.notes && <div className="text-xs text-mist">{t.notes}</div>}
                </div>
                <button onClick={() => deleteTransfer(trip.id, t.id)} className="text-mist hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── RENTAL CAR ─── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-ink">🚗 Rent a car</h2>
          {!showCarForm && (
            <button onClick={() => setShowCarForm(true)} className="flex items-center gap-1 text-sm bg-emerald-500 text-white px-3 py-1.5 rounded-full hover:bg-emerald-600 transition-colors">
              {trip.rentalCar ? 'Izmeni' : <><Plus size={14} /> Dodaj</>}
            </button>
          )}
        </div>

        {showCarForm ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={carForm.company} onChange={(e) => setCarForm((f) => ({ ...f, company: e.target.value }))} placeholder="Kompanija (npr. Hertz)" className={inp} />
              <input type="text" value={carForm.carModel} onChange={(e) => setCarForm((f) => ({ ...f, carModel: e.target.value }))} placeholder="Model auta" className={inp} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={carForm.bookingRef} onChange={(e) => setCarForm((f) => ({ ...f, bookingRef: e.target.value }))} placeholder="Rezervacioni kod" className={inp} />
              <input type="text" value={carForm.cost} onChange={(e) => setCarForm((f) => ({ ...f, cost: e.target.value }))} placeholder="Ukupna cena" className={inp} />
            </div>
            <div className="bg-green-50 rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-green-700">📍 Preuzimanje</p>
              <input type="text" value={carForm.pickupLocation} onChange={(e) => setCarForm((f) => ({ ...f, pickupLocation: e.target.value }))} placeholder="Lokacija preuzimanja" className={inp} />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={carForm.pickupDate} onChange={(e) => setCarForm((f) => ({ ...f, pickupDate: e.target.value }))} className={inp} />
                <input type="time" value={carForm.pickupTime} onChange={(e) => setCarForm((f) => ({ ...f, pickupTime: e.target.value }))} className={inp} />
              </div>
            </div>
            <div className="bg-terra/10 rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-terra">📍 Vraćanje</p>
              <input type="text" value={carForm.dropoffLocation} onChange={(e) => setCarForm((f) => ({ ...f, dropoffLocation: e.target.value }))} placeholder="Lokacija vraćanja" className={inp} />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={carForm.dropoffDate} onChange={(e) => setCarForm((f) => ({ ...f, dropoffDate: e.target.value }))} className={inp} />
                <input type="time" value={carForm.dropoffTime} onChange={(e) => setCarForm((f) => ({ ...f, dropoffTime: e.target.value }))} className={inp} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={carForm.fuelPolicy} onChange={(e) => setCarForm((f) => ({ ...f, fuelPolicy: e.target.value }))} placeholder="Politika goriva (Full-Full...)" className={inp} />
              <input type="text" value={carForm.insurance} onChange={(e) => setCarForm((f) => ({ ...f, insurance: e.target.value }))} placeholder="Osiguranje" className={inp} />
            </div>
            <textarea value={carForm.notes} onChange={(e) => setCarForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Napomene..." className={`${inp} resize-none`} />
            <div className="flex gap-2">
              <button onClick={handleSaveCar} className="flex-1 bg-emerald-500 text-white text-sm py-2 rounded-xl hover:bg-emerald-600 font-medium">Sačuvaj</button>
              <button onClick={() => setShowCarForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2 rounded-xl hover:bg-parchment">Otkaži</button>
            </div>
          </div>
        ) : trip.rentalCar ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Kompanija" value={trip.rentalCar.company} />
              <Detail label="Model" value={trip.rentalCar.carModel} />
              <Detail label="Rezervacioni kod" value={trip.rentalCar.bookingRef} />
              <Detail label="Cena" value={trip.rentalCar.cost} />
              <Detail label="Preuzimanje" value={`${trip.rentalCar.pickupLocation} · ${trip.rentalCar.pickupDate} ${trip.rentalCar.pickupTime}`} />
              <Detail label="Vraćanje" value={`${trip.rentalCar.dropoffLocation} · ${trip.rentalCar.dropoffDate} ${trip.rentalCar.dropoffTime}`} />
              <Detail label="Gorivo" value={trip.rentalCar.fuelPolicy} />
              <Detail label="Osiguranje" value={trip.rentalCar.insurance} />
              {trip.rentalCar.notes && <div className="col-span-2"><Detail label="Napomene" value={trip.rentalCar.notes} /></div>}
            </div>
          </div>
        ) : (
          <Empty icon="🚗" text="Nema uneta rent a car detalja" />
        )}
      </section>
      </>}
    </div>
  )
}

function Detail({ label, value }) {
  if (!value) return null
  return (
    <div>
      <div className="text-xs text-mist">{label}</div>
      <div className="font-medium text-ink-light">{value}</div>
    </div>
  )
}

function Empty({ icon, text }) {
  return (
    <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-linen">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-mist text-sm">{text}</p>
    </div>
  )
}

function FlightSuggestions({ destination }) {
  const tips = getFlightSuggestions(destination)
  return (
    <div className="space-y-3">
      <div className="bg-forest/5 rounded-2xl p-4 border border-forest/15">
        <p className="text-sm font-semibold text-forest mb-0.5">💡 Predlozi za letove — {destination}</p>
        <p className="text-xs text-mist">Saveti za planiranje putovanja iz Beograda (BEG)</p>
      </div>
      {tips.map((tip, i) => (
        <div key={i} className="bg-white rounded-2xl border border-linen shadow-sm p-4 flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-lg flex-shrink-0">{tip.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink text-sm mb-1">{tip.title}</p>
            <p className="text-xs text-ink-light leading-relaxed">{tip.description}</p>
          </div>
        </div>
      ))}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
        <p className="text-xs text-amber-700">
          <strong>Napomena:</strong> Predlozi su informativni — uvek proverite aktuelne cene na{' '}
          <strong>Skyscanner</strong>, <strong>Google Flights</strong> ili <strong>Kiwi.com</strong>.
        </p>
      </div>
    </div>
  )
}
