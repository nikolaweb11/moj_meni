import { useState, useRef } from 'react'
import { Plus, Trash2, Edit2, Camera, Upload, Link as LinkIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import useStore from '../store/useStore'

const inp = 'border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white placeholder-slate-400 w-full'

const MOODS = [
  { id: 'amazing', emoji: '🤩', label: 'Fantastično' },
  { id: 'great', emoji: '😊', label: 'Odlično' },
  { id: 'good', emoji: '🙂', label: 'Dobro' },
  { id: 'mixed', emoji: '😐', label: 'Mešovito' },
  { id: 'tired', emoji: '😴', label: 'Umorno' },
]

const EMPTY = { date: '', title: '', content: '', mood: 'great', location: '', tags: '' }

function compressImage(file, cb) {
  if (file.size > 10 * 1024 * 1024) { alert('Slika je prevelika (max 10MB).'); return }
  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = document.createElement('img')
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX = 900
      let w = img.width, h = img.height
      if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX }
      else if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      cb(canvas.toDataURL('image/jpeg', 0.78))
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

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
  const [photoMode, setPhotoMode] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoCaption, setPhotoCaption] = useState('')
  const [photoTab, setPhotoTab] = useState('upload')
  const [expanded, setExpanded] = useState(null)
  const fileRef = useRef()

  const handleSave = () => {
    if (!form.title.trim()) return
    if (editId) { updateMemory(trip.id, editId, form); setEditId(null) }
    else addMemory(trip.id, form)
    setForm(EMPTY); setShowForm(false)
  }

  const startEdit = (m) => {
    setEditId(m.id)
    setForm({ date: m.date || '', title: m.title || '', content: m.content || '', mood: m.mood || 'great', location: m.location || '', tags: m.tags || '' })
    setShowForm(true)
  }

  const handleAddUrl = (memId) => {
    if (!photoUrl.trim()) return
    addPhoto(trip.id, memId, { url: photoUrl.trim(), caption: photoCaption.trim() })
    setPhotoUrl(''); setPhotoCaption(''); setPhotoMode(null)
  }

  const handleFileUpload = (e, memId) => {
    const file = e.target.files[0]
    if (!file) return
    compressImage(file, (dataUrl) => addPhoto(trip.id, memId, { url: dataUrl, caption: '' }))
    e.target.value = ''
  }

  const sortedMemories = [...memories].sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">📸 Uspomene & dnevnik</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY) }} className="flex items-center gap-1 text-sm bg-forest text-white px-3 py-1.5 rounded-full hover:bg-forest-light transition-colors">
          <Plus size={14} /> Dodaj
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen space-y-3">
          <h3 className="font-semibold text-ink">{editId ? 'Izmeni uspomenu' : 'Nova uspomenu'}</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-mist mb-1 block">Datum</label>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} min={trip.startDate} max={trip.endDate} className={inp} />
            </div>
            <div>
              <label className="text-xs text-mist mb-1 block">Lokacija</label>
              <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="npr. Seljalandsfoss" className={inp} />
            </div>
          </div>
          <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Naslov uspomene *" className={inp} />
          <div>
            <label className="text-xs text-mist mb-2 block">Raspoloženje</label>
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button key={m.id} type="button" onClick={() => setForm((f) => ({ ...f, mood: m.id }))}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs transition-all ${form.mood === m.id ? 'bg-forest/10 text-forest ring-2 ring-forest/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  <span className="text-lg">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={6} placeholder="Opiši dan, osećanja, šta se desilo..." className={`${inp} resize-none`} />
          <input type="text" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="#more #zalazak #romantika" className={inp} />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-forest text-white text-sm py-2.5 rounded-xl hover:bg-forest-light font-medium">
              {editId ? 'Sačuvaj izmene' : 'Sačuvaj uspomenu'}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="px-4 border border-linen text-ink-light text-sm py-2.5 rounded-xl hover:bg-parchment">Otkaži</button>
          </div>
        </div>
      )}

      {memories.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-linen">
          <div className="text-5xl mb-3">📸</div>
          <p className="font-display font-semibold text-ink-light text-lg mb-1">Nema uspomena</p>
          <p className="text-sm text-mist">Počnite da beležite vaše putovanje</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMemories.map((m) => {
            const mood = MOODS.find((x) => x.id === m.mood) || MOODS[1]
            const isExp = expanded === m.id
            return (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-linen overflow-hidden">
                <div className="p-4 cursor-pointer" onClick={() => setExpanded(isExp ? null : m.id)}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{mood.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-ink">{m.title}</span>
                        {m.date && <span className="text-xs text-mist">{format(parseISO(m.date), 'dd.MM.yyyy')}</span>}
                        {m.location && <span className="text-xs text-terra">📍{m.location}</span>}
                      </div>
                      {m.content && <p className="text-sm text-ink-light/70 mt-1 line-clamp-2">{m.content}</p>}
                      {m.photos?.length > 0 && <span className="text-xs text-mist mt-1 flex items-center gap-1"><Camera size={11} /> {m.photos.length} fotografija</span>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => startEdit(m)} className="text-slate-300 hover:text-forest p-1"><Edit2 size={14} /></button>
                      <button onClick={() => deleteMemory(trip.id, m.id)} className="text-slate-300 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>

                {isExp && (
                  <div className="border-t border-linen p-4 space-y-3">
                    {m.content && <p className="text-sm text-ink-light leading-relaxed whitespace-pre-wrap">{m.content}</p>}
                    {m.tags && <p className="text-xs text-forest/70">{m.tags}</p>}

                    {m.photos?.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {m.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img src={photo.url} alt={photo.caption || ''} className="w-full h-28 object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none' }} />
                            {photo.caption && <p className="text-xs text-mist mt-0.5">{photo.caption}</p>}
                            <button onClick={() => deletePhoto(trip.id, m.id, photo.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs hidden group-hover:flex">×</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {photoMode === m.id ? (
                      <div className="bg-parchment rounded-xl p-3 space-y-2">
                        <div className="flex gap-1 mb-2">
                          <button onClick={() => setPhotoTab('upload')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${photoTab === 'upload' ? 'bg-forest text-white' : 'bg-white text-mist border border-linen'}`}>
                            <Upload size={12} /> Upload
                          </button>
                          <button onClick={() => setPhotoTab('url')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${photoTab === 'url' ? 'bg-forest text-white' : 'bg-white text-mist border border-linen'}`}>
                            <LinkIcon size={12} /> URL
                          </button>
                        </div>
                        {photoTab === 'upload' ? (
                          <div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, m.id)} />
                            <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-linen rounded-xl py-5 text-sm text-mist hover:border-forest hover:text-forest transition-colors flex flex-col items-center gap-1">
                              <Upload size={20} /><span>Izaberi fotografiju</span><span className="text-xs opacity-60">JPG, PNG, HEIC</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <input type="text" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="URL fotografije" className={inp} autoFocus />
                            <input type="text" value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} placeholder="Opis (opciono)" className={inp} />
                            <button onClick={() => handleAddUrl(m.id)} className="w-full bg-forest text-white text-xs py-2 rounded-lg font-medium hover:bg-forest-light">Dodaj fotografiju</button>
                          </div>
                        )}
                        <button onClick={() => setPhotoMode(null)} className="w-full text-xs text-mist hover:text-ink-light pt-1">Otkaži</button>
                      </div>
                    ) : (
                      <button onClick={() => { setPhotoMode(m.id); setPhotoTab('upload') }} className="flex items-center gap-1.5 text-xs text-forest hover:text-forest-light font-medium">
                        <Camera size={13} /> Dodaj fotografiju
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
