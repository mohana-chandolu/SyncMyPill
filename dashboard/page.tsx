'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) router.push('/auth');
      else setUser(data.user);
    }
    loadUser();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  if (!user) return <p>Loading...</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>Welcome, {user.email}</h1>
      <button onClick={handleSignOut}>Sign out</button>
    </main>
  );
}
