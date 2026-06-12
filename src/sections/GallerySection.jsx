import { useState, useRef } from 'react'
import { Upload, Trash2, X, ZoomIn } from 'lucide-react'
import useStore from '../store/useStore'

function compressImage(file, cb) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 1200
      let { width: w, height: h } = img
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round((h * MAX) / w); w = MAX }
        else { w = Math.round((w * MAX) / h); h = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      cb(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

export default function GallerySection({ trip }) {
  const addGalleryPhoto = useStore((s) => s.addGalleryPhoto)
  const deleteGalleryPhoto = useStore((s) => s.deleteGalleryPhoto)

  const gallery = trip.gallery || []
  const [lightbox, setLightbox] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  function processFiles(files) {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!arr.length) return
    setUploading(true)
    let done = 0
    arr.forEach((file) => {
      compressImage(file, (url) => {
        addGalleryPhoto(trip.id, { url, caption: '', filename: file.name })
        done++
        if (done === arr.length) setUploading(false)
      })
    })
  }

  function handleFileChange(e) {
    processFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const lightboxPhoto = lightbox != null ? gallery[lightbox] : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">📷 Galerija putovanja</h2>
          <p className="text-xs text-mist mt-0.5">{gallery.length} {gallery.length === 1 ? 'fotografija' : 'fotografija'}</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 bg-terra text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-terra-light transition-colors"
        >
          <Upload size={14} /> Dodaj slike
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => gallery.length === 0 && fileRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed transition-all ${dragging ? 'border-terra bg-terra/5 scale-[1.01]' : gallery.length === 0 ? 'border-linen hover:border-terra/40 cursor-pointer' : 'border-transparent'}`}
      >
        {gallery.length === 0 && !uploading && (
          <div className="py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-terra/10 rounded-2xl flex items-center justify-center">
              <Upload size={28} className="text-terra/60" />
            </div>
            <div>
              <p className="font-display font-semibold text-ink-light text-lg">Povucite slike ovde</p>
              <p className="text-sm text-mist mt-1">ili kliknite da izaberete • PNG, JPG, HEIC</p>
              <p className="text-xs text-mist/60 mt-0.5">Možete dodati više slika odjednom</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="py-8 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-terra border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-mist">Kompresovanje i dodavanje...</p>
          </div>
        )}
      </div>

      {/* Photo grid */}
      {gallery.length > 0 && (
        <div className="columns-2 md:columns-3 gap-2 space-y-2">
          {gallery.map((photo, i) => (
            <div key={photo.id} className="break-inside-avoid group relative rounded-xl overflow-hidden shadow-sm cursor-pointer">
              <img
                src={photo.url}
                alt=""
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                onClick={() => setLightbox(i)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => setLightbox(i)} className="w-9 h-9 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <ZoomIn size={16} className="text-ink" />
                </button>
                <button onClick={() => deleteGalleryPhoto(trip.id, photo.id)} className="w-9 h-9 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
            </div>
          ))}
          {/* Upload more tile */}
          <div
            onClick={() => fileRef.current?.click()}
            className="break-inside-avoid h-32 rounded-xl border-2 border-dashed border-linen hover:border-terra/40 flex items-center justify-center cursor-pointer transition-colors group"
          >
            <Upload size={20} className="text-mist group-hover:text-terra transition-colors" />
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <X size={20} className="text-white" />
          </button>
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xl"
            >‹</button>
          )}
          <img src={lightboxPhoto.url} alt="" className="max-h-[90vh] max-w-full rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          {lightbox < gallery.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xl"
            >›</button>
          )}
          <p className="absolute bottom-4 text-white/50 text-sm">{lightbox + 1} / {gallery.length}</p>
        </div>
      )}
    </div>
  )
}
