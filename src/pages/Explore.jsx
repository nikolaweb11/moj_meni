import { useState, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

const COUNTRIES = [
  {
    id: 'iceland',
    name: 'Island',
    flag: '🇮🇸',
    wikiImg: 'Iceland landscape nature',
    legend: 'Prema drevnom islandskom verovanju, zemlja je dom tajnih bića — "huldufólka" (skrivenih naroda). Priče govore o elfovima koji žive u stenama, livadama i brdima. Čak i danas, Islanđani ponekad menjaju puteve gradnje da ne bi uznemiravali stene za koje se veruje da su stanište ovih bića. Kada bi radnici pokušali da presele posebnu stenu, mašine bi se kvarile — sve dok se stena ne bi ostavila na miru.',
    fact: 'Island nema armiju i nikad nije bio u ratu sa drugom državom. Zemlja ima najmanji broj stanovnika po kvadratnom kilometru u Evropi, a severnа svetlost (aurora borealis) vidljiva je tokom gotovo svake noći između septembra i marta.',
  },
  {
    id: 'norway',
    name: 'Norveška',
    flag: '🇳🇴',
    wikiImg: 'Norway fjord landscape',
    legend: 'Norveška mitologija opisuje Norne — tri moćne boginje koje tkaju sudbine svih živih bića. Urðr (Prošlost), Verðandi (Sadašnjost) i Skuld (Budućnost) sede pod drvetom Yggdrasil, vretenom sveta, i određuju tok svakog života. Veruje se da se niti sudbine ne mogu prekinuti — mogu se samo prihvatiti.',
    fact: 'Norveška je zemlja koja ima više električnih automobila po glavi stanovnika nego bilo koja druga zemlja na svetu. Osim toga, zemlja zakonski garantuje pravo pristupa svim planinama, šumama i obalama — takozvan "Allemannsretten" (pravo svakog čoveka).',
  },
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    wikiImg: 'Japan Mount Fuji sakura cherry blossoms',
    legend: 'Priča o Kaguya-hime (Princezi od bambusa) jedna je od najstarijih japanskih priča. Devojčica pronađena unutar sjajnog bambusa odrasla je da postane neverovatna lepotica. Plemeniti muškarci i sam car su je prosili, ali ona je bila od Meseca — i na kraju se vratila svom nebeskom domu, ostavljajući za sobom eleksir besmrtnosti koji je car odbio da popije jer bez nje nije hteo da živi večno.',
    fact: 'Japan ima više od 6.800 ostrva, od kojih je samo oko 430 stalno naseljeno. Zemlja ima najduži prosečan životni vek na svetu, a japanski voz shinkansen ima kašnjenje u proseku manje od jedne minute godišnje.',
  },
  {
    id: 'italy',
    name: 'Italija',
    flag: '🇮🇹',
    wikiImg: 'Italy Tuscany landscape hills',
    legend: 'Rimska legenda kaže da su osnivači Rima bili blizanci Romul i Rem, sinovi boga rata Marsa. Napušteni kao deca, dojila ih je vučica (Lupa) ispod svetog smokvinog drveta. Kada su odrasli i rešili da osnuju grad, posvađali su se oko lokacije. Romul je ubio Rema i nazvao grad po sebi — Roma. Lupa je postala simbol večnog Rima.',
    fact: 'Italija poseduje više UNESCO svetske baštine od bilo koje druge države na svetu — čak 58 lokacija. Gotovo 80% sveg arhiviranog umetničkog blaga čovečanstva nalazi se u Italiji. Fontana di Trevi u Rimu svake godine prikupi više od milion evra kovanica koje turisti bacaju.',
  },
  {
    id: 'greece',
    name: 'Grčka',
    flag: '🇬🇷',
    wikiImg: 'Greece Santorini blue domes sea',
    legend: 'Legenda o Ikarusu opisuje čovekovu večnu čežnju za slobodom i visinama. Daedalus je napravio krila od perja i voska za sebe i sina Ikarusa. Upozorio je sina da ne leti preblizu suncu — ali Ikarus, opijen slobodom leta, nije slušao. Vosak se istoplje, i on je pao u more. Metafora koja traje 3.000 godina: granice postoje da bi nas zaštitile, ne da bi nas zatvorile.',
    fact: 'Grčka ima treću najdužu obalnu liniju na svetu, sa više od 16.000 km obale. Grčki jezik je najstariji živi jezik na svetu koji se i dalje govori — sa istorijom od 3.500 godina. Reč "muzej" potiče od grčke "mouseion" — hrama Musa.',
  },
  {
    id: 'ireland',
    name: 'Irska',
    flag: '🇮🇪',
    wikiImg: 'Ireland green cliffs landscape',
    legend: 'Irska legenda govori o "Pot of Gold" — loncu zlata koji se krije na kraju duge, koji čuva Leprechaun, vilenjak-krojač. Ako ga uhvatiš, mora ti ispuniti tri želje. Ali vilenjaci su lukavi — oni uvek nađu način da te prevare. Leprechaun simbolizuje ideju da sreća uvek izmiče onima koji je previše traže, ali dolazi onima koji je ne traže.',
    fact: 'Irska je jedina zemlja na svetu gde su novogodišnji balovi i ples zabranjeni do 1935. godine. Više od 70 miliona ljudi u svetu ima irsko poreklo — a samo 5 miliona živi u samoj Irskoj. Irski je jedan od najstarijih pisanih jezika Evrope.',
  },
  {
    id: 'scotland',
    name: 'Škotska',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    wikiImg: 'Scotland highlands loch landscape',
    legend: 'Legenda o Nessie — čudovištu jezera Loch Ness — jedna je od najpoznatijih misterioznih priča sveta. Prema lokalnoj tradiciji, stvorenje je viđeno još od 6. veka. Fotografija iz 1934. godine (koja se ispostavilo da je falsifikat) pokrenula je globalnu fascinaciju. Loch Ness je toliko duboko da bi primilo vodu svih reka, jezera i rezervoara Engleske i Velsa zajedno.',
    fact: 'Škotska je izmislila bicikl, telefon, penicillin i parnu mašinu — sve u periodu kraćem od 200 godina. Jednorog je zvanična životinja Škotske. Grb Škotske prikazuje lavove koji drže jednorogove u lancima — simbol snage.',
  },
  {
    id: 'peru',
    name: 'Peru',
    flag: '🇵🇪',
    wikiImg: 'Peru Machu Picchu mountains',
    legend: 'Inka legenda kaže da je bog sunca Inti poslao svog sina Manco Cápaca i kćerku Mama Ocllo na Zemlju, sa zlatnim štapom. Rečeno im je da hodaju dok štap ne upadne u zemlju do drške — to će biti mesto gde treba da osnuju grad. Štap je potonuo u dolini Cusco, i tu je osnovan Tawantinsuyu — Carstvo četiri strane sveta.',
    fact: 'Machu Picchu sagrađena je oko 1450. godine, ali Španci nikad nisu saznali za nju — tako da je nikad nisu razorili. Grad je "otkriven" tek 1911. godine. Peru ima više od 3.000 vrsta krompira — kultura koja je hranila Evropu potiče odavde.',
  },
  {
    id: 'morocco',
    name: 'Maroko',
    flag: '🇲🇦',
    wikiImg: 'Morocco Sahara desert dunes sunset',
    legend: 'Berberske priče govore o džinima koji nastanjuju pustinju Saharu. Putnici koji zalutaju u pesku Sahare čuju šaputanja i muziku — to su džini koji ih mamе da se odmore, da bi ih zarobili. Jedina zaštita je tikva sa morskom vodom i zrno soli na vrhu glave. Džini se plaše slane vode jer podseća na suze anđela.',
    fact: 'Maroko je jedina afrička zemlja koja ima obalu i na Atlantskom okeanu i na Sredozemnom moru. Grad Fes ima najstariji univerzitet na svetu — Al-Karaouine, osnovan 859. godine. Marokanska medina u Fesu je najveći urbani pešački okrug na svetu.',
  },
  {
    id: 'turkey',
    name: 'Turska',
    flag: '🇹🇷',
    wikiImg: 'Turkey Cappadocia hot air balloons',
    legend: 'Legenda o Nasreddinu Hodži, mudracu i budali u isto vreme, puna je paradoksa i mudrosti. Jednom je Hodža ušao u mecet naopako obuven. Čarapa mu je bila naopačke. Neko mu reče: "Hodža, pogrešno si obuo čarape!" On odgovori: "Ne — svet je pogrešno postavljen, a moje čarape su jedino ispravno u njemu." Hodžine priče se recikliraju kroz vekove.',
    fact: 'Turska je zemlja gde je prvi novac u istoriji kovan (u Lidiji, 650. p.n.e.). Istanbul je jedini grad na svetu koji leži na dva kontinenta. Cappadocia ima više od 200 podzemnih gradova — jedan od njih je bio dom za 20.000 ljudi.',
  },
  {
    id: 'egypt',
    name: 'Egipat',
    flag: '🇪🇬',
    wikiImg: 'Egypt pyramids Giza desert',
    legend: 'Priča o Ozirisu i Izidi je priča o večnoj ljubavi. Oziris, bog plodnosti, ubijen je od svog brata Seta i isečen na 14 delova rasutih po celom Egiptu. Njegova žena Izida prehodala je celu zemlju skupljajući delove tela i sastavila ga — i on je oživeo. Ta ljubav koja pobeđuje smrt predstavljala je osnovu egipatske vere u zagrobni život i reinkarnaciju.',
    fact: 'Drevni Egipćani su koristili pasta za zube, dezodorans i kontracepciju — pre 4.000 godina. Kleopatra je živela bliže vremenu sletanja na Mesec nego vremenu izgradnje piramida. Faraoni su mazali glavu medom da bi odvratili muhe.',
  },
  {
    id: 'india',
    name: 'Indija',
    flag: '🇮🇳',
    wikiImg: 'India Taj Mahal garden landscape',
    legend: 'Taj Mahal je simbol večne ljubavi. Mogulski car Šah Džahan naručio je ovaj mausolej za svoju voljenu ženu Mumtaz Mahal, koja je umrla rađajući njihovo 14. dete. Grађeni su 22 godine, 20.000 radnika. Priča kaže da je car naredio da se odseku ruke svim majstorima koji su radili na njemu, kako niko nikad ne bi napravio nešto jednako lepo.',
    fact: 'Indija je zemlja odakle potiču šah, yoga, algebra i numerički sistem koji danas koristi ceo svet ("arapske brojke" su zapravo indijskog porekla). Sa više od 1,4 milijarde stanovnika, Indija ima više vegetarijanaca od ostatka sveta zajedno.',
  },
  {
    id: 'thailand',
    name: 'Tajland',
    flag: '🇹🇭',
    wikiImg: 'Thailand temple elephant jungle',
    legend: 'Prema tajlandskoj legendi, beli slon je sveto biće koje donosi sreću i prosperitet. Kada se rodi beli slon, automatski postaje vlasništvo kralja. Legenda kaže da je sam Buda, u prethodnom životu, bio beli slon koji je spasio svoju majku iz oluje. To je razlog zašto se slonovi u Tajlandu tretiraju kao svete životinje.',
    fact: 'Tajland nikad nije bio kolonizovan od strane evropskih sila — jedina zemlja u jugoistočnoj Aziji sa takvom istorijom. Reč "Tajland" znači "Zemlja slobodnih". Tajland je svetski lider u izvozu riže i gume. Bangkok ima najduže zvanično ime ikojeg grada na svetu — 169 slova u tajlanskom originalu.',
  },
  {
    id: 'canada',
    name: 'Kanada',
    flag: '🇨🇦',
    wikiImg: 'Canada Rocky Mountains lake reflection',
    legend: 'Legenda o Thunderbirdu potiče od autohtonih naroda Kanade. Thunderbird je ogromna mitološka ptica čija krila stvaraju grom, a oči sevaju munje. Živela je na vrhu planine u Stenovitim planinama, daleko od ljudi. Kada bi bila gladna, spuštala bi se do mora i hvatala kitove. Njena slika na "totem polu" simbol je zaštite i snage zajednice.',
    fact: 'Kanada ima najdužu obalnu liniju na svetu — 202.080 km. Kanada ima više jezera sa slatkom vodom od svih ostalih zemalja sveta zajedno. Reč "Kanada" potiče od irokenskog "kanata" što znači "selo" ili "naselje".',
  },
  {
    id: 'australia',
    name: 'Australija',
    flag: '🇦🇺',
    wikiImg: 'Australia Uluru outback landscape',
    legend: 'Aboridžinski "Dreamtime" (Vreme snova) nije mit o prošlosti — to je živa stvarnost koja prožima sadašnjost. U njemu su Preci Stvaratelji hodali kroz praznu zemlju i pevali sve što su videli — kamenje, reke, životinje — i tako su ih stvarali. Te "putanje pesme" prolaze kroz celu Australiju. Aborigini i danas hodaju tim putanjama, pevajući ih i čuvajući zemlja živi jedino ako se pesme ne zaborave.',
    fact: 'Australija je jedina zemlja koja pokriva ceo kontinent. Ima više vrsta smrtonosnih životinja od bilo koje druge zemlje na svetu — ali i jednu od najnižih stopa ubistava. Kengur i emu ne mogu hodati unazad — zato su simbol napretka na australijskom grbu.',
  },
]

function useCountryImage(wikiQuery) {
  const [data, setData] = useState({ loading: false, imageUrl: null })

  useEffect(() => {
    if (!wikiQuery) return
    setData({ loading: true, imageUrl: null })
    let cancelled = false

    async function fetch() {
      try {
        const searchRes = await window.fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wikiQuery)}&srlimit=1&format=json&origin=*`
        )
        const searchJson = await searchRes.json()
        const pageId = searchJson.query?.search?.[0]?.pageid
        if (!pageId || cancelled) return

        const imgRes = await window.fetch(
          `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&pithumbsize=800&format=json&origin=*`
        )
        const imgJson = await imgRes.json()
        const imageUrl = imgJson.query?.pages?.[pageId]?.thumbnail?.source || null
        if (!cancelled) setData({ loading: false, imageUrl })
      } catch {
        if (!cancelled) setData({ loading: false, imageUrl: null })
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [wikiQuery])

  return data
}

export default function Explore() {
  const [selected, setSelected] = useState(COUNTRIES[0])
  const [open, setOpen] = useState(false)
  const imgData = useCountryImage(selected.wikiImg)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-ink">Istraži svet 🌍</h1>
        <p className="text-slate-500 text-sm mt-1">Legende, zanimljivosti i priroda različitih zemalja</p>
      </div>

      {/* Country selector */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-white border border-linen rounded-2xl px-5 py-4 shadow-sm hover:border-forest/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selected.flag}</span>
            <span className="font-display text-xl font-semibold text-ink">{selected.name}</span>
          </div>
          <ChevronDown
            size={20}
            className={`text-mist transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-linen rounded-2xl shadow-lg z-10 overflow-hidden max-h-72 overflow-y-auto">
            {COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelected(c); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-parchment transition-colors border-b border-linen last:border-0 ${selected.id === c.id ? 'bg-forest/5 text-forest font-semibold' : 'text-ink-light'}`}
              >
                <span className="text-xl">{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Country image */}
      {imgData.loading && (
        <div className="h-52 bg-linen rounded-2xl animate-pulse" />
      )}
      {!imgData.loading && imgData.imageUrl && (
        <div className="h-52 rounded-2xl overflow-hidden shadow-md">
          <img src={imgData.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
        </div>
      )}
      {!imgData.loading && !imgData.imageUrl && (
        <div
          className="h-52 rounded-2xl flex items-center justify-center text-8xl"
          style={{ background: 'linear-gradient(135deg, #2D4A3E, #4A7C59)' }}
        >
          {selected.flag}
        </div>
      )}

      {/* Legend card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-linen">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📖</span>
          <h2 className="font-display text-lg font-semibold text-ink">Narodna legenda</h2>
        </div>
        <p className="text-sm text-ink-light leading-relaxed">{selected.legend}</p>
      </div>

      {/* Fact card */}
      <div className="bg-gradient-to-br from-forest/5 to-gold/5 rounded-2xl p-6 border border-forest/10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💡</span>
          <h2 className="font-display text-lg font-semibold text-ink">Zanimljivost</h2>
        </div>
        <p className="text-sm text-ink-light leading-relaxed">{selected.fact}</p>
      </div>

      {/* Country name footer */}
      <div className="text-center pb-4">
        <Globe size={16} className="inline text-mist mr-1.5 mb-0.5" />
        <span className="text-xs text-mist">{COUNTRIES.length} zemalja • sadržaj se proširuje</span>
      </div>
    </div>
  )
}
