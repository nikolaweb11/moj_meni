import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import useStore from '../store/useStore'

const PRIORITIES = [
  { id: 'high', label: 'Visok', emoji: '❤️', bg: 'bg-rose-100', text: 'text-rose-700' },
  { id: 'medium', label: 'Srednji', emoji: '💛', bg: 'bg-amber-100', text: 'text-amber-700' },
  { id: 'low', label: 'Nizak', emoji: '💚', bg: 'bg-green-100', text: 'text-green-700' },
]

const inputCls =
  'border border-linen rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white placeholder-mist'

export default function BucketList() {
  const { bucketList } = useStore()
  const addBucketItem = useStore((s) => s.addBucketItem)
  const toggleBucketItem = useStore((s) => s.toggleBucketItem)
  const deleteBucketItem = useStore((s) => s.deleteBucketItem)

  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ destination: '', country: '', notes: '', priority: 'medium' })

  const filtered = bucketList.filter((i) => {
    if (filter === 'pending') return !i.done
    if (filter === 'done') return i.done
    return true
  })

  const done = bucketList.filter((i) => i.done).length

  const handleAdd = () => {
    if (!form.destination.trim() || !form.country.trim()) return
    addBucketItem({ ...form, destination: form.destination.trim(), country: form.country.trim() })
    setForm({ destination: '', country: '', notes: '', priority: 'medium' })
    setShowForm(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Lista želja ⭐</h1>
          <p className="text-mist text-sm">
            {done}/{bucketList.length} destinacija posećeno
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus size={15} /> Dodaj
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen mb-6">
          <h3 className="font-semibold text-ink-light mb-4">Nova destinacija</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                placeholder="Destinacija *"
                className={inputCls}
                autoFocus
              />
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="Zemlja *"
                className={inputCls}
              />
            </div>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Napomene (opciono)"
              className={`${inputCls} w-full`}
            />
            <div>
              <p className="text-xs text-mist mb-2">Prioritet</p>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: p.id }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      form.priority === p.id
                        ? `${p.bg} ${p.text} ring-2 ring-offset-1 ring-current`
                        : 'bg-linen text-mist hover:bg-linen'
                    }`}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAdd}
                className="flex-1 bg-purple-600 text-white text-sm py-2.5 rounded-xl hover:bg-purple-700 transition-colors font-medium"
              >
                Dodaj destinaciju
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 border border-linen text-ink-light text-sm py-2.5 rounded-xl hover:bg-parchment transition-colors"
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[
          ['all', 'Sve'],
          ['pending', 'Neposećeno'],
          ['done', 'Posećeno'],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === val
                ? 'bg-purple-600 text-white'
                : 'bg-white text-ink-light border border-linen hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-linen">
          <div className="text-5xl mb-3">🌍</div>
          <p className="font-semibold text-ink-light mb-1">
            {filter === 'done'
              ? 'Niste još posetili nijednu destinaciju'
              : filter === 'pending'
              ? 'Nema neposećenih destinacija'
              : 'Lista želja je prazna'}
          </p>
          <p className="text-sm text-mist">
            {filter === 'all' && 'Dodajte mesta koja želite da posetite zajedno'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const priority = PRIORITIES.find((p) => p.id === item.priority) || PRIORITIES[1]
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                  item.done
                    ? 'border-green-200 opacity-75'
                    : 'border-linen hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-bold text-ink text-base ${
                        item.done ? 'line-through text-mist' : ''
                      }`}
                    >
                      {item.destination}
                    </h3>
                    <p className="text-sm text-mist">{item.country}</p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${priority.bg} ${priority.text}`}
                  >
                    {priority.emoji}
                  </span>
                </div>

                {item.notes && (
                  <p className="text-xs text-mist mt-2 mb-3 leading-relaxed">{item.notes}</p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-linen mt-3">
                  <button
                    onClick={() => toggleBucketItem(item.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      item.done
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-linen text-ink-light hover:bg-purple-100 hover:text-purple-700'
                    }`}
                  >
                    {item.done ? (
                      <>
                        <Check size={12} /> Posećeno
                      </>
                    ) : (
                      'Označi kao posećeno'
                    )}
                  </button>
                  <button
                    onClick={() => deleteBucketItem(item.id)}
                    className="ml-auto text-mist hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
