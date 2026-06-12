import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import useStore from '../store/useStore'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist w-full'

const CATEGORIES = [
  { id: 'documents', label: 'Dokumenti', emoji: '📄', color: 'bg-blue-50 text-blue-700' },
  { id: 'booking', label: 'Rezervacije', emoji: '🎫', color: 'bg-purple-50 text-purple-700' },
  { id: 'bank', label: 'Finansije', emoji: '💰', color: 'bg-green-50 text-green-700' },
  { id: 'tech', label: 'Tehnologija', emoji: '📱', color: 'bg-linen text-ink-light' },
  { id: 'health', label: 'Zdravlje', emoji: '💊', color: 'bg-red-50 text-red-700' },
  { id: 'home', label: 'Kuća', emoji: '🏠', color: 'bg-amber-50 text-amber-700' },
  { id: 'packing', label: 'Pakovanje', emoji: '🎒', color: 'bg-terra/10 text-terra' },
  { id: 'other', label: 'Ostalo', emoji: '✅', color: 'bg-parchment text-ink-light' },
]

export default function PreTripSection({ trip }) {
  const togglePreTrip = useStore((s) => s.togglePreTrip)
  const addPreTripTask = useStore((s) => s.addPreTripTask)
  const deletePreTripTask = useStore((s) => s.deletePreTripTask)
  const updatePreTripTask = useStore((s) => s.updatePreTripTask)

  const tasks = trip.preTrip || []
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ task: '', category: 'other', deadline: '', notes: '' })
  const [filterCat, setFilterCat] = useState('all')
  const [showDone, setShowDone] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editNotes, setEditNotes] = useState('')

  const done = tasks.filter((t) => t.done).length
  const pct = tasks.length ? (done / tasks.length) * 100 : 0

  const filtered = tasks.filter((t) => {
    if (!showDone && t.done) return false
    if (filterCat !== 'all' && t.category !== filterCat) return false
    return true
  })

  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter((t) => t.category === cat.id)
    if (items.length) acc[cat.id] = { ...cat, items }
    return acc
  }, {})

  const handleAdd = () => {
    if (!form.task.trim()) return
    addPreTripTask(trip.id, { ...form, task: form.task.trim() })
    setForm({ task: '', category: 'other', deadline: '', notes: '' })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-ink">✅ Pre-trip checklista</h2>
          <p className="text-xs text-mist mt-0.5">{done}/{tasks.length} završeno</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-sm bg-terra text-white px-3 py-1.5 rounded-full hover:bg-terra-light transition-colors">
          <Plus size={14} /> Dodaj zadatak
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
        <div className="flex justify-between text-sm text-ink-light mb-2">
          <span>Napredak</span>
          <span className="font-semibold">{pct.toFixed(0)}% završeno</span>
        </div>
        <div className="h-3 bg-linen rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-400' : 'bg-gradient-to-r from-terra to-purple-500'}`} style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && <p className="text-xs text-green-600 mt-2 font-medium">🎉 Sve je pripremljeno! Uživajte u putovanju!</p>}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen space-y-2">
          <input type="text" value={form.task} onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))} placeholder="Opis zadatka *" className={inp} autoFocus onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
          <div className="grid grid-cols-2 gap-2">
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
            <div>
              <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className={inp} title="Rok (opciono)" />
            </div>
          </div>
          <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={1} placeholder="Napomene (opciono)" className={`${inp} resize-none`} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-terra text-white text-sm py-2 rounded-xl hover:bg-terra-light font-medium">Dodaj</button>
            <button onClick={() => setShowForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2 rounded-xl hover:bg-parchment">Otkaži</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === 'all' ? 'bg-terra text-white' : 'bg-white border border-linen text-ink-light'}`}>
            Sve
          </button>
          {CATEGORIES.filter((c) => tasks.some((t) => t.category === c.id)).map((c) => (
            <button key={c.id} onClick={() => setFilterCat(c.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === c.id ? 'bg-terra text-white' : 'bg-white border border-linen text-ink-light'}`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowDone(!showDone)} className={`ml-auto px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${showDone ? 'bg-green-100 text-green-700' : 'bg-linen text-mist'}`}>
          {showDone ? '✓ Prikaži završene' : '○ Sakrij završene'}
        </button>
      </div>

      {/* Tasks by category */}
      {Object.values(byCategory).map(({ id, label, emoji, color, items }) => (
        <div key={id} className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{emoji}</span>
            <h3 className="font-semibold text-ink-light text-sm">{label}</h3>
            <span className="text-xs text-mist ml-auto">{items.filter((i) => i.done).length}/{items.length}</span>
          </div>
          <div className="space-y-2">
            {items.map((task) => (
              <div key={task.id} className={`flex items-start gap-3 p-2.5 rounded-xl ${task.done ? 'bg-green-50' : 'bg-parchment'}`}>
                <button
                  onClick={() => togglePreTrip(trip.id, task.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-linen hover:border-terra'}`}
                >
                  {task.done && <Check size={11} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${task.done ? 'line-through text-mist' : 'text-ink-light'}`}>
                    {task.task}
                  </div>
                  {task.deadline && (
                    <div className="text-xs text-amber-600 mt-0.5">📅 Rok: {task.deadline}</div>
                  )}
                  {editId === task.id ? (
                    <div className="mt-1 flex gap-1">
                      <input type="text" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Napomene..." className={`${inp} text-xs py-1 flex-1`} autoFocus />
                      <button onClick={() => { updatePreTripTask(trip.id, task.id, { notes: editNotes }); setEditId(null) }} className="text-xs bg-terra text-white px-2 py-1 rounded-lg">OK</button>
                    </div>
                  ) : (
                    task.notes ? (
                      <div className="text-xs text-mist mt-0.5 cursor-pointer" onClick={() => { setEditId(task.id); setEditNotes(task.notes) }}>{task.notes}</div>
                    ) : (
                      <button onClick={() => { setEditId(task.id); setEditNotes('') }} className="text-xs text-mist hover:text-ink-light mt-0.5">+ napomena</button>
                    )
                  )}
                </div>
                <button onClick={() => deletePreTripTask(trip.id, task.id)} className="text-mist hover:text-red-400 flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-8 text-mist text-sm">
          <div className="text-3xl mb-2">✅</div>
          Nema zadataka
        </div>
      )}
    </div>
  )
}
