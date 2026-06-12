import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Paste your Firebase config here (from Firebase console → Project Settings → Your apps)
const firebaseConfig = {
  apiKey: 'AIzaSyAwzsPDHFb7w_OnSBmR4hRtC1T39yO1I-g',
  authDomain: 'moj-meni.firebaseapp.com',
  projectId: 'moj-meni',
  storageBucket: 'moj-meni.firebasestorage.app',
  messagingSenderId: '107902860248',
  appId: '1:107902860248:web:7bf0152791e82df2ddd0ad',
}

const isConfigured = firebaseConfig.apiKey !== 'PASTE_HERE'

export let db = null

if (isConfigured) {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
}

export { isConfigured }
