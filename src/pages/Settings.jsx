import { useState } from 'react'
import { Save, Check, Image } from 'lucide-react'
import useStore from '../store/useStore'

const inputCls =
  'w-full border border-linen rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist'

export default function Settings() {
  const couple = useStore((s) => s.couple)
  const setCouple = useStore((s) => s.setCouple)
  const bgEnabled = useStore((s) => s.bgEnabled)
  const setBgEnabled = useStore((s) => s.setBgEnabled)

  const [name1, setName1] = useState(couple.name1)
  const [name2, setName2] = useState(couple.name2)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setCouple(name1.trim() || 'Ti', name2.trim() || 'Ona')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Podešavanja ⚙️</h1>
        <p className="text-mist text-sm mt-1">Personalizujte vašu platformu</p>
      </div>

      {/* Couple names */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <h2 className="font-semibold text-ink-light mb-4">Vaša imena 💑</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-mist mb-1 uppercase tracking-wider">Tvoje ime</label>
            <input type="text" value={name1} onChange={(e) => setName1(e.target.value)} placeholder="npr. Nikola" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-mist mb-1 uppercase tracking-wider">Njeno ime</label>
            <input type="text" value={name2} onChange={(e) => setName2(e.target.value)} placeholder="npr. Ana" className={inputCls} />
          </div>
          {(name1 || name2) && (
            <div className="rounded-xl bg-gradient-to-r from-terra/10 to-purple-50 border border-terra/20 p-3 text-center text-sm text-ink-light">
              Pregled: <span className="font-bold text-ink">{name1 || 'Ti'} &amp; {name2 || 'Ona'}</span> 💑
            </div>
          )}
          <button type="submit" className="flex items-center gap-2 bg-terra text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-terra-light transition-colors">
            {saved ? <><Check size={15} /> Sačuvano!</> : <><Save size={15} /> Sačuvaj imena</>}
          </button>
        </form>
      </div>

      {/* Background photos */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-ink-light flex items-center gap-2"><Image size={16} className="text-forest" /> Pozadinska fotografija</h2>
            <p className="text-xs text-mist mt-0.5">63 vaše slike • rotira svakih 60s • random redosled</p>
          </div>
          <button
            onClick={() => setBgEnabled(!bgEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${bgEnabled ? 'bg-forest' : 'bg-linen'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${bgEnabled ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <h2 className="font-semibold text-ink-light mb-3">O aplikaciji</h2>
        <div className="space-y-2 text-sm text-mist">
          <p>✈️ Naš Odmor — platforma za planiranje putovanja u paru</p>
          <p>☁️ Podaci se čuvaju u oblaku i sinhronizuju između uređaja</p>
          <p>🔒 Privatno — samo vi dvoje</p>
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-2xl text-terra">{useStore.getState().trips.length}</div>
            <div className="text-mist">putovanja</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-purple-500">{useStore.getState().bucketList.length}</div>
            <div className="text-mist">lista želja</div>
          </div>
        </div>
      </div>

    </div>
  )
}
