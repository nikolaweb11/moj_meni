import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { differenceInDays, parseISO, format } from 'date-fns'
import {
  ArrowLeft, Trash2, MapPin, Calendar, LayoutDashboard,
  PlaneTakeoff, Building2, CalendarDays, Wallet,
  Backpack, FileText, Globe, Star, Camera, CheckSquare, Menu, X, Heart, Users,
} from 'lucide-react'
import useStore from '../store/useStore'
import { useDestinationData, getDestinationTheme } from '../hooks/useDestinationData'
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
import FamilyWallSection from '../sections/FamilyWallSection'

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
  { id: 'familywall', label: 'Porodični zid', icon: Users },
]

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trip = useStore((s) => s.trips.find((t) => t.id === id))
  const deleteTrip = useStore((s) => s.deleteTrip)
  const [active, setActive] = useState('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const destData = useDestinationData(trip?.destination)
  const theme = getDestinationTheme(trip?.destination)

  if (!trip) return <Navigate to="/" replace />

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

  function sectionBadge(navId) {
    if (navId === 'pretrip') return preDone < preTrip.length ? preTrip.length - preDone : null
    if (navId === 'flights') return (trip.flights || []).length || null
    if (navId === 'accommodation') return (trip.accommodations || []).length || null
    if (navId === 'places') return (trip.places || []).length || null
    if (navId === 'memories') return (trip.memories || []).length || null
    if (navId === 'review') return (trip.review?.overallRating > 0) ? '⭐' : null
    if (navId === 'familywall') {
      const total = (trip.familyWall?.guestPosts?.length || 0) + (trip.familyWall?.dailyUpdates?.length || 0)
      return total || null
    }
    return null
  }

  const headerBg = destData.imageUrl
    ? { backgroundImage: `url(${destData.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }

  return (
    <div>
      {/* Trip header */}
      <div className="rounded-2xl overflow-hidden mb-6 relative shadow-lg" style={{ minHeight: 160, ...headerBg }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/15" />
        {!destData.imageUrl && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-15 select-none">{theme.flag}</div>
        )}
        <div className="relative p-6 md:p-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={15} /> Nazad
          </button>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{trip.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/65 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} style={{ color: theme.accent }} />{trip.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-white/40" />
              {format(parseISO(trip.startDate), 'dd.MM.yyyy')} — {format(parseISO(trip.endDate), 'dd.MM.yyyy')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white/85" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
              {numDays} dana
            </span>
          </div>
        </div>
        <button onClick={handleDelete} className="absolute top-5 right-5 text-white/30 hover:text-white/70 transition-colors">
          <Trash2 size={17} />
        </button>
      </div>

      <div className="flex gap-5">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex flex-col gap-0.5 w-52 flex-shrink-0">
          {NAV.map((item) => {
            const Icon = item.icon
            const badge = sectionBadge(item.id)
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                  active === item.id
                    ? 'bg-forest text-white shadow-sm'
                    : 'text-ink-light hover:bg-white hover:text-ink hover:shadow-sm'
                }`}
              >
                <Icon size={15} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badge != null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active === item.id ? 'bg-white/20 text-white' : 'bg-linen text-mist'}`}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden w-full">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-linen mb-4"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              {activeNav && <activeNav.icon size={16} className="text-forest" />}
              {activeNav?.label}
            </div>
            {mobileNavOpen ? <X size={18} className="text-mist" /> : <Menu size={18} className="text-mist" />}
          </button>
          {mobileNavOpen && (
            <div className="bg-white rounded-2xl shadow-md border border-linen mb-4 overflow-hidden">
              {NAV.map((item) => {
                const Icon = item.icon
                const badge = sectionBadge(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => selectSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-linen last:border-0 ${active === item.id ? 'bg-forest/5 text-forest' : 'text-ink-light hover:bg-parchment'}`}
                  >
                    <Icon size={15} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {badge != null && <span className="text-xs bg-linen text-mist px-1.5 py-0.5 rounded-full">{badge}</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Main content desktop */}
        <main className="flex-1 min-w-0 hidden lg:block">
          {active === 'overview' && <OverviewSection trip={trip} numDays={numDays} destData={destData} />}
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
          {active === 'familywall' && <FamilyWallSection trip={trip} />}
        </main>
      </div>

      {/* Mobile main content */}
      <div className="lg:hidden">
        {!mobileNavOpen && (
          <>
            {active === 'overview' && <OverviewSection trip={trip} numDays={numDays} destData={destData} />}
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
            {active === 'familywall' && <FamilyWallSection trip={trip} />}
          </>
        )}
      </div>
    </div>
  )
}
