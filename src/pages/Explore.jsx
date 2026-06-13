import { useState, useEffect, useRef } from 'react'
import { Globe, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const COUNTRIES = [
  {
    id: 'iceland', name: 'Island', flag: '🇮🇸',
    capital: 'Rejkjavik', population: '~370.000',
    ytHistory: 'https://www.youtube.com/results?search_query=Iceland+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Iceland+nature+beauty+scenery',
    mapsUrl: 'https://www.google.com/maps/place/Iceland',
    wikiImgs: ['Iceland landscape waterfall', 'Iceland aurora borealis night sky', 'Iceland black sand beach Reynisfjara'],
    legend: 'Prema drevnom islandskom verovanju, zemlja je dom tajnih bića — "huldufólka" (skrivenih naroda). Priče govore o elfovima koji žive u stenama, livadama i brdima. Čak i danas, Islanđani ponekad menjaju puteve gradnje da ne bi uznemiravali stene za koje se veruje da su stanište ovih bića. Kada bi radnici pokušali da presele posebnu stenu, mašine bi se kvarile — sve dok se stena ne bi ostavila na miru.',
    fact: 'Island nema armiju i nikad nije bio u ratu sa drugom državom. Zemlja ima najmanji broj stanovnika po kvadratnom kilometru u Evropi, a severna svetlost (aurora borealis) vidljiva je tokom gotovo svake noći između septembra i marta.',
  },
  {
    id: 'norway', name: 'Norveška', flag: '🇳🇴',
    capital: 'Oslo', population: '~5,5 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Norway+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Norway+nature+fjords+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Norway',
    wikiImgs: ['Norway Geirangerfjord landscape', 'Norway Lofoten islands', 'Norway Bergen Bryggen waterfront'],
    legend: 'Norveška mitologija opisuje Norne — tri moćne boginje koje tkaju sudbine svih živih bića. Urðr (Prošlost), Verðandi (Sadašnjost) i Skuld (Budućnost) sede pod drvetom Yggdrasil, vretenom sveta, i određuju tok svakog života. Veruje se da se niti sudbine ne mogu prekinuti — mogu se samo prihvatiti.',
    fact: 'Norveška je zemlja koja ima više električnih automobila po glavi stanovnika nego bilo koja druga zemlja na svetu. Zemlja zakonski garantuje pravo pristupa svim planinama, šumama i obalama — tzv. "Allemannsretten" (pravo svakog čoveka).',
  },
  {
    id: 'japan', name: 'Japan', flag: '🇯🇵',
    capital: 'Tokio', population: '~125 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Japan+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Japan+nature+beauty+scenery',
    mapsUrl: 'https://www.google.com/maps/place/Japan',
    wikiImgs: ['Japan Mount Fuji cherry blossoms', 'Japan Kyoto temple autumn', 'Japan Tokyo skyline night'],
    legend: 'Priča o Kaguya-hime (Princezi od bambusa) jedna je od najstarijih japanskih priča. Devojčica pronađena unutar sjajnog bambusa odrasla je da postane neverovatna lepotica. Plemeniti muškarci i sam car su je prosili, ali ona je bila od Meseca — i na kraju se vratila svom nebeskom domu, ostavljajući za sobom eliksir besmrtnosti koji je car odbio da popije jer bez nje nije hteo da živi večno.',
    fact: 'Japan ima više od 6.800 ostrva, od kojih je samo oko 430 stalno naseljeno. Zemlja ima najduži prosečan životni vek na svetu, a japanski voz shinkansen ima kašnjenje u proseku manje od jedne minute godišnje.',
  },
  {
    id: 'italy', name: 'Italija', flag: '🇮🇹',
    capital: 'Rim', population: '~60 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Italy+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Italy+nature+landscapes+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Italy',
    wikiImgs: ['Italy Tuscany hills vineyard', 'Italy Amalfi coast sea', 'Italy Rome Colosseum'],
    legend: 'Rimska legenda kaže da su osnivači Rima bili blizanci Romul i Rem, sinovi boga rata Marsa. Napušteni kao deca, dojila ih je vučica (Lupa) ispod svetog smokvinog drveta. Kada su odrasli i rešili da osnuju grad, posvađali su se oko lokacije. Romul je ubio Rema i nazvao grad po sebi — Roma.',
    fact: 'Italija poseduje više UNESCO svetske baštine od bilo koje druge države na svetu — čak 58 lokacija. Gotovo 80% sveg arhiviranog umetničkog blaga čovečanstva nalazi se u Italiji. Fontana di Trevi u Rimu svake godine prikupi više od milion evra kovanica.',
  },
  {
    id: 'greece', name: 'Grčka', flag: '🇬🇷',
    capital: 'Atina', population: '~11 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Greece+ancient+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Greece+nature+islands+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Greece',
    wikiImgs: ['Greece Santorini blue domes sea', 'Greece Acropolis Athens sunset', 'Greece Meteora monasteries'],
    legend: 'Legenda o Ikarusu opisuje čovekovu večnu čežnju za slobodom. Daedalus je napravio krila od perja i voska za sebe i sina. Upozorio je Ikarusa da ne leti preblizu suncu — ali on, opijen slobodom leta, nije slušao. Vosak se istopi i on pade u more. Metafora koja traje 3.000 godina: granice postoje da bi nas zaštitile, ne da bi nas zatvorile.',
    fact: 'Grčka ima treću najdužu obalnu liniju na svetu, sa više od 16.000 km obale. Grčki jezik je najstariji živi jezik na svetu koji se i dalje govori — sa istorijom od 3.500 godina. Reč "muzej" potiče od grčke "mouseion".',
  },
  {
    id: 'ireland', name: 'Irska', flag: '🇮🇪',
    capital: 'Dublin', population: '~5,2 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Ireland+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Ireland+nature+countryside+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Ireland',
    wikiImgs: ['Ireland Cliffs of Moher ocean', 'Ireland green countryside', 'Ireland Dublin city'],
    legend: 'Irska legenda govori o "Pot of Gold" — loncu zlata koji se krije na kraju duge, koji čuva Leprechaun, vilenjak-krojač. Ako ga uhvatiš, mora ti ispuniti tri želje. Ali vilenjaci su lukavi — oni uvek nađu način da te prevare. Leprechaun simbolizuje ideju da sreća dolazi onima koji je ne traže preagresivno.',
    fact: 'Više od 70 miliona ljudi u svetu ima irsko poreklo — a samo 5 miliona živi u samoj Irskoj. Irski je jedan od najstarijih pisanih jezika Evrope. Guiness pivara u Dablinu zakupila je svoju lokaciju na 9.000 godina.',
  },
  {
    id: 'scotland', name: 'Škotska', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    capital: 'Edinburg', population: '~5,5 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Scotland+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Scotland+highlands+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Scotland',
    wikiImgs: ['Scotland highlands glencoe valley', 'Scotland Loch Ness landscape', 'Scotland Edinburgh castle'],
    legend: 'Legenda o Nessie — čudovištu jezera Loch Ness — jedna je od najpoznatijih misterioznih priča sveta. Prema lokalnoj tradiciji, stvorenje je viđeno još od 6. veka. Loch Ness je toliko duboko da bi primilo vodu svih reka, jezera i rezervoara Engleske i Velsa zajedno.',
    fact: 'Škotska je izmislila bicikl, telefon, penicillin i parnu mašinu — sve u periodu kraćem od 200 godina. Jednorog je zvanična životinja Škotske. Grb Škotske prikazuje lavove koji drže jednorogove u lancima — simbol snage.',
  },
  {
    id: 'peru', name: 'Peru', flag: '🇵🇪',
    capital: 'Lima', population: '~33 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Peru+Inca+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Peru+nature+Amazon+Andes+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Peru',
    wikiImgs: ['Peru Machu Picchu mountains clouds', 'Peru Rainbow Mountain Vinicunca', 'Peru Amazon rainforest'],
    legend: 'Inka legenda kaže da je bog sunca Inti poslao svog sina Manco Cápaca i kćerku Mama Ocllo na Zemlju, sa zlatnim štapom. Rečeno im je da hodaju dok štap ne upadne u zemlju do drške — to će biti mesto gde treba da osnuju grad. Štap je potonuo u dolini Cusco.',
    fact: 'Machu Picchu sagrađena je oko 1450. godine, ali Španci nikad nisu saznali za nju — tako da je nikad nisu razorili. Grad je "otkriven" tek 1911. godine. Peru ima više od 3.000 vrsta krompira.',
  },
  {
    id: 'morocco', name: 'Maroko', flag: '🇲🇦',
    capital: 'Rabat', population: '~37 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Morocco+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Morocco+Sahara+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Morocco',
    wikiImgs: ['Morocco Sahara desert dunes sunset', 'Morocco Chefchaouen blue city', 'Morocco Fes medina'],
    legend: 'Berberske priče govore o džinima koji nastanjuju pustinju Saharu. Putnici koji zalutaju u pesku Sahare čuju šaputanja i muziku — to su džini koji ih mame da se odmore, da bi ih zarobili. Jedina zaštita je tikva sa morskom vodom i zrno soli na vrhu glave.',
    fact: 'Maroko je jedina afrička zemlja koja ima obalu i na Atlantskom okeanu i na Sredozemnom moru. Grad Fes ima najstariji univerzitet na svetu — Al-Karaouine, osnovan 859. godine. Marokanska medina u Fesu je najveći urbani pešački okrug na svetu.',
  },
  {
    id: 'turkey', name: 'Turska', flag: '🇹🇷',
    capital: 'Ankara', population: '~85 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Turkey+Ottoman+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Turkey+nature+Cappadocia+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Turkey',
    wikiImgs: ['Turkey Cappadocia hot air balloons sunrise', 'Turkey Pamukkale thermal pools', 'Turkey Istanbul Bosphorus'],
    legend: 'Legenda o Nasreddinu Hodži, mudracu i budali u isto vreme, puna je paradoksa i mudrosti. Jednom je Hodža ušao u mecet naopako obuven. Čarapa mu je bila naopačke. Neko mu reče da je pogrešno obuo čarape. On odgovori: "Ne — svet je pogrešno postavljen, a moje čarape su jedino ispravno u njemu."',
    fact: 'Turska je zemlja gde je prvi novac u istoriji kovan (u Lidiji, 650. p.n.e.). Istanbul je jedini grad na svetu koji leži na dva kontinenta. Cappadocia ima više od 200 podzemnih gradova.',
  },
  {
    id: 'egypt', name: 'Egipat', flag: '🇪🇬',
    capital: 'Kairo', population: '~106 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Ancient+Egypt+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Egypt+Nile+desert+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Egypt',
    wikiImgs: ['Egypt pyramids Giza desert sunset', 'Egypt Nile river cruise', 'Egypt Luxor temple columns'],
    legend: 'Priča o Ozirisu i Izidi je priča o večnoj ljubavi. Oziris, bog plodnosti, ubijen je od svog brata Seta i isečen na 14 delova rasutih po celom Egiptu. Njegova žena Izida prehodala je celu zemlju skupljajući delove tela i sastavila ga — i on je oživeo. Ta ljubav koja pobeđuje smrt bila je osnova egipatske vere u zagrobni život.',
    fact: 'Drevni Egipćani su koristili pastu za zube, dezodorans i kontracepciju — pre 4.000 godina. Kleopatra je živela bliže vremenu sletanja na Mesec nego vremenu izgradnje piramida.',
  },
  {
    id: 'india', name: 'Indija', flag: '🇮🇳',
    capital: 'Nju Delhi', population: '~1,44 milijarde',
    ytHistory: 'https://www.youtube.com/results?search_query=India+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=India+nature+landscapes+beauty',
    mapsUrl: 'https://www.google.com/maps/place/India',
    wikiImgs: ['India Taj Mahal sunrise', 'India Rajasthan palace', 'India Kerala backwaters'],
    legend: 'Taj Mahal je simbol večne ljubavi. Mogulski car Šah Džahan naručio je ovaj mausolej za svoju voljenu ženu Mumtaz Mahal, koja je umrla rađajući njihovo 14. dete. Građen je 22 godine, 20.000 radnika.',
    fact: 'Indija je zemlja odakle potiču šah, yoga, algebra i numerički sistem koji danas koristi ceo svet ("arapske brojke" su zapravo indijskog porekla). Sa više od 1,4 milijarde stanovnika, Indija ima više vegetarijanaca od ostatka sveta zajedno.',
  },
  {
    id: 'thailand', name: 'Tajland', flag: '🇹🇭',
    capital: 'Bangkok', population: '~71 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Thailand+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Thailand+nature+islands+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Thailand',
    wikiImgs: ['Thailand Wat Pho temple Bangkok', 'Thailand Phi Phi islands sea', 'Thailand elephant jungle'],
    legend: 'Prema tajlandskoj legendi, beli slon je sveto biće koje donosi sreću i prosperitet. Kada se rodi beli slon, automatski postaje vlasništvo kralja. Legenda kaže da je sam Buda, u prethodnom životu, bio beli slon koji je spasio svoju majku iz oluje.',
    fact: 'Tajland nikad nije bio kolonizovan od strane evropskih sila — jedina zemlja u jugoistočnoj Aziji sa takvom istorijom. Reč "Tajland" znači "Zemlja slobodnih". Bangkok ima najduže zvanično ime ikojeg grada na svetu — 169 slova.',
  },
  {
    id: 'canada', name: 'Kanada', flag: '🇨🇦',
    capital: 'Otava', population: '~39 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Canada+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Canada+nature+Rockies+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Canada',
    wikiImgs: ['Canada Banff National Park lake mountains', 'Canada Niagara Falls', 'Canada Vancouver autumn'],
    legend: 'Legenda o Thunderbirdu potiče od autohtonih naroda Kanade. Thunderbird je ogromna mitološka ptica čija krila stvaraju grom, a oči sevaju munje. Živela je na vrhu planine u Stenovitim planinama, daleko od ljudi. Kada bi bila gladna, spuštala bi se do mora i hvatala kitove.',
    fact: 'Kanada ima najdužu obalnu liniju na svetu — 202.080 km. Kanada ima više jezera sa slatkom vodom od svih ostalih zemalja sveta zajedno. Reč "Kanada" potiče od irokenskog "kanata" što znači "selo".',
  },
  {
    id: 'australia', name: 'Australija', flag: '🇦🇺',
    capital: 'Kanbera', population: '~26 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Australia+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Australia+nature+outback+reef+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Australia',
    wikiImgs: ['Australia Uluru Ayers Rock sunset', 'Australia Great Barrier Reef', 'Australia Sydney Opera House'],
    legend: 'Aboridžinski "Dreamtime" (Vreme snova) nije mit o prošlosti — to je živa stvarnost koja prožima sadašnjost. Preci Stvaratelji hodali su kroz praznu zemlju i pevali sve što su videli — kamenje, reke, životinje — i tako su ih stvarali. Te "putanje pesme" prolaze kroz celu Australiju.',
    fact: 'Australija je jedina zemlja koja pokriva ceo kontinent. Ima više vrsta smrtonosnih životinja od bilo koje druge zemlje na svetu — ali i jednu od najnižih stopa ubistava. Kengur i emu ne mogu hodati unazad.',
  },
  {
    id: 'france', name: 'Francuska', flag: '🇫🇷',
    capital: 'Pariz', population: '~68 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=France+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=France+nature+Provence+Alps+beauty',
    mapsUrl: 'https://www.google.com/maps/place/France',
    wikiImgs: ['France Eiffel Tower Paris night', 'France Provence lavender fields', 'France Mont Saint-Michel'],
    legend: 'Legenda o Merlin i Vili Jezerskoj kaže da je Arturova Excalibur iskovan u dalekim keltskim krajima, a da je zlaćani mač čuvala Vila Jezera duboko ispod ogledalne vode. Artur je mač primio sa ruke koja se uzdizala iz vode, ali je i vratio tu ruku pred smrt — jer vladaru onog sveta vlada i oprosta mora da se vrati.',
    fact: 'Francuska je najposećenija turistička destinacija na svetu — prima oko 90 miliona turista godišnje. Eiffelov toranj bio je prvobitno zamišljen kao privremena struktura za Svetsku izložbu 1889. Baguette hleb je toliko deo kulture da postoji zakon koji reguliše sastojke.',
  },
  {
    id: 'spain', name: 'Španija', flag: '🇪🇸',
    capital: 'Madrid', population: '~47 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Spain+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Spain+nature+landscapes+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Spain',
    wikiImgs: ['Spain Sagrada Familia Barcelona', 'Spain Alhambra Granada palace', 'Spain Seville orange trees'],
    legend: 'El Cid — Rodrigo Díaz de Vivar — junak je Španije koji je, prema legendi, toliko bio poštovan da su ga vojnici nosili u bici mrtvog i neprijatelji su i dalje bežali od njega. Njegova priča govori o tome kako čast i slava ne umiru sa čovekom.',
    fact: 'Španija ima drugi najveći broj UNESCO lokacija u svetu. La Tomatina festival u Buñolu je jedina bitka gde oružje je... paradajz. Španski jezik govori više od 580 miliona ljudi širom sveta — drugi je po broju izvornih govornika.',
  },
  {
    id: 'portugal', name: 'Portugalija', flag: '🇵🇹',
    capital: 'Lisabon', population: '~10 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Portugal+history+Age+of+Discovery+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Portugal+nature+Algarve+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Portugal',
    wikiImgs: ['Portugal Sintra Pena Palace', 'Portugal Douro Valley vineyards', 'Portugal Algarve cliffs ocean'],
    legend: 'Legenda o Sebastiánu kaže da kralj Sebastião I, koji je poginuo u bici 1578. bez naslednika, nije zaista umro. Živeo je na tajanstvenom ostrvu i vratiće se u magli jednog jutra da obnovi carstvo. Taj sebastijanizam je živeo vekovima kao utočište u teškim vremenima.',
    fact: 'Portugalija je najstarija država-nacija u Evropi, sa nepromenjenim granicama od 1139. godine. Portugal je bio prva globalna imperija — Vasco da Gama je 1498. otvorio put do Indije. Lisabon je stariji od Rima za čak 400 godina.',
  },
  {
    id: 'croatia', name: 'Hrvatska', flag: '🇭🇷',
    capital: 'Zagreb', population: '~4 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Croatia+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Croatia+Plitvice+Dalmatia+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Croatia',
    wikiImgs: ['Croatia Dubrovnik old town walls', 'Croatia Plitvice Lakes waterfalls', 'Croatia Split Diocletians Palace'],
    legend: 'Legenda o Vilama čuvaricama dalmatinskih ostrva govori da su prelepe žene-vile, sa dugom svilenom kosom, živele u pećinama uz more. One su čuvale ribare i brodove u olujama, ali ih je trebalo poštovati — onaj ko bi otkrio njihove tajne bio bi pretvoren u mermerni kip koji stoji na dnu mora.',
    fact: 'Kravata je izmišljena u Hrvatskoj — vojnici su je nosili u 17. veku, a Francuzi su je zvali "à la croate". Dubrovnik je bio slobodna republika sa zapisima koji sežu u 1358. godinu. Plitvička jezera su jedan od najstarijih nacionalnih parkova Evrope.',
  },
  {
    id: 'newzealand', name: 'Novi Zeland', flag: '🇳🇿',
    capital: 'Velington', population: '~5,1 milion',
    ytHistory: 'https://www.youtube.com/results?search_query=New+Zealand+history+Maori+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=New+Zealand+nature+landscapes+beauty',
    mapsUrl: 'https://www.google.com/maps/place/New+Zealand',
    wikiImgs: ['New Zealand Milford Sound fjord', 'New Zealand Hobbiton Shire', 'New Zealand Mount Cook glacier'],
    legend: 'Maorska legenda kaže da je polobog Maui uhvatio sunce i natukao ga kanapom da bi usporilo hod i dalo više svetlosti. Zatim je pecao džinovskom udicom i izvukao ostrvo Novog Zelanda iz mora — ono je "Riba Mauija". Severni otok Novog Zelanda i danas nosi to ime — Te Ika-a-Māui.',
    fact: 'Novi Zeland je bio prva zemlja na svetu koja je ženama dala pravo glasa, 1893. godine. Zemlja ima više vrsta ptica bez sposobnosti leta nego bilo koja druga zemlja. Na svakog čoveka dolazi oko 9 ovaca.',
  },
  {
    id: 'switzerland', name: 'Švajcarska', flag: '🇨🇭',
    capital: 'Bern', population: '~8,7 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Switzerland+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Switzerland+Alps+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Switzerland',
    wikiImgs: ['Switzerland Matterhorn Alps', 'Switzerland Lucerne lake bridge', 'Switzerland Jungfrau snow mountains'],
    legend: 'Legenda o Vilijamu Telu govori o heroju koji je odbio da se pokloni tiraninovom šeširu na vrhu koplja. Kao kaznu, morao je da gadom pogodi jabuku na glavi svog sina. Pogodio je iz prvog pokušaja — ali je imao drugu strelu za tiranina, ako bi prva promašila sina. Simbol slobode i roditeljske ljubavi koji definiše šavarjcarsku dušu.',
    fact: 'Švajcarska ima četiri zvanična jezika: nemački, francuski, italijanski i romanški. Zemlja nije bila u ratu od 1815. i jedina je koja zadržava stalno neutralnost. U Švajcarskoj je više muzeja po glavi stanovnika nego bilo gde drugde na svetu.',
  },
  {
    id: 'austria', name: 'Austrija', flag: '🇦🇹',
    capital: 'Beč', population: '~9,1 milion',
    ytHistory: 'https://www.youtube.com/results?search_query=Austria+Habsburg+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Austria+Alps+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Austria',
    wikiImgs: ['Austria Vienna Belvedere Palace', 'Austria Hallstatt lake village', 'Austria Tyrol Alps meadow'],
    legend: 'Legenda o Sissi — carici Elizabeti — govori o devojci koja je odrasla slobodna među planinama Bavarske, a onda se udala za cara i bila zarobljena dvorskim protokolom. Postala je simbol žene koja nikad nije pristala da bude u kavezu — večno putovala, pisala poeziju i nikad nije starela u srcima naroda.',
    fact: 'Austrija je rodna zemlja Mocarta, Betovena (koji je tamo živeo) i Frojda. Bečka filharmonija je jedan od najstarijih i najprestižnijih orkestara na svetu. Austrija ima više od 3.000 zamkova i utvrđenja.',
  },
  {
    id: 'hungary', name: 'Mađarska', flag: '🇭🇺',
    capital: 'Budimpešta', population: '~10 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Hungary+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Hungary+nature+Balaton+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Hungary',
    wikiImgs: ['Hungary Budapest Parliament Danube night', 'Hungary Lake Balaton sunset', 'Hungary Eger castle wine'],
    legend: 'Mađarska legenda govori da je Attila Hun pokopio pod rekom Tisom okovan u tri kovčega — zlatnom, srebrnom i gvozdenom. Reka je skrenuta da pokrije grob, a svi radnici su ubijeni da bi tajna ostala večna. Priča kaže da se zemlja i voda mešaju u jednu pesmu koja čuva pokojnika.',
    fact: 'Mađari su izmislili kuglicu za pismo, Rubikovu kocku i holografiju. Budimpešta ima više termalni kupki nego bilo koji drugi evropski grad. Mađarski jezik je jedan od najtežih za naučiti — nema srodnih jezika u Evropi.',
  },
  {
    id: 'czechia', name: 'Češka', flag: '🇨🇿',
    capital: 'Prag', population: '~10,9 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Czech+Republic+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Czech+Republic+nature+Bohemia+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Czech+Republic',
    wikiImgs: ['Czech Republic Prague Charles Bridge', 'Czech Republic Cesky Krumlov castle', 'Czech Republic Bohemian Switzerland'],
    legend: 'Golem iz Praga — priča o glinenoj figuri kojoj je rabin Loew udahnuo život da zaštiti jevrejsku zajednicu. Golem je obavio mnoge zadatke, ali je postao previše moćan i nekontrolisan. Rabin ga je morao uništiti brisanjem jednog slova sa čela — pretvorivši "EMET" (istina) u "MET" (smrt).',
    fact: 'Češka je svetski lider u konzumiranju piva po glavi stanovnika — prosečan Čeh popije oko 188 litara godišnje. Prag je jedan od najočuvanijih gradova Evrope — nije bombardovan u Drugom svetskom ratu. Češka je izmislila šećer u kocki 1843.',
  },
  {
    id: 'poland', name: 'Poljska', flag: '🇵🇱',
    capital: 'Varšava', population: '~38 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Poland+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Poland+nature+Tatra+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Poland',
    wikiImgs: ['Poland Krakow market square', 'Poland Tatra Mountains', 'Poland Gdansk old town'],
    legend: 'Legenda o osnivanju Varšave govori o polu-devi polu-ribi — Sireni (Syrenka) — koja je živela u Visli. Ribar Var i njegova žena Šava su je čuli kako peva i zavoleli je. Sirena im je rekla: "Nazovite grad po meni — i ja ću ga večno čuvati." I danas sirena stoji na grbu Varšave.',
    fact: 'Marija Kiri, jedina osoba koja je dobila Nobelovu nagradu iz dve različite nauke, bila je Poljakinja. Auschwitz je podsećanje koje Poljska nosi svake godine. Šopinova muzika je toliko deo poljskog identiteta da se svira na javnim mestima svake nedelje u Varšavi.',
  },
  {
    id: 'mexico', name: 'Meksiko', flag: '🇲🇽',
    capital: 'Meksiko Siti', population: '~130 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Mexico+Aztec+Maya+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Mexico+nature+jungle+cenotes+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Mexico',
    wikiImgs: ['Mexico Chichen Itza pyramid', 'Mexico Copper Canyon landscape', 'Mexico Oaxaca Day of Dead'],
    legend: 'Legenda o Kvecalkvatlu govori o bogu u obliku pernatog zmaja koji je naučio ljude umetnosti, nauci i agricolturi. Otišao je na istok obećavši da će se vratiti — i kad su Španci stigli u 1519. godini, Acteci su mislili da je to njegov povratak. Ta zabluda je koštala carstvo.',
    fact: 'Meksiko je osmina zemlja na svetu po površini. Čokolada, paradajz, kukuruz, paprika i vanilija — sve je poniklo u Meksiku i promenilo svtsku kuhinju. Meksiko Siti je izgrađen na drevnom aztečkom gradu Tenochtitlanu, koji je stajao na veštačkim ostrvima.',
  },
  {
    id: 'brazil', name: 'Brazil', flag: '🇧🇷',
    capital: 'Brazilija', population: '~215 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Brazil+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Brazil+Amazon+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Brazil',
    wikiImgs: ['Brazil Amazon rainforest river', 'Brazil Iguazu Falls', 'Brazil Rio de Janeiro Sugarloaf Mountain'],
    legend: 'Legenda o Iarsí kaže da u dubini Amazonke živi prelepа žena sa dugom crnom kosom. Ona mami ribareи vodenike da siđu pod vodu i postanu zauvek deo reke. Njeni oči su zelene kao voda, a njena pesma se čuje samo kada je reka mirna. Ko je čuje, ne vraća se kući.',
    fact: 'Amazon šuma proizvodi 20% svetskog kiseonika. Brazil je jedina zemlja u Latinskoj Americi gde se govori portugalski. Karneval u Rio de Žaneiru je najveća stranka na svetu — 2 miliona ljudi dnevno tokom pet dana.',
  },
  {
    id: 'argentina', name: 'Argentina', flag: '🇦🇷',
    capital: 'Buenos Ajres', population: '~46 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Argentina+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Argentina+Patagonia+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Argentina',
    wikiImgs: ['Argentina Patagonia Torres del Paine', 'Argentina Iguazu Falls aerial', 'Argentina Buenos Aires tango'],
    legend: 'Legenda o gaucho heroju Martinu Fierru govori o čoveku koji je živeo slobodan na ogromnoj pampi. Prisilno regrutirajući u vojsku, pobegao je i posvadio se sa zakonom. Ali njegova muzika — milonga — ostaje njegova jedina sloboda. Fierro je simbol argentinskog duha otpora i slobode.',
    fact: 'Argentina je osma zemlja na svetu po površini. Tango je nastao u lukavim kvartovima Buenos Airesa u kasnom 19. veku. Argentina je zemlja sa više psihologa po glavi stanovnika nego bilo gde drugde na svetu.',
  },
  {
    id: 'colombia', name: 'Kolumbija', flag: '🇨🇴',
    capital: 'Bogota', population: '~51 milion',
    ytHistory: 'https://www.youtube.com/results?search_query=Colombia+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Colombia+nature+coffee+region+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Colombia',
    wikiImgs: ['Colombia Cartagena old city walls', 'Colombia Coffee region landscape', 'Colombia Caño Cristales river'],
    legend: 'Legenda o El Doradu — zlatnom gradu — opisuje vladara koji se svake godine pokrivao zlatnim prahom i skakao u sveto jezero. Španskim konkvistadorima ta priča je pomogla da poharaju kontinent tražeći grad koji nikad nisu pronašli. El Dorado je ostao metafora za neuhvatljiv san.',
    fact: 'Kolumbija je jedina zemlja u Južnoj Americi sa obalom i na Tihom okeanu i na Karibima. Zemlja je svetski lider u raznolikosti ptica — ima više od 1.900 vrsta. Kaño Kristales reka menja boje — zelenu, crvenu, plavu — zbog endemskih algi.',
  },
  {
    id: 'vietnam', name: 'Vijetnam', flag: '🇻🇳',
    capital: 'Hanoi', population: '~98 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Vietnam+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Vietnam+Ha+Long+Bay+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Vietnam',
    wikiImgs: ['Vietnam Ha Long Bay limestone karsts', 'Vietnam Hoi An lanterns night', 'Vietnam Sapa rice terraces'],
    legend: 'Legenda o Vrećnoj žabi kaže da je žaba, davno pre pojave bogova, bila straža između neba i zemlje. Kada bi žaba prestala da peva, kiša bi prestala. Seljaci su i danas u sušama tražili žabe i terali ih da cvrkuću — verovalo se da bogovi neba čuju žabe, ne ljude.',
    fact: 'Vijetnam ima jedan od najbrže rastućih ekonomija u svetu. Ao dai — tradicionalna vijetnamska haljina — smatra se jednom od najelegantniih nošnji na svetu. Vijetnamska kafa (cà phê trứng) — kafa sa žumancetom — je lokalni izum koji osvaja svet.',
  },
  {
    id: 'cambodia', name: 'Kambodža', flag: '🇰🇭',
    capital: 'Pnom Pen', population: '~17 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Cambodia+Khmer+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Cambodia+Angkor+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Cambodia',
    wikiImgs: ['Cambodia Angkor Wat temple sunrise', 'Cambodia Tonle Sap lake floating village', 'Cambodia Siem Reap jungle temple'],
    legend: 'Legenda o Angkor Vatu kaže da je hramu podignut za jednu noć od strane boga Indre za svog sina. Jutro pre nego što je završen, pijetao je zapevao i gradnja je morala stati — jedini nedovršeni deo je i danas vidljiv. Hram je orijentisan prema zapadu — prema carstvu mrtvih — jer je bio mauzolej, ne samo svetilište.',
    fact: 'Angkor Vat je najveća religiozna građevina na svetu. Kambodža ima jedan od najvećih ratnih i geopolitičkih tragova 20. veka — Crveni Kmeri su ubili gotovo četvrtinu stanovništva. Zemlja se oporavlja i beleži rast turizma svake godine.',
  },
  {
    id: 'indonesia', name: 'Indonezija', flag: '🇮🇩',
    capital: 'Džakarta', population: '~275 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Indonesia+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Indonesia+Bali+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Indonesia',
    wikiImgs: ['Indonesia Bali rice terraces', 'Indonesia Komodo dragon island', 'Indonesia Mount Bromo volcano sunrise'],
    legend: 'Balijanska legenda o Barong i Rangdi govori o večnoj borbi između dobrog i zlog — ali bez pobednika. Barong (lav zaštitnik) i Rangdi (veštica smrti) večno se bore, ali nijedan ne može da pobedi drugog. Ravnoteža, ne pobeda, je smisao svemira — i ta filozofija prožima balijanski život.',
    fact: 'Indonezija ima više od 17.000 ostrva, od kojih je samo 6.000 naseljeno. Zemlja ima četvrtu najveću populaciju na svetu. Bali ima drugačiju religiju od ostatka Indonezije — hinduizam — i to čini njenu kulturu potpuno jedinstvenom.',
  },
  {
    id: 'nepal', name: 'Nepal', flag: '🇳🇵',
    capital: 'Katmandu', population: '~30 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Nepal+history+Himalayas+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Nepal+Everest+Himalayas+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Nepal',
    wikiImgs: ['Nepal Everest Himalayas sunrise', 'Nepal Kathmandu Durbar Square temples', 'Nepal Annapurna trekking'],
    legend: 'Legenda o Yetiju — snežnom čoveku Himalaja — živi vekovima u nepalskim selima. Yeti se pojavljuje za snežnih oluja, ostavlja tragove, ali nikada ne dozvoli da ga vide. Šerpasi veruju da je Yeti čuvar planine koji kažnjava one koji ne poštuju Himalaje.',
    fact: 'Nepal je dom osam od deset najviših planina na svetu, uključujući Everest (8.849 m). Katmandu je nekad bio buddhistička i hinduistička prestonica — dva živa svetska centra vere koji dele iste svetinjе. Nepal je jedina zemlja na svetu sa nekvadratnom zastavom.',
  },
  {
    id: 'china', name: 'Kina', flag: '🇨🇳',
    capital: 'Peking', population: '~1,4 milijarde',
    ytHistory: 'https://www.youtube.com/results?search_query=China+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=China+nature+landscapes+beauty',
    mapsUrl: 'https://www.google.com/maps/place/China',
    wikiImgs: ['China Great Wall landscape', 'China Zhangjiajie floating mountains', 'China Li River karst scenery'],
    legend: 'Legenda o Meng Jiangnüu govori o ženi čiji je muž odveden da gradi Kineski zid. Godinama ga je čekala, a kada je stigla na zid, saznala je da je umro i zazidan u njega. Njena tuga je bila tolika da je deo zida popucao od njenih suza — i otkrila je muževe kosti. Priča je simbol ljubavi koja se ne predaje.',
    fact: 'Kineski zid nije vidljiv iz svemira — to je mit. Kina je zemlja sa najviše UNESCO lokacija (56). Papir, štamparija, barut i kompas — četiri velika izuma koji su promenili svet — sve potiče iz Kine.',
  },
  {
    id: 'southkorea', name: 'Južna Koreja', flag: '🇰🇷',
    capital: 'Seul', population: '~52 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=South+Korea+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=South+Korea+nature+Jeju+beauty',
    mapsUrl: 'https://www.google.com/maps/place/South+Korea',
    wikiImgs: ['South Korea Gyeongbokgung Palace Seoul', 'South Korea Jeju Island coast', 'South Korea Seoraksan autumn forest'],
    legend: 'Legenda o Tangun-u kaže da je osnivač Koreje bio sin boga neba i medvedice koja se transformisala u ženu. Tangun je osnovao prvo korejsko kraljevstvo pre 4.300 godina i vladao hiljadu godina. Dan osnivanja Koreje i danas se slavi 3. oktobra.',
    fact: 'Južna Koreja je jedna od najbrže modernizovanih zemalja u istoriji — prešla je iz jedne od najsiromašnijih u jednu od najbogatijih za 60 godina. K-pop je globalni fenomen koji je promenio muzičku industriju. Koreja ima najbrži internet u svetu.',
  },
  {
    id: 'jordan', name: 'Jordan', flag: '🇯🇴',
    capital: 'Aman', population: '~10 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Jordan+Petra+Nabataean+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Jordan+Wadi+Rum+Dead+Sea+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Jordan',
    wikiImgs: ['Jordan Petra Treasury rose city', 'Jordan Wadi Rum desert landscape', 'Jordan Dead Sea float'],
    legend: 'Petra je "Izgubljen grad" Nabatejaca koji su živeli u stenovitoj pustinji pre 2.000 godina. Prema legendi, sva vrata Petre nestaju tokom punog meseca — osim jednog, tajnog, koji vodi u riznicu samog Alaha. Beduini i danas pričaju da su čuli zvuk zlata iza stena noću.',
    fact: 'Mrtvo more je najniža tačka na površini Zemlje — 430 metara ispod nivoa mora. Petra je bila toliko izgubljena da su Europljani saznali za nju tek 1812. Jordan je jedna od najbezbednijih zemalja na Bliskom Istoku.',
  },
  {
    id: 'israel', name: 'Izrael', flag: '🇮🇱',
    capital: 'Jerusalim', population: '~9,7 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Israel+Jerusalem+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Israel+Negev+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Israel',
    wikiImgs: ['Israel Jerusalem Old City', 'Israel Negev desert crater', 'Israel Tel Aviv beach'],
    legend: 'Legenda o Masadi kaže da je 960 Jevreja, okruženih rimskom vojskom, izabralo smrt nad ropstvom 73. n.e. Komandant je zamolio svakog muškarca da ubije svoju porodicu, a zatim su jedni drugima oduzimali živote. Poslednji čovek se ubio sam. "Masada se neće pasti ponovo" ostalo je vojni moto Izraela.',
    fact: 'Izrael je zemlja sa najviše startap kompanija po glavi stanovnika — naziva se "Startup nacija". Jerusalem je sveto mesto za tri svetske religije — judaizam, hrišćanstvo i islam. Hebrejski jezik je jedini jezik koji je uspešno oživljen iz izumiranja.',
  },
  {
    id: 'kenya', name: 'Kenija', flag: '🇰🇪',
    capital: 'Najrobi', population: '~55 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Kenya+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Kenya+Masai+Mara+safari+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Kenya',
    wikiImgs: ['Kenya Masai Mara safari lions', 'Kenya Mount Kilimanjaro landscape', 'Kenya Amboseli elephants savanna'],
    legend: 'Maasai legenda govori da je Enkai (Bog) dao svu stoku na svetu Maasai narodu. Kada bi tuđe stado prolazilo kroz Maasai teritoriju, smatralo se da je to Enkai vratio svoju imovinu. Stoka je sveta i nosi dušu zajednice — bez goveda, čovek nema ni identitet.',
    fact: 'Kenija je najbrži narod na svetu — kenijski trkači osvajaju gotovo sve maratone. Masai Mara je dom jednoj od najvećih migracija životinja na Zemlji — više od 1,5 miliona gnuja. Kenija je zemlja sa jednim od najbogatijih safari ekosistema.',
  },
  {
    id: 'southafrica', name: 'Južna Afrika', flag: '🇿🇦',
    capital: 'Pretorija', population: '~60 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=South+Africa+history+apartheid+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=South+Africa+Cape+Town+Kruger+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/South+Africa',
    wikiImgs: ['South Africa Cape Town Table Mountain', 'South Africa Kruger National Park', 'South Africa Garden Route coast'],
    legend: 'Zulu legenda o Uthlakanyana govori o lukavom patuljku koji je pobegao iz majčine utrobe pre vremena, a zatim čitav život varao i krao od jačih. Simbol je buntovnog duha koji preživljava snagom uma, ne mišića. Zulu kultura ceni snagu priče jednako kao i snagu koplja.',
    fact: 'Južna Afrika je jedina zemlja na svetu koja je dobrovoljno odustala od nuklearnog oružja. Zemlja ima 11 zvaničnih jezika. Nelson Mandela je proveo 27 godina u zatvoru i zatim poveo Južnu Afriku iz aparthejda u demokratiju bez krvavog rata.',
  },
  {
    id: 'usa', name: 'SAD', flag: '🇺🇸',
    capital: 'Vašington D.K.', population: '~335 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=United+States+American+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=USA+national+parks+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/United+States',
    wikiImgs: ['USA Grand Canyon Arizona sunset', 'USA New York City skyline', 'USA Yosemite Valley waterfalls'],
    legend: 'Legenda o Johnu Hemenu — legendarnom crnačkom radniku koji je takmičenjem sa parnom mašinom bušio tunele. John Henry je pobedio mašinu — ali odmah potom pao mrtav od napora. Simbol je borbe čoveka naspram tehnologije, i dostojanstva rada koji se ne predaje.',
    fact: 'SAD imaju najveći GDP na svetu. Yellowstone je bio prvi nacionalni park na svetu (1872). Američka ustava je najstariji pisani ustav koji se i dalje primenjuje. NASA je poslala ljude na Mesec šest puta između 1969. i 1972.',
  },
  {
    id: 'cuba', name: 'Kuba', flag: '🇨🇺',
    capital: 'Havana', population: '~11 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Cuba+history+revolution+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Cuba+Vinales+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Cuba',
    wikiImgs: ['Cuba Havana vintage cars colorful', 'Cuba Vinales tobacco valley', 'Cuba Trinidad colonial city'],
    legend: 'Afro-kubanska legenda govori o Changó, bogu groma i plesa. Živi u vatri, oblači se u crveno i belo, i voli rum i muziku. Changó je simbol strasti i slobode — onaj ko pleše u ime Changó pozvan je da živi bez straha. Santeria religija i danas ga slavi po ulicama Havane.',
    fact: 'Kuba je jedna od retkih zemalja gde su klasični američki automobili iz 1950-ih i dalje svakodnevni saobraćaj. Havana ima jednu od najneobičnijih arhitektonskih mešavina — kolonijalna, art deco i brutalizam. Kubanski rum i cigare su među najcenjenijima na svetu.',
  },
  {
    id: 'chile', name: 'Čile', flag: '🇨🇱',
    capital: 'Santijago', population: '~19 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Chile+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Chile+Patagonia+Atacama+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Chile',
    wikiImgs: ['Chile Torres del Paine Patagonia', 'Chile Atacama desert flowers', 'Chile Easter Island Moai statues'],
    legend: 'Legenda o Moai statуama Uskršnjeg ostrva kaže da su ih sagradili preci koji su bili džinovi, ili da su statуe hodanje u mrak i zauzele položaj da bi čuvale narod koji je živeo za njima. Moai uvek okrenuti leđima moru — gledaju unutra, štite, ne progone.',
    fact: 'Čile je najuža i jedna od najdužih zemalja na svetu — 4.300 km dugačka, ali samo 177 km prosečno široka. Atacama pustinja je najsuša mesta na Zemlji. Čileanski astronomi imaju pristup nekim od najboljih teleskopa na svetu zahvaljujući čistom nebu.',
  },
  {
    id: 'russia', name: 'Rusija', flag: '🇷🇺',
    capital: 'Moskva', population: '~145 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Russia+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Russia+Siberia+Baikal+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Russia',
    wikiImgs: ['Russia Lake Baikal ice winter', 'Russia Saint Petersburg canals', 'Russia Kamchatka volcanoes'],
    legend: 'Legenda o Baba Jagi govori o staroj vještici koja živi u kolibi na pilećim nogama duboko u šumi. Pojede goste koji ne znaju pravo pitanje — ali onima koji su dovoljno mudri i drski, pokazuje put. Nije čisto zlo — ona je granica između života i smrti, i na toj granici spava mudrost.',
    fact: 'Rusija je najveća zemlja na svetu — pokriva 11 vremenskih zona. Jezero Bajkal sadrži 20% sve slatke vode na Zemlji i dublje je od ikojeg jezera. Trans-Sibirska pruga — 9.289 km — najduža je železnička pruga na svetu.',
  },
  {
    id: 'finland', name: 'Finska', flag: '🇫🇮',
    capital: 'Helsinki', population: '~5,5 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Finland+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Finland+Lapland+aurora+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Finland',
    wikiImgs: ['Finland Lapland aurora borealis reindeer', 'Finland Helsinki cathedral', 'Finland lake forest summer'],
    legend: 'Finska mitologija iz Kalevale govori o junaku Väinämöinenu — pradavnom starcu koji je pevanjem stvarao svet. Njegova pesma je toliko moćna da može da pomeri planine i zamrzne more. Ali on, koji je znao sve pesme, nije znao tri reči koje su potrebne da se sagrada čamac — i morao je da ode daleko da ih traži.',
    fact: 'Finska ima više sauna nego automobila — 3,3 miliona sauna za 5,5 miliona stanovnika. Finska deca počinju školu u 7 godini i imaju najkraće radne sate ali i neke od najviših rezultata na PISA testovima. Santa Klaus zvanično živi u Rovaniemiju, u Finskoj.',
  },
  {
    id: 'sweden', name: 'Švedska', flag: '🇸🇪',
    capital: 'Stokholm', population: '~10,5 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Sweden+Viking+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Sweden+nature+archipelago+northern+lights+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Sweden',
    wikiImgs: ['Sweden Stockholm archipelago summer', 'Sweden Abisko National Park', 'Sweden Gothenburg canal'],
    legend: 'Nordijska legenda o Valhalli kaže da ratnici koji umru u bici idu u dvoranu Odina gde svaki dan se bore do smrti — ali ustaju živi da večeraju i piju. To nije kazna — to je čast. Smrt u bici bio je jedini put u Valhalu, te su Vikinzi ulazili u bitku bez straha od kraja.',
    fact: 'Švedska je izmislila dinamit (Alfred Nobel), sigurnosni šibice i Bluetooth. Zemlja je jedna od najsretnijih na svetu po godišnjem indeksu sreće. Fika — kafena pauza sa kolegama — je kulturna institucija koja je zaštićena u radnom pravu.',
  },
  {
    id: 'denmark', name: 'Danska', flag: '🇩🇰',
    capital: 'Kopenhagen', population: '~5,9 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Denmark+Viking+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Denmark+nature+coast+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Denmark',
    wikiImgs: ['Denmark Nyhavn colorful buildings Copenhagen', 'Denmark Bornholm coast', 'Denmark Ribe medieval town'],
    legend: 'H.C. Andersen — danski pisac — inspirisao se lokalnim legendama za priče poput Male Sirene. Originalna priča nije imala sretan završetak: Sirena, kojoj je oduzet glas, nije uspela da osvoji ljubav princa i rasplinula se u morsku penu. Čak i u tugu postoji lepota — poruka danskog poimanja tišine.',
    fact: 'Danska je redovno na vrhu liste najsretnijih zemalja na svetu. Lego kocke su izumljene u Bilundu, Danska, 1958. Danska ima nultu stopu korupcije i jednu od najvećih stopa ciklizma u svetu.',
  },
  {
    id: 'romania', name: 'Rumunija', flag: '🇷🇴',
    capital: 'Bukurešt', population: '~19 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Romania+Transylvania+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Romania+Carpathians+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Romania',
    wikiImgs: ['Romania Transylvania castle Bran', 'Romania Bucovina painted monasteries', 'Romania Danube Delta birds'],
    legend: 'Vlad Cepeš — vojvoda Transilvanije — bio je toliko surov prema neprijateljima da su priče o njemu postale osnova za mit o vampirama. Ali u Rumuniji, Vlad je heroj koji je odbranio zemlju od Osmanlija. Bram Stoker nikad nije bio u Transilvaniji — celokupni roman "Drakula" zasnovan je na pismima i knijigama.',
    fact: 'Rumunija ima jednu od najbrže rastućih ekonomija u Evropi. Dela Dunava Delta je jedno od najbogatijih ptica-bioraznolikosti mesta u Evropi. Rumunski matematičar Stefan Banach i fizičar Horia Hulubei dali su veliki doprinos nauci.',
  },
  {
    id: 'ukraine', name: 'Ukrajina', flag: '🇺🇦',
    capital: 'Kijev', population: '~44 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Ukraine+history+Kyiv+Rus+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Ukraine+Carpathians+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Ukraine',
    wikiImgs: ['Ukraine Kyiv Saint Sophia Cathedral', 'Ukraine Carpathian Mountains', 'Ukraine sunflower fields'],
    legend: 'Legenda o Slavutni — Dnjepru — opisuje reku kao živu osobu. Mudar i spor starac hoda kroz stepe i planine, nosi priče svih naroda. Ko se napije iz Dnjepra noću, vidi snu prošlih i budućih vremena. Reka je pamćenje naroda.',
    fact: 'Černobilj je 1986. uzrokovao najveću nuklearnu katastrofu u istoriji — ali i neočekivano stvorio jedno od najbogatijih divljih staništa u Evropi. Kijevska Rus bila je jedna od najmoćnijih država medievalne Evrope. Suncokret je nacionalni cvet Ukrajine.',
  },
  {
    id: 'montenegro', name: 'Crna Gora', flag: '🇲🇪',
    capital: 'Podgorica', population: '~620.000',
    ytHistory: 'https://www.youtube.com/results?search_query=Montenegro+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Montenegro+Bay+of+Kotor+Durmitor+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Montenegro',
    wikiImgs: ['Montenegro Bay of Kotor fjord', 'Montenegro Durmitor National Park', 'Montenegro Sveti Stefan island'],
    legend: 'Crnogorska epska tradicija slavi hajduke — osvetničke heroje koji su krali od bogatih i davali siromašnima. Najčuveniji je Bajo Pivljanin, koji je decenijama pljačkao turske karavane i nikad nije bio uhvaćen. Crnogorski epovi su predani u UNESCO baštinu — jedina usmena tradicija takvog statusa.',
    fact: 'Crna Gora je jedna od najmanjih zemalja Evrope, ali ima 294 km obale na Jadranskom moru. Boko-Kotorski zaliv se često naziva jednim od najlepših zalivih na svetu. Crna Gora je postala nezavisna 2006. i jedna je od najmlađih zemalja Evrope.',
  },
  {
    id: 'sri_lanka', name: 'Šri Lanka', flag: '🇱🇰',
    capital: 'Kolombo', population: '~22 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Sri+Lanka+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Sri+Lanka+nature+tea+plantations+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Sri+Lanka',
    wikiImgs: ['Sri Lanka Sigiriya Rock Fortress', 'Sri Lanka tea plantation hills', 'Sri Lanka whale watching ocean'],
    legend: 'Legenda o Ravani kaže da je demon-kralj Ravana vladao ostrvom toliko moćno da je mogao da vozi nebeska kola letećim plamenim krilima. Oteo je Situ, ženu heroja Rame, što je dovelo do epskog rata opevenog u Ramajani. Šri Langanci i danas poštuju Ravanu kao mudrog vladara koji je učio ljude medicini i muzici.',
    fact: 'Šri Lanka je dom jednog od najstarijih kontinuiranih stabala zasađenih od strane čoveka — Ficus religiosa u Anuradhapuri, star 2.300 godina. Zemlja je svetski lider u proizvodnji cimeta. Ima jedan od najgušće naseljenih divljih slonova u Aziji.',
  },
  {
    id: 'malaysia', name: 'Malezija', flag: '🇲🇾',
    capital: 'Kuala Lumpur', population: '~33 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Malaysia+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Malaysia+Borneo+rainforest+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Malaysia',
    wikiImgs: ['Malaysia Petronas Twin Towers Kuala Lumpur', 'Malaysia Borneo rainforest orangutan', 'Malaysia Langkawi island beach'],
    legend: 'Malajska legenda o Raja Bersiong — Kralju koji pije krv — govori o vladaru koji je jednom okusio jelo sa krvlju i od tada nije mogao živeti bez kraja. Postupno je menjao sudere za krv slugu, dok narod nije ustao i proterao ga. Priča je upozorenje o tome kako ukus moći može u potpunosti promeniti čoveka.',
    fact: 'Malezija je dom najstarijem kišnom šumu na svetu — Taman Negara, star 130 miliona godina. Petronas tornjevi bili su najviše zgrade na svetu 1998-2004. Malezija ima više od 130 etničkih grupa i 137 živih jezika.',
  },
  {
    id: 'uae', name: 'UAE', flag: '🇦🇪',
    capital: 'Abu Dabi', population: '~10 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=UAE+Dubai+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=UAE+Dubai+desert+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/United+Arab+Emirates',
    wikiImgs: ['UAE Dubai skyline Burj Khalifa', 'UAE Abu Dhabi Sheikh Zayed Mosque', 'UAE desert dunes 4x4'],
    legend: 'Beduinska legenda o Falconu govori da je svaki plemenski starešina imao svog sokolova — koji je bio i lov i savest. Ako bi sokol odbio da se vrati, to je bio znak da je vladar izgubio čast. Falconry je i danas kraljevska umetnost u UAE, a sokoli imaju svoje pasoše za međunarodna putovanja.',
    fact: 'Dubai je za 50 godina prešao iz ribarskog sela u jedno od najbogatijih gradova na svetu. Burj Khalifa je najviša građevina na svetu sa 830 m. UAE ima najveći broj muzeja Luvra izvan Pariza. 89% stanovnika UAE su ekspatrijati.',
  },
  {
    id: 'taiwan', name: 'Tajvan', flag: '🇹🇼',
    capital: 'Tajpej', population: '~23 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Taiwan+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Taiwan+Taroko+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Taiwan',
    wikiImgs: ['Taiwan Taroko Gorge marble canyon', 'Taiwan Jiufen village mountain lights', 'Taiwan Sun Moon Lake'],
    legend: 'Tajvanska legenda o Yinglong-u — dragonovom kralju Mora — kaže da svaki grad kraj mora ima svog čuvara zmaja koji spava na dnu. Kada zmaj ustane, dolazi do cunamija — ali i do blagostanja. Ribari su bacali darove u more da bi zmaj ostao zadovoljan i spavao mirno.',
    fact: 'Tajvan je demon-centralizovana ekonomija — u 70-im se transformisao od siromašnog u visokorazvijenoj. TSMC na Tajvanu pravi više od 90% najnaprednijih čipova na svetu. Tajvan je rodna zemlja bubble tea.',
  },
  {
    id: 'ghana', name: 'Gana', flag: '🇬🇭',
    capital: 'Akra', population: '~33 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Ghana+history+Ashanti+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Ghana+nature+wildlife+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Ghana',
    wikiImgs: ['Ghana Kakum National Park canopy walk', 'Ghana Cape Coast Castle', 'Ghana Mole National Park elephants'],
    legend: 'Anansi priče — o pauku koji je od bogova kupio sve priče sveta — govore da je Anansi platio paucima, osinjama i leopardom da bi dobio pravo da bude čuvar svih priča na svetu. Zato su Ashanti priče i mudrost čuvane u pričama o pauku koji je pametniji od sile.',
    fact: 'Gana je bila prva subsaharska afrička zemlja koja je stekla nezavisnost od kolonijalne vlasti, 1957. Zemlja ima jedan od najvećih akumulacionih jezera na svetu — Akosombo. Ašanti tkanje (Kente) je jedna od najprepoznatljivijih tkanina na svetu.',
  },
  {
    id: 'ethiopia', name: 'Etiopija', flag: '🇪🇹',
    capital: 'Adis Abeba', population: '~126 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Ethiopia+history+Aksum+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Ethiopia+Simien+Mountains+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Ethiopia',
    wikiImgs: ['Ethiopia Lalibela rock hewn churches', 'Ethiopia Danakil Depression', 'Ethiopia Simien Mountains'],
    legend: 'Etiopska legenda o Kraljici od Sabe govori da je Makeda otputovala u Jerusalim da vidi Solomonovu mudrost. Ostala je godinu dana, rodila njegovog sina Menelika koji je, odrasavši, pošao ocu — i sa sobom vratio Kovčeg Saveza koji i danas, prema verovanju, leži u Aksumu.',
    fact: 'Etiopija je jedina afrička zemlja koja nikad nije bila kolonizovana (osim kratke italijanske okupacije 1936-41). Etiopski kalendar ima 13 meseci i Etiopija je godinu dana "iza" ostatka sveta. Kafa se pije u zemli koja joj je dala ime — Kaffa regija.',
  },
  {
    id: 'tanzania', name: 'Tanzanija', flag: '🇹🇿',
    capital: 'Dodoma', population: '~64 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Tanzania+Zanzibar+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Tanzania+Serengeti+Kilimanjaro+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Tanzania',
    wikiImgs: ['Tanzania Kilimanjaro sunrise clouds', 'Tanzania Serengeti wildebeest migration', 'Tanzania Zanzibar beach'],
    legend: 'Maasai legenda o Kilimandžaru kaže da je bog Ngai živeo na vrhu planine i spuštao dažd i sunce na narod u dolinama. Planina nije bila za ljude — bila je stan boga. Oni koji su se peli pokazivali su drskost, a gromovi i mraz bili su Ngaijev odgovor.',
    fact: 'Kilimandžaro je najviša tačka Afrike (5.895 m) i najveći slobodnostojeći vulkanski masiv na svetu. Tanzanija je dom Serengeti ekosistema, koji podržava najveću migraciju kopnenih životinja na Zemlji. Zanzibar je bio centar afričke robovlasničke trgovine.',
  },
  {
    id: 'madagascar', name: 'Madagaskar', flag: '🇲🇬',
    capital: 'Antananarivo', population: '~28 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Madagascar+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Madagascar+baobab+lemur+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Madagascar',
    wikiImgs: ['Madagascar Avenue of Baobabs sunset', 'Madagascar lemur jungle', 'Madagascar Tsingy de Bemaraha'],
    legend: 'Madagaskarska Malagasy tradicija govori da preci "Razana" nisu zaista mrtvi. Jednom u sedam godina, porodice otkopavaju kosti predaka, umotavaju ih u svilu, plešu sa njima i slave do jutra. "Famadihana" — okretanje mrtvih — nije stravično već sveto — jer veza sa precima ne prekida smrću.',
    fact: 'Madagaskar je četvrti po veličini ostrvo na svetu i odvojeno je od Afrike pre 88 miliona godina. 90% biljaka i životinja na Madagaskaru nema drugde na svetu — zemlja je biodiverzitetna mega-tačka. Lemuri su jedine primacione vrste koje postoje samo na Madagaskaru.',
  },
  {
    id: 'iran', name: 'Iran', flag: '🇮🇷',
    capital: 'Teheran', population: '~87 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Iran+Persia+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Iran+Persia+nature+landscapes+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Iran',
    wikiImgs: ['Iran Persepolis ancient ruins', 'Iran Isfahan Imam Square mosque', 'Iran Yazd desert wind towers'],
    legend: 'Legenda o Rustamu iz Šahname — epske pesme od 60.000 stihova — govori o junaku koji je u borbi ubio sopstvenog sina, ne znajući ko je. Slično tragičnoj sudbini iz grčke mitologije, priča govori o veličini i krhkosti — da ni snaga ni plemenita krv ne štite od sudbine.',
    fact: 'Iran (Persija) je jedna od najstarijih kontinuiranih civilizacija — 7.000 godina istorije. Persepolis je bio jedna od najslavnijih prestonica antičkog sveta. Iran ima više od 26 UNESCO svetske baštine. Šafran, pistaci i umetnost vezenja — sve su globalni darovi iranskog naroda.',
  },
  {
    id: 'oman', name: 'Oman', flag: '🇴🇲',
    capital: 'Muskat', population: '~4,7 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Oman+history+Sinbad+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Oman+Wahiba+Sands+Wadi+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Oman',
    wikiImgs: ['Oman Wahiba Sands desert dunes', 'Oman Nizwa fort oasis', 'Oman Wadi Shab canyon pool'],
    legend: 'Omanska legenda o Sindbadu mornaru — koji je plovio sedam putovanja kroz čudna mora i sreo zmajeve, džinove i mitske ptice Ruh — poreklom je iz Suara, omanski grad. Priče iz "Hiljadu i jedne noći" inspirisane su omanski mornarima koji su plovili do Kine i Afrike.',
    fact: 'Oman je jedna od najbezbednijih i najpristupačnijih zemalja Arapskog poluostrva za turiste. Sultan Qabus bin Said Al Said vladao je 50 godina i pretvorio siromašni Oman u prosperitetnu naciju. Frankincense — tamjan — potiče iz Omana i bio je vredniji od zlata u antici.',
  },
  {
    id: 'bolivia', name: 'Bolivija', flag: '🇧🇴',
    capital: 'Sukre / La Paz', population: '~12 miliona',
    ytHistory: 'https://www.youtube.com/results?search_query=Bolivia+Inca+history+documentary',
    ytNature: 'https://www.youtube.com/results?search_query=Bolivia+Salar+Uyuni+nature+beauty',
    mapsUrl: 'https://www.google.com/maps/place/Bolivia',
    wikiImgs: ['Bolivia Salar de Uyuni salt flat reflection', 'Bolivia La Paz cityscape', 'Bolivia Amazon jungle'],
    legend: 'Ajmara legenda o "Pachamama" — Majci Zemlji — kaže da je Zemlja živo biće koje oseća glad, bol i radost. Seljaci ne oraju niti sade bez da najpre "nahrane" Pachamamu lišćem koke, alkoholom i duvanom. Ako je ne poštuješ, suša ili grad uništiće žetvu.',
    fact: 'Salar de Uyuni je najveće slatkovodne soljivane na svetu — 10.582 km². Bolivija ima dve prestonice. Titicacino jezero je najviše navigabilno jezero na svetu na 3.812 m visine. Bolivija ima jedan od najvećih udela autohtonog stanovništva u Južnoj Americi.',
  },
]

function useCountryImages(wikiImgs) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!wikiImgs?.length) return
    setLoading(true)
    setImages([])

    let cancelled = false

    async function fetchOne(query) {
      try {
        const searchRes = await window.fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`
        )
        const searchJson = await searchRes.json()
        const pageId = searchJson.query?.search?.[0]?.pageid
        if (!pageId) return null

        const imgRes = await window.fetch(
          `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&pithumbsize=900&format=json&origin=*`
        )
        const imgJson = await imgRes.json()
        return imgJson.query?.pages?.[pageId]?.thumbnail?.source || null
      } catch {
        return null
      }
    }

    Promise.all(wikiImgs.map(fetchOne)).then((results) => {
      if (!cancelled) {
        setImages(results.filter(Boolean))
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [wikiImgs?.join('|')])

  return { images, loading }
}

function PhotoCarousel({ images, loading, flag, name }) {
  const [idx, setIdx] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (images.length <= 1) return
    intervalRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % images.length)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [images.length])

  useEffect(() => {
    setIdx(0)
  }, [images])

  if (loading) {
    return <div className="h-56 bg-linen rounded-2xl animate-pulse" />
  }

  if (!images.length) {
    return (
      <div
        className="h-56 rounded-2xl flex items-center justify-center text-9xl"
        style={{ background: 'linear-gradient(135deg, #2D4A3E, #4A7C59)' }}
      >
        {flag}
      </div>
    )
  }

  return (
    <div className="relative h-56 rounded-2xl overflow-hidden shadow-md group">
      <img
        src={images[idx]}
        alt={name}
        className="w-full h-full object-cover transition-opacity duration-700"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-3' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Explore() {
  const [selected, setSelected] = useState(COUNTRIES[0])
  const [open, setOpen] = useState(false)
  const { images, loading } = useCountryImages(selected.wikiImgs)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-ink">Istraži svet 🌍</h1>
        <p className="text-mist text-sm mt-1">Legende, zanimljivosti i priroda različitih zemalja</p>
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

      {/* Photo carousel */}
      <PhotoCarousel images={images} loading={loading} flag={selected.flag} name={selected.name} />

      {/* Info card */}
      <div className="bg-white rounded-2xl p-6 border border-linen shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🌐</span>
          <h2 className="font-display text-lg font-semibold text-ink">Podaci o zemlji</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">🏛️</span>
            <div>
              <div className="text-xs text-mist mb-0.5">Glavni grad</div>
              <div className="font-semibold text-ink text-sm">{selected.capital}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">👥</span>
            <div>
              <div className="text-xs text-mist mb-0.5">Stanovništvo</div>
              <div className="font-semibold text-ink text-sm">{selected.population}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href={selected.ytHistory}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-red-50 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <span className="text-base">▶️</span>
            <span>Istorija — YouTube pretraga</span>
          </a>
          <a
            href={selected.ytNature}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
          >
            <span className="text-base">🌿</span>
            <span>Prirodne lepote — YouTube pretraga</span>
          </a>
          <a
            href={selected.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <span className="text-base">🗺️</span>
            <span>Otvori na Google Maps</span>
          </a>
        </div>
      </div>

      {/* Legend card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-linen">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📖</span>
          <h2 className="font-display text-lg font-semibold text-ink">Narodna legenda</h2>
        </div>
        <p className="text-sm text-ink-light leading-relaxed">{selected.legend}</p>
      </div>

      {/* Fact card */}
      <div className="bg-white rounded-2xl p-6 border border-linen shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💡</span>
          <h2 className="font-display text-lg font-semibold text-ink">Zanimljivost</h2>
        </div>
        <p className="text-sm text-ink-light leading-relaxed">{selected.fact}</p>
      </div>

      {/* Footer */}
      <div className="text-center pb-4">
        <Globe size={16} className="inline text-mist mr-1.5 mb-0.5" />
        <span className="text-xs text-mist">{COUNTRIES.length} zemalja • fotografije iz Wikipedia</span>
      </div>
    </div>
  )
}
