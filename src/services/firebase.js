import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Cek apakah konfigurasi Firebase sudah diset
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your-api-key'
)

let db = null

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    console.info('🔥 Firebase Firestore connected successfully!')
  } catch (err) {
    console.warn('⚠️ Gagal inisialisasi Firebase, beralih ke LocalStorage fallback:', err)
  }
} else {
  console.info('ℹ️ Konfigurasi Firebase belum diisi di .env. Menggunakan LocalStorage fallback.')
}

const STORAGE_KEY = 'fero_time_capsule_comments'

const DEFAULT_COMMENTS = [
  {
    id: 'default-1',
    author: 'Aika 🌸',
    text: 'Halo Fero! Semangat terus buat project-project kerennya yaa! Jangan lupa istirahat!',
    displayDate: 'Hari ini, 14:20'
  },
  {
    id: 'default-2',
    author: 'Kira ⚡',
    text: 'Web karya & visual neumorphism-nya juara banget bro, clean parah!',
    displayDate: 'Kemarin, 21:05'
  },
  {
    id: 'default-3',
    author: 'Anonim 🕵️',
    text: 'Ferooo, titip jejak di mesin waktu ya! Semoga sehat dan sukses selalu :3',
    displayDate: 'Kemarin, 18:30'
  },
  {
    id: 'default-4',
    author: 'Pengelana Waktu 🚀',
    text: 'Pesan ini dikirim dari masa depan: ide-ide kamu bakal kejadian nyata semua!',
    displayDate: '3 hari lalu'
  }
]

export const timeCapsuleService = {
  // Ambil semua komentar
  async getComments() {
    if (db) {
      try {
        const commentsRef = collection(db, 'comments')
        const q = query(commentsRef, orderBy('createdAt', 'desc'), limit(100))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          return snapshot.docs.map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              author: data.author || 'Anonim 🕵️',
              text: data.text || '',
              displayDate: data.displayDate || 'Waktu terlampir',
              createdAt: data.createdAt?.toDate?.() || new Date()
            }
          })
        }
        return DEFAULT_COMMENTS
      } catch (err) {
        console.warn('Error fetching from Firestore, falling back to LocalStorage:', err)
      }
    }

    // Fallback: LocalStorage
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      return stored.length > 0 ? stored : DEFAULT_COMMENTS
    } catch {
      return DEFAULT_COMMENTS
    }
  },

  // Tambah komentar baru
  async addComment(author, text) {
    const authorName = author?.trim() || 'Anonim 🕵️'
    const commentText = text?.trim() || ''

    const now = new Date()
    const displayDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    if (db) {
      try {
        const commentsRef = collection(db, 'comments')
        const docRef = await addDoc(commentsRef, {
          author: authorName,
          text: commentText,
          displayDate: displayDate,
          createdAt: serverTimestamp()
        })
        return {
          id: docRef.id,
          author: authorName,
          text: commentText,
          displayDate: displayDate
        }
      } catch (err) {
        console.warn('Gagal simpan ke Firestore, simpan ke LocalStorage:', err)
      }
    }

    // Fallback simpan ke LocalStorage
    const newEntry = {
      id: Date.now().toString(),
      author: authorName,
      text: commentText,
      displayDate: displayDate,
      timestamp: now.toISOString()
    }

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      existing.unshift(newEntry)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    } catch (e) {
      console.warn('Gagal simpan ke localStorage:', e)
    }

    return newEntry
  },

  // Realtime subscription (Pesan baru langsung tersinkronisasi tanpa duplikasi)
  subscribeComments(callback) {
    if (db) {
      try {
        const commentsRef = collection(db, 'comments')
        const q = query(commentsRef, orderBy('createdAt', 'desc'), limit(100))

        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(doc => {
              const data = doc.data()
              return {
                id: doc.id,
                author: data.author || 'Anonim 🕵️',
                text: data.text || '',
                displayDate: data.displayDate || 'Waktu terlampir',
                createdAt: data.createdAt?.toDate?.() || new Date()
              }
            })
            callback(list)
          } else {
            callback(DEFAULT_COMMENTS)
          }
        }, (error) => {
          console.warn('Firestore subscription error:', error)
        })

        return unsubscribe
      } catch (err) {
        console.warn('Realtime error:', err)
      }
    }

    return () => {}
  }
}
