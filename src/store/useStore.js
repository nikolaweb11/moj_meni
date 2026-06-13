import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_PRETIP = [
  { task: 'Proveri datum isteka pasoša', category: 'documents' },
  { task: 'Proveri da li treba viza', category: 'documents' },
  { task: 'Kupi putno osiguranje', category: 'documents' },
  { task: 'Rezerviši letove', category: 'booking' },
  { task: 'Rezerviši smeštaj', category: 'booking' },
  { task: 'Rezerviši rent a car (ako treba)', category: 'booking' },
  { task: 'Obavesti banku o putovanju', category: 'bank' },
  { task: 'Proveri kurs valute i podigi gotovinu', category: 'bank' },
  { task: 'Skini offline mape (Google Maps / Maps.me)', category: 'tech' },
  { task: 'Skini prevodilac offline', category: 'tech' },
  { task: 'Napravi bekap fotografija telefona', category: 'tech' },
  { task: 'Napuni power bank', category: 'tech' },
  { task: 'Organizuj čuvanje kućnih ljubimaca', category: 'home' },
  { task: 'Zaustavi poštu / obavesti komšije', category: 'home' },
  { task: 'Proveri vremenske prilike za destinaciju', category: 'other' },
  { task: 'Pakuj kofer', category: 'packing' },
  { task: 'Odštampaj rezervacije i itinerar', category: 'documents' },
]

const EMPTY_DOCS = () => ({
  name: '',
  passportNumber: '',
  passportExpiry: '',
  visaRequired: false,
  visaStatus: '',
  visaExpiry: '',
  insurance: { company: '', policyNumber: '', phone: '', coverage: '' },
  vaccinations: '',
})

const EMPTY_LOCAL_INFO = () => ({
  currency: '',
  exchangeRate: '',
  homeCurrency: 'EUR',
  emergencyNumbers: { police: '', ambulance: '', fire: '', embassy: '' },
  hospital: { name: '', address: '', phone: '' },
  usefulPhrases: [],
  culturalTips: '',
  simCard: '',
  timezone: '',
  voltage: '',
  language: '',
})

const EMPTY_REVIEW = () => ({
  overallRating: 0,
  summary: '',
  bestMoment: '',
  wouldChange: '',
  wouldGoAgain: '',
  ratings: { hotel: 0, food: 0, transport: 0, activities: 0, valueForMoney: 0 },
  photos: [],
  publishedDate: '',
})

function newTrip(data) {
  return {
    ...data,
    id: crypto.randomUUID(),
    // transport
    flights: [],
    transfers: [],
    rentalCar: null,
    // accommodation
    accommodations: [],
    // itinerary
    itinerary: [],
    // budget
    budget: { total: Number(data.budgetTotal) || 0, currency: data.currency || 'EUR', people: 2 },
    expenses: [],
    // documents
    documents: { person1: EMPTY_DOCS(), person2: EMPTY_DOCS() },
    // packing
    packingList: [],
    outfits: [],
    // local info
    localInfo: EMPTY_LOCAL_INFO(),
    // places
    places: [],
    // memories
    memories: [],
    // review
    review: EMPTY_REVIEW(),
    // pre-trip
    preTrip: DEFAULT_PRETIP.map((t) => ({ ...t, id: crypto.randomUUID(), done: false, deadline: '', notes: '' })),
    notes: '',
    // family wall
    familyWall: { guestPosts: [], dailyUpdates: [], photos: [] },
    // gallery
    gallery: [],
  }
}

const useStore = create(
  persist(
    (set, get) => ({
      couple: { name1: 'Ti', name2: 'Ona' },
      trips: [],
      bucketList: [],
      bgEnabled: true,
      bgSelectedPhoto: 'auto',
      userBgPhotos: [],
      photoInteractions: {},

      setCouple: (name1, name2) => set({ couple: { name1, name2 } }),
      setBgEnabled: (bgEnabled) => set({ bgEnabled }),
      setBgSelectedPhoto: (bgSelectedPhoto) => set({ bgSelectedPhoto }),
      addUserBgPhoto: (photo) => set((s) => ({ userBgPhotos: [...(s.userBgPhotos || []), { ...photo, id: crypto.randomUUID() }] })),
      removeUserBgPhoto: (id) => set((s) => ({ userBgPhotos: (s.userBgPhotos || []).filter((p) => p.id !== id) })),

      /* ── TRIPS ── */
      addTrip: (data) => set((s) => ({ trips: [...s.trips, newTrip(data)] })),

      updateTrip: (id, updates) =>
        set((s) => ({ trips: s.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),

      deleteTrip: (id) => set((s) => ({ trips: s.trips.filter((t) => t.id !== id) })),

      /* ── FLIGHTS ── */
      addFlight: (tripId, flight) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, flights: [...t.flights, { ...flight, id: crypto.randomUUID() }] }
          ),
        })),
      updateFlight: (tripId, flightId, updates) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, flights: t.flights.map((f) => (f.id === flightId ? { ...f, ...updates } : f)) }
          ),
        })),
      deleteFlight: (tripId, flightId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, flights: t.flights.filter((f) => f.id !== flightId) }
          ),
        })),

      /* ── TRANSFERS ── */
      addTransfer: (tripId, transfer) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, transfers: [...(t.transfers || []), { ...transfer, id: crypto.randomUUID() }] }
          ),
        })),
      deleteTransfer: (tripId, tid) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, transfers: t.transfers.filter((x) => x.id !== tid) }
          ),
        })),
      setRentalCar: (tripId, car) =>
        set((s) => ({ trips: s.trips.map((t) => (t.id !== tripId ? t : { ...t, rentalCar: car })) })),

      /* ── ACCOMMODATION ── */
      addAccommodation: (tripId, acc) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, accommodations: [...t.accommodations, { ...acc, id: crypto.randomUUID() }] }
          ),
        })),
      updateAccommodation: (tripId, accId, updates) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, accommodations: t.accommodations.map((a) => (a.id === accId ? { ...a, ...updates } : a)) }
          ),
        })),
      deleteAccommodation: (tripId, accId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, accommodations: t.accommodations.filter((a) => a.id !== accId) }
          ),
        })),

      /* ── ITINERARY ── */
      addActivity: (tripId, day, activity) =>
        set((s) => ({
          trips: s.trips.map((t) => {
            if (t.id !== tripId) return t
            const itin = [...t.itinerary]
            const idx = itin.findIndex((d) => d.day === day)
            const newAct = { ...activity, id: crypto.randomUUID(), done: false }
            if (idx >= 0) itin[idx] = { ...itin[idx], activities: [...itin[idx].activities, newAct] }
            else itin.push({ day, theme: '', notes: '', activities: [newAct] })
            return { ...t, itinerary: itin }
          }),
        })),
      toggleActivity: (tripId, day, actId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t, itinerary: t.itinerary.map((d) =>
                d.day !== day ? d : { ...d, activities: d.activities.map((a) => a.id === actId ? { ...a, done: !a.done } : a) }
              ),
            }
          ),
        })),
      deleteActivity: (tripId, day, actId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t, itinerary: t.itinerary.map((d) =>
                d.day !== day ? d : { ...d, activities: d.activities.filter((a) => a.id !== actId) }
              ),
            }
          ),
        })),
      updateDayMeta: (tripId, day, meta) =>
        set((s) => ({
          trips: s.trips.map((t) => {
            if (t.id !== tripId) return t
            const itin = [...t.itinerary]
            const idx = itin.findIndex((d) => d.day === day)
            if (idx >= 0) itin[idx] = { ...itin[idx], ...meta }
            else itin.push({ day, theme: '', notes: '', activities: [], ...meta })
            return { ...t, itinerary: itin }
          }),
        })),

      /* ── BUDGET ── */
      updateBudget: (tripId, budget) =>
        set((s) => ({ trips: s.trips.map((t) => (t.id !== tripId ? t : { ...t, budget: { ...t.budget, ...budget } })) })),
      addExpense: (tripId, expense) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, expenses: [...(t.expenses || []), { ...expense, id: crypto.randomUUID() }] }
          ),
        })),
      deleteExpense: (tripId, expId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, expenses: t.expenses.filter((e) => e.id !== expId) }
          ),
        })),

      /* ── PACKING ── */
      addPackingItem: (tripId, item) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, packingList: [...(t.packingList || []), { ...item, id: crypto.randomUUID(), packed: false }] }
          ),
        })),
      togglePackingItem: (tripId, itemId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, packingList: t.packingList.map((i) => i.id === itemId ? { ...i, packed: !i.packed } : i) }
          ),
        })),
      deletePackingItem: (tripId, itemId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, packingList: t.packingList.filter((i) => i.id !== itemId) }
          ),
        })),
      addOutfit: (tripId, outfit) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, outfits: [...(t.outfits || []), { ...outfit, id: crypto.randomUUID() }] }
          ),
        })),
      updateOutfit: (tripId, outfitId, updates) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, outfits: t.outfits.map((o) => o.id === outfitId ? { ...o, ...updates } : o) }
          ),
        })),
      deleteOutfit: (tripId, outfitId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, outfits: t.outfits.filter((o) => o.id !== outfitId) }
          ),
        })),

      /* ── DOCUMENTS ── */
      updateDocuments: (tripId, person, data) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, documents: { ...t.documents, [person]: { ...t.documents[person], ...data } } }
          ),
        })),

      /* ── LOCAL INFO ── */
      updateLocalInfo: (tripId, data) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, localInfo: { ...t.localInfo, ...data } }
          ),
        })),
      addPhrase: (tripId, phrase) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, localInfo: { ...t.localInfo, usefulPhrases: [...(t.localInfo?.usefulPhrases || []), { ...phrase, id: crypto.randomUUID() }] } }
          ),
        })),
      deletePhrase: (tripId, phraseId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, localInfo: { ...t.localInfo, usefulPhrases: t.localInfo.usefulPhrases.filter((p) => p.id !== phraseId) } }
          ),
        })),

      /* ── PLACES ── */
      addPlace: (tripId, place) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, places: [...(t.places || []), { ...place, id: crypto.randomUUID(), visited: false }] }
          ),
        })),
      updatePlace: (tripId, placeId, updates) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, places: t.places.map((p) => p.id === placeId ? { ...p, ...updates } : p) }
          ),
        })),
      deletePlace: (tripId, placeId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, places: t.places.filter((p) => p.id !== placeId) }
          ),
        })),

      /* ── MEMORIES ── */
      addMemory: (tripId, memory) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, memories: [...(t.memories || []), { ...memory, id: crypto.randomUUID(), photos: [] }] }
          ),
        })),
      updateMemory: (tripId, memId, updates) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, memories: t.memories.map((m) => m.id === memId ? { ...m, ...updates } : m) }
          ),
        })),
      deleteMemory: (tripId, memId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, memories: t.memories.filter((m) => m.id !== memId) }
          ),
        })),
      addPhoto: (tripId, memId, photo) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, memories: t.memories.map((m) => m.id === memId ? { ...m, photos: [...m.photos, { ...photo, id: crypto.randomUUID() }] } : m) }
          ),
        })),
      deletePhoto: (tripId, memId, photoId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, memories: t.memories.map((m) => m.id === memId ? { ...m, photos: m.photos.filter((p) => p.id !== photoId) } : m) }
          ),
        })),

      /* ── PRE-TRIP ── */
      togglePreTrip: (tripId, taskId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, preTrip: t.preTrip.map((p) => p.id === taskId ? { ...p, done: !p.done } : p) }
          ),
        })),
      addPreTripTask: (tripId, task) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, preTrip: [...t.preTrip, { ...task, id: crypto.randomUUID(), done: false }] }
          ),
        })),
      deletePreTripTask: (tripId, taskId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, preTrip: t.preTrip.filter((p) => p.id !== taskId) }
          ),
        })),
      updatePreTripTask: (tripId, taskId, updates) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, preTrip: t.preTrip.map((p) => p.id === taskId ? { ...p, ...updates } : p) }
          ),
        })),

      /* ── REVIEW ── */
      updateReview: (tripId, data) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, review: { ...(t.review || EMPTY_REVIEW()), ...data } }
          ),
        })),
      addReviewPhoto: (tripId, photo) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              review: {
                ...(t.review || EMPTY_REVIEW()),
                photos: [...(t.review?.photos || []), { ...photo, id: crypto.randomUUID() }],
              },
            }
          ),
        })),
      deleteReviewPhoto: (tripId, photoId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              review: {
                ...(t.review || EMPTY_REVIEW()),
                photos: (t.review?.photos || []).filter((p) => p.id !== photoId),
              },
            }
          ),
        })),

      /* ── GALLERY ── */
      addGalleryPhoto: (tripId, photo) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, gallery: [...(t.gallery || []), { ...photo, id: crypto.randomUUID(), date: new Date().toISOString() }] }
          ),
        })),
      deleteGalleryPhoto: (tripId, photoId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, gallery: (t.gallery || []).filter((p) => p.id !== photoId) }
          ),
        })),
      clearTripGallery: (tripId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : { ...t, gallery: [] }
          ),
        })),

      /* ── FAMILY WALL PHOTOS ── */
      addFamilyWallPhoto: (tripId, photo) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              familyWall: {
                ...(t.familyWall || {}),
                photos: [...(t.familyWall?.photos || []), { ...photo, id: crypto.randomUUID(), date: new Date().toISOString() }],
              },
            }
          ),
        })),
      deleteFamilyWallPhoto: (tripId, photoId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              familyWall: {
                ...(t.familyWall || {}),
                photos: (t.familyWall?.photos || []).filter((p) => p.id !== photoId),
              },
            }
          ),
        })),

      /* ── FAMILY WALL ── */
      addGuestPost: (tripId, post) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              familyWall: {
                ...(t.familyWall || { guestPosts: [], dailyUpdates: [] }),
                guestPosts: [...(t.familyWall?.guestPosts || []), { ...post, id: crypto.randomUUID(), date: new Date().toISOString() }],
              },
            }
          ),
        })),
      deleteGuestPost: (tripId, postId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              familyWall: {
                ...(t.familyWall || { guestPosts: [], dailyUpdates: [] }),
                guestPosts: (t.familyWall?.guestPosts || []).filter((p) => p.id !== postId),
              },
            }
          ),
        })),
      addDailyUpdate: (tripId, update) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              familyWall: {
                ...(t.familyWall || { guestPosts: [], dailyUpdates: [] }),
                dailyUpdates: [...(t.familyWall?.dailyUpdates || []), { ...update, id: crypto.randomUUID(), photos: update.photoUrl ? [{ id: crypto.randomUUID(), url: update.photoUrl }] : [], date: new Date().toISOString() }],
              },
            }
          ),
        })),
      deleteDailyUpdate: (tripId, updateId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              familyWall: {
                ...(t.familyWall || { guestPosts: [], dailyUpdates: [] }),
                dailyUpdates: (t.familyWall?.dailyUpdates || []).filter((u) => u.id !== updateId),
              },
            }
          ),
        })),
      addDailyPhoto: (tripId, updateId, photo) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId ? t : {
              ...t,
              familyWall: {
                ...(t.familyWall || { guestPosts: [], dailyUpdates: [] }),
                dailyUpdates: (t.familyWall?.dailyUpdates || []).map((u) =>
                  u.id !== updateId ? u : { ...u, photos: [...u.photos, { ...photo, id: crypto.randomUUID() }] }
                ),
              },
            }
          ),
        })),

      /* ── PHOTO INTERACTIONS ── */
      togglePhotoLike: (idx) => set((s) => {
        const prev = s.photoInteractions?.[idx] || { liked: false, reactions: [], comments: [] }
        return { photoInteractions: { ...s.photoInteractions, [idx]: { ...prev, liked: !prev.liked } } }
      }),
      togglePhotoReaction: (idx, emoji) => set((s) => {
        const prev = s.photoInteractions?.[idx] || { liked: false, reactions: [], comments: [] }
        const reactions = (prev.reactions || []).includes(emoji)
          ? prev.reactions.filter((r) => r !== emoji)
          : [...(prev.reactions || []), emoji]
        return { photoInteractions: { ...s.photoInteractions, [idx]: { ...prev, reactions } } }
      }),
      addPhotoComment: (idx, text, author) => set((s) => {
        const prev = s.photoInteractions?.[idx] || { liked: false, reactions: [], comments: [] }
        return {
          photoInteractions: {
            ...s.photoInteractions,
            [idx]: { ...prev, comments: [...(prev.comments || []), { id: crypto.randomUUID(), text, author, date: new Date().toISOString() }] },
          },
        }
      }),
      deletePhotoComment: (idx, commentId) => set((s) => {
        const prev = s.photoInteractions?.[idx] || { liked: false, reactions: [], comments: [] }
        return {
          photoInteractions: {
            ...s.photoInteractions,
            [idx]: { ...prev, comments: (prev.comments || []).filter((c) => c.id !== commentId) },
          },
        }
      }),

      /* ── BUCKET LIST ── */
      addBucketItem: (item) =>
        set((s) => ({ bucketList: [...s.bucketList, { ...item, id: crypto.randomUUID(), done: false }] })),
      toggleBucketItem: (id) =>
        set((s) => ({ bucketList: s.bucketList.map((i) => (i.id === id ? { ...i, done: !i.done } : i)) })),
      deleteBucketItem: (id) =>
        set((s) => ({ bucketList: s.bucketList.filter((i) => i.id !== id) })),

      resetAll: () => set({ trips: [], bucketList: [], couple: { name1: 'Ti', name2: 'Ona' } }),
    }),
    { name: 'nas-odmor-v2' }
  )
)

export default useStore
