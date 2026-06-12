import { Link } from 'react-router-dom'
import { Plus, MapPin, Calendar, Star, CheckCircle2, Plane } from 'lucide-react'
import { format, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns'
import useStore from '../store/useStore'

const GRADIENT_MAP = {
  sunset: 'from-orange-400 to-rose-500',
  ocean: 'from-blue-400 to-cyan-500',
  forest: 'from-green-400 to-emerald-500',
  lavender: 'from-purple-400 to-pink-500',
  night: 'from-indigo-600 to-purple-700',
  sand: 'from-yellow-400 to-amber-500',
}

function daysLabel(n) {
  if (n === 1) return '1 dan'
  if (n < 5) return `${n} dana`
  return `${n} dana`
}

export default function Dashboard() {
  const { couple, trips, bucketList } = useStore()
  const today = new Date()

  const upcoming = trips
    .filter((t) => isAfter(parseISO(t.startDate), today))
    .sort((a, b) => parseISO(a.startDate) - parseISO(b.startDate))

  const ongoing = trips.filter(
    (t) => !isAfter(parseISO(t.startDate), today) && !isBefore(parseISO(t.endDate), today)
  )

  const completed = trips
    .filter((t) => isBefore(parseISO(t.endDate), today))
    .sort((a, b) => parseISO(b.endDate) - parseISO(a.endDate))

  const bucketDone = bucketList.filter((i) => i.done).length

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 p-8 md:p-12 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-8xl">✈️</div>
          <div className="absolute bottom-4 right-32 text-6xl">🗺️</div>
          <div className="absolute top-8 right-48 text-5xl">⭐</div>
        </div>
        <div className="relative">
          <p className="text-rose-200 text-sm font-medium mb-1 uppercase tracking-wider">Dobrodošli</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            {couple.name1} &amp; {couple.name2}
          </h1>
          <p className="text-rose-100 text-lg">Planiramo avanturu zajedno 💑</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          emoji="✈️"
          value={trips.length}
          label="Putovanja"
          color="bg-rose-50 text-rose-600"
        />
        <StatCard
          emoji="📅"
          value={upcoming.length}
          label="Nadolazeće"
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          emoji="✅"
          value={completed.length}
          label="Završeno"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          emoji="⭐"
          value={bucketList.length - bucketDone}
          label="Lista želja"
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Ongoing trip */}
      {ongoing.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-bold text-slate-800">Trenutno na putu 🌍</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {ongoing.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Nadolazeća putovanja</h2>
          <Link
            to="/trips/new"
            className="flex items-center gap-1.5 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            <Plus size={15} /> Planiraj odmor
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="Nema planiranih putovanja"
            subtitle="Dodaj vaš sledeći odmor i počni da planiraš"
            cta="Planiraj odmor"
            to="/trips/new"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Prošla putovanja</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((trip) => (
              <TripCard key={trip.id} trip={trip} completed />
            ))}
          </div>
        </section>
      )}

      {/* Bucket list preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Lista želja ⭐{' '}
            <span className="text-base font-normal text-slate-400">
              ({bucketDone}/{bucketList.length})
            </span>
          </h2>
          <Link to="/bucket-list" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Vidi sve →
          </Link>
        </div>
        {bucketList.length === 0 ? (
          <EmptyState
            icon="⭐"
            title="Lista želja je prazna"
            subtitle="Dodaj destinacije iz snova"
            cta="Dodaj destinaciju"
            to="/bucket-list"
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {bucketList.slice(0, 8).map((item) => (
              <span
                key={item.id}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  item.done
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {item.done ? '✓ ' : ''}
                {item.destination}, {item.country}
              </span>
            ))}
            {bucketList.length > 8 && (
              <Link
                to="/bucket-list"
                className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                +{bucketList.length - 8} više
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function TripCard({ trip, completed }) {
  const gradient = GRADIENT_MAP[trip.color] || GRADIENT_MAP.sunset
  const numDays =
    differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1
  const totalSpent = (trip.expenses || []).reduce((s, e) => s + Number(e.amount), 0)

  return (
    <Link
      to={`/trips/${trip.id}`}
      className={`block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-slate-100 ${
        completed ? 'opacity-80' : ''
      }`}
    >
      <div className={`h-28 bg-gradient-to-r ${gradient} flex items-end p-4 relative`}>
        {completed && (
          <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
            Završeno ✓
          </span>
        )}
        <h3 className="text-white font-bold text-lg leading-tight group-hover:translate-x-0.5 transition-transform">
          {trip.title}
        </h3>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-1">
          <MapPin size={13} className="text-rose-400" />
          {trip.destination}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-2">
          <Calendar size={13} className="text-purple-400" />
          {format(parseISO(trip.startDate), 'dd.MM.yyyy')} —{' '}
          {format(parseISO(trip.endDate), 'dd.MM.yyyy')}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-50">
          <span className="flex items-center gap-1">
            <Plane size={11} /> {daysLabel(numDays)}
          </span>
          {trip.budget?.total > 0 && (
            <span>
              {totalSpent > 0
                ? `${totalSpent.toFixed(0)} / ${trip.budget.total} ${trip.budget.currency}`
                : `${trip.budget.total} ${trip.budget.currency}`}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function StatCard({ emoji, value, label, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${color} bg-opacity-20`}
      >
        {emoji}
      </div>
      <div className="text-2xl font-extrabold text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  )
}

function EmptyState({ icon, title, subtitle, cta, to }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-semibold text-slate-600 mb-1">{title}</p>
      <p className="text-sm text-slate-400 mb-5">{subtitle}</p>
      <Link
        to={to}
        className="inline-flex items-center gap-1.5 bg-rose-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors"
      >
        <Plus size={15} /> {cta}
      </Link>
    </div>
  )
}
