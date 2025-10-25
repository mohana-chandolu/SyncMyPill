'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAfterLogin = searchParams.get('next') || '/dashboard';

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [mode, setMode] = useState<'signIn'|'signUp'>('signIn');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);

  // If already logged in, bounce to next
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.replace(nextAfterLogin);
    })();
  }, [router, nextAfterLogin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!email || !pwd) {
      setMsg('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signUp') {
        const { error } = await supabase.auth.signUp({ email, password: pwd });
        if (error) throw error;
        // (Optional) some setups require email confirm. You can show a message, or sign in immediately.
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: pwd });
        if (signInErr) throw signInErr;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
        if (error) throw error;
      }

      // ✅ Redirect only AFTER successful auth
      router.push(nextAfterLogin);
    } catch (err: any) {
      setMsg(err?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Sign {mode === 'signIn' ? 'In' : 'Up'}</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white"
        >
          {loading ? 'Please wait…' : (mode === 'signIn' ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      {msg && <p className="text-sm text-red-500">{msg}</p>}

      <button
        onClick={() => setMode(m => (m === 'signIn' ? 'signUp' : 'signIn'))}
        className="text-sm underline"
      >
        {mode === 'signIn' ? "Don't have an account? Sign up" : 'Have an account? Sign in'}
      </button>
    </main>
  );
}
