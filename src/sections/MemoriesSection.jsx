import { useState } from 'react'
import { Plus, Trash2, Edit2, Camera, Heart } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import useStore from '../store/useStore'

const inp = 'border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white placeholder-slate-400 w-full'

const MOODS = [
  { id: 'amazing', emoji: '🤩', label: 'Fantastično' },
  { id: 'great', emoji: '😊', label: 'Odlično' },
  { id: 'good', emoji: '🙂', label: 'Dobro' },
  { id: 'mixed', emoji: '😐', label: 'Mešovito' },
  { id: 'tired', emoji: '😴', label: 'Umorno' },
]

const EMPTY = { date: '', title: '', content: '', mood: 'great', location: '', tags: '' }

export default function MemoriesSection({ trip }) {
  const addMemory = useStore((s) => s.addMemory)
  const updateMemory = useStore((s) => s.updateMemory)
  const deleteMemory = useStore((s) => s.deleteMemory)
  const addPhoto = useStore((s) => s.addPhoto)
  const deletePhoto = useStore((s) => s.deletePhoto)

  const memories = trip.memories || []
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [photoForm, setPhotoForm] = useState({ memId: null, url: '', caption: '' })
  const [showPhotoForm, setShowPhotoForm] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const handleSave = () => {
    if (!form.title.trim()) return
    if (editId) {
      updateMemory(trip.id, editId, form)
      setEditId(null)
    } else {
      addMemory(trip.id, form)
    }
    setForm(EMPTY)
    setShowForm(false)
  }

  const startEdit = (m) => {
    setEditId(m.id)
    setForm({ date: m.date || '', title: m.title || '', content: m.content || '', mood: m.mood || 'great', location: m.location || '', tags: m.tags || '' })
    setShowForm(true)
  }

  const handleAddPhoto = (memId) => {
    if (!photoForm.url.trim()) return
    addPhoto(trip.id, memId, { url: photoForm.url.trim(), caption: photoForm.caption.trim() })
    setPhotoForm({ memId: null, url: '', caption: '' })
    setShowPhotoForm(null)
  }

  const sortedMemories = [...memories].sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800">📸 Uspomene & dnevnik</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY) }} className="flex items-center gap-1 text-sm bg-purple-600 text-white px-3 py-1.5 rounded-full hover:bg-purple-700 transition-colors">
          <Plus size={14} /> Dodaj uspomenu
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-700">{editId ? 'Izmeni uspomenu' : 'Nova uspomenu'}</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Datum</label>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} min={trip.startDate} max={trip.endDate} className={inp} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Lokacija</label>
              <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="npr. Kolizeum, Rim" className={inp} />
            </div>
          </div>
          <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Naslov uspomene *" className={inp} />
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Raspoloženje</label>
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button key={m.id} type="button" onClick={() => setForm((f) => ({ ...f, mood: m.id }))}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs transition-all ${form.mood === m.id ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  <span className="text-lg">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={6} placeholder="Opiši dan, osećanja, šta se desilo, šta vas je oduševilo..." className={`${inp} resize-none`} />
          <input type="text" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="Oznake (npr. #more #zalazak #romantika)" className={inp} />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-purple-600 text-white text-sm py-2.5 rounded-xl hover:bg-purple-700 font-medium">
              {editId ? 'Sačuvaj izmene' : 'Sačuvaj uspomenu'}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="px-4 border border-slate-200 text-slate-600 text-sm py-2.5 rounded-xl hover:bg-slate-50">Otkaži</button>
          </div>
        </div>
      )}

      {memories.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-5xl mb-3">📸</div>
          <p className="font-semibold text-slate-600 mb-1">Nema uspomena</p>
          <p className="text-sm text-slate-400">Počnite da beležite vaše putovanje — svaki dan je priča za sebe</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMemories.map((m) => {
            const mood = MOODS.find((x) => x.id === m.mood) || MOODS[1]
            const isExp = expanded === m.id
            return (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 cursor-pointer" onClick={() => setExpanded(isExp ? null : m.id)}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{mood.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">{m.title}</span>
                        {m.date && <span className="text-xs text-slate-400">{format(parseISO(m.date), 'dd.MM.yyyy')}</span>}
                        {m.location && <span className="text-xs text-rose-400 flex items-center gap-0.5">📍{m.location}</span>}
                      </div>
                      {m.content && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{m.content}</p>}
                      {m.photos?.length > 0 && <span className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Camera size={11} /> {m.photos.length} fotografija</span>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => startEdit(m)} className="text-slate-300 hover:text-purple-500 p-1"><Edit2 size={14} /></button>
                      <button onClick={() => deleteMemory(trip.id, m.id)} className="text-slate-300 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>

                {isExp && (
                  <div className="border-t border-slate-100 p-4 space-y-3">
                    {m.content && <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{m.content}</p>}
                    {m.tags && <p className="text-xs text-purple-500">{m.tags}</p>}

                    {/* Photos */}
                    {m.photos?.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {m.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img src={photo.url} alt={photo.caption || ''} className="w-full h-24 object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none' }} />
                            {photo.caption && <p className="text-xs text-slate-400 mt-0.5">{photo.caption}</p>}
                            <button onClick={() => deletePhoto(trip.id, m.id, photo.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs hidden group-hover:flex">×</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add photo */}
                    {showPhotoForm === m.id ? (
                      <div className="bg-purple-50 rounded-xl p-3 space-y-2">
                        <input type="text" value={photoForm.url} onChange={(e) => setPhotoForm((f) => ({ ...f, url: e.target.value }))} placeholder="URL fotografije (Google Photos, Imgur...)" className={inp} autoFocus />
                        <input type="text" value={photoForm.caption} onChange={(e) => setPhotoForm((f) => ({ ...f, caption: e.target.value }))} placeholder="Opis (opciono)" className={inp} />
                        <div className="flex gap-2">
                          <button onClick={() => handleAddPhoto(m.id)} className="flex-1 bg-purple-600 text-white text-xs py-2 rounded-lg font-medium">Dodaj fotografiju</button>
                          <button onClick={() => setShowPhotoForm(null)} className="px-3 border border-slate-200 text-slate-500 text-xs py-2 rounded-lg">Otkaži</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setShowPhotoForm(m.id)} className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-700">
                        <Camera size={13} /> Dodaj fotografiju (URL)
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
