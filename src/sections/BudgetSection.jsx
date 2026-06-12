import { useState } from 'react'
import { Plus, Trash2, TrendingUp, Users } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import useStore from '../store/useStore'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist w-full'

const EXPENSE_CATS = ['Smeštaj','Letovi','Prevoz','Hrana','Aktivnosti & ulaznice','Kupovina','Kozmetika','Lekovi','Ostalo']
const CAT_EMOJI = {'Smeštaj':'🏨','Letovi':'✈️','Prevoz':'🚕','Hrana':'🍽️','Aktivnosti & ulaznice':'🎭','Kupovina':'🛍️','Kozmetika':'💄','Lekovi':'💊','Ostalo':'💸'}
const PAID_BY = ['Oboje','Ti','Ona']
const PAYMENT = ['Kartica','Gotovina','Online']

export default function BudgetSection({ trip }) {
  const updateBudget = useStore((s) => s.updateBudget)
  const addExpense = useStore((s) => s.addExpense)
  const deleteExpense = useStore((s) => s.deleteExpense)

  const expenses = trip.expenses || []
  const budget = trip.budget || { total: 0, currency: 'EUR', people: 2 }
  const currency = budget.currency || 'EUR'
  const people = budget.people || 2

  const today = format(new Date(), 'yyyy-MM-dd')
  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [budgetForm, setBudgetForm] = useState({ total: budget.total || '', currency: currency, people: people })
  const [form, setForm] = useState({ title: '', amount: '', category: 'Hrana', paidBy: 'Oboje', paymentMethod: 'Kartica', date: today, notes: '' })
  const [filterCat, setFilterCat] = useState('sve')
  const [viewMode, setViewMode] = useState('category') // category | date | person

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const budgetTotal = Number(budget.total) || 0
  const remaining = budgetTotal - totalSpent
  const pct = budgetTotal ? Math.min((totalSpent / budgetTotal) * 100, 100) : 0

  const perPerson = totalSpent / people

  // Group by category
  const byCat = EXPENSE_CATS.reduce((acc, cat) => {
    const items = expenses.filter((e) => e.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  // By paidBy
  const byPerson = PAID_BY.reduce((acc, p) => {
    const items = expenses.filter((e) => e.paidBy === p)
    if (items.length) acc[p] = items
    return acc
  }, {})

  const handleAdd = () => {
    if (!form.title.trim() || !form.amount) return
    addExpense(trip.id, { ...form, title: form.title.trim() })
    setForm({ title: '', amount: '', category: 'Hrana', paidBy: 'Oboje', paymentMethod: 'Kartica', date: today, notes: '' })
    setShowForm(false)
  }

  const handleSaveBudget = () => {
    updateBudget(trip.id, { total: Number(budgetForm.total) || 0, currency: budgetForm.currency, people: Number(budgetForm.people) || 2 })
    setShowBudgetEdit(false)
  }

  const filteredExpenses = filterCat === 'sve' ? expenses : expenses.filter((e) => e.category === filterCat)

  return (
    <div className="space-y-4">
      {/* Budget summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-3xl font-extrabold text-ink">
              {totalSpent.toFixed(0)} <span className="text-base font-normal text-mist">{currency}</span>
            </div>
            <div className="text-sm text-mist">ukupno potrošeno</div>
          </div>
          <div className="text-right">
            {budgetTotal > 0 && (
              <div className={`text-xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {remaining >= 0 ? '+' : ''}{remaining.toFixed(0)} {currency}
              </div>
            )}
            <div className="text-xs text-mist">{remaining >= 0 ? 'preostalo' : 'prekoračeno'}</div>
            <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs text-terra hover:text-terra-light mt-1">
              {budgetTotal > 0 ? `Budžet: ${budgetTotal} ${currency}` : '+ Postavi budžet'}
            </button>
          </div>
        </div>

        {showBudgetEdit && (
          <div className="bg-parchment rounded-xl p-3 mb-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-xs text-mist mb-1 block">Ukupan budžet</label>
                <input type="number" value={budgetForm.total} onChange={(e) => setBudgetForm((f) => ({ ...f, total: e.target.value }))} placeholder="0" className={inp} />
              </div>
              <div>
                <label className="text-xs text-mist mb-1 block">Valuta</label>
                <select value={budgetForm.currency} onChange={(e) => setBudgetForm((f) => ({ ...f, currency: e.target.value }))} className={inp}>
                  {['EUR','USD','RSD','GBP','CHF'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Broj osoba</label>
              <input type="number" value={budgetForm.people} onChange={(e) => setBudgetForm((f) => ({ ...f, people: e.target.value }))} min="1" max="10" className={inp} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveBudget} className="flex-1 bg-terra text-white text-xs py-2 rounded-lg">Sačuvaj budžet</button>
              <button onClick={() => setShowBudgetEdit(false)} className="px-3 border border-linen text-mist text-xs py-2 rounded-lg">Otkaži</button>
            </div>
          </div>
        )}

        {budgetTotal > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-mist mb-1">
              <span>0</span><span>{pct.toFixed(0)}%</span><span>{budgetTotal} {currency}</span>
            </div>
            <div className="h-3 bg-linen rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-red-400' : pct > 70 ? 'bg-amber-400' : 'bg-green-400'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Potrošeno" value={`${totalSpent.toFixed(0)} ${currency}`} color="text-ink" />
          <MiniStat label="Po osobi" value={`${perPerson.toFixed(0)} ${currency}`} color="text-purple-600" icon={<Users size={12} />} />
          <MiniStat label="Br. troškova" value={expenses.length} color="text-ink-light" />
        </div>
      </div>

      {/* Add expense */}
      {showForm ? (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen space-y-2">
          <h3 className="font-semibold text-ink-light">Novi trošak</h3>
          <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Opis troška *" className={inp} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder={`Iznos (${currency}) *`} min="0" step="0.01" className={inp} />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp}>
              {EXPENSE_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <select value={form.paidBy} onChange={(e) => setForm((f) => ({ ...f, paidBy: e.target.value }))} className={inp}>
              {PAID_BY.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select value={form.paymentMethod} onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value }))} className={inp}>
              {PAYMENT.map((p) => <option key={p}>{p}</option>)}
            </select>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inp} />
          </div>
          <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Napomene..." className={`${inp} resize-none`} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-terra text-white text-sm py-2.5 rounded-xl hover:bg-terra-light font-medium">Dodaj trošak</button>
            <button onClick={() => setShowForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2.5 rounded-xl hover:bg-parchment">Otkaži</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 bg-white text-terra border-2 border-dashed border-terra/30 rounded-2xl py-3 hover:bg-terra/10 text-sm font-medium">
          <Plus size={15} /> Dodaj trošak
        </button>
      )}

      {/* Category breakdown */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
          <h3 className="font-semibold text-ink-light mb-3">Po kategorijama</h3>
          <div className="space-y-2">
            {Object.entries(byCat).map(([cat, items]) => {
              const catTotal = items.reduce((s, e) => s + Number(e.amount), 0)
              const catPct = totalSpent ? (catTotal / totalSpent) * 100 : 0
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-ink-light">{CAT_EMOJI[cat] || '💸'} {cat}</span>
                    <span className="font-semibold text-ink-light">{catTotal.toFixed(0)} {currency}</span>
                  </div>
                  <div className="h-1.5 bg-linen rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-terra to-purple-500 rounded-full" style={{ width: `${catPct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All expenses list */}
      {expenses.length === 0 ? (
        <div className="text-center py-10 text-mist text-sm"><div className="text-4xl mb-2">💸</div>Nema evidentiranih troškova</div>
      ) : (
        <div className="space-y-2">
          <h3 className="font-semibold text-ink-light text-sm">Svi troškovi</h3>
          {expenses.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).map((e) => (
            <div key={e.id} className="bg-white rounded-xl p-3 shadow-sm border border-linen flex items-center gap-3">
              <span className="text-lg">{CAT_EMOJI[e.category] || '💸'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-ink-light text-sm">{e.title}</div>
                <div className="text-xs text-mist">
                  {e.date && `${format(parseISO(e.date), 'dd.MM.')} · `}
                  {e.category} · {e.paidBy} · {e.paymentMethod}
                </div>
              </div>
              <div className="font-bold text-ink-light text-sm flex-shrink-0">{Number(e.amount).toFixed(0)} {currency}</div>
              <button onClick={() => deleteExpense(trip.id, e.id)} className="text-mist hover:text-red-400 flex-shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, color, icon }) {
  return (
    <div className="bg-parchment rounded-xl p-3 text-center">
      <div className={`font-bold text-base ${color} flex items-center justify-center gap-1`}>{icon}{value}</div>
      <div className="text-xs text-mist mt-0.5">{label}</div>
    </div>
  )
}
