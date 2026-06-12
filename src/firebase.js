import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Paste your Firebase config here (from Firebase console → Project Settings → Your apps)
const firebaseConfig = {
  apiKey: 'PASTE_HERE',
  authDomain: 'PASTE_HERE',
  projectId: 'PASTE_HERE',
  storageBucket: 'PASTE_HERE',
  messagingSenderId: 'PASTE_HERE',
  appId: 'PASTE_HERE',
}

const isConfigured = firebaseConfig.apiKey !== 'PASTE_HERE'

export let db = null

if (isConfigured) {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
}

export { isConfigured }
