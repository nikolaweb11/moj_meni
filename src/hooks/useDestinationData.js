import { useState, useEffect } from 'react'

const TRANSLATIONS = {
  'island': 'Iceland', 'islanda': 'Iceland', 'reykjavik': 'Reykjavik', 'rejkjavik': 'Reykjavik',
  'pariz': 'Paris', 'bec': 'Vienna', 'beč': 'Vienna', 'wien': 'Vienna',
  'rim': 'Rome', 'roma': 'Rome', 'venecija': 'Venice', 'firenca': 'Florence', 'milano': 'Milan',
  'london': 'London', 'barselona': 'Barcelona', 'madrid': 'Madrid', 'lisabon': 'Lisbon',
  'atina': 'Athens', 'santorini': 'Santorini', 'mikonos': 'Mykonos', 'krf': 'Corfu', 'kreta': 'Crete',
  'dubai': 'Dubai', 'istanbul': 'Istanbul', 'ankara': 'Ankara',
  'tokio': 'Tokyo', 'osaka': 'Osaka', 'kjoto': 'Kyoto',
  'bali': 'Bali', 'tajland': 'Thailand', 'singapur': 'Singapore',
  'njujork': 'New York City', 'new york': 'New York City',
  'los anđeles': 'Los Angeles', 'san francisko': 'San Francisco',
  'amsterdam': 'Amsterdam', 'brisel': 'Brussels', 'budimpesta': 'Budapest',
  'prag': 'Prague', 'varšava': 'Warsaw', 'krakow': 'Kraków',
  'berlin': 'Berlin', 'minhen': 'Munich', 'hamburg': 'Hamburg',
  'kopenhagen': 'Copenhagen', 'stokholm': 'Stockholm', 'oslo': 'Oslo',
  'helsinki': 'Helsinki', 'marakeš': 'Marrakesh', 'maroko': 'Morocco',
  'kair': 'Cairo', 'egipat': 'Egypt', 'dubrovnik': 'Dubrovnik',
  'split': 'Split', 'hvar': 'Hvar', 'beograd': 'Belgrade',
  'sarajevo': 'Sarajevo', 'kotor': 'Kotor', 'budva': 'Budva',
  'skoplje': 'Skopje', 'sofija': 'Sofia', 'bukurešt': 'Bucharest',
  'toronto': 'Toronto', 'montreal': 'Montreal', 'vancouver': 'Vancouver',
  'sidnej': 'Sydney', 'melburn': 'Melbourne', 'nice': 'Nice',
  'monako': 'Monaco', 'malta': 'Malta', 'kipar': 'Cyprus',
  'hong kong': 'Hong Kong', 'seoul': 'Seoul', 'peking': 'Beijing',
  'šangaj': 'Shanghai', 'mumbai': 'Mumbai', 'delhi': 'New Delhi',
  'havana': 'Havana', 'kuba': 'Cuba', 'meksiko': 'Mexico City',
  'zürich': 'Zürich', 'ženeva': 'Geneva', 'mostar': 'Mostar',
  'tivat': 'Tivat', 'podgorica': 'Podgorica', 'novi sad': 'Novi Sad',
  'malaga': 'Málaga', 'seville': 'Seville', 'valencia': 'Valencia',
}

export function normalizeDestination(dest) {
  if (!dest) return null
  const lower = dest.toLowerCase().trim()
  if (TRANSLATIONS[lower]) return TRANSLATIONS[lower]
  for (const [sr, en] of Object.entries(TRANSLATIONS)) {
    if (lower.includes(sr)) return en
  }
  return dest.split(',')[0].trim()
}

export function getDestinationTheme(destination) {
  const lower = (destination || '').toLowerCase()
  if (/island|iceland|reykjavik|rejkjavik/.test(lower))
    return { from: '#1A3A4A', to: '#0F2218', accent: '#4DB8C8', flag: '🇮🇸' }
  if (/pariz|paris|franc|bec|wien|vienna/.test(lower))
    return { from: '#4A2818', to: '#2A1008', accent: '#E8C84A', flag: '🇫🇷' }
  if (/\brim\b|rome|roma|italija|italy|venecija|venice|firenca|florence|milano/.test(lower))
    return { from: '#5A1A0A', to: '#3A0A00', accent: '#F4A030', flag: '🇮🇹' }
  if (/japan|tokio|tokyo|osaka|kjoto|kyoto/.test(lower))
    return { from: '#4A0A1A', to: '#2A0010', accent: '#F4A0C0', flag: '🇯🇵' }
  if (/grcka|greece|atina|athens|santorini|mikonos|krf|kreta|crete/.test(lower))
    return { from: '#0A2A5A', to: '#001040', accent: '#60B8FF', flag: '🇬🇷' }
  if (/dubai|abu dhabi|uae/.test(lower))
    return { from: '#5A3A00', to: '#3A2000', accent: '#F4D030', flag: '🇦🇪' }
  if (/spanija|spain|barselona|barcelona|madrid|seville|valenc/.test(lower))
    return { from: '#5A0A0A', to: '#3A0000', accent: '#F4D030', flag: '🇪🇸' }
  if (/turska|turkey|istanbul|antalya/.test(lower))
    return { from: '#4A0A10', to: '#2A0008', accent: '#FF7070', flag: '🇹🇷' }
  if (/tajland|thailand|bali|singapur|singapore/.test(lower))
    return { from: '#0A3A2A', to: '#001A10', accent: '#40D4A0', flag: '🌴' }
  if (/london|england|britanija|uk|scotland/.test(lower))
    return { from: '#1A1A4A', to: '#0A0A2A', accent: '#8888FF', flag: '🇬🇧' }
  if (/new york|nyc|njujork|usa|america/.test(lower))
    return { from: '#0A1A3A', to: '#000A20', accent: '#4488FF', flag: '🇺🇸' }
  if (/maroko|morocco|marakesh|marakeš/.test(lower))
    return { from: '#4A1A0A', to: '#2A0800', accent: '#F4A030', flag: '🇲🇦' }
  if (/egipat|egypt|kair|cairo/.test(lower))
    return { from: '#4A3A00', to: '#2A2000', accent: '#F4C830', flag: '🇪🇬' }
  if (/dubrovnik|split|hvar|hrvatska|croatia/.test(lower))
    return { from: '#0A2A4A', to: '#001830', accent: '#50B8E8', flag: '🇭🇷' }
  if (/crna gora|montenegro|kotor|budva|tivat/.test(lower))
    return { from: '#1A2A3A', to: '#0A1820', accent: '#60A8C8', flag: '🇲🇪' }
  if (/srbija|serbia|beograd|belgrade/.test(lower))
    return { from: '#3A0A0A', to: '#200000', accent: '#E84444', flag: '🇷🇸' }
  return { from: '#2A2018', to: '#181208', accent: '#C4932A', flag: '✈️' }
}

export function useDestinationData(destination) {
  const [data, setData] = useState({ summary: null, imageUrl: null, loading: true, title: null })

  useEffect(() => {
    if (!destination) {
      setData({ summary: null, imageUrl: null, loading: false, title: null })
      return
    }
    const query = normalizeDestination(destination)
    let cancelled = false

    async function fetchData() {
      try {
        const searchResp = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=1`
        )
        const searchData = await searchResp.json()
        const pageTitle = searchData?.query?.search?.[0]?.title
        if (!pageTitle || cancelled) {
          if (!cancelled) setData({ summary: null, imageUrl: null, loading: false, title: null })
          return
        }
        const [summaryResp, imageResp] = await Promise.all([
          fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`),
          fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=900&origin=*`)
        ])
        if (cancelled) return
        const summaryData = await summaryResp.json()
        const imageData = await imageResp.json()
        const pages = imageData?.query?.pages || {}
        const page = Object.values(pages)[0]
        const imageUrl = page?.thumbnail?.source || summaryData?.originalimage?.source || null
        const extract = summaryData?.extract || null
        const sentences = extract ? extract.split(/(?<=\.)\s+/) : []
        const shortExtract = sentences.slice(0, 2).join(' ') || extract

        if (!cancelled) {
          setData({ summary: shortExtract, imageUrl, loading: false, title: summaryData?.title || pageTitle })
        }
      } catch {
        if (!cancelled) setData({ summary: null, imageUrl: null, loading: false, title: null })
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [destination])

  return data
}
