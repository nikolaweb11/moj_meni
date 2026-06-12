import { useState } from 'react'
import { Save, Trash2, AlertTriangle, Check } from 'lucide-react'
import useStore from '../store/useStore'

const inputCls =
  'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white placeholder-slate-400'

export default function Settings() {
  const couple = useStore((s) => s.couple)
  const setCouple = useStore((s) => s.setCouple)
  const resetAll = useStore((s) => s.resetAll)

  const [name1, setName1] = useState(couple.name1)
  const [name2, setName2] = useState(couple.name2)
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setCouple(name1.trim() || 'Ti', name2.trim() || 'Ona')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    resetAll()
    setShowReset(false)
    setName1('Ti')
    setName2('Ona')
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Podešavanja ⚙️</h1>
        <p className="text-slate-500 text-sm mt-1">Personalizujte vašu platformu</p>
      </div>

      {/* Couple names */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-700 mb-4">Vaša imena 💑</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">
              Tvoje ime
            </label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="npr. Nikola"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">
              Njeno ime
            </label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="npr. Ana"
              className={inputCls}
            />
          </div>

          {/* Preview */}
          {(name1 || name2) && (
            <div className="rounded-xl bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-100 p-3 text-center text-sm text-slate-600">
              Pregled:{' '}
              <span className="font-bold text-slate-800">
                {name1 || 'Ti'} &amp; {name2 || 'Ona'}
              </span>{' '}
              💑
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            {saved ? (
              <>
                <Check size={15} /> Sačuvano!
              </>
            ) : (
              <>
                <Save size={15} /> Sačuvaj imena
              </>
            )}
          </button>
        </form>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-700 mb-3">O aplikaciji</h2>
        <div className="space-y-2 text-sm text-slate-500">
          <p>✈️ Naš Odmor — platforma za planiranje putovanja u paru</p>
          <p>💾 Svi podaci se čuvaju lokalno u vašem pretraživaču</p>
          <p>🔒 Nema naloga, nema servera — samo vi dvoje</p>
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-2xl text-rose-500">
              {useStore.getState().trips.length}
            </div>
            <div className="text-slate-400">putovanja</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-purple-500">
              {useStore.getState().bucketList.length}
            </div>
            <div className="text-slate-400">lista želja</div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
        <h2 className="font-semibold text-red-600 mb-1">Opasna zona</h2>
        <p className="text-sm text-slate-500 mb-4">Ove akcije su nepovratne</p>

        {showReset ? (
          <div className="bg-red-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle size={16} />
              <span className="font-semibold text-sm">Da li si siguran/na?</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Sva putovanja, troškovi, liste za pakovanje i lista želja biće trajno izbrisani.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white text-sm py-2.5 rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                Da, obriši sve
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 border border-slate-200 text-slate-600 text-sm py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Otkaži
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowReset(true)}
            className="flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} /> Obriši sve podatke
          </button>
        )}
      </div>
    </div>
  )
}
