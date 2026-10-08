import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const LOCAL_STORAGE_KEY = 'fero_time_capsule_comments'

const DEFAULT_MOCK_COMMENTS = [
  {
    id: 1,
    author: 'Aika 🌸',
    message: 'Halo Fero! Semangat terus buat project-project kerennya yaa! Jangan lupa istirahat!',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 2,
    author: 'Kira ⚡',
    message: 'Web karya & visual neumorphism-nya juara banget bro, clean parah!',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 3,
    author: 'Anonim 🕵️',
    message: 'Ferooo, titip jejak di mesin waktu ya! Semoga sehat dan sukses selalu :3',
    created_at: new Date(Date.now() - 3600000 * 26).toISOString()
  },
  {
    id: 4,
    author: 'Pengelana Waktu 🚀',
    message: 'Pesan ini dikirim dari masa depan: ide-ide kamu bakal kejadian nyata semua!',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  }
]

// Service untuk mengambil dan menyimpan pesan Mesin Waktu
export const timeCapsuleService = {
  // Ambil semua pesan
  async getMessages() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('time_capsule_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) return data
      console.warn('Gagal fetch Supabase, fallback ke local:', error)
    }

    try {
      const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null')
      if (local && local.length > 0) return local
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_COMMENTS))
      return DEFAULT_MOCK_COMMENTS
    } catch {
      return DEFAULT_MOCK_COMMENTS
    }
  },

  // Simpan pesan baru
  async addMessage(author, message) {
    const newEntry = {
      author: author.trim() || 'Anonim 🕵️',
      message: message.trim(),
      created_at: new Date().toISOString()
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('time_capsule_messages')
        .insert([newEntry])
        .select()
        .single()

      if (!error && data) return data
      console.warn('Gagal insert Supabase, fallback ke local:', error)
    }

    // LocalStorage fallback
    const local = await this.getMessages()
    const itemWithId = { id: Date.now(), ...newEntry }
    const updated = [itemWithId, ...local]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    return itemWithId
  },

  // Subscribe realtime
  subscribe(callback) {
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public:time_capsule_messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'time_capsule_messages' },
          (payload) => callback(payload.new)
        )
        .subscribe()

      return () => supabase.removeChannel(channel)
    }
    return () => {}
  }
}
