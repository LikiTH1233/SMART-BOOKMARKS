'use client'
import { supabase } from '../../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Dashboard({ session }) {
  const [bookmarks, setBookmarks] = useState([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  async function fetchBookmarks() {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })
    setBookmarks(data || [])
  }

  useEffect(() => {
    fetchBookmarks()
    const channel = supabase
      .channel('realtime-bookmarks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, fetchBookmarks)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function addBookmark() {
    if (!url || !title) return
    await supabase.from('bookmarks').insert([{ url, title, user_id: session.user.id }])
    setUrl('')
    setTitle('')
  }

  async function deleteBookmark(id) {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">🔖 My Bookmarks</h1>
          <button onClick={logout} className="text-red-400">Logout</button>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow mb-8 flex gap-3">
          <input
            placeholder="Title"
            className="flex-1 p-3 rounded bg-slate-700"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            placeholder="URL"
            className="flex-1 p-3 rounded bg-slate-700"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <button
            onClick={addBookmark}
            className="bg-green-500 px-6 rounded font-bold"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {bookmarks.map(b => (
            <div key={b.id} className="bg-slate-800 p-4 rounded flex justify-between items-center">
              <a href={b.url} target="_blank" className="text-blue-400">{b.title}</a>
              <button onClick={() => deleteBookmark(b.id)} className="text-red-400 text-xl">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
