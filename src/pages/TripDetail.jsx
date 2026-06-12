import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { differenceInDays, addDays, format, parseISO } from 'date-fns'
import {
  ArrowLeft, MapPin, Calendar, Trash2, Plus, Check,
  ChevronDown, ChevronUp, Save,
} from 'lucide-react'
import useStore from '../store/useStore'

const GRADIENT_MAP = {
  sunset: 'from-orange-400 to-rose-500',
  ocean: 'from-blue-400 to-cyan-500',
  forest: 'from-green-400 to-emerald-500',
  lavender: 'from-purple-400 to-pink-500',
  night: 'from-indigo-600 to-purple-700',
  sand: 'from-yellow-400 to-amber-500',
}

const EXPENSE_CATS = ['Smeštaj', 'Prevoz', 'Hrana', 'Aktivnosti', 'Kupovina', 'Ostalo']
const PACKING_CATS = ['Dokumenti', 'Odeća', 'Toaletna', 'Elektronika', 'Lekovi', 'Ostalo']

const DAYS_SR = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']
const MONTHS_SR = [
  'januara', 'februara', 'marta', 'aprila', 'maja', 'juna',
  'jula', 'avgusta', 'septembra', 'oktobra', 'novembra', 'decembra',
]

function formatDay(date) {
  return `${DAYS_SR[date.getDay()]}, ${date.getDate()}. ${MONTHS_SR[date.getMonth()]}`
}

const inputCls =
  'border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white placeholder-slate-400'

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trip = useStore((s) => s.trips.find((t) => t.id === id))
  const deleteTrip = useStore((s) => s.deleteTrip)
  const [activeTab, setActiveTab] = useState('itinerary')

  if (!trip) return <Navigate to="/" replace />

  const gradient = GRADIENT_MAP[trip.color] || GRADIENT_MAP.sunset
  const numDays = differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1

  const handleDelete = () => {
    if (window.confirm(`Obriši putovanje "${trip.title}"?`)) {
      deleteTrip(id)
      navigate('/')
    }
  }

  const tabs = [
    { id: 'itinerary', label: '📅 Itinerar' },
    { id: 'budget', label: '💰 Budžet' },
    { id: 'packing', label: '🎒 Pakovanje' },
    { id: 'notes', label: '📝 Beleške' },
  ]

  return (
    <div>
      {/* Header */}
      <div className={`rounded-3xl bg-gradient-to-r ${gradient} p-7 md:p-10 mb-6 text-white relative overflow-hidden shadow-lg`}>
        <div className="absolute inset-0 opacity-10 text-8xl flex items-center justify-end pr-10 select-none">
          ✈️
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Nazad
        </button>
        <h1 className="text-3xl font-extrabold mb-2 relative">{trip.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm relative">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {trip.destination}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {format(parseISO(trip.startDate), 'dd.MM.yyyy')} —{' '}
            {format(parseISO(trip.endDate), 'dd.MM.yyyy')}
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {numDays} {numDays === 1 ? 'dan' : 'dana'}
          </span>
        </div>
        {trip.description && (
          <p className="mt-3 text-white/70 text-sm relative">{trip.description}</p>
        )}
        <button
          onClick={handleDelete}
          title="Obriši putovanje"
          className="absolute top-5 right-5 text-white/50 hover:text-white/90 transition-colors p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-2 md:px-4 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'itinerary' && <ItineraryTab trip={trip} numDays={numDays} />}
      {activeTab === 'budget' && <BudgetTab trip={trip} />}
      {activeTab === 'packing' && <PackingTab trip={trip} />}
      {activeTab === 'notes' && <NotesTab trip={trip} />}
    </div>
  )
}

/* ─── Itinerary ─── */
function ItineraryTab({ trip, numDays }) {
  const addActivity = useStore((s) => s.addActivity)
  const toggleActivity = useStore((s) => s.toggleActivity)
  const deleteActivity = useStore((s) => s.deleteActivity)

  const [expandedDay, setExpandedDay] = useState(1)
  const [addingDay, setAddingDay] = useState(null)
  const [actForm, setActForm] = useState({ time: '', title: '', notes: '' })

  const handleAdd = (day) => {
    if (!actForm.title.trim()) return
    addActivity(trip.id, day, { ...actForm, title: actForm.title.trim() })
    setActForm({ time: '', title: '', notes: '' })
    setAddingDay(null)
  }

  const totalActivities = trip.itinerary.reduce(
    (s, d) => s + d.activities.length, 0
  )
  const doneActivities = trip.itinerary.reduce(
    (s, d) => s + d.activities.filter((a) => a.done).length, 0
  )

  return (
    <div className="space-y-3">
      {totalActivities > 0 && (
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 flex items-center justify-between text-sm text-slate-600">
          <span>Napredak itinerara</span>
          <span className="font-semibold">{doneActivities}/{totalActivities} aktivnosti</span>
        </div>
      )}

      {Array.from({ length: numDays }, (_, i) => i + 1).map((day) => {
        const date = addDays(parseISO(trip.startDate), day - 1)
        const dayData = trip.itinerary.find((d) => d.day === day)
        const activities = dayData?.activities || []
        const isExpanded = expandedDay === day
        const doneCnt = activities.filter((a) => a.done).length

        return (
          <div key={day} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <button
              onClick={() => setExpandedDay(isExpanded ? null : day)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {day}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800 text-sm">Dan {day}</div>
                  <div className="text-xs text-slate-500">{formatDay(date)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activities.length > 0 && (
                  <span className="text-xs text-slate-400">
                    {doneCnt}/{activities.length}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100 p-4">
                {activities.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-3">
                    Nema aktivnosti za ovaj dan
                  </p>
                )}

                <div className="space-y-2 mb-3">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className={`flex items-start gap-3 p-3 rounded-xl ${
                        act.done ? 'bg-green-50' : 'bg-slate-50'
                      }`}
                    >
                      <button
                        onClick={() => toggleActivity(trip.id, day, act.id)}
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          act.done
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-slate-300 hover:border-rose-400'
                        }`}
                      >
                        {act.done && <Check size={11} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            act.done ? 'text-slate-400 line-through' : 'text-slate-700'
                          }`}
                        >
                          {act.time && (
                            <span className="text-rose-500 mr-1.5 font-semibold">{act.time}</span>
                          )}
                          {act.title}
                        </div>
                        {act.notes && (
                          <p className="text-xs text-slate-400 mt-0.5">{act.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteActivity(trip.id, day, act.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {addingDay === day ? (
                  <div className="bg-rose-50 rounded-xl p-3 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={actForm.time}
                        onChange={(e) => setActForm((f) => ({ ...f, time: e.target.value }))}
                        className={`${inputCls} w-28`}
                      />
                      <input
                        type="text"
                        value={actForm.title}
                        onChange={(e) => setActForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Naziv aktivnosti *"
                        className={`${inputCls} flex-1`}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd(day)}
                      />
                    </div>
                    <input
                      type="text"
                      value={actForm.notes}
                      onChange={(e) => setActForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Napomene (opciono)"
                      className={`${inputCls} w-full`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdd(day)}
                        className="flex-1 bg-rose-500 text-white text-sm py-2 rounded-xl hover:bg-rose-600 transition-colors font-medium"
                      >
                        Dodaj
                      </button>
                      <button
                        onClick={() => {
                          setAddingDay(null)
                          setActForm({ time: '', title: '', notes: '' })
                        }}
                        className="px-4 bg-white text-slate-600 text-sm py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        Otkaži
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingDay(day)}
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-600 text-sm font-medium transition-colors"
                  >
                    <Plus size={15} /> Dodaj aktivnost
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Budget ─── */
function BudgetTab({ trip }) {
  const addExpense = useStore((s) => s.addExpense)
  const deleteExpense = useStore((s) => s.deleteExpense)
  const [showForm, setShowForm] = useState(false)
  const today = format(new Date(), 'yyyy-MM-dd')
  const [form, setForm] = useState({ title: '', amount: '', category: 'Hrana', date: today })

  const expenses = trip.expenses || []
  const currency = trip.budget?.currency || 'EUR'
  const budgetTotal = trip.budget?.total || 0
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const remaining = budgetTotal - totalSpent
  const pct = budgetTotal ? Math.min((totalSpent / budgetTotal) * 100, 100) : 0

  const byCategory = EXPENSE_CATS.reduce((acc, cat) => {
    const items = expenses.filter((e) => e.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const handleAdd = () => {
    if (!form.title.trim() || !form.amount) return
    addExpense(trip.id, { ...form, title: form.title.trim() })
    setForm({ title: '', amount: '', category: 'Hrana', date: today })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-3xl font-extrabold text-slate-800">
              {totalSpent.toFixed(0)}{' '}
              <span className="text-lg font-normal text-slate-500">{currency}</span>
            </div>
            <div className="text-sm text-slate-500">
              potrošeno{budgetTotal > 0 ? ` od ${budgetTotal} ${currency}` : ''}
            </div>
          </div>
          {budgetTotal > 0 && (
            <div className={`text-right ${remaining >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              <div className="text-xl font-bold">
                {Math.abs(remaining).toFixed(0)} {currency}
              </div>
              <div className="text-xs">{remaining >= 0 ? 'preostalo' : 'prekoračeno'}</div>
            </div>
          )}
        </div>

        {budgetTotal > 0 && (
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>0 {currency}</span>
              <span>{pct.toFixed(0)}%</span>
              <span>
                {budgetTotal} {currency}
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pct > 90 ? 'bg-red-400' : pct > 70 ? 'bg-amber-400' : 'bg-green-400'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add expense */}
      {showForm ? (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-3">Novi trošak</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Opis troška *"
              className={`${inputCls} w-full`}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder={`Iznos (${currency}) *`}
                min="0"
                step="0.01"
                className={inputCls}
              />
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={inputCls}
              >
                {EXPENSE_CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className={`${inputCls} w-full`}
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAdd}
                className="flex-1 bg-rose-500 text-white text-sm py-2 rounded-xl hover:bg-rose-600 transition-colors font-medium"
              >
                Dodaj trošak
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 border border-slate-200 text-slate-600 text-sm py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-white text-rose-500 border-2 border-dashed border-rose-200 rounded-2xl py-3 hover:border-rose-300 hover:bg-rose-50 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Dodaj trošak
        </button>
      )}

      {expenses.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          <div className="text-4xl mb-2">💸</div>
          Nema evidentiranih troškova
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700">{cat}</h3>
              <span className="text-sm font-bold text-slate-600">
                {items.reduce((s, i) => s + Number(i.amount), 0).toFixed(0)} {currency}
              </span>
            </div>
            <div className="space-y-2">
              {items.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-700 truncate">{expense.title}</span>
                    {expense.date && (
                      <span className="text-slate-400 text-xs flex-shrink-0">
                        {format(parseISO(expense.date), 'dd.MM.')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-semibold text-slate-700">
                      {Number(expense.amount).toFixed(0)} {currency}
                    </span>
                    <button
                      onClick={() => deleteExpense(trip.id, expense.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

/* ─── Packing ─── */
function PackingTab({ trip }) {
  const addPackingItem = useStore((s) => s.addPackingItem)
  const togglePackingItem = useStore((s) => s.togglePackingItem)
  const deletePackingItem = useStore((s) => s.deletePackingItem)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ item: '', category: 'Odeća' })

  const list = trip.packingList || []
  const packed = list.filter((i) => i.packed).length
  const total = list.length
  const pct = total ? (packed / total) * 100 : 0

  const byCategory = PACKING_CATS.reduce((acc, cat) => {
    const items = list.filter((i) => i.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const handleAdd = () => {
    if (!form.item.trim()) return
    addPackingItem(trip.id, { ...form, item: form.item.trim() })
    setForm({ item: '', category: 'Odeća' })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {total > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Spakovano</span>
            <span className="font-semibold">
              {packed}/{total} stavki ({pct.toFixed(0)}%)
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-purple-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {packed === total && total > 0 && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              🎉 Sve je spakovano! Srećan put!
            </p>
          )}
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={form.item}
                onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
                placeholder="Naziv predmeta *"
                className={`${inputCls} flex-1`}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`${inputCls} flex-shrink-0`}
              >
                {PACKING_CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-rose-500 text-white text-sm py-2 rounded-xl hover:bg-rose-600 transition-colors font-medium"
              >
                Dodaj
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 border border-slate-200 text-slate-600 text-sm py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-white text-rose-500 border-2 border-dashed border-rose-200 rounded-2xl py-3 hover:border-rose-300 hover:bg-rose-50 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Dodaj predmet
        </button>
      )}

      {total === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          <div className="text-4xl mb-2">🎒</div>
          Lista za pakovanje je prazna
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-3">{cat}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => togglePackingItem(trip.id, item.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      item.packed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-slate-300 hover:border-rose-400'
                    }`}
                  >
                    {item.packed && <Check size={11} />}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      item.packed ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}
                  >
                    {item.item}
                  </span>
                  <button
                    onClick={() => deletePackingItem(trip.id, item.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

/* ─── Notes ─── */
function NotesTab({ trip }) {
  const updateTrip = useStore((s) => s.updateTrip)
  const [notes, setNotes] = useState(trip.notes || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateTrip(trip.id, { notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-700">Beleške za putovanje</h3>
        {saved && (
          <span className="text-green-500 text-sm font-medium flex items-center gap-1">
            <Check size={14} /> Sačuvano
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={
          'Dodaj beleške...\n\n• Ideje za restorane\n• Rezervacije\n• Preporuke\n• Napomene'
        }
        rows={14}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
      />
      <button
        onClick={handleSave}
        className="mt-3 flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors"
      >
        <Save size={14} /> Sačuvaj beleške
      </button>
    </div>
  )
}
