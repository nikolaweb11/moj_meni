import { format, parseISO, isAfter, isBefore } from 'date-fns'
import { MapPin, Calendar, PlaneTakeoff, Building2 } from 'lucide-react'

export default function OverviewSection({ trip, numDays, destData }) {
  const today = new Date()
  const started = !isAfter(parseISO(trip.startDate), today)
  const ended = isBefore(parseISO(trip.endDate), today)
  const status = ended ? 'completed' : started ? 'ongoing' : 'planned'

  const totalSpent = (trip.expenses || []).reduce((s, e) => s + Number(e.amount), 0)
  const budget = trip.budget?.total || 0
  const currency = trip.budget?.currency || 'EUR'
  const budgetPct = budget ? Math.min((totalSpent / budget) * 100, 100) : 0
  const preTrip = trip.preTrip || []
  const preDone = preTrip.filter((p) => p.done).length
  const itinDays = (trip.itinerary || []).reduce((s, d) => s + d.activities.length, 0)
  const itinDone = (trip.itinerary || []).reduce((s, d) => s + d.activities.filter((a) => a.done).length, 0)
  const packingList = trip.packingList || []
  const packDone = packingList.filter((i) => i.packed).length

  const statusConfig = {
    planned: { cls: 'bg-blue-50 text-blue-700 border border-blue-100', label: 'Planirano' },
    ongoing: { cls: 'bg-green-50 text-green-700 border border-green-100', label: '🟢 U toku' },
    completed: { cls: 'bg-linen text-ink-light border border-linen', label: 'Završeno' },
  }
  const st = statusConfig[status]

  return (
    <div className="space-y-4">
      {/* Wikipedia fact card */}
      {destData?.loading && (
        <div className="bg-forest/5 rounded-2xl p-4 border border-forest/15 animate-pulse">
          <div className="h-3 bg-forest/20 rounded w-1/3 mb-2" />
          <div className="h-3 bg-forest/10 rounded w-full mb-1" />
          <div className="h-3 bg-forest/10 rounded w-4/5" />
        </div>
      )}
      {!destData?.loading && destData?.summary && (
        <div className="bg-forest/5 rounded-2xl p-4 border border-forest/15 flex gap-4 items-start">
          {destData.imageUrl && (
            <img src={destData.imageUrl} alt={destData.title || trip.destination} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              🌍 {destData.title || trip.destination}
            </p>
            <p className="text-sm text-ink-light leading-relaxed line-clamp-3">{destData.summary}</p>
          </div>
        </div>
      )}

      {/* Status + info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">{trip.title}</h2>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${st.cls}`}>{st.label}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoRow icon={<MapPin size={14} className="text-terra" />} label="Destinacija" value={trip.destination} />
          <InfoRow icon={<Calendar size={14} className="text-mist" />} label="Trajanje" value={`${numDays} dana`} />
          <InfoRow icon={<Calendar size={14} className="text-mist" />} label="Polazak" value={format(parseISO(trip.startDate), 'dd.MM.yyyy')} />
          <InfoRow icon={<Calendar size={14} className="text-mist" />} label="Povratak" value={format(parseISO(trip.endDate), 'dd.MM.yyyy')} />
          {trip.flights?.length > 0 && <InfoRow icon={<PlaneTakeoff size={14} className="text-mist" />} label="Letovi" value={`${trip.flights.length} let(ova)`} />}
          {trip.accommodations?.length > 0 && <InfoRow icon={<Building2 size={14} className="text-mist" />} label="Smeštaj" value={trip.accommodations[0].name} />}
        </div>
        {trip.description && <p className="mt-4 text-sm text-ink-light/70 border-t border-linen pt-3">{trip.description}</p>}
      </div>

      {/* Progress */}
      <div className="grid grid-cols-2 gap-3">
        <ProgressCard label="Budžet" value={`${totalSpent.toFixed(0)} / ${budget} ${currency}`} pct={budgetPct} barColor={budgetPct > 90 ? '#F87171' : budgetPct > 70 ? '#FBBF24' : '#4A7C59'} icon="💰" />
        <ProgressCard label="Pre-trip lista" value={`${preDone} / ${preTrip.length} završeno`} pct={preTrip.length ? (preDone / preTrip.length) * 100 : 0} barColor="#8B5CF6" icon="✅" />
        <ProgressCard label="Itinerar" value={`${itinDone} / ${itinDays} aktivnosti`} pct={itinDays ? (itinDone / itinDays) * 100 : 0} barColor="#C4932A" icon="📅" />
        <ProgressCard label="Pakovanje" value={`${packDone} / ${packingList.length} spakovano`} pct={packingList.length ? (packDone / packingList.length) * 100 : 0} barColor="#2D4A3E" icon="🎒" />
      </div>

      {trip.flights?.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
          <h3 className="font-semibold text-ink text-sm mb-3">✈️ Letovi</h3>
          {trip.flights.map((f) => (
            <div key={f.id} className="flex items-center gap-3 text-sm py-2 border-b border-linen last:border-0">
              <div className="w-8 h-8 bg-forest/10 rounded-lg flex items-center justify-center text-forest flex-shrink-0"><PlaneTakeoff size={14} /></div>
              <div>
                <div className="font-medium text-ink">{f.departureAirport} → {f.arrivalAirport}</div>
                <div className="text-xs text-mist">{f.airline} {f.flightNumber} · {f.departureDate} {f.departureTime}</div>
              </div>
              {f.bookingRef && <span className="ml-auto text-xs bg-forest/10 text-forest px-2 py-0.5 rounded-full font-mono">{f.bookingRef}</span>}
            </div>
          ))}
        </div>
      )}

      {trip.accommodations?.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
          <h3 className="font-semibold text-ink text-sm mb-3">🏨 Smeštaj</h3>
          {trip.accommodations.map((a) => (
            <div key={a.id} className="flex items-start gap-3 text-sm py-2 border-b border-linen last:border-0">
              <div className="w-8 h-8 bg-terra/10 rounded-lg flex items-center justify-center text-terra flex-shrink-0"><Building2 size={14} /></div>
              <div>
                <div className="font-medium text-ink">{a.name}</div>
                <div className="text-xs text-mist">Check-in: {a.checkIn} {a.checkInTime} · Check-out: {a.checkOut} {a.checkOutTime}</div>
                {a.address && <div className="text-xs text-mist">{a.address}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <div className="text-xs text-mist">{label}</div>
        <div className="font-medium text-ink text-sm">{value || '—'}</div>
      </div>
    </div>
  )
}

function ProgressCard({ label, value, pct, barColor, icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-mist">{label}</span>
      </div>
      <div className="text-sm font-semibold text-ink mb-2">{value}</div>
      <div className="h-2 bg-linen rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  )
}
