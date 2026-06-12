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

// ── Flight suggestions ────────────────────────────────────────────────────────
export function getFlightSuggestions(destination) {
  const type = inferDestType(destination)
  const d = (destination || '').toLowerCase()

  const isRome = /rim|rome|roma|italija|italy/.test(d)
  const isParis = /pariz|paris|francuska|france/.test(d)
  const isBarcelona = /barcelona|španija|spain/.test(d)
  const isAmsterdam = /amsterdam|holandija|netherlands/.test(d)
  const isVienna = /beč|wien|vienna|austrija/.test(d)
  const isPrague = /prag|prague|češka|czech/.test(d)
  const isLondon = /london|britanija|uk|england/.test(d)
  const isBangkok = /tajland|thailand|bangkok/.test(d)
  const isBali = /bali/.test(d)
  const isDubai = /dubai/.test(d)
  const isIceland = /island|iceland|reykjavik/.test(d)
  const isNorway = /norveška|norway|oslo/.test(d)

  const commonTips = [
    {
      icon: '🔔',
      title: 'Postavite alert za cene',
      description: 'Google Flights, Skyscanner i Kiwi.com nude obaveštenja kada cena padne. Pratite isti let nedelju-dve pre kupovine — cene fluktuiraju.',
    },
    {
      icon: '🧳',
      title: 'Prtljag — ručni vs. predani',
      description: 'Niskobudžetni prevoznici (Wizz Air, Ryanair) naplaćuju predani prtljag posebno. Uvek proverite šta je uključeno u cenu karte pre potvrde rezervacije.',
    },
    {
      icon: '📱',
      title: 'Online check-in',
      description: 'Uradite online check-in 24-48h pre leta. Štedi vreme na aerodromu i često omogućava besplatan izbor sedišta. Preuzmite boarding pass na telefon.',
    },
    {
      icon: '⏰',
      title: 'Stignite na aerodrom na vreme',
      description: 'Za međunarodne letove preporučuje se dolazak 2.5-3h pre poletanja. Beogradski aerodrom "Nikola Tesla" (BEG) može biti gužvan, posebno u letnjem periodu.',
    },
  ]

  if (type === 'arctic') {
    const dest = isIceland ? 'Reykjavik (KEF)' : isNorway ? 'Oslo (OSL)' : 'skandinavsku destinaciju'
    const airportTip = isIceland
      ? 'Iz aerodroma Keflavik (KEF) do Reykjavika ide Flybus (~50€) ili taksi (~130€). Rent a car je preporučljiv za obilazak Islanda — Ring Road zahteva vozilo.'
      : 'Većina skandinavskih gradova ima odličan javni prevoz od aerodroma — metro, ekspresni voz ili autobus do centra za 15-25€.'
    return [
      {
        icon: '✈️',
        title: `Letovi do ${dest}`,
        description: 'Direktni letovi iz Beograda (BEG) nisu česti — tražite Air Serbia + Icelandair via Kopenhagen ili SAS via Stockholm. Konekcija dodaje 2-4h, ali često je jeftinija.',
      },
      {
        icon: '📅',
        title: 'Kada knjižiti',
        description: 'Knjižite 2-3 meseca unapred za bolju cenu, posebno za letnji period (jun-avg) koji je najpopularniji. Zimski letovi za northern lights su traženi od novembra do marta.',
      },
      {
        icon: '🚌',
        title: 'Prevoz od aerodroma',
        description: airportTip,
      },
      ...commonTips,
      {
        icon: '💡',
        title: 'Pro tip za sever',
        description: 'Leti rano ujutru ili kasno uveče — cene su niže. Za Island, uzmite u obzir i let via London (Heathrow) sa British Airways ili via Amsterdam sa KLM.',
      },
    ]
  }

  if (type === 'tropical') {
    const dest = isBangkok ? 'Bangkok (BKK/DMK)' : isBali ? 'Bali (DPS — Ngurah Rai)' : 'tropsku destinaciju'
    return [
      {
        icon: '✈️',
        title: `Letovi do ${dest}`,
        description: 'Direktnih letova iz BEG-a nema — najčešće konekcija u Abu Dabiju (Etihad), Dohi (Qatar Airways) ili Istanbulu (Turkish Airlines). Ukupno 10-16h puta sa čekanjem.',
      },
      {
        icon: '📅',
        title: 'Kada knjižiti',
        description: 'Knjižite 3-4 meseca unapred za bolju cenu. Long-haul letovi imaju veće fluktuacije cena — pratite Google Flights i koristite "Explore" funkciju za jeftine termine.',
      },
      {
        icon: '🛫',
        title: 'Preporučene avio-kompanije',
        description: 'Qatar Airways i Emirates nude odličan odnos cena/kvalitet za Aziju. Turkish Airlines via Istanbul je često najjeftinija opcija iz Beograda. Etihad ima komforne avione.',
      },
      {
        icon: '🚌',
        title: 'Prevoz od aerodroma',
        description: isBangkok
          ? 'Iz Suvarnabhumi (BKK) do centra Bangkoka ide Airport Rail Link (~5€, 30min) ili taksi (~12-15€). Grab app je pouzdaniji i jeftiniji od taxi štanda.'
          : isBali
          ? 'Iz aerodroma DPS do Kuta/Seminyak ide taksi (~5-8€) ili Grab app. Blue Bird taksi je najzvaničniji. Do Ubudа je 1.5h vožnje (~20-25€).'
          : 'Koristite lokalne rideshare aplikacije (Grab u Aziji) — znatno jeftinije od aerodromskih taksi. Dogovorite cenu unapred ako uzimate taxi.',
      },
      ...commonTips,
      {
        icon: '💡',
        title: 'Long-haul saveti',
        description: 'Check-in 3h pre za long-haul letove. Ponesite hermetičku torbu za tečnosti u ručnom prtljagu. Kompresivne čarape su preporučljive za dugo sedenje.',
      },
    ]
  }

  if (type === 'desert') {
    const destName = isDubai ? 'Dubai (DXB)' : 'Marakeš (RAK)'
    return [
      {
        icon: '✈️',
        title: `Letovi do ${destName}`,
        description: isDubai
          ? 'Air Serbia leti direktno Beograd–Dubai nekoliko puta nedeljno. Flydubai i Emirates su alternativa via Dubai. Cene variraju 200-500€ po osobi.'
          : 'Za Maroko: Royal Air Maroc leti direktno ili via Kazablanka. Ryanair i easyJet imaju povoljne opcije via Madrid ili Lisabon. Oko 3-4h leta.',
      },
      {
        icon: '📅',
        title: 'Kada knjižiti',
        description: isDubai
          ? 'Dubai je popularan oktobar–april. Knjižite 6-10 nedelja unapred. Letnji period (maj-sep) je ekstremno vruć ali cene letova i hotela su niže.'
          : 'Maroko — knjižite 6-8 nedelja unapred. Izbegavajte Ramadan za prvu posetu (promenjeno radno vreme). Mart–maj i sep–nov su idealni meseci.',
      },
      {
        icon: '🚌',
        title: 'Prevoz od aerodroma',
        description: isDubai
          ? 'Dubai Metro Red Line vozi direktno od aerodroma DXB do centra (~3€, 30min). Kareem/Uber su dostupni i povoljni. Taxi sa žutim pločama je zvanični aerodromski.'
          : 'Iz aerodroma Marakeš postoji bus br. 19 do džeme el-Fna (~0.5€). Petit taxi košta oko 3-5€ ali pregovarajte cenu pre ulaska.',
      },
      ...commonTips,
    ]
  }

  if (type === 'mountain') {
    return [
      {
        icon: '✈️',
        title: 'Letovi za planinska odredišta',
        description: isVienna || /austrija|austria/.test(d)
          ? 'Austrian Airlines i Air Serbia lete direktno BEG–VIE. Wizz Air ima povoljne opcije. Beč je 1h leta od Beograda.'
          : 'Za Švajcarsku: letovi do Züricha (ZRH) ili Ženeve (GVA) via Beč, Frankfurt ili Istanbul. Swiss Airlines nudi direktne letove iz regiona.',
      },
      {
        icon: '📅',
        title: 'Kada knjižiti',
        description: 'Planinska odredišta imaju dve sezone — letnju (jun-sep) i zimsku (dec-mar). Knjižite 2-3 meseca unapred za obe. Ski sezona je posebno tražena.',
      },
      {
        icon: '🚂',
        title: 'Prevoz od aerodroma',
        description: 'Švajcarska i Austrija imaju odličan železnički sistem od aerodroma. Swiss Pass ili Eurail karte isplativije za duži boravak. Iz Beča aerodroma do centra: S-Bahn ili CAT voz.',
      },
      ...commonTips,
    ]
  }

  // city type — European capitals
  let airportInfo = 'Proverite koji aerodrom koristite (npr. Pariz ima CDG i Orly, London ima Heathrow i Gatwick). Niskobudžetni prevoznici često koriste sekundarne aerodrome.'
  let flightInfo = 'Niskobudžetni avio-prevoznici (Wizz Air, Ryanair, easyJet) lete iz Beograda od 30-80€. Knjižite 6-8 nedelja unapred za bolju cenu.'
  let airportTransport = 'Većina evropskih gradova ima direktan airport-city shuttle, metro ili voz. Taksi je skuplji ali praktičan sa prtljagom — koristite zvanične aerodromske taksije ili Uber/Bolt.'

  if (isRome) {
    airportInfo = 'Rim ima dva aerodroma: Fiumicino (FCO — veći, 30km od centra) i Ciampino (CIA — Ryanair/easyJet). Proverite koji koristite.'
    flightInfo = 'Air Serbia, Wizz Air i Ryanair lete direktno BEG–FCO ili BEG–CIA. Cene od 50-150€ u oba smera, knjižite 6-8 nedelja unapred.'
    airportTransport = 'Iz Fiumicino: Leonardo Express voz do Roma Termini (14€, 32min). Iz Ciampino: Terravision bus do Termini (~6€). Taksi do centra fiksna cena: 48€.'
  } else if (isParis) {
    airportInfo = 'Pariz Charles de Gaulle (CDG) je glavni aerodrom, 25km severno od centra. Pariz Orly (ORY) koriste neki niskobudžetni.'
    flightInfo = 'Air Serbia i Wizz Air lete direktno BEG–CDG. Cene 60-200€, knjižite 8-10 nedelja unapred za Pariz koji je uvek tražen.'
    airportTransport = 'Iz CDG: RER B voz do centra (~11€, 40min). Roissybus do Opera (~13€). Taksi ~50-60€. Pariz metro je odličan za kretanje po gradu.'
  } else if (isBarcelona) {
    flightInfo = 'Vueling, Wizz Air i Ryanair nude direktne letove BEG–BCN. Cene od 40-120€, najpovoljnije van vikenda i letnjih meseci.'
    airportTransport = 'Iz aerodroma BCN: Aerobus do Pl. Catalunya (~6€, 35min). Metro L9 Sud (~5€ + zona 1). Taksi ~35-40€ do centra.'
  } else if (isAmsterdam) {
    flightInfo = 'KLM i Wizz Air nude direktne opcije BEG–AMS. Amsterdam Schiphol je jedan od najvećih evropskih hubova sa odličnim konekcijama.'
    airportTransport = 'Iz Schiphola: direktan voz do Amsterdam Centraal (~5€, 15-20min). Radi 24/7. Taksi ~45-55€.'
  } else if (isLondon) {
    flightInfo = 'London ima 6 aerodroma — najčešće Heathrow (LHR), Gatwick (LGW) ili Stansted (STN). Wizz Air iz BEG-a leti na Luton (LTN) i Gatwick. Knjižite 8-12 nedelja unapred.'
    airportTransport = 'Iz Heathrow: Piccadilly Line metro (~6£, 50min) ili Heathrow Express (£25, 15min). Iz Gatwick: Gatwick Express (~£19). Taksi je skup — Uber povoljniji.'
  } else if (isPrague) {
    flightInfo = 'Wizz Air i Air Serbia imaju direktne letove BEG–PRG. Prag je jedna od najpovoljnijih evropskih prestonica za srpske putnike.'
    airportTransport = 'Iz Václav Havel aerodroma: Airport Express bus do Hlavní nádraží (~4€, 40min) ili taksi/Bolt (~12-18€).'
  }

  return [
    {
      icon: '✈️',
      title: 'Dostupni letovi',
      description: flightInfo,
    },
    {
      icon: '🛫',
      title: 'Info o aerodromu',
      description: airportInfo,
    },
    {
      icon: '📅',
      title: 'Kada knjižiti',
      description: 'Za kratke evropske letove: 4-8 nedelja unapred je optimalno. Cene rastu unutar 2 nedelje od polaska. Utorak i sreda su statistički najpovoljniji dani za kupovinu karata.',
    },
    {
      icon: '🚌',
      title: 'Prevoz od aerodroma',
      description: airportTransport,
    },
    ...commonTips,
  ]
}

// ── Budget suggestions ────────────────────────────────────────────────────────
export function getBudgetSuggestions(destination, numDays) {
  const type = inferDestType(destination)
  const d = (destination || '').toLowerCase()
  const days = Math.max(1, numDays || 7)

  let daily = { budget: 50, midrange: 100, luxury: 220 }
  let cats = []
  let tips = []
  let currency = 'EUR'

  if (type === 'arctic') {
    daily = { budget: 70, midrange: 140, luxury: 300 }
    cats = [
      { name: 'Smeštaj', budget: '30-60€/noć', midrange: '80-140€/noć', luxury: '200€+/noć' },
      { name: 'Hrana', budget: '15-25€/dan', midrange: '35-60€/dan', luxury: '100€+/dan' },
      { name: 'Prevoz', budget: '10-20€/dan', midrange: '25-40€/dan', luxury: '60€+/dan' },
      { name: 'Aktivnosti', budget: '10-20€/dan', midrange: '30-50€/dan', luxury: '100€+/dan' },
    ]
    tips = [
      'Island i Norveška su skuplje destinacije — priremite budžet u EUR ili koristite karticu bez provizije (Revolut, Wise).',
      'Islandska kruna (ISK) se koristi lokalno ali kartice su prihvaćene svuda. Gotovina gotovo nije potrebna.',
      'Supermarketi su značajno jeftiniji od restorana — Bónus u Islandu je najjeftinija opcija za namirnice.',
      'Rent a car je skup (30-80€/dan) ali neophodan za obilazak. Uključite ga u budžet unapred.',
    ]
  } else if (type === 'tropical') {
    const isBali = /bali/.test(d)
    const isThailand = /tajland|thailand/.test(d)
    if (isBali) {
      daily = { budget: 25, midrange: 60, luxury: 150 }
      cats = [
        { name: 'Smeštaj', budget: '10-20€/noć', midrange: '30-60€/noć', luxury: '100€+/noć' },
        { name: 'Hrana', budget: '5-10€/dan', midrange: '15-30€/dan', luxury: '60€+/dan' },
        { name: 'Prevoz', budget: '3-8€/dan', midrange: '10-20€/dan', luxury: '30€+/dan' },
        { name: 'Aktivnosti', budget: '5-10€/dan', midrange: '15-25€/dan', luxury: '50€+/dan' },
      ]
      currency = 'EUR (→ IDR)'
      tips = [
        'Indonezijska rupija (IDR) — 1 EUR ≈ 16.000 IDR. Menjajte gotovinu po dolasku na aerodromu ili u gradu (bolji kurs od aerodroma).',
        'Kartice su prihvaćene u hotelima i većim restoranima, ali gotovina je neophodna za lokalna tržišta, tempole i male warunges.',
        'Pregovaranje (bargaining) je uobičajeno na tržnicama — počnite od 30-40% tražene cene.',
      ]
    } else {
      daily = { budget: 30, midrange: 70, luxury: 160 }
      cats = [
        { name: 'Smeštaj', budget: '10-20€/noć', midrange: '30-60€/noć', luxury: '100€+/noć' },
        { name: 'Hrana', budget: '5-15€/dan', midrange: '20-35€/dan', luxury: '70€+/dan' },
        { name: 'Prevoz', budget: '3-8€/dan', midrange: '10-20€/dan', luxury: '40€+/dan' },
        { name: 'Aktivnosti', budget: '5-15€/dan', midrange: '20-30€/dan', luxury: '60€+/dan' },
      ]
      if (isThailand) {
        currency = 'EUR (→ THB)'
        tips = [
          'Tajlandski baht (THB) — 1 EUR ≈ 38 THB. Menjajte u SuperRich ili Vasu Exchange za bolji kurs od banaka.',
          'Gotovina je neophodna — mnogi lokalni restorani, tuk-tuk vozači i tržnice ne prihvataju kartice.',
          'ATM naplaćuju proviziju (~5-7€ po podizanju) — podižite veće iznose odjednom. Revolut/Wise kartice smanjuju troškove.',
        ]
      } else {
        tips = [
          'Lokalna valuta je neophodna za tržišta i mali prevoz. Menjajte po dolasku u gradu, ne na aerodromu.',
          'Kartice su prihvaćene u hotelima i turistički orijentisanim restoranima. Gotovina za sve ostalo.',
          'Troškovi su znatno niži nego u Evropi — prosečan turistički obrok 3-10€, lokalni prevoz 1-3€.',
        ]
      }
    }
  } else if (type === 'desert') {
    const isDubai = /dubai/.test(d)
    if (isDubai) {
      daily = { budget: 70, midrange: 150, luxury: 400 }
      cats = [
        { name: 'Smeštaj', budget: '30-60€/noć', midrange: '80-160€/noć', luxury: '300€+/noć' },
        { name: 'Hrana', budget: '15-25€/dan', midrange: '40-80€/dan', luxury: '150€+/dan' },
        { name: 'Prevoz', budget: '10-15€/dan', midrange: '20-30€/dan', luxury: '80€+/dan' },
        { name: 'Aktivnosti', budget: '10-20€/dan', midrange: '30-60€/dan', luxury: '150€+/dan' },
      ]
      currency = 'EUR (→ AED)'
      tips = [
        'Dirham (AED) — 1 EUR ≈ 3.9 AED. Kartice su prihvaćene svuda u Dubaiju, gotovina gotovo nije potrebna.',
        'Dubai Metro je jeftin i efikasan. Nol kartica za metro (10 AED + punjenje). Taksi je dostupan i relativno povoljan.',
        'Alkohol se može konzumirati samo u licenciranim restoranima i barovima u hotelima — poseban trošak.',
      ]
    } else {
      daily = { budget: 40, midrange: 90, luxury: 200 }
      cats = [
        { name: 'Smeštaj', budget: '15-30€/noć', midrange: '50-90€/noć', luxury: '150€+/noć' },
        { name: 'Hrana', budget: '8-15€/dan', midrange: '25-45€/dan', luxury: '80€+/dan' },
        { name: 'Prevoz', budget: '5-10€/dan', midrange: '15-25€/dan', luxury: '50€+/dan' },
        { name: 'Aktivnosti', budget: '5-10€/dan', midrange: '15-30€/dan', luxury: '80€+/dan' },
      ]
      currency = 'EUR (→ MAD)'
      tips = [
        'Marokanski dirham (MAD) — 1 EUR ≈ 10.5 MAD. Menjajte na aerodromu ili u banci, ne kod ulični menjača.',
        'Pregovaranje je sastavni deo kulture u medini i na tržnicama. Nemojte se ustručavati da pregovarate.',
        'Gotovina je neophodna za manje troškove. Kartice prihvaćene u većim hotelima i restoranima.',
      ]
    }
  } else if (type === 'mountain') {
    daily = { budget: 60, midrange: 130, luxury: 280 }
    cats = [
      { name: 'Smeštaj', budget: '25-50€/noć', midrange: '70-120€/noć', luxury: '200€+/noć' },
      { name: 'Hrana', budget: '15-25€/dan', midrange: '35-55€/dan', luxury: '100€+/dan' },
      { name: 'Prevoz', budget: '10-20€/dan', midrange: '25-40€/dan', luxury: '60€+/dan' },
      { name: 'Aktivnosti', budget: '10-20€/dan', midrange: '30-50€/dan', luxury: '100€+/dan' },
    ]
    const isSwiss = /švajcarska|switzerland/.test(d)
    if (isSwiss) {
      currency = 'EUR (→ CHF)'
      tips = [
        'Švajcarski franak (CHF) — 1 EUR ≈ 0.96 CHF. Kartice su svuda prihvaćene, gotovina nije neophodna.',
        'Švajcarska je skuplja od ostatka Evrope — restoran obrok od 20-40 CHF je normalan. Supermarketi su povoljniji.',
        'Swiss Travel Pass za neograničen prevoz vozom, busom i brodom — isplativ za 4+ dana.',
      ]
    } else {
      tips = [
        'EUR je prihvaćen u Austriji. Kartice su svuda prihvaćene u planinskim letovištima.',
        'Ski karte i oprema su značajan trošak — planiraite 40-80€/dan po osobi za ski pass.',
        'Mountain hut ručkovi su prihvatljive cene — odlična alternativa restoranu.',
      ]
    }
  } else {
    // city — Europe
    const isExpensive = /london|britanija|stockholm|kopenhagen|copenhagen|zürich|zurich|oslo/.test(d)
    if (isExpensive) {
      daily = { budget: 70, midrange: 150, luxury: 350 }
      cats = [
        { name: 'Smeštaj', budget: '40-70€/noć', midrange: '100-180€/noć', luxury: '300€+/noć' },
        { name: 'Hrana', budget: '20-35€/dan', midrange: '50-90€/dan', luxury: '150€+/dan' },
        { name: 'Prevoz', budget: '10-15€/dan', midrange: '20-30€/dan', luxury: '60€+/dan' },
        { name: 'Aktivnosti', budget: '10-20€/dan', midrange: '30-50€/dan', luxury: '100€+/dan' },
      ]
      tips = [
        'London koristi funtu (GBP) — 1 EUR ≈ 0.85 GBP. Revolut ili Wise kartica za kupovinu bez provizije.',
        'London Oyster kartica za metro i bus — punjite odmah po dolasku na aerodromu.',
        'Mnogi muzeji u Londonu su besplatni (British Museum, Tate Modern, National Gallery). Planirajte dan obilasku muzeja.',
      ]
    } else {
      daily = { budget: 50, midrange: 100, luxury: 220 }
      cats = [
        { name: 'Smeštaj', budget: '25-50€/noć', midrange: '70-120€/noć', luxury: '180€+/noć' },
        { name: 'Hrana', budget: '15-25€/dan', midrange: '30-55€/dan', luxury: '100€+/dan' },
        { name: 'Prevoz', budget: '5-10€/dan', midrange: '15-25€/dan', luxury: '50€+/dan' },
        { name: 'Aktivnosti', budget: '5-15€/dan', midrange: '20-40€/dan', luxury: '80€+/dan' },
      ]
      const isRomeTips = /rim|rome|roma|italija|italy/.test(d)
      const isPrague = /prag|prague|češka|czech/.test(d)
      if (isRomeTips) {
        tips = [
          'Italija koristi EUR — kartice su prihvaćene skoro svuda. Gotovina za male kafice i tržnice.',
          'Tourist tax se plaća gotovinom po dolasku u hotel (1-7€/noć po osobi). Imajte sitni novac.',
          'Ručak menu fisso (obrok dana) u trattoriji — 10-15€ za 2-3 kursa. Znatno jeftinije od večere.',
        ]
      } else if (isPrague) {
        currency = 'EUR (→ CZK)'
        tips = [
          'Češka kruna (CZK) — 1 EUR ≈ 25 CZK. Menjajte u gradu, ne na aerodromu koji ima loš kurs.',
          'Prag je povoljniji od zapadne Evrope. Lokalni obrok u konobe 5-10€, pivo u pivnici ~1.5€.',
          'Kartice su sve prihvaćenije, ali imajte gotovinu za tržnice, neke muzeje i stariji prevoz.',
        ]
      } else {
        tips = [
          'EUR je standardna valuta u većini EU zemalja. Kartice su široko prihvaćene.',
          'Revolut ili Wise kartica omogućavaju plaćanje bez konverzijskih provizija.',
          'Turistički gradovi imaju varijabilne cene — restorani bliže atrakcijama su skuplje.',
        ]
      }
    }
  }

  const totalEstimate = {
    budget: daily.budget * days,
    midrange: daily.midrange * days,
    luxury: daily.luxury * days,
  }

  return {
    dailyBudgets: {
      budget: { amount: daily.budget, currency, label: 'Budžet putnik' },
      midrange: { amount: daily.midrange, currency, label: 'Prosečan turist' },
      luxury: { amount: daily.luxury, currency, label: 'Komforni odmor' },
    },
    categories: cats,
    tips,
    totalEstimate,
  }
}

// ── Accommodation suggestions (Wikipedia hook + static tips) ──────────────────
export function useAccommodationSuggestions(destination) {
  const [state, setState] = useState({ loading: false, suggestions: [] })

  useEffect(() => {
    if (!destination) return
    setState({ loading: true, suggestions: [] })
    let cancelled = false

    const query = normalizeDestination(destination)

    async function fetchSuggestions() {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' neighborhood district stay')}&srlimit=5&format=json&origin=*`),
          fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' hotel accommodation tourism')}&srlimit=5&format=json&origin=*`),
        ])
        const [d1, d2] = await Promise.all([r1.json(), r2.json()])
        if (cancelled) return

        const n1 = (d1.query?.search || []).map((s) => ({ ...s, _type: 'neighborhood' }))
        const n2 = (d2.query?.search || []).map((s) => ({ ...s, _type: 'accommodation' }))

        const seen = new Set()
        const all = [...n1, ...n2].filter((p) => {
          if (seen.has(p.pageid)) return false
          seen.add(p.pageid)
          return true
        }).slice(0, 8)

        if (all.length === 0) { setState({ loading: false, suggestions: [] }); return }

        const suggestions = all.map((p) => ({
          name: p.title,
          description: stripHtml(p.snippet),
          type: p._type,
        }))

        if (!cancelled) setState({ loading: false, suggestions })
      } catch {
        if (!cancelled) setState({ loading: false, suggestions: [] })
      }
    }

    fetchSuggestions()
    return () => { cancelled = true }
  }, [destination])

  return state
}

export function getAccommodationTips(destination) {
  const type = inferDestType(destination)
  const d = (destination || '').toLowerCase()

  const isIceland = /island|iceland|reykjavik/.test(d)
  const isBali = /bali/.test(d)
  const isThailand = /tajland|thailand/.test(d)
  const isDubai = /dubai/.test(d)
  const isRome = /rim|rome|roma|italija|italy/.test(d)
  const isParis = /pariz|paris/.test(d)
  const isPrague = /prag|prague|češka/.test(d)

  const platformTip = 'Booking.com, Airbnb i Hotels.com su najpopularnije platforme. Uvek proverite cenu direktno na sajtu hotela — ponekad je jeftinija.'
  const cancelTip = 'Birajte opciju besplatnog otkazivanja kad god je moguće — pruža fleksibilnost u slučaju promene planova.'

  const baseTips = [platformTip, cancelTip]

  if (type === 'arctic') {
    if (isIceland) {
      return [
        'Za Island: rezervišite smeštaj 3-6 meseci unapred, posebno u leto (jun-avg) i za period severnog svetla (jan-mar). Popularni smeštaji se pune jako brzo.',
        'Reykjavik je najpraktičnija baza za obilazak Islanda. Alternativa: guesthouses duž Ring Road za autentičnije iskustvo.',
        'Camping je popularan i jeftin (maj-sep) — Iceland camping card pokriva mnoga kampovišta. Potrebna je vlastita oprema.',
        ...baseTips,
        'Guesthouses i farmhouses van Reykjavika nude autentično iskustvo i direktan kontakt sa prirodom. Često uključuju doručak.',
      ]
    }
    return [
      'Skandinavske destinacije: rezervišite 2-3 meseca unapred. Ljeto i period polarne noći/dana su posebno traženi.',
      'Hosteli su odlična opcija za smanjivanje troškova u skupim skandinavskim gradovima — Hostelling International mreža.',
      ...baseTips,
    ]
  }

  if (type === 'tropical') {
    if (isBali) {
      return [
        'Bali oblasti: Seminyak/Kuta (plaže, noćni život), Ubud (kultura, priroda, miran), Nusa Dua (luksuzni resorti), Canggu (surferi, digital nomadi).',
        'Private villa sa bazenom je često iznenađujuće povoljno — od 50€/noć za 2 osobe. Airbnb i Agoda imaju odličnu ponudu.',
        'Rezervišite 4-8 nedelja unapred za popularni period (jul-avg, dec-jan). Van sezone (apr-jun, sep-okt) lako naći slobodan smeštaj.',
        ...baseTips,
        'Provizija na kreditne kartice je česta — pitajte da li ima popust za gotovinu.',
      ]
    }
    if (isThailand) {
      return [
        'Bangkok četvrti: Sukhumvit (moderno, metro pristup), Silom (poslovna zona), Khao San Road (backpackers, centralno), Riverside (romantično).',
        'Tajland ima odličnu ponudu od budget hostela (5-15€/noć) do luksuznih resorti. Agoda je posebno dobra za Aziju.',
        'High season (nov-feb): rezervišite 4-6 nedelja unapred. Low season (maj-okt — monsun) ima niže cene i lako dostupan smeštaj.',
        ...baseTips,
      ]
    }
    return [
      'Tropske destinacije: provjerite sezonu kiša — može uticati na cene i dostupnost smeštaja.',
      'Resorti s all-inclusive su popularna opcija — preračunajte da li je jeftinije od hotela + hrane zasebno.',
      ...baseTips,
    ]
  }

  if (isDubai) {
    return [
      'Dubai četvrti: Downtown (Burj Khalifa, luksuz), Dubai Marina (more, pogled), JBR (plaže, porodice), Deira (stari grad, povoljnije).',
      'Hoteli u Dubaiju su često popunjeniji oktobar–april. Rezervišite 4-8 nedelja unapred za ovaj period.',
      'Dubai se isplati za apartmane — Airbnb i short-term najam često jeftiniji od hotela za 5+ noći.',
      ...baseTips,
      'Gotovo svi hoteli imaju bazen — klima je neophodna, proverite da li je uključena u cenu sobe.',
    ]
  }

  if (type === 'mountain') {
    return [
      'Planinska odredišta imaju dve sezone — ski zimska i letnja planinarska. Rezervišite mesec-dva unapred za obe.',
      'Chalet i mountain hut smeštaj je autentičan doživljaj — malo skuplji ali uključuje obrok i view.',
      'Airbnb apartmani sa kuhinjom mogu smanjiti troškove hrane — korisno za duže boravke.',
      ...baseTips,
    ]
  }

  // city
  if (isRome) {
    return [
      'Rim četvrti za smeštaj: Centro Storico (sve pešice), Trastevere (autentično, živo), Prati (blizu Vatikana, mirnije), Testaccio (lokalno iskustvo).',
      'Booking.com ima odličnu ponudu za Rim. Agriturismo van centra su jeftiniji i autentičniji — dobra opcija sa autom.',
      'Rezervišite 6-10 nedelja unapred za leto i Uskrs koji su najpopularniji periodi.',
      'Provjerite da li hotel naplaćuje turističku taksu (1-7€/noć) posebno — nije uvek uključena u Booking cenu.',
      ...baseTips,
    ]
  }
  if (isParis) {
    return [
      'Pariz arrondissements: 1-4 (istorijsko središte, skuplje), 5-6 (Latin Quarter, Montparnasse), 11-12 (lokalno, povoljnije), Montmartre 18 (turistično ali šarmantno).',
      'Pariz je skup grad — budžet hotel košta 80-120€/noć. Apartman na Airbnb je jeftiniji za 3+ noći.',
      'Rezervišite 8-12 nedelja unapred za leto i modne nedelje (mart i oktobar).',
      ...baseTips,
    ]
  }
  if (isPrague) {
    return [
      'Prag četvrti: Staré Město (stari grad, turisti), Vinohrady (lokalno, zeleno, preporučljivo), Malá Strana (romantično, ispod Hrčana), Žižkov (hipstersko, povoljno).',
      'Prag je jedna od najpovoljnijih evropskih prestonica za smeštaj — dobar hostel od 15-20€, hotel od 50-80€/noć.',
      'Rezervišite 4-6 nedelja unapred za prolece i leto. Van sezone je lako naći slobodan smeštaj.',
      ...baseTips,
    ]
  }

  return [
    `${destination} — centrani kvartovi su praktičniji za pešačke ture, ali skuplji. Kvartovi van centra sa dobrim metro/tramvajskim pristupom nude bolji odnos cena/vrednost.`,
    'Rezervišite 4-8 nedelja unapred za letni period. Van sezone je smeštaj dostupniji i jeftiniji.',
    ...baseTips,
    'Proverite recenzije na TripAdvisoru i Google Maps pored Booking.com — daju kompletniju sliku iskustva.',
  ]
}
