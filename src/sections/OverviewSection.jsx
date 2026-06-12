import { format, parseISO, isAfter, isBefore } from 'date-fns'
import { MapPin, Calendar, Wallet, CheckSquare, PlaneTakeoff, Building2 } from 'lucide-react'

export default function OverviewSection({ trip, numDays }) {
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

  const statusColors = {
    planned: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-slate-100 text-slate-600',
  }
  const statusLabel = { planned: 'Planirano', ongoing: '🟢 U toku', completed: 'Završeno' }

  return (
    <div className="space-y-4">
      {/* Status + basic info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">{trip.title}</h2>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[status]}`}>
            {statusLabel[status]}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoRow icon={<MapPin size={14} className="text-rose-400" />} label="Destinacija" value={trip.destination} />
          <InfoRow icon={<Calendar size={14} className="text-purple-400" />} label="Trajanje" value={`${numDays} dana`} />
          <InfoRow
            icon={<Calendar size={14} className="text-blue-400" />}
            label="Polazak"
            value={format(parseISO(trip.startDate), 'dd.MM.yyyy')}
          />
          <InfoRow
            icon={<Calendar size={14} className="text-blue-400" />}
            label="Povratak"
            value={format(parseISO(trip.endDate), 'dd.MM.yyyy')}
          />
          {trip.flights?.length > 0 && (
            <InfoRow icon={<PlaneTakeoff size={14} className="text-cyan-500" />} label="Letovi" value={`${trip.flights.length} let(ova)`} />
          )}
          {trip.accommodations?.length > 0 && (
            <InfoRow icon={<Building2 size={14} className="text-emerald-500" />} label="Smeštaj" value={trip.accommodations[0].name} />
          )}
        </div>
        {trip.description && (
          <p className="mt-4 text-sm text-slate-500 border-t border-slate-50 pt-3">{trip.description}</p>
        )}
      </div>

      {/* Progress cards */}
      <div className="grid grid-cols-2 gap-3">
        <ProgressCard
          label="Budžet"
          value={`${totalSpent.toFixed(0)} / ${budget} ${currency}`}
          pct={budgetPct}
          color={budgetPct > 90 ? 'bg-red-400' : budgetPct > 70 ? 'bg-amber-400' : 'bg-green-400'}
          icon="💰"
        />
        <ProgressCard
          label="Pre-trip lista"
          value={`${preDone} / ${preTrip.length} završeno`}
          pct={preTrip.length ? (preDone / preTrip.length) * 100 : 0}
          color="bg-purple-400"
          icon="✅"
        />
        <ProgressCard
          label="Itinerar"
          value={`${itinDone} / ${itinDays} aktivnosti`}
          pct={itinDays ? (itinDone / itinDays) * 100 : 0}
          color="bg-rose-400"
          icon="📅"
        />
        <ProgressCard
          label="Pakovanje"
          value={`${packDone} / ${packingList.length} spakovano`}
          pct={packingList.length ? (packDone / packingList.length) * 100 : 0}
          color="bg-blue-400"
          icon="🎒"
        />
      </div>

      {/* Flights quick view */}
      {trip.flights?.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">✈️ Letovi</h3>
          {trip.flights.map((f) => (
            <div key={f.id} className="flex items-center gap-3 text-sm py-2 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                <PlaneTakeoff size={14} />
              </div>
              <div>
                <div className="font-medium text-slate-700">
                  {f.departureAirport} → {f.arrivalAirport}
                </div>
                <div className="text-xs text-slate-400">
                  {f.airline} {f.flightNumber} · {f.departureDate} {f.departureTime}
                </div>
              </div>
              {f.bookingRef && (
                <span className="ml-auto text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-mono">
                  {f.bookingRef}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Accommodations quick view */}
      {trip.accommodations?.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">🏨 Smeštaj</h3>
          {trip.accommodations.map((a) => (
            <div key={a.id} className="flex items-start gap-3 text-sm py-2 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Building2 size={14} />
              </div>
              <div>
                <div className="font-medium text-slate-700">{a.name}</div>
                <div className="text-xs text-slate-400">
                  Check-in: {a.checkIn} {a.checkInTime} · Check-out: {a.checkOut} {a.checkOutTime}
                </div>
                {a.address && <div className="text-xs text-slate-400">{a.address}</div>}
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
      <span className="mt-0.5">{icon}</span>
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="font-medium text-slate-700">{value || '—'}</div>
      </div>
    </div>
  )
}

function ProgressCard({ label, value, pct, color, icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="text-sm font-semibold text-slate-700 mb-2">{value}</div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
