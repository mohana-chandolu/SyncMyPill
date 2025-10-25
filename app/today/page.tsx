// app/today/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TodayPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        // if not logged in, go back to login
        router.push('/auth')
      } else {
        setUser(data.user)
      }
      setLoading(false)
    }
    fetchUser()
  }, [router])
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/auth');
  }
// button: <button onClick={handleSignOut}>Sign out</button>


  if (loading) {
    return (
      <main className="p-6">
        <p>Loading your daily checklist...</p>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Today’s Pill Checklist</h1>
      <p className="text-gray-600">
        Hello {user?.email}! Here you can view and mark today’s medications.
      </p>

      {/* temporary placeholders for now */}
      <ul className="space-y-2">
        <li className="border p-2 rounded-md flex items-center justify-between">
          <span>💊 Morning dose</span>
          <button className="bg-green-500 text-white px-3 py-1 rounded">Mark as taken</button>
        </li>
        <li className="border p-2 rounded-md flex items-center justify-between">
          <span>💊 Afternoon dose</span>
          <button className="bg-green-500 text-white px-3 py-1 rounded">Mark as taken</button>
        </li>
        <li className="border p-2 rounded-md flex items-center justify-between">
          <span>💊 Night dose</span>
          <button className="bg-green-500 text-white px-3 py-1 rounded">Mark as taken</button>
        </li>
      </ul>
    </main>
  )
}
