'use client'

import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'
import Dashboard from './dashboard/page'

export default function Home() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (!session) {
    return (
      <div className="flex flex-col items-center mt-40">
        <h1 className="text-3xl mb-6 font-bold">Smart Bookmark App</h1>
        <button
         onClick={() =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return <Dashboard session={session} />
}
