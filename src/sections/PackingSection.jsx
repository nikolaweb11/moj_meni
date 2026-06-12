import { useState } from 'react'
import { Plus, Trash2, Check, Edit2, Lightbulb } from 'lucide-react'
import { parseISO, addDays } from 'date-fns'
import useStore from '../store/useStore'
import { getPackingSuggestions } from '../hooks/useSuggestions'

const inp = 'border border-linen rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra/30 bg-white placeholder-mist w-full'

const PACKING_CATS = ['Dokumenti','Odeća','Toaletna','Elektronika','Lekovi','Obuća','Nakit & aksesoare','Hrana & piće','Ostalo']
const CAT_EMOJI = {'Dokumenti':'📄','Odeća':'👕','Toaletna':'🧴','Elektronika':'🔌','Lekovi':'💊','Obuća':'👟','Nakit & aksesoare':'💍','Hrana & piće':'🍎','Ostalo':'📦'}

const DAYS_SR = ['Ned','Pon','Uto','Sre','Čet','Pet','Sub']
const MONTHS_SR = ['jan','feb','mar','apr','maj','jun','jul','avg','sep','okt','nov','dec']

export default function PackingSection({ trip, numDays }) {
  const addPackingItem = useStore((s) => s.addPackingItem)
  const togglePackingItem = useStore((s) => s.togglePackingItem)
  const deletePackingItem = useStore((s) => s.deletePackingItem)
  const addOutfit = useStore((s) => s.addOutfit)
  const updateOutfit = useStore((s) => s.updateOutfit)
  const deleteOutfit = useStore((s) => s.deleteOutfit)

  const [tab, setTab] = useState('packing')
  const [showForm, setShowForm] = useState(false)
  const [showOutfitForm, setShowOutfitForm] = useState(false)
  const [editOutfit, setEditOutfit] = useState(null)
  const [form, setForm] = useState({ item: '', category: 'Odeća', assignedTo: 'Oboje', quantity: '1', notes: '' })
  const [outfitForm, setOutfitForm] = useState({ day: 1, occasion: '', person1: '', person2: '', notes: '' })

  const list = trip.packingList || []
  const outfits = trip.outfits || []
  const packed = list.filter((i) => i.packed).length

  const byCat = PACKING_CATS.reduce((acc, cat) => {
    const items = list.filter((i) => i.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const handleAdd = () => {
    if (!form.item.trim()) return
    addPackingItem(trip.id, { ...form, item: form.item.trim() })
    setForm({ item: '', category: 'Odeća', assignedTo: 'Oboje', quantity: '1', notes: '' })
    setShowForm(false)
  }

  const handleSaveOutfit = () => {
    if (!outfitForm.occasion.trim()) return
    if (editOutfit) {
      updateOutfit(trip.id, editOutfit, outfitForm)
      setEditOutfit(null)
    } else {
      addOutfit(trip.id, outfitForm)
    }
    setOutfitForm({ day: 1, occasion: '', person1: '', person2: '', notes: '' })
    setShowOutfitForm(false)
  }

  const couple = useStore((s) => s.couple)
  const startEdit = (outfit) => {
    setEditOutfit(outfit.id)
    setOutfitForm({ day: outfit.day, occasion: outfit.occasion, person1: outfit.person1 || '', person2: outfit.person2 || '', notes: outfit.notes || '' })
    setShowOutfitForm(true)
  }

  function dayDate(day) {
    try {
      const d = addDays(parseISO(trip.startDate), day - 1)
      return `${DAYS_SR[d.getDay()]}, ${d.getDate()}. ${MONTHS_SR[d.getMonth()]}`
    } catch { return `Dan ${day}` }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-linen p-1 rounded-2xl">
        <button onClick={() => setTab('packing')} className={`flex-1 py-2 px-2 rounded-xl text-sm font-medium transition-all ${tab === 'packing' ? 'bg-white shadow-sm text-ink' : 'text-mist'}`}>
          🎒 Lista
        </button>
        <button onClick={() => setTab('outfits')} className={`flex-1 py-2 px-2 rounded-xl text-sm font-medium transition-all ${tab === 'outfits' ? 'bg-white shadow-sm text-ink' : 'text-mist'}`}>
          👗 Outfiti
        </button>
        <button onClick={() => setTab('suggest')} className={`flex-1 py-2 px-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1 ${tab === 'suggest' ? 'bg-white shadow-sm text-ink' : 'text-mist'}`}>
          <Lightbulb size={13} /> Predlozi
        </button>
      </div>

      {tab === 'packing' && (
        <>
          {list.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
              <div className="flex justify-between text-sm text-ink-light mb-2">
                <span>Spakovano</span>
                <span className="font-semibold">{packed}/{list.length} ({list.length ? Math.round((packed/list.length)*100) : 0}%)</span>
              </div>
              <div className="h-3 bg-linen rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-terra to-purple-500 rounded-full transition-all" style={{ width: `${list.length ? (packed/list.length)*100 : 0}%` }} />
              </div>
              {packed === list.length && list.length > 0 && <p className="text-xs text-green-600 mt-2 font-medium">🎉 Sve je spakovano!</p>}
            </div>
          )}

          {showForm ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={form.item} onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))} placeholder="Predmet *" className={inp} autoFocus onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp}>
                  {PACKING_CATS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={form.assignedTo} onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))} className={inp}>
                  <option value="Oboje">Oboje</option>
                  <option value="person1">{couple.name1}</option>
                  <option value="person2">{couple.name2}</option>
                </select>
                <input type="text" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} placeholder="Količina" className={inp} />
              </div>
              <input type="text" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Napomene (npr. crna, formalna)" className={inp} />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex-1 bg-terra text-white text-sm py-2 rounded-xl hover:bg-terra-light font-medium">Dodaj</button>
                <button onClick={() => setShowForm(false)} className="px-4 border border-linen text-ink-light text-sm py-2 rounded-xl hover:bg-parchment">Otkaži</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 bg-white text-terra border-2 border-dashed border-terra/30 rounded-2xl py-3 hover:bg-terra/10 text-sm font-medium">
              <Plus size={15} /> Dodaj predmet
            </button>
          )}

          {list.length === 0 ? (
            <div className="text-center py-10 text-mist"><div className="text-4xl mb-2">🎒</div><p className="text-sm">Lista je prazna</p></div>
          ) : (
            Object.entries(byCat).map(([cat, items]) => (
              <div key={cat} className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-ink-light">{CAT_EMOJI[cat]} {cat}</h3>
                  <span className="text-xs text-mist">{items.filter((i) => i.packed).length}/{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <button onClick={() => togglePackingItem(trip.id, item.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.packed ? 'bg-green-500 border-green-500 text-white' : 'border-linen hover:border-terra'}`}>
                        {item.packed && <Check size={11} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${item.packed ? 'text-mist line-through' : 'text-ink-light'}`}>{item.item}</span>
                        {item.quantity && item.quantity !== '1' && <span className="text-xs text-mist ml-1">× {item.quantity}</span>}
                        {item.assignedTo !== 'Oboje' && <span className="text-xs text-purple-500 ml-1">({item.assignedTo})</span>}
                        {item.notes && <div className="text-xs text-mist">{item.notes}</div>}
                      </div>
                      <button onClick={() => deletePackingItem(trip.id, item.id)} className="text-mist hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {tab === 'outfits' && (
        <>
          {(showOutfitForm) ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-linen space-y-3">
              <h3 className="font-semibold text-ink-light">{editOutfit ? 'Izmeni outfit' : 'Novi outfit'}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-mist mb-1 block">Dan</label>
                  <select value={outfitForm.day} onChange={(e) => setOutfitForm((f) => ({ ...f, day: Number(e.target.value) }))} className={inp}>
                    {Array.from({ length: numDays }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>Dan {d} — {dayDate(d)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-mist mb-1 block">Prigoda</label>
                  <input type="text" value={outfitForm.occasion} onChange={(e) => setOutfitForm((f) => ({ ...f, occasion: e.target.value }))} placeholder="npr. Večera u restoranu" className={inp} />
                </div>
              </div>
              <div>
                <label className="text-xs text-mist mb-1 block">👤 {couple.name1} — outfit</label>
                <textarea value={outfitForm.person1} onChange={(e) => setOutfitForm((f) => ({ ...f, person1: e.target.value }))} rows={2} placeholder="npr. Bela košulja, tamne pantalone, bele patike" className={`${inp} resize-none`} />
              </div>
              <div>
                <label className="text-xs text-mist mb-1 block">👤 {couple.name2} — outfit</label>
                <textarea value={outfitForm.person2} onChange={(e) => setOutfitForm((f) => ({ ...f, person2: e.target.value }))} rows={2} placeholder="npr. Crvena haljina, sandale, clutch torbica" className={`${inp} resize-none`} />
              </div>
              <textarea value={outfitForm.notes} onChange={(e) => setOutfitForm((f) => ({ ...f, notes: e.target.value }))} rows={1} placeholder="Napomene (dress code, vreme...)" className={`${inp} resize-none`} />
              <div className="flex gap-2">
                <button onClick={handleSaveOutfit} className="flex-1 bg-purple-600 text-white text-sm py-2 rounded-xl hover:bg-purple-700 font-medium">Sačuvaj outfit</button>
                <button onClick={() => { setShowOutfitForm(false); setEditOutfit(null) }} className="px-4 border border-linen text-ink-light text-sm py-2 rounded-xl hover:bg-parchment">Otkaži</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowOutfitForm(true)} className="w-full flex items-center justify-center gap-2 bg-white text-purple-600 border-2 border-dashed border-purple-200 rounded-2xl py-3 hover:bg-purple-50 text-sm font-medium">
              <Plus size={15} /> Dodaj outfit
            </button>
          )}

          {outfits.length === 0 && !showOutfitForm ? (
            <div className="text-center py-10 text-mist"><div className="text-4xl mb-2">👗</div><p className="text-sm">Nema planiranih outfita</p></div>
          ) : (
            <div className="space-y-3">
              {outfits.sort((a, b) => a.day - b.day).map((outfit) => (
                <div key={outfit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">Dan {outfit.day} — {dayDate(outfit.day)}</span>
                      <p className="font-semibold text-ink mt-1">{outfit.occasion}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(outfit)} className="text-mist hover:text-purple-500"><Edit2 size={14} /></button>
                      <button onClick={() => deleteOutfit(trip.id, outfit.id)} className="text-mist hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {outfit.person1 && (
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs font-medium text-blue-600 mb-1">👤 {couple.name1}</p>
                        <p className="text-xs text-ink-light">{outfit.person1}</p>
                      </div>
                    )}
                    {outfit.person2 && (
                      <div className="bg-terra/10 rounded-xl p-3">
                        <p className="text-xs font-medium text-terra mb-1">👤 {couple.name2}</p>
                        <p className="text-xs text-ink-light">{outfit.person2}</p>
                      </div>
                    )}
                  </div>
                  {outfit.notes && <p className="text-xs text-mist mt-2">{outfit.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'suggest' && (
        <PackingSuggestions trip={trip} numDays={numDays} addPackingItem={addPackingItem} />
      )}
    </div>
  )
}

function PackingSuggestions({ trip, numDays, addPackingItem }) {
  const suggestions = getPackingSuggestions(trip.destination, trip.startDate, numDays)
  const [addedItems, setAddedItems] = useState(new Set())

  const PACKING_CATS = ['Dokumenti', 'Odeća', 'Toaletna', 'Elektronika', 'Lekovi', 'Obuća', 'Nakit & aksesoare', 'Ostalo']
  const CAT_EMOJI = { Dokumenti: '📄', Odeća: '👕', Toaletna: '🧴', Elektronika: '🔌', Lekovi: '💊', Obuća: '👟', 'Nakit & aksesoare': '💍', Ostalo: '📦' }

  const byCat = PACKING_CATS.reduce((acc, cat) => {
    const items = suggestions.filter((s) => s.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  function addItem(s) {
    addPackingItem(trip.id, { item: s.item, category: s.category, assignedTo: s.assignedTo, quantity: s.quantity, notes: s.notes })
    setAddedItems((prev) => new Set([...prev, s.item]))
  }

  function addAll(items) {
    items.forEach((s) => {
      if (!addedItems.has(s.item)) addItem(s)
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-forest/5 rounded-2xl p-4 border border-forest/15">
        <p className="text-sm font-semibold text-forest mb-0.5">💡 Predlozi za {trip.destination}</p>
        <p className="text-xs text-mist">{suggestions.length} stavki na osnovu destinacije i sezone • kliknite + da dodate</p>
      </div>
      {Object.entries(byCat).map(([cat, items]) => (
        <div key={cat} className="bg-white rounded-2xl border border-linen shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-linen bg-parchment/50">
            <span className="font-medium text-ink text-sm">{CAT_EMOJI[cat] || '📦'} {cat}</span>
            <button
              onClick={() => addAll(items)}
              className="text-xs text-forest hover:text-forest-light font-medium border border-forest/30 px-2.5 py-1 rounded-lg hover:bg-forest/5 transition-colors"
            >
              Dodaj sve
            </button>
          </div>
          <div className="divide-y divide-linen">
            {items.map((s) => {
              const isAdded = addedItems.has(s.item)
              return (
                <div key={s.item} className={`flex items-center gap-3 px-4 py-2.5 ${isAdded ? 'opacity-50' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink">{s.item}</p>
                    {s.notes && <p className="text-xs text-mist">{s.notes}</p>}
                  </div>
                  <button
                    onClick={() => addItem(s)}
                    disabled={isAdded}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isAdded ? 'bg-green-100 text-green-600' : 'bg-forest/10 text-forest hover:bg-forest hover:text-white'}`}
                  >
                    {isAdded ? <Check size={13} /> : <Plus size={13} />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
