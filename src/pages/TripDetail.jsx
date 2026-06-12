import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { differenceInDays, parseISO, format } from 'date-fns'
import {
  ArrowLeft, Trash2, MapPin, Calendar, LayoutDashboard,
  PlaneTakeoff, Building2, CalendarDays, Wallet,
  Backpack, FileText, Globe, Star, Camera, CheckSquare, Menu, X, Heart,
} from 'lucide-react'
import useStore from '../store/useStore'
import ReviewSection from '../sections/ReviewSection'
import OverviewSection from '../sections/OverviewSection'
import FlightsSection from '../sections/FlightsSection'
import AccommodationSection from '../sections/AccommodationSection'
import ItinerarySection from '../sections/ItinerarySection'
import BudgetSection from '../sections/BudgetSection'
import PackingSection from '../sections/PackingSection'
import DocumentsSection from '../sections/DocumentsSection'
import LocalInfoSection from '../sections/LocalInfoSection'
import PlacesSection from '../sections/PlacesSection'
import MemoriesSection from '../sections/MemoriesSection'
import PreTripSection from '../sections/PreTripSection'

const GRADIENT_MAP = {
  sunset: 'from-orange-400 to-rose-500',
  ocean: 'from-blue-400 to-cyan-500',
  forest: 'from-green-400 to-emerald-500',
  lavender: 'from-purple-400 to-pink-500',
  night: 'from-indigo-600 to-purple-700',
  sand: 'from-yellow-400 to-amber-500',
}

const NAV = [
  { id: 'overview', label: 'Pregled', icon: LayoutDashboard },
  { id: 'flights', label: 'Letovi & prevoz', icon: PlaneTakeoff },
  { id: 'accommodation', label: 'Smeštaj', icon: Building2 },
  { id: 'itinerary', label: 'Itinerar', icon: CalendarDays },
  { id: 'budget', label: 'Budžet', icon: Wallet },
  { id: 'packing', label: 'Pakovanje', icon: Backpack },
  { id: 'documents', label: 'Dokumenti', icon: FileText },
  { id: 'localinfo', label: 'Lokalne info', icon: Globe },
  { id: 'places', label: 'Mesta & restorani', icon: Star },
  { id: 'memories', label: 'Uspomene', icon: Camera },
  { id: 'pretrip', label: 'Pre-trip lista', icon: CheckSquare },
  { id: 'review', label: 'Utisci & ocene', icon: Heart },
]

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trip = useStore((s) => s.trips.find((t) => t.id === id))
  const deleteTrip = useStore((s) => s.deleteTrip)
  const [active, setActive] = useState('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  if (!trip) return <Navigate to="/" replace />

  const gradient = GRADIENT_MAP[trip.color] || GRADIENT_MAP.sunset
  const numDays = differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1

  const handleDelete = () => {
    if (window.confirm(`Obriši putovanje "${trip.title}"?`)) {
      deleteTrip(id)
      navigate('/')
    }
  }

  const selectSection = (sectionId) => {
    setActive(sectionId)
    setMobileNavOpen(false)
  }

  const activeNav = NAV.find((n) => n.id === active)

  const preTrip = trip.preTrip || []
  const preDone = preTrip.filter((p) => p.done).length

  function sectionBadge(id) {
    if (id === 'pretrip') return preDone < preTrip.length ? preTrip.length - preDone : null
    if (id === 'flights') return (trip.flights || []).length || null
    if (id === 'accommodation') return (trip.accommodations || []).length || null
    if (id === 'places') return (trip.places || []).length || null
    if (id === 'memories') return (trip.memories || []).length || null
    if (id === 'review') return (trip.review?.overallRating > 0) ? '⭐' : null
    return null
  }

  return (
    <div>
      {/* Trip header */}
      <div className={`rounded-3xl bg-gradient-to-r ${gradient} p-6 md:p-9 mb-6 text-white relative overflow-hidden shadow-lg`}>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-10 select-none">✈️</div>
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-white/75 hover:text-white text-sm mb-3 transition-colors">
          <ArrowLeft size={15} /> Nazad
        </button>
        <h1 className="text-3xl font-extrabold mb-1 relative">{trip.title}</h1>
        <div className="flex flex-wrap gap-4 text-white/80 text-sm relative">
          <span className="flex items-center gap-1"><MapPin size={13} />{trip.destination}</span>
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {format(parseISO(trip.startDate), 'dd.MM.yyyy')} — {format(parseISO(trip.endDate), 'dd.MM.yyyy')}
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{numDays} dana</span>
        </div>
        <button onClick={handleDelete} className="absolute top-5 right-5 text-white/40 hover:text-white/80 transition-colors">
          <Trash2 size={17} />
        </button>
      </div>

      <div className="flex gap-5">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex flex-col gap-1 w-52 flex-shrink-0">
          {NAV.map((item) => {
            const Icon = item.icon
            const badge = sectionBadge(item.id)
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                  active === item.id
                    ? 'bg-white shadow-sm text-rose-600'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badge != null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active === item.id ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </aside>

        {/* Mobile nav toggle */}
        <div className="lg:hidden w-full">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 mb-4"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              {activeNav && <activeNav.icon size={16} className="text-rose-500" />}
              {activeNav?.label}
            </div>
            {mobileNavOpen ? <X size={18} className="text-slate-400" /> : <Menu size={18} className="text-slate-400" />}
          </button>

          {mobileNavOpen && (
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 mb-4 overflow-hidden">
              {NAV.map((item) => {
                const Icon = item.icon
                const badge = sectionBadge(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => selectSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-slate-50 last:border-0 ${
                      active === item.id ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {badge != null && (
                      <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">{badge}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 hidden lg:block">
          {active === 'overview' && <OverviewSection trip={trip} numDays={numDays} />}
          {active === 'flights' && <FlightsSection trip={trip} />}
          {active === 'accommodation' && <AccommodationSection trip={trip} />}
          {active === 'itinerary' && <ItinerarySection trip={trip} numDays={numDays} />}
          {active === 'budget' && <BudgetSection trip={trip} />}
          {active === 'packing' && <PackingSection trip={trip} numDays={numDays} />}
          {active === 'documents' && <DocumentsSection trip={trip} />}
          {active === 'localinfo' && <LocalInfoSection trip={trip} />}
          {active === 'places' && <PlacesSection trip={trip} />}
          {active === 'memories' && <MemoriesSection trip={trip} />}
          {active === 'pretrip' && <PreTripSection trip={trip} />}
          {active === 'review' && <ReviewSection trip={trip} />}
        </main>
      </div>

      {/* Mobile main content (shown outside flex when nav is closed) */}
      <div className="lg:hidden">
        {!mobileNavOpen && (
          <>
            {active === 'overview' && <OverviewSection trip={trip} numDays={numDays} />}
            {active === 'flights' && <FlightsSection trip={trip} />}
            {active === 'accommodation' && <AccommodationSection trip={trip} />}
            {active === 'itinerary' && <ItinerarySection trip={trip} numDays={numDays} />}
            {active === 'budget' && <BudgetSection trip={trip} />}
            {active === 'packing' && <PackingSection trip={trip} numDays={numDays} />}
            {active === 'documents' && <DocumentsSection trip={trip} />}
            {active === 'localinfo' && <LocalInfoSection trip={trip} />}
            {active === 'places' && <PlacesSection trip={trip} />}
            {active === 'memories' && <MemoriesSection trip={trip} />}
            {active === 'pretrip' && <PreTripSection trip={trip} />}
            {active === 'review' && <ReviewSection trip={trip} />}
          </>
        )}
      </div>
    </div>
  )
}
