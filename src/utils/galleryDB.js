const DB_NAME = 'moj-meni-gallery'
const DB_VERSION = 1
const STORE = 'photos'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('tripId', 'tripId', { unique: false })
      }
    }
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = () => reject(req.error)
  })
}

export async function galleryGetByTrip(tripId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).index('tripId').getAll(tripId)
    req.onsuccess = () => resolve(req.result.sort((a, b) => new Date(a.date) - new Date(b.date)))
    req.onerror = () => reject(req.error)
  })
}

export async function galleryAdd(photo) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).add(photo)
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}

export async function galleryDelete(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}

export async function galleryClearTrip(tripId) {
  const photos = await galleryGetByTrip(tripId)
  await Promise.all(photos.map((p) => galleryDelete(p.id)))
}
