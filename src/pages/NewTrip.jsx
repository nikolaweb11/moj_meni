import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useStore from '../store/useStore'

const COLORS = [
  { id: 'sunset', label: 'Zalazak', cls: 'from-orange-400 to-rose-500' },
  { id: 'ocean', label: 'Okean', cls: 'from-blue-400 to-cyan-500' },
  { id: 'forest', label: 'Šuma', cls: 'from-green-400 to-emerald-500' },
  { id: 'lavender', label: 'Lavanda', cls: 'from-purple-400 to-pink-500' },
  { id: 'night', label: 'Noć', cls: 'from-indigo-600 to-purple-700' },
  { id: 'sand', label: 'Pesak', cls: 'from-yellow-400 to-amber-500' },
]

const inputCls =
  'w-full border border-linen rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist'

export default function NewTrip() {
  const addTrip = useStore((s) => s.addTrip)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budgetTotal: '',
    currency: 'EUR',
    color: 'sunset',
    description: '',
  })

  const [error, setError] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.destination.trim() || !form.startDate || !form.endDate) {
      setError('Molimo popunite sva obavezna polja.')
      return
    }
    if (form.endDate < form.startDate) {
      setError('Datum povratka mora biti posle datuma polaska.')
      return
    }
    addTrip({
      title: form.title.trim(),
      destination: form.destination.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      budget: { total: Number(form.budgetTotal) || 0, currency: form.currency },
      color: form.color,
      description: form.description.trim(),
    })
    navigate('/')
  }

  const selectedColor = COLORS.find((c) => c.id === form.color)

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-mist hover:text-ink text-sm mb-5 transition-colors"
      >
        <ArrowLeft size={16} /> Nazad
      </button>

      {/* Preview banner */}
      <div
        className={`rounded-2xl bg-gradient-to-r ${selectedColor.cls} h-28 flex items-end p-5 mb-6 shadow-sm`}
      >
        <span className="text-white font-bold text-xl opacity-80">
          {form.title || 'Naziv putovanja'}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-ink mb-1">Novi odmor</h1>
      <p className="text-mist text-sm mb-6">Planirajte vašu sledeću avanturu</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-linen space-y-5">
        {/* Color picker */}
        <div>
          <label className="block text-sm font-medium text-ink-light mb-2">Tema boje</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                title={c.label}
                onClick={() => set('color', c.id)}
                className={`w-10 h-10 rounded-xl bg-gradient-to-r ${c.cls} transition-all ${
                  form.color === c.id
                    ? 'ring-2 ring-offset-2 ring-terra scale-110'
                    : 'hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-ink-light mb-1">
            Naziv putovanja <span className="text-terra">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="npr. Romantični Rim"
            className={inputCls}
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-ink-light mb-1">
            Destinacija <span className="text-terra">*</span>
          </label>
          <input
            type="text"
            value={form.destination}
            onChange={(e) => set('destination', e.target.value)}
            placeholder="npr. Rim, Italija"
            className={inputCls}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">
              Datum polaska <span className="text-terra">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">
              Datum povratka <span className="text-terra">*</span>
            </label>
            <input
              type="date"
              value={form.endDate}
              min={form.startDate}
              onChange={(e) => set('endDate', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-ink-light mb-1">Budžet</label>
            <input
              type="number"
              value={form.budgetTotal}
              onChange={(e) => set('budgetTotal', e.target.value)}
              placeholder="0"
              min="0"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">Valuta</label>
            <select
              value={form.currency}
              onChange={(e) => set('currency', e.target.value)}
              className={inputCls}
            >
              <option>EUR</option>
              <option>USD</option>
              <option>RSD</option>
              <option>GBP</option>
              <option>CHF</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-ink-light mb-1">Opis (opciono)</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Šta planirate za ovaj odmor?"
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-terra to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          Sačuvaj putovanje ✈️
        </button>
      </form>
    </div>
  )
}
