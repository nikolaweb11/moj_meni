import { useState } from 'react'
import { Save, Plus, Trash2, Check } from 'lucide-react'
import useStore from '../store/useStore'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist w-full'

export default function LocalInfoSection({ trip }) {
  const updateLocalInfo = useStore((s) => s.updateLocalInfo)
  const addPhrase = useStore((s) => s.addPhrase)
  const deletePhrase = useStore((s) => s.deletePhrase)

  const info = trip.localInfo || {}
  const phrases = info.usefulPhrases || []

  const [form, setForm] = useState({
    currency: info.currency || '',
    exchangeRate: info.exchangeRate || '',
    homeCurrency: info.homeCurrency || 'EUR',
    timezone: info.timezone || '',
    voltage: info.voltage || '',
    language: info.language || '',
    culturalTips: info.culturalTips || '',
    simCard: info.simCard || '',
    emergencyNumbers: {
      police: info.emergencyNumbers?.police || '',
      ambulance: info.emergencyNumbers?.ambulance || '',
      fire: info.emergencyNumbers?.fire || '',
      embassy: info.emergencyNumbers?.embassy || '',
      general: info.emergencyNumbers?.general || '',
    },
    hospital: {
      name: info.hospital?.name || '',
      address: info.hospital?.address || '',
      phone: info.hospital?.phone || '',
    },
  })
  const [saved, setSaved] = useState(false)
  const [phraseForm, setPhraseForm] = useState({ phrase: '', translation: '', pronunciation: '' })
  const [showPhraseForm, setShowPhraseForm] = useState(false)

  const save = () => {
    updateLocalInfo(trip.id, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddPhrase = () => {
    if (!phraseForm.phrase.trim()) return
    addPhrase(trip.id, phraseForm)
    setPhraseForm({ phrase: '', translation: '', pronunciation: '' })
    setShowPhraseForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-ink">🗺️ Lokalne informacije</h2>
        <button onClick={save} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${saved ? 'bg-green-100 text-green-700' : 'bg-terra text-white hover:bg-terra-light'}`}>
          {saved ? <><Check size={13} /> Sačuvano</> : <><Save size={13} /> Sačuvaj</>}
        </button>
      </div>

      {/* Currency & basics */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen space-y-3">
        <p className="text-xs font-semibold text-mist uppercase tracking-wider">💱 Valuta & osnovne info</p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-mist mb-1 block">Lokalna valuta</label>
            <input type="text" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} placeholder="npr. EUR, HUF" className={inp} />
          </div>
          <div>
            <label className="text-xs text-mist mb-1 block">Kurs (1 {form.homeCurrency} =)</label>
            <input type="text" value={form.exchangeRate} onChange={(e) => setForm((f) => ({ ...f, exchangeRate: e.target.value }))} placeholder="npr. 117" className={inp} />
          </div>
          <div>
            <label className="text-xs text-mist mb-1 block">Moja valuta</label>
            <select value={form.homeCurrency} onChange={(e) => setForm((f) => ({ ...f, homeCurrency: e.target.value }))} className={inp}>
              {['EUR','USD','RSD','GBP','CHF'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-mist mb-1 block">Vremenska zona</label>
            <input type="text" value={form.timezone} onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))} placeholder="npr. UTC+1, CET" className={inp} />
          </div>
          <div>
            <label className="text-xs text-mist mb-1 block">Napon struje</label>
            <input type="text" value={form.voltage} onChange={(e) => setForm((f) => ({ ...f, voltage: e.target.value }))} placeholder="npr. 220V, Type C" className={inp} />
          </div>
          <div>
            <label className="text-xs text-mist mb-1 block">Jezik</label>
            <input type="text" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} placeholder="npr. Italijanski" className={inp} />
          </div>
        </div>
      </div>

      {/* Emergency numbers */}
      <div className="bg-red-50 rounded-2xl p-4 border border-red-100 space-y-3">
        <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">🚨 Hitni brojevi</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['police', '👮 Policija'],
            ['ambulance', '🚑 Hitna pomoć'],
            ['fire', '🚒 Vatrogasci'],
            ['general', '📞 Opšti hitni'],
            ['embassy', '🏛️ Ambasada Srbije'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-mist mb-1 block">{label}</label>
              <input type="tel" value={form.emergencyNumbers[key]} onChange={(e) => setForm((f) => ({ ...f, emergencyNumbers: { ...f.emergencyNumbers, [key]: e.target.value } }))} placeholder="Broj telefona" className={inp} />
            </div>
          ))}
        </div>
      </div>

      {/* Hospital */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 space-y-2">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">🏥 Najbliža bolnica / apoteka</p>
        <input type="text" value={form.hospital.name} onChange={(e) => setForm((f) => ({ ...f, hospital: { ...f.hospital, name: e.target.value } }))} placeholder="Naziv" className={inp} />
        <input type="text" value={form.hospital.address} onChange={(e) => setForm((f) => ({ ...f, hospital: { ...f.hospital, address: e.target.value } }))} placeholder="Adresa" className={inp} />
        <input type="tel" value={form.hospital.phone} onChange={(e) => setForm((f) => ({ ...f, hospital: { ...f.hospital, phone: e.target.value } }))} placeholder="Telefon" className={inp} />
      </div>

      {/* SIM */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
        <label className="text-xs text-mist mb-2 block font-semibold">📱 SIM kartica / Roaming</label>
        <textarea value={form.simCard} onChange={(e) => setForm((f) => ({ ...f, simCard: e.target.value }))} rows={2} placeholder="npr. Lokalni SIM — Vodafone IT, 10€/7 dana, neограничен internet. APN: mobile.vodafone.it" className={`${inp} resize-none`} />
      </div>

      {/* Cultural tips */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
        <label className="text-xs text-mist mb-2 block font-semibold">🎭 Kulturni bonton & saveti</label>
        <textarea value={form.culturalTips} onChange={(e) => setForm((f) => ({ ...f, culturalTips: e.target.value }))} rows={4} placeholder="npr. Napojnica 10-15% je uobičajena&#10;U restoranima se ne žuri&#10;Na plažama bikini top je opciono&#10;Šorts nije prihvatljiv u crkvama..." className={`${inp} resize-none`} />
      </div>

      {/* Useful phrases */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-ink-light uppercase tracking-wider">💬 Korisne fraze</p>
          <button onClick={() => setShowPhraseForm(true)} className="flex items-center gap-1 text-xs text-terra hover:text-terra-light">
            <Plus size={13} /> Dodaj frazu
          </button>
        </div>

        {showPhraseForm && (
          <div className="bg-terra/10 rounded-xl p-3 mb-3 space-y-2">
            <input type="text" value={phraseForm.phrase} onChange={(e) => setPhraseForm((f) => ({ ...f, phrase: e.target.value }))} placeholder="Fraza na lokalnom jeziku *" className={inp} autoFocus />
            <input type="text" value={phraseForm.translation} onChange={(e) => setPhraseForm((f) => ({ ...f, translation: e.target.value }))} placeholder="Prevod na srpski" className={inp} />
            <input type="text" value={phraseForm.pronunciation} onChange={(e) => setPhraseForm((f) => ({ ...f, pronunciation: e.target.value }))} placeholder="Izgovor (fonetski)" className={inp} />
            <div className="flex gap-2">
              <button onClick={handleAddPhrase} className="flex-1 bg-terra text-white text-xs py-2 rounded-lg font-medium">Dodaj</button>
              <button onClick={() => setShowPhraseForm(false)} className="px-3 border border-linen text-mist text-xs py-2 rounded-lg">Otkaži</button>
            </div>
          </div>
        )}

        {phrases.length === 0 ? (
          <p className="text-mist text-sm text-center py-4">Nema sačuvanih fraza</p>
        ) : (
          <div className="space-y-2">
            {phrases.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-parchment rounded-xl p-3">
                <div className="flex-1">
                  <div className="font-medium text-ink text-sm">{p.phrase}</div>
                  {p.translation && <div className="text-xs text-mist">{p.translation}</div>}
                  {p.pronunciation && <div className="text-xs text-purple-500 italic">[{p.pronunciation}]</div>}
                </div>
                <button onClick={() => deletePhrase(trip.id, p.id)} className="text-mist hover:text-red-400"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
