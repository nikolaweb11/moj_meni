import { useState, useRef } from 'react'
import { Trash2, Upload, Link2, Send, BookOpen, Users } from 'lucide-react'
import useStore from '../store/useStore'

function compressImage(file, cb) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 900
      let { width: w, height: h } = img
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round((h * MAX) / w); w = MAX }
        else { w = Math.round((w * MAX) / h); h = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      cb(canvas.toDataURL('image/jpeg', 0.78))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const inputCls = 'w-full border border-linen rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white placeholder-slate-400'

export default function FamilyWallSection({ trip }) {
  const addGuestPost = useStore((s) => s.addGuestPost)
  const deleteGuestPost = useStore((s) => s.deleteGuestPost)
  const addDailyUpdate = useStore((s) => s.addDailyUpdate)
  const deleteDailyUpdate = useStore((s) => s.deleteDailyUpdate)
  const addDailyPhoto = useStore((s) => s.addDailyPhoto)

  const [tab, setTab] = useState('diary')

  // Guest form
  const [guestName, setGuestName] = useState('')
  const [guestMsg, setGuestMsg] = useState('')
  const [guestPhotoUrl, setGuestPhotoUrl] = useState('')
  const [guestPhotoTab, setGuestPhotoTab] = useState('upload')
  const guestFileRef = useRef()

  // Daily update form
  const [dayNum, setDayNum] = useState('')
  const [dayTitle, setDayTitle] = useState('')
  const [dayText, setDayText] = useState('')

  // Photo for existing daily update
  const [uploadingForId, setUploadingForId] = useState(null)
  const [photoUrlFor, setPhotoUrlFor] = useState('')
  const [photoTabFor, setPhotoTabFor] = useState('upload')
  const photoFileRef = useRef()

  const wall = trip.familyWall || { guestPosts: [], dailyUpdates: [] }
  const guestPosts = [...(wall.guestPosts || [])].reverse()
  const dailyUpdates = [...(wall.dailyUpdates || [])].sort((a, b) => Number(a.day) - Number(b.day))

  function handleGuestFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    compressImage(file, (url) => setGuestPhotoUrl(url))
  }

  function submitGuestPost(e) {
    e.preventDefault()
    if (!guestName.trim() || !guestMsg.trim()) return
    addGuestPost(trip.id, { name: guestName.trim(), message: guestMsg.trim(), photoUrl: guestPhotoUrl || null })
    setGuestName(''); setGuestMsg(''); setGuestPhotoUrl('')
    if (guestFileRef.current) guestFileRef.current.value = ''
  }

  function submitDailyUpdate(e) {
    e.preventDefault()
    if (!dayTitle.trim() || !dayText.trim()) return
    addDailyUpdate(trip.id, { day: dayNum || '?', title: dayTitle.trim(), text: dayText.trim() })
    setDayNum(''); setDayTitle(''); setDayText('')
  }

  function handleAddPhotoToUpdate(updateId) {
    if (!photoUrlFor) return
    addDailyPhoto(trip.id, updateId, { url: photoUrlFor })
    setPhotoUrlFor(''); setUploadingForId(null)
    if (photoFileRef.current) photoFileRef.current.value = ''
  }

  function handlePhotoFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    compressImage(file, (url) => setPhotoUrlFor(url))
  }

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return '' }
  }

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex gap-2 bg-white rounded-2xl p-1 border border-linen shadow-sm">
        <button
          onClick={() => setTab('diary')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'diary' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}
        >
          <BookOpen size={15} /> Naš dnevnik
        </button>
        <button
          onClick={() => setTab('guests')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'guests' ? 'bg-forest text-white shadow-sm' : 'text-ink-light hover:text-ink'}`}
        >
          <Users size={15} /> Poruke od porodice
        </button>
      </div>

      {/* DIARY TAB */}
      {tab === 'diary' && (
        <>
          {/* Add daily update form */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
            <h3 className="font-semibold text-ink mb-4 text-sm">✍️ Dodaj beleška dana</h3>
            <form onSubmit={submitDailyUpdate} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-mist mb-1">Dan br.</label>
                  <input
                    type="number"
                    min="1"
                    value={dayNum}
                    onChange={(e) => setDayNum(e.target.value)}
                    placeholder="1"
                    className={inputCls}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-mist mb-1">Naslov dana</label>
                  <input
                    type="text"
                    value={dayTitle}
                    onChange={(e) => setDayTitle(e.target.value)}
                    placeholder="npr. Zlatni zalazak sunca..."
                    className={inputCls}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-mist mb-1">Kako smo proveli dan</label>
                <textarea
                  rows={3}
                  value={dayText}
                  onChange={(e) => setDayText(e.target.value)}
                  placeholder="Opišite najlepše trenutke, šta ste jeli, gde ste bili, šta ste osjetili..."
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-light transition-colors"
              >
                <Send size={14} /> Sačuvaj beleška
              </button>
            </form>
          </div>

          {/* Daily updates list */}
          {dailyUpdates.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-linen">
              <p className="text-3xl mb-2">📓</p>
              <p className="font-display font-semibold text-ink-light">Dnevnik je prazan</p>
              <p className="text-sm text-mist mt-1">Zabeležite svaki dan putovanja za porodicu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dailyUpdates.map((u) => (
                <div key={u.id} className="bg-white rounded-2xl shadow-sm border border-linen overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full mr-2">
                          Dan {u.day}
                        </span>
                        <span className="text-xs text-mist">{formatDate(u.date)}</span>
                      </div>
                      <button onClick={() => deleteDailyUpdate(trip.id, u.id)} className="text-mist hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h4 className="font-display font-semibold text-ink text-base mb-2">{u.title}</h4>
                    <p className="text-sm text-ink-light leading-relaxed whitespace-pre-wrap">{u.text}</p>
                  </div>

                  {/* Photos grid */}
                  {u.photos?.length > 0 && (
                    <div className={`grid gap-1 px-5 pb-4 ${u.photos.length === 1 ? 'grid-cols-1' : u.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {u.photos.map((p) => (
                        <img key={p.id} src={p.url} alt="" className="w-full h-32 object-cover rounded-xl" />
                      ))}
                    </div>
                  )}

                  {/* Add photo to this update */}
                  {uploadingForId === u.id ? (
                    <div className="px-5 pb-4 space-y-2">
                      <div className="flex gap-2 mb-2">
                        <button onClick={() => setPhotoTabFor('upload')} className={`text-xs px-3 py-1 rounded-lg ${photoTabFor === 'upload' ? 'bg-forest text-white' : 'bg-linen text-mist'}`}>
                          <Upload size={11} className="inline mr-1" />Upload
                        </button>
                        <button onClick={() => setPhotoTabFor('url')} className={`text-xs px-3 py-1 rounded-lg ${photoTabFor === 'url' ? 'bg-forest text-white' : 'bg-linen text-mist'}`}>
                          <Link2 size={11} className="inline mr-1" />URL
                        </button>
                      </div>
                      {photoTabFor === 'upload' ? (
                        <input ref={photoFileRef} type="file" accept="image/*" onChange={handlePhotoFileChange} className="text-xs text-mist file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-forest/10 file:text-forest hover:file:bg-forest/20" />
                      ) : (
                        <input type="url" value={photoUrlFor} onChange={(e) => setPhotoUrlFor(e.target.value)} placeholder="https://..." className={inputCls} />
                      )}
                      {photoUrlFor && (
                        <img src={photoUrlFor} alt="" className="h-20 rounded-lg object-cover" />
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => handleAddPhotoToUpdate(u.id)} disabled={!photoUrlFor} className="text-xs bg-forest text-white px-3 py-1.5 rounded-lg hover:bg-forest-light transition-colors disabled:opacity-40">
                          Dodaj
                        </button>
                        <button onClick={() => { setUploadingForId(null); setPhotoUrlFor('') }} className="text-xs text-mist hover:text-ink px-3 py-1.5">
                          Otkaži
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 pb-4">
                      <button onClick={() => setUploadingForId(u.id)} className="text-xs text-forest hover:text-forest-light font-medium flex items-center gap-1">
                        <Upload size={12} /> Dodaj fotografiju
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* GUESTS TAB */}
      {tab === 'guests' && (
        <>
          {/* Add guest post form */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-linen">
            <h3 className="font-semibold text-ink mb-4 text-sm">💌 Ostavi poruku</h3>
            <form onSubmit={submitGuestPost} className="space-y-3">
              <div>
                <label className="block text-xs text-mist mb-1">Vaše ime</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="npr. Mama i Tata"
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-mist mb-1">Poruka</label>
                <textarea
                  rows={3}
                  value={guestMsg}
                  onChange={(e) => setGuestMsg(e.target.value)}
                  placeholder="Pišite im — pozdravi, željа za putovanje, pitanja..."
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              {/* Optional photo */}
              <div>
                <label className="block text-xs text-mist mb-1">Fotografija (opciono)</label>
                <div className="flex gap-2 mb-2">
                  <button type="button" onClick={() => setGuestPhotoTab('upload')} className={`text-xs px-3 py-1 rounded-lg ${guestPhotoTab === 'upload' ? 'bg-forest text-white' : 'bg-linen text-mist'}`}>
                    <Upload size={11} className="inline mr-1" />Upload
                  </button>
                  <button type="button" onClick={() => setGuestPhotoTab('url')} className={`text-xs px-3 py-1 rounded-lg ${guestPhotoTab === 'url' ? 'bg-forest text-white' : 'bg-linen text-mist'}`}>
                    <Link2 size={11} className="inline mr-1" />URL
                  </button>
                </div>
                {guestPhotoTab === 'upload' ? (
                  <input ref={guestFileRef} type="file" accept="image/*" onChange={handleGuestFileChange} className="text-xs text-mist file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-forest/10 file:text-forest hover:file:bg-forest/20" />
                ) : (
                  <input type="url" value={guestPhotoUrl} onChange={(e) => setGuestPhotoUrl(e.target.value)} placeholder="https://..." className={inputCls} />
                )}
                {guestPhotoUrl && (
                  <img src={guestPhotoUrl} alt="preview" className="mt-2 h-24 rounded-xl object-cover" />
                )}
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-terra text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-terra-light transition-colors"
              >
                <Send size={14} /> Pošalji poruku
              </button>
            </form>
          </div>

          {/* Guest posts list */}
          {guestPosts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-linen">
              <p className="text-3xl mb-2">💌</p>
              <p className="font-display font-semibold text-ink-light">Nema poruka</p>
              <p className="text-sm text-mist mt-1">Porodica i prijatelji mogu ostaviti poruke ovde</p>
            </div>
          ) : (
            <div className="space-y-3">
              {guestPosts.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-linen">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 bg-terra/15 rounded-full flex items-center justify-center text-sm font-bold text-terra">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-ink text-sm">{p.name}</span>
                          <span className="text-xs text-mist ml-2">{formatDate(p.date)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-ink-light leading-relaxed ml-10 whitespace-pre-wrap">{p.message}</p>
                      {p.photoUrl && (
                        <img src={p.photoUrl} alt="" className="mt-2 ml-10 rounded-xl max-h-48 object-cover" />
                      )}
                    </div>
                    <button onClick={() => deleteGuestPost(trip.id, p.id)} className="text-mist hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
