import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MapPin, Calendar, Plane, X, ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Trash2 } from 'lucide-react'
import { format, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns'
import useStore from '../store/useStore'
import { getDestinationTheme, useDestinationData } from '../hooks/useDestinationData'
import { ALL_PHOTOS } from '../components/BackgroundPhoto'

function daysLabel(n) {
  return n === 1 ? '1 dan' : `${n} dana`
}

const BIBLE_VERSES = [
  { text: '„Zato će čovek ostaviti oca svog i mater svoju i prionuće uz ženu svoju, i biće jedno telo."', ref: 'Postanje 2:24' },
  { text: '„Gde ti pođeš, pođem i ja; i gde se ti zaustavlješ, zaustavim se i ja; tvoj narod je moj narod, i tvoj Bog moj Bog."', ref: 'Ruta 1:16' },
  { text: '„Metni me kao pečat na srce svoje, kao pečat na mišicu svoju; jer je ljubav jaka kao smrt... Velike vode ne mogu ugasiti ljubavi, niti je reke mogu potopiti."', ref: 'Pesma nad pesmama 8:6–7' },
  { text: '„Bolje je dvoje nego jedno, jer imaju dobru nagradu za trud svoj. Jer ako padnu, jedan će podignuti drugoga."', ref: 'Propovedač 4:9–10' },
  { text: '„Ljubav je dugotrpeljiva, blagoutrobna je ljubav, ljubav ne zavidi, ljubav se ne hvališe, ne nadima se. Ne radi ništa što se ne pristoji, ne traži svoje, ne jeda se, ne misli o zlu."', ref: '1. Korinćanima 13:4–5' },
  { text: '„Muževi, ljubite žene svoje, kao što i Hristos zavolijo crkvu i predao sebe za nju."', ref: 'Efescima 5:25' },
  { text: '„A nad sve ovo obucite ljubav, koja je veza savršenstva. I mir Božiji da vlada u srcima vašim."', ref: 'Kološanima 3:14–15' },
  { text: '„Nije dobro da je čovek sam; načiniću mu pomoć prema njemu."', ref: 'Postanje 2:18' },
  { text: '„Nađoh onoga koga ljubi duša moja; uhvatih ga i ne pustih ga."', ref: 'Pesma nad pesmama 3:4' },
  { text: '„Ko nađe ženu dobru, nađe dobro i dobija blagoslov od Gospoda."', ref: 'Priče 18:22' },
  { text: '„Raduj se sa ženom mladosti svoje... neka te kiti njena ljubav svagda, i u njezinoj ljubavi budi svagda zanesen."', ref: 'Priče 5:18–19' },
  { text: '„Ni smrt, ni život, ni anđeli, ni poglavarstva, ni sile, ni sadašnjost, ni budućnost, ni visina, ni dubina, neće moći nas rastaviti od ljubavi Božije."', ref: 'Rimljanima 8:38–39' },
  { text: '„Draga moja je moja i ja sam njen, koji pase između ljiljana."', ref: 'Pesma nad pesmama 2:16' },
  { text: '„Ljubav neka bude nepritvorena... U ljubavi bratskoj jedni drugima budite nežni, u poštovanju jedni druge predupređujte."', ref: 'Rimljanima 12:9–10' },
  { text: '„I stvori Bog čoveka po obličju svome... muško i žensko stvori ih. I blagoslovi ih Bog."', ref: 'Postanje 1:27–28' },
]

const TRAVEL_QUOTES = [
  { text: '„Putovati je živeti."', ref: '— Hans Christian Andersen' },
  { text: '„Svet je knjiga, a oni koji ne putuju čitaju samo jednu stranu."', ref: '— Sveti Avgustin' },
  { text: '„Putovati s voljenom osobom pretvara i nepoznato mesto u dom."', ref: '— Sharyn McCrumb' },
  { text: '„Jedini trezor koji ne može da se ukrade je bogatstvo iskustava."', ref: '— stara izreka' },
  { text: '„Putnici nikada ne stignu na isti cilj — jer svako nosi sopstveni horizont u srcu."', ref: '— Martin Buber' },
  { text: '„Lepotica putovanja nije u odredištu, već u svemu što se dogodi usput."', ref: '— neznanog autora' },
  { text: '„Kad putujemo, shvatamo koliko je svet velik i koliko smo mi mali — i to oslobađa."', ref: '— neznanog autora' },
  { text: '„Svako putovanje s voljenom osobom jeste i povratak kući."', ref: '— neznanog autora' },
  { text: '„Nema lepšeg prizora nego dvoje srećnih ljudi koji zajedno gledaju u isti zalazak sunca."', ref: '— neznanog autora' },
  { text: '„Putovanje nas uči da budemo zahvalni za sve što imamo — i za sve što nismo znali da smo željeli."', ref: '— Mary Anne Radmacher' },
  { text: '„Jedini način da se otkrije granica mogućeg jeste da se malo ode iza nje."', ref: '— Arthur C. Clarke' },
  { text: '„Dok putujemo, ne menjamo samo mesta — menjamo i sebe."', ref: '— Anatole France' },
  { text: '„Putovanje s partnerom je najpouzdaniji test ljubavi — i najpouzdaniji izvor najlepših uspomena."', ref: '— neznanog autora' },
  { text: '„Najdraže fotografije nisu one najsavršenije — već one koje pamte taj miris, taj smeh, taj trenutak."', ref: '— neznanog autora' },
  { text: '„Svet je pun čuda. Treba samo izaći iz kuće."', ref: '— J.R.R. Tolkien' },
]

// 0-based indices of photos where both Nikola & Andjela appear together
const COUPLE_PHOTOS = new Set([0,1,4,12,13,14,15,16,23,24,26,31,45,46,47,48,49,50,51,52,53,54,56,57,58,60,61])

const REACTIONS = ['❤️', '😍', '😂', '😮', '😢', '🔥']

function HeroCarousel({ couple }) {
  const trackRef = useRef()
  const [lightbox, setLightbox] = useState(null)
  const [commentText, setCommentText] = useState('')
  const photoInteractions = useStore((s) => s.photoInteractions)
  const togglePhotoLike = useStore((s) => s.togglePhotoLike)
  const togglePhotoReaction = useStore((s) => s.togglePhotoReaction)
  const addPhotoComment = useStore((s) => s.addPhotoComment)
  const deletePhotoComment = useStore((s) => s.deletePhotoComment)

  const scrollTrack = (dir) => {
    const el = trackRef.current
    if (!el) return
    const itemW = (el.querySelector('button')?.offsetWidth || 96) + 12
    const visibleCount = Math.floor(el.clientWidth / itemW) || 1
    el.scrollBy({ left: dir * itemW * visibleCount, behavior: 'smooth' })
  }

  const closeLightbox = useCallback(() => {
    setLightbox(null)
    setCommentText('')
  }, [])
  const prevPhoto = useCallback((e) => { e?.stopPropagation(); setLightbox(i => Math.max(0, i - 1)) }, [])
  const nextPhoto = useCallback((e) => { e?.stopPropagation(); setLightbox(i => Math.min(ALL_PHOTOS.length - 1, i + 1)) }, [])

  useEffect(() => {
    if (lightbox === null) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prevPhoto()
      else if (e.key === 'ArrowRight') nextPhoto()
      else if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prevPhoto, nextPhoto, closeLightbox])

  const getQuote = (idx) => {
    if (COUPLE_PHOTOS.has(idx)) return BIBLE_VERSES[idx % BIBLE_VERSES.length]
    return TRAVEL_QUOTES[idx % TRAVEL_QUOTES.length]
  }

  const interactions = lightbox !== null ? (photoInteractions?.[lightbox] || { liked: false, reactions: [], comments: [] }) : null

  const handleComment = (e) => {
    e.preventDefault()
    if (!commentText.trim() || lightbox === null) return
    addPhotoComment(lightbox, commentText.trim(), couple.name1 || 'Ti')
    setCommentText('')
  }

  return (
    <div className="space-y-5">
      {/* Circles row */}
      <div className="relative flex items-center gap-2">
        <button
          onClick={() => scrollTrack(-1)}
          className="flex-shrink-0 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-ink-light hover:text-forest hover:shadow-lg transition-all border border-linen z-10"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={trackRef}
          className="flex gap-3 flex-1 py-2"
          style={{
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {ALL_PHOTOS.map((url, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[3px] border-white shadow-md hover:border-forest hover:scale-105 hover:shadow-lg transition-all"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTrack(1)}
          className="flex-shrink-0 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-ink-light hover:text-forest hover:shadow-lg transition-all border border-linen z-10"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Text below circles */}
      <div className="text-center space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-mist">✈️ Naša priča</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
          {couple.name1} & {couple.name2}
        </h1>
        <p className="text-ink-light/70 text-base font-display italic">Daleko od kuće, bliže jedno drugom</p>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex"
          style={{ backgroundColor: 'rgba(14,5,10,0.95)', backdropFilter: 'blur(20px)' }}
        >
          {/* Prev */}
          {lightbox > 0 && (
            <button
              onClick={prevPhoto}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* Counter */}
          <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs z-10">
            {lightbox + 1} / {ALL_PHOTOS.length}
          </p>

          {/* Main content */}
          <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
            {/* Photo side */}
            <div className="flex-shrink-0 md:flex-1 flex items-center justify-center p-6 pt-16 md:pt-6">
              <div className="w-full max-w-sm md:max-w-md" onClick={(e) => e.stopPropagation()}>
                <img
                  src={ALL_PHOTOS[lightbox]}
                  alt=""
                  className="w-full rounded-3xl shadow-2xl object-cover"
                  style={{ maxHeight: '55vh' }}
                />
                {/* Quote */}
                <div className="text-center px-2 mt-5 max-w-sm mx-auto">
                  <p className="font-display italic text-white/85 text-base md:text-lg leading-relaxed">
                    {getQuote(lightbox).text}
                  </p>
                  <p className="text-white/40 text-xs mt-2 tracking-wide">{getQuote(lightbox).ref}</p>
                </div>
              </div>
            </div>

            {/* Interactions side */}
            <div
              className="md:w-80 bg-white/5 border-t md:border-t-0 md:border-l border-white/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Like + reactions */}
              <div className="p-4 border-b border-white/10 space-y-3">
                <button
                  onClick={() => togglePhotoLike(lightbox)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${interactions?.liked ? 'text-red-400' : 'text-white/60 hover:text-white/90'}`}
                >
                  <Heart size={20} fill={interactions?.liked ? 'currentColor' : 'none'} />
                  {interactions?.liked ? 'Lajkovano' : 'Lajkuj'}
                </button>
                <div className="flex gap-2 flex-wrap">
                  {REACTIONS.map((emoji) => {
                    const active = interactions?.reactions?.includes(emoji)
                    return (
                      <button
                        key={emoji}
                        onClick={() => togglePhotoReaction(lightbox, emoji)}
                        className={`text-xl rounded-full px-2 py-1 transition-all ${active ? 'bg-white/20 scale-110' : 'hover:bg-white/10 opacity-60 hover:opacity-100'}`}
                      >
                        {emoji}
                      </button>
                    )
                  })}
                </div>
                {interactions?.reactions?.length > 0 && (
                  <p className="text-white/50 text-xs">{interactions.reactions.join(' ')}</p>
                )}
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {(!interactions?.comments || interactions.comments.length === 0) && (
                  <p className="text-white/30 text-sm text-center mt-4">
                    <MessageCircle size={20} className="mx-auto mb-2 opacity-40" />
                    Nema komentara još
                  </p>
                )}
                {interactions?.comments?.map((c) => (
                  <div key={c.id} className="group flex gap-2">
                    <div className="flex-1 bg-white/8 rounded-2xl px-3 py-2">
                      <p className="text-white/90 text-xs font-semibold mb-0.5">{c.author}</p>
                      <p className="text-white/70 text-sm leading-snug">{c.text}</p>
                    </div>
                    <button
                      onClick={() => deletePhotoComment(lightbox, c.id)}
                      className="opacity-0 group-hover:opacity-100 self-center text-white/30 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <form onSubmit={handleComment} className="p-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Dodaj komentar..."
                  className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/15 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center disabled:opacity-30 hover:bg-forest-light transition-colors flex-shrink-0"
                >
                  <Send size={14} className="text-white" />
                </button>
              </form>
            </div>
          </div>

          {/* Next */}
          {lightbox < ALL_PHOTOS.length - 1 && (
            <button
              onClick={nextPhoto}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </div>
  )
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
      <HeroCarousel couple={couple} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard value={trips.length} label="Putovanja" sub="ukupno" color="text-forest" />
        <StatCard value={upcoming.length} label="Nadolazeće" sub="planiranih" color="text-gold" />
        <StatCard value={completed.length} label="Završeno" sub="odmora" color="text-terra" />
        <StatCard value={bucketList.length - bucketDone} label="Lista želja" sub="destinacija" color="text-mist" />
      </div>

      {/* Travel wisdom */}
      <TravelWisdom />

      {/* Ongoing */}
      {ongoing.length > 0 && (
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
            <h2 className="font-display text-xl font-semibold text-ink">Trenutno na putu</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {ongoing.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">Nadolazeća putovanja</h2>
          <Link to="/trips/new" className="text-sm text-forest font-medium hover:text-forest-light transition-colors">
            + Dodaj novo
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState title="Nema planiranih putovanja" subtitle="Dodaj vaš sledeći odmor i počni da planiraš" cta="Planiraj odmor" to="/trips/new" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </div>
        )}
      </section>

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-4">Prošla putovanja</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((trip) => <TripCard key={trip.id} trip={trip} completed />)}
          </div>
        </section>
      )}

      {/* Bucket list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Lista želja <span className="text-base font-normal text-mist">({bucketDone}/{bucketList.length})</span>
          </h2>
          <Link to="/bucket-list" className="text-sm text-forest font-medium hover:text-forest-light transition-colors">Vidi sve →</Link>
        </div>
        {bucketList.length === 0 ? (
          <EmptyState title="Lista želja je prazna" subtitle="Dodaj destinacije iz snova" cta="Dodaj destinaciju" to="/bucket-list" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {bucketList.slice(0, 8).map((item) => (
              <span key={item.id} className={`px-4 py-2 rounded-full text-sm font-medium border ${item.done ? 'bg-forest/10 text-forest border-forest/20' : 'bg-white border-linen text-ink-light'}`}>
                {item.done ? '✓ ' : ''}{item.destination}, {item.country}
              </span>
            ))}
            {bucketList.length > 8 && (
              <Link to="/bucket-list" className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-linen text-mist hover:border-forest transition-colors">
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
  const theme = getDestinationTheme(trip.destination)
  const { imageUrl } = useDestinationData(trip.destination)
  const numDays = differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1
  const totalSpent = (trip.expenses || []).reduce((s, e) => s + Number(e.amount), 0)

  const cardBg = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }

  return (
    <Link
      to={`/trips/${trip.id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-linen hover:-translate-y-0.5 ${completed ? 'opacity-80' : ''}`}
    >
      <div className="h-36 flex items-end p-4 relative overflow-hidden" style={cardBg}>
        {!imageUrl && (
          <div className="absolute right-3 top-2 text-7xl opacity-15 select-none leading-none">{theme.flag}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {completed && (
          <span className="absolute top-3 left-3 bg-white/15 backdrop-blur-sm text-white/90 text-xs px-2.5 py-0.5 rounded-full font-medium">✓ Završeno</span>
        )}
        <h3 className="relative font-display text-white font-semibold text-lg leading-tight group-hover:translate-x-0.5 transition-transform">
          {trip.title}
        </h3>
      </div>
      <div className="p-4 space-y-2.5">
        <div className="flex items-center gap-1.5 text-ink-light text-sm">
          <MapPin size={13} style={{ color: theme.accent }} />
          <span>{trip.destination}</span>
        </div>
        <div className="flex items-center gap-1.5 text-ink-light/70 text-sm">
          <Calendar size={13} className="text-mist" />
          {format(parseISO(trip.startDate), 'dd.MM.yyyy')} — {format(parseISO(trip.endDate), 'dd.MM.yyyy')}
        </div>
        <div className="flex items-center justify-between text-xs text-mist pt-2 border-t border-linen">
          <span className="flex items-center gap-1"><Plane size={11} /> {daysLabel(numDays)}</span>
          {trip.budget?.total > 0 && (
            <span>
              {totalSpent > 0 ? `${totalSpent.toFixed(0)} / ${trip.budget.total} ${trip.budget.currency}` : `${trip.budget.total} ${trip.budget.currency}`}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function StatCard({ value, label, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-linen shadow-sm">
      <div className={`text-3xl font-display font-bold ${color} mb-0.5`}>{value}</div>
      <div className="text-sm font-medium text-ink leading-tight">{label}</div>
      <div className="text-xs text-mist">{sub}</div>
    </div>
  )
}

const WISDOM = [
  { icon: '🧭', title: 'Iskustvo je sve', text: 'Nećete pamtiti cene karata ni hotelske sobe. Pamtićete miris mora u zoru, smeh koji vas je iznenadio, i trenutke kad ste bili potpuno prisutni.' },
  { icon: '🐢', title: 'Idi sporije', text: 'Brzina preskače suštinu. Grad koji vidite kroz prozor autobusa razlikuje se od grada koji hodite pešice, gubite se u, otkrivate sa stanarima.' },
  { icon: '💑', title: 'Putovanje je test i nagrada', text: 'Putovanje sa partnerom otkriva vas jedne drugima više od godinu dana zajedničkog života. Odluke, stres, oduševljenje — sve se uvećava na putu. To je dar.' },
  { icon: '🗺️', title: 'Plan je polazna tačka', text: 'Najbolji trenuci se dešavaju van plana. Planirajte dovoljno da se osećate sigurno, ali ostavite prostor za slučajan skret koji postaje priča za ceo život.' },
  { icon: '🙏', title: 'Poštujte mesto', text: 'Svaka zemlja ima dušu. Ona se ne vidi u turističkim kartama već u navikama, greškama i ljubaznostima lokalaca. Putnik koji sluša i posmatra učiće više od onog koji stalno govori.' },
  { icon: '📷', title: 'Nekad spustite fotoaparat', text: 'Fotografija čuva trenutak, ali ga i prekida. Neke prizore treba samo gledati — dišući ih, osećajući. Neka vaša memorija bude najvažniji album.' },
]

function TravelWisdom() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-ink">Filozofija putovanja</h2>
        <p className="text-sm text-mist mt-0.5">Šta čini putovanje nezaboravnim</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {WISDOM.map((w) => (
          <div key={w.title} className="bg-white rounded-2xl p-4 border border-linen shadow-sm hover:shadow-md transition-shadow">
            <span className="text-2xl mb-2 block">{w.icon}</span>
            <h3 className="font-display font-semibold text-ink text-sm mb-1.5">{w.title}</h3>
            <p className="text-xs text-ink-light leading-relaxed">{w.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function EmptyState({ title, subtitle, cta, to }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-linen">
      <p className="font-display font-semibold text-ink-light text-lg mb-1">{title}</p>
      <p className="text-sm text-mist mb-5">{subtitle}</p>
      <Link to={to} className="inline-flex items-center gap-1.5 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-light transition-colors">
        <Plus size={15} /> {cta}
      </Link>
    </div>
  )
}
