import { useState, useEffect } from 'react'
import { normalizeDestination } from './useDestinationData'

// ── Climate inference ────────────────────────────────────────────────────────
function inferClimate(destination, month) {
  const d = (destination || '').toLowerCase()
  if (/island|iceland|norveška|norway|finnland|stockholm|oslo|helsinki|reykjavik/.test(d)) return 'arctic'
  if (/tajland|thailand|bali|vietnam|singapur|singapore|maldiv|sri lanka|hawaii|kambodža|myanmar/.test(d)) return 'tropical'
  if (/dubai|maroko|morocco|egipat|egypt|sahara|jordan|oman/.test(d)) return 'desert'
  if (/švajcarska|switzerland|austrija|austria|peru|nepal|tibet|alp/.test(d)) return 'mountain'
  if (/italija|italy|španija|spain|grčka|greece|hrvatska|croatia|dubrovnik|rim|pariz|paris|portugal|turska|turkey/.test(d)) {
    if (month >= 5 && month <= 8) return 'med_summer'
    return 'med'
  }
  if (month >= 5 && month <= 8) return 'summer'
  if (month === 11 || month <= 1) return 'winter'
  return 'temperate'
}

function inferDestType(destination) {
  const d = (destination || '').toLowerCase()
  if (/island|iceland|norveška|norway|finska|finland/.test(d)) return 'arctic'
  if (/tajland|thailand|bali|vietnam|maldiv|hawaii/.test(d)) return 'tropical'
  if (/maroko|morocco/.test(d)) return 'desert'
  if (/alps|švajcarska|switzerland|austrija|austria|peru|nepal/.test(d)) return 'mountain'
  return 'city'
}

// ── Packing suggestions ──────────────────────────────────────────────────────
export function getPackingSuggestions(destination, startDate, numDays) {
  const month = startDate ? new Date(startDate).getMonth() : new Date().getMonth()
  const climate = inferClimate(destination, month)
  const d = (destination || '').toLowerCase()
  const isIceland = /island|iceland|reykjavik/.test(d)

  const items = []

  // Essentials always
  const essentials = [
    { item: 'Pasoš i lična karta', category: 'Dokumenti' },
    { item: 'Vozačka dozvola', category: 'Dokumenti' },
    { item: 'Štampane rezervacije (hotel, letovi)', category: 'Dokumenti' },
    { item: 'Putno osiguranje — polisa', category: 'Dokumenti' },
    { item: 'Gotovinska rezerva i kartice', category: 'Dokumenti' },
    { item: 'Telefon punjač + kabl', category: 'Elektronika' },
    { item: 'Prenosna baterija (powerbank)', category: 'Elektronika' },
    { item: 'Adapter za struju', category: 'Elektronika' },
    { item: 'Slušalice', category: 'Elektronika' },
    { item: 'Ibuprofen / paracetamol', category: 'Lekovi' },
    { item: 'Lekovi na recept', category: 'Lekovi' },
    { item: 'Flaster i mala kutija prve pomoći', category: 'Lekovi' },
    { item: 'Četkica i pasta za zube', category: 'Toaletna' },
    { item: 'Dezodorant', category: 'Toaletna' },
    { item: 'Šampon i balzam', category: 'Toaletna' },
    { item: 'Brijač / epilator', category: 'Toaletna' },
    { item: 'Krema za ruke i lice', category: 'Toaletna' },
  ]
  items.push(...essentials)

  if (climate === 'arctic' || climate === 'mountain' || climate === 'winter') {
    items.push(
      { item: 'Zimska jakna (vodootporna)', category: 'Odeća' },
      { item: 'Termalno donje rublje', category: 'Odeća' },
      { item: 'Vunene čarape x3', category: 'Odeća' },
      { item: 'Šal, kapa i rukavice', category: 'Odeća' },
      { item: 'Džemper ili fleece', category: 'Odeća' },
      { item: 'Tople pidžame', category: 'Odeća' },
      { item: 'Zimske čizme (vodootporne)', category: 'Obuća' },
      { item: 'Krema za usne — lip balm', category: 'Toaletna' },
      { item: 'Sunčane naočare (UV jači na snegu/ledu)', category: 'Nakit & aksesoare' },
    )
    if (isIceland) {
      items.push(
        { item: 'Gumene čizme / waterproof boots (lava i blato)', category: 'Obuća' },
        { item: 'Kabanica — rain jacket (česta kiša)', category: 'Odeća' },
        { item: 'Termo flaša', category: 'Ostalo' },
        { item: 'Kamera / dodatne baterije za aurora borealis', category: 'Elektronika', notes: 'Hladnoća prazni baterije brzo' },
      )
    }
  }

  if (climate === 'tropical') {
    items.push(
      { item: 'Kupaći kostim x2', category: 'Odeća' },
      { item: 'Lagane pamučne majice x4', category: 'Odeća' },
      { item: 'Kratke hlače x2', category: 'Odeća' },
      { item: 'Letnja haljina / lagane pantalone', category: 'Odeća' },
      { item: 'Sandale za grad', category: 'Obuća' },
      { item: 'Vodootporne japanke (za plažu)', category: 'Obuća' },
      { item: 'Krema za sunce SPF 50+', category: 'Toaletna' },
      { item: 'After sun krema', category: 'Toaletna' },
      { item: 'Repelent za insekte', category: 'Lekovi' },
      { item: 'Lekovi za probavu (česta na egzotičnim destinacijama)', category: 'Lekovi' },
      { item: 'Peškir za plažu (brzo sušeći)', category: 'Ostalo' },
      { item: 'Vodootporna torbica za telefon', category: 'Elektronika' },
      { item: 'Snorkeling maska (opciono)', category: 'Ostalo', notes: 'Ili iznajmite na mestu' },
    )
  }

  if (climate === 'med_summer') {
    items.push(
      { item: 'Kupaći kostim', category: 'Odeća' },
      { item: 'Lagane letnje majice x3', category: 'Odeća' },
      { item: 'Kratke hlače / suknja', category: 'Odeća' },
      { item: 'Lagana večernja odeća', category: 'Odeća' },
      { item: 'Šešir od sunca / kapa', category: 'Odeća' },
      { item: 'Sunčane naočare', category: 'Nakit & aksesoare' },
      { item: 'Krema za sunce SPF 30-50', category: 'Toaletna' },
      { item: 'After sun', category: 'Toaletna' },
      { item: 'Sandale za hodanje', category: 'Obuća' },
      { item: 'Udobne cipele (crkve, stari grad)', category: 'Obuća', notes: 'Bez otvorenih prstiju za crkve' },
    )
  }

  if (climate === 'desert') {
    items.push(
      { item: 'Lagana odeća dugih rukava (sunce)', category: 'Odeća' },
      { item: 'Kapa sa obodom / šešir', category: 'Odeća' },
      { item: 'Krema za sunce SPF 50+', category: 'Toaletna' },
      { item: 'Sunčane naočare UV400', category: 'Nakit & aksesoare' },
      { item: 'Flaša za vodu 2L', category: 'Ostalo' },
      { item: 'Marama za prašinu', category: 'Odeća' },
      { item: 'Konzervativna odeća (poštovanje kulture)', category: 'Odeća', notes: 'Ramena i kolena pokrivena' },
    )
  }

  if (climate === 'temperate' || climate === 'summer' || climate === 'med') {
    items.push(
      { item: 'Lagana jakna / vjetrovka', category: 'Odeća' },
      { item: 'Džemper', category: 'Odeća' },
      { item: 'Majice kratkih rukava x3', category: 'Odeća' },
      { item: 'Pantalone i farmerke', category: 'Odeća' },
      { item: 'Udobne cipele za hodanje', category: 'Obuća' },
      { item: 'Sunčane naočare', category: 'Nakit & aksesoare' },
      { item: 'Kišobran / kabanica', category: 'Odeća' },
    )
  }

  if (numDays > 7) {
    items.push({ item: 'Dodatno pakovanje rublja', category: 'Odeća', notes: 'Za dugo putovanje' })
  }

  return items.map((i) => ({ assignedTo: 'Oboje', quantity: '1', notes: '', ...i }))
}

// ── Itinerary suggestions ────────────────────────────────────────────────────
export function getItinerarySuggestions(destination, numDays) {
  const type = inferDestType(destination)

  const arcticDays = [
    { day: 1, theme: 'Dolazak i orijentacija', activities: [
      { time: '14:00', title: 'Dolazak i prijava u smeštaj', category: 'Hotel', location: '', notes: 'Odmorite se od dugog puta' },
      { time: '17:00', title: 'Šetnja po okolini smeštaja', category: 'Atrakcija', location: '', notes: 'Upoznajte komšiluk' },
      { time: '20:00', title: 'Večera u lokalnom restoranu', category: 'Restoran', location: '', notes: 'Probajte lokalne specijalitete' },
    ]},
    { day: 2, theme: 'Geotermalni čudesi', activities: [
      { time: '09:00', title: 'Blue Lagoon / geotermalna banja', category: 'Aktivnost', location: 'Blue Lagoon', notes: 'Rezervišite unapred!' },
      { time: '13:00', title: 'Ručak sa pogledom na lavu polja', category: 'Restoran', location: '', notes: '' },
      { time: '15:00', title: 'Vožnja kroz lava polja i kratki trekking', category: 'Atrakcija', location: '', notes: 'Nosite čvrstu obuću' },
    ]},
    { day: 3, theme: 'Golden Circle tura', activities: [
      { time: '08:30', title: 'Geysir — čuveni gejzir Strokkur', category: 'Atrakcija', location: 'Geysir', notes: 'Erupcija svakih 5-10 min' },
      { time: '11:00', title: 'Gullfoss — zlatni vodopad', category: 'Atrakcija', location: 'Gullfoss', notes: 'Jedan od najlepših vodopada Islanda' },
      { time: '14:00', title: 'Þingvellir — rascep tektonskih ploča', category: 'Atrakcija', location: 'Þingvellir', notes: 'UNESCO svetska baština' },
      { time: '20:00', title: 'Aurora borealis posmatranje', category: 'Aktivnost', location: '', notes: 'Daleko od svetlosti grada, jasno nebo potrebno' },
    ]},
    { day: 4, theme: 'Vodopadi i crne plaže', activities: [
      { time: '09:00', title: 'Seljalandsfoss — prolazak iza vodopada', category: 'Atrakcija', location: 'Seljalandsfoss', notes: 'Možete ući iza vodopada!' },
      { time: '11:00', title: 'Skógafoss vodopad', category: 'Atrakcija', location: 'Skógafoss', notes: 'Duga se često pojavljuje' },
      { time: '14:00', title: 'Reynisfjara — crna peščana plaža', category: 'Plaža', location: 'Vík', notes: 'Pažnja: opasni talasi, ne stajati blizu mora' },
    ]},
    { day: 5, theme: 'Glečeri i ledene pećine', activities: [
      { time: '09:00', title: 'Jökulsárlón — laguna ledenih santi', category: 'Atrakcija', location: 'Jökulsárlón', notes: 'Jedna od najfotogeničnijih lokacija' },
      { time: '11:00', title: 'Diamond Beach — led na crnoj plaži', category: 'Plaža', location: 'Diamond Beach', notes: '10 min od lagune' },
      { time: '14:00', title: 'Vatnajökull — tura glečerom', category: 'Aktivnost', location: 'Vatnajökull', notes: 'Rezervišite vodiča unapred' },
    ]},
  ]

  const tropicalDays = [
    { day: 1, theme: 'Dolazak i plaža', activities: [
      { time: '14:00', title: 'Dolazak i prijava u hotel/resort', category: 'Hotel', location: '', notes: '' },
      { time: '16:00', title: 'Prva šetnja plažom', category: 'Plaža', location: '', notes: 'Pronađite svoja omiljena mesta' },
      { time: '19:00', title: 'Sunset koktel i lokalna kuhinja', category: 'Restoran', location: '', notes: 'Probajte svežu ribu' },
    ]},
    { day: 2, theme: 'More i snorkeling', activities: [
      { time: '08:00', title: 'Jutarnje kupanje pre turista', category: 'Plaža', location: '', notes: 'Najmirniji deo dana' },
      { time: '10:00', title: 'Snorkeling / ronjenje tura', category: 'Aktivnost', location: '', notes: 'Iznajmite opremu ili rezervišite turu' },
      { time: '14:00', title: 'Odmor i lokalni ručak', category: 'Restoran', location: '', notes: 'Tržnica ili beach restaurant' },
      { time: '19:00', title: 'Noćna tržnica', category: 'Kupovina', location: '', notes: 'Lokalni začini, tkanine, suveniri' },
    ]},
    { day: 3, theme: 'Kultura i hramovi', activities: [
      { time: '08:00', title: 'Poseta lokalnim hramovima u jutarnjim satima', category: 'Atrakcija', location: '', notes: 'Pokrijte ramena i kolena' },
      { time: '11:00', title: 'Tradicionalni lokalni ručak', category: 'Restoran', location: '', notes: 'Naručite šta preporuči konobar' },
      { time: '15:00', title: 'Džungla / rice terraces tura', category: 'Priroda', location: '', notes: '' },
      { time: '20:00', title: 'Kulturni nastup / traditionalna muzika', category: 'Aktivnost', location: '', notes: '' },
    ]},
    { day: 4, theme: 'Avantura', activities: [
      { time: '07:00', title: 'Jutarnji trekking ili kayaking', category: 'Aktivnost', location: '', notes: 'Raniji start zbog vrućine' },
      { time: '13:00', title: 'Lokalni masaž ili spa', category: 'Aktivnost', location: '', notes: 'Tradicional massage, povoljno i odlično' },
      { time: '18:00', title: 'Sunset tour brodom', category: 'Aktivnost', location: '', notes: 'Rezervišite unapred' },
    ]},
  ]

  const cityDays = [
    { day: 1, theme: 'Dolazak i šetnja', activities: [
      { time: '14:00', title: 'Dolazak i prijava u smeštaj', category: 'Hotel', location: '', notes: '' },
      { time: '16:00', title: 'Šetnja po centru i orijentacija', category: 'Atrakcija', location: '', notes: 'Bez plana — impresije prve večeri' },
      { time: '20:00', title: 'Večera u restoranu u blizini', category: 'Restoran', location: '', notes: 'Pitajte osoblje u hotelu za preporuku' },
    ]},
    { day: 2, theme: 'Stari grad i arhitektura', activities: [
      { time: '09:00', title: 'Jutarnji espreso i šetnja starim gradom', category: 'Cafe/Bar', location: '', notes: 'Jutro je najlepše u starom gradu' },
      { time: '11:00', title: 'Poseta glavnoj atrakciji', category: 'Atrakcija', location: '', notes: 'Kupite karte unapred, izbegnite redove' },
      { time: '14:00', title: 'Ručak na lokalnoj tržnici', category: 'Restoran', location: '', notes: 'Probajte lokalna jela' },
      { time: '17:00', title: 'Razgledanje susednih četvrti', category: 'Atrakcija', location: '', notes: '' },
      { time: '20:00', title: 'Večera u preporučenom restoranu', category: 'Restoran', location: '', notes: '' },
    ]},
    { day: 3, theme: 'Kultura i gastronomija', activities: [
      { time: '10:00', title: 'Muzej ili galerija', category: 'Muzej', location: '', notes: 'Proverite radno vreme unapred' },
      { time: '13:00', title: 'Ručak na lokalnoj pijaci', category: 'Restoran', location: '', notes: 'Tržnica za lokalne ukuse' },
      { time: '15:00', title: 'Slobodan šoping ili razgledanje', category: 'Kupovina', location: '', notes: '' },
      { time: '19:00', title: 'Sunset sa visokog mesta (brdo, toranj...)', category: 'Atrakcija', location: '', notes: '' },
      { time: '21:00', title: 'Noćni život ili cocktail bar', category: 'Cafe/Bar', location: '', notes: '' },
    ]},
    { day: 4, theme: 'Izlet u okolinu', activities: [
      { time: '09:00', title: 'Izlet u okolinu (dan u prirodi ili drugi grad)', category: 'Aktivnost', location: '', notes: 'Rent a car ili organizovana tura' },
      { time: '13:00', title: 'Ručak van centra', category: 'Restoran', location: '', notes: '' },
      { time: '17:00', title: 'Povratak i odmor', category: 'Hotel', location: '', notes: '' },
      { time: '20:00', title: 'Oproštajna večera u omiljenom restoranu', category: 'Restoran', location: '', notes: 'Rezervišite sto unapred' },
    ]},
  ]

  const extraDay = (n) => ({
    day: n,
    theme: 'Slobodan dan',
    activities: [
      { time: '09:00', title: 'Jutarnja kafa i šetnja', category: 'Cafe/Bar', location: '', notes: '' },
      { time: '12:00', title: 'Istraživanje skrivenih draguljaи', category: 'Atrakcija', location: '', notes: 'Pitajte lokalne za preporuke' },
      { time: '15:00', title: 'Slobodno vreme — po sopstvenom nahođenju', category: 'Slobodno', location: '', notes: '' },
      { time: '20:00', title: 'Večera po sopstvenom izboru', category: 'Restoran', location: '', notes: '' },
    ],
  })

  const base = type === 'arctic' ? arcticDays : type === 'tropical' ? tropicalDays : cityDays

  const result = []
  for (let i = 1; i <= numDays; i++) {
    const template = base.find((d) => d.day === i)
    result.push(template ? { ...template, day: i } : extraDay(i))
  }
  return result
}

// ── Wikipedia place suggestions ───────────────────────────────────────────────
function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

function inferCategory(text) {
  const t = text.toLowerCase()
  if (/museum|gallery|galeri|muzej/.test(t)) return 'attraction'
  if (/restaurant|cafe|bar|bistro|cuisine|food|tavern|eatery/.test(t)) return 'restaurant'
  if (/beach|coast|sea|ocean|riviera/.test(t)) return 'beach'
  if (/park|garden|forest|nature reserve|national park|jungle/.test(t)) return 'nature'
  if (/castle|palace|cathedral|church|temple|mosque|basilica|fort/.test(t)) return 'attraction'
  if (/night|club|disco|lounge/.test(t)) return 'nightlife'
  if (/market|shopping|mall|bazaar|souk/.test(t)) return 'shopping'
  return 'attraction'
}

export function usePlaceSuggestions(destination) {
  const [state, setState] = useState({ loading: false, places: [] })

  useEffect(() => {
    if (!destination) return
    setState({ loading: true, places: [] })
    let cancelled = false

    const query = normalizeDestination(destination)

    async function fetchPlaces() {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' tourist attraction landmark')}&srlimit=6&format=json&origin=*`),
          fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' restaurant food cuisine')}&srlimit=4&format=json&origin=*`),
        ])
        const [d1, d2] = await Promise.all([r1.json(), r2.json()])
        if (cancelled) return

        const attract = (d1.query?.search || []).map((s) => ({ ...s, _type: 'attraction' }))
        const food = (d2.query?.search || []).map((s) => ({ ...s, _type: 'food' }))

        const seen = new Set()
        const all = [...attract, ...food].filter((p) => {
          if (seen.has(p.pageid)) return false
          seen.add(p.pageid)
          return true
        }).slice(0, 10)

        if (all.length === 0) { setState({ loading: false, places: [] }); return }

        const ids = all.map((p) => p.pageid).join('|')
        const imgResp = await fetch(`https://en.wikipedia.org/w/api.php?action=query&pageids=${ids}&prop=pageimages&pithumbsize=400&format=json&origin=*`)
        const imgData = await imgResp.json()
        if (cancelled) return

        const pages = imgData.query?.pages || {}
        const places = all.map((p) => ({
          id: p.pageid,
          name: p.title,
          description: stripHtml(p.snippet),
          imageUrl: pages[p.pageid]?.thumbnail?.source || null,
          category: p._type === 'food' ? 'restaurant' : inferCategory(p.title + ' ' + stripHtml(p.snippet)),
          priceLevel: p._type === 'food' ? '2' : null,
        }))

        if (!cancelled) setState({ loading: false, places })
      } catch {
        if (!cancelled) setState({ loading: false, places: [] })
      }
    }

    fetchPlaces()
    return () => { cancelled = true }
  }, [destination])

  return state
}
