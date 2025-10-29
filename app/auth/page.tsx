'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Turn off static pre-render for safety in prod
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// --- Inner component uses the hooks ---
function AuthInner() {
  const router = useRouter();
  const params = useSearchParams();               // ✅ safe inside Suspense
  const next = params.get('next') || '/authed';

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, go to next
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.replace(next);
    })();
  }, [router, next]);

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
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
        if (error) throw error;
      }
      router.replace(next); // go to /today (or whatever ?next= says)
    } catch (err: any) {
      setMsg(err?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sign {mode === 'signIn' ? 'in' : 'up'}</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          className="px-5 py-2 rounded border border-pink-500 text-pink-600 bg-white hover:bg-pink-50 text-sm sm:text-base transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="px-5 py-2 rounded border border-pink-500 text-pink-600 bg-white hover:bg-pink-50 text-sm sm:text-base transition"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <button
          type="submit"
          className="px-5 py-2 rounded border border-greem-500 text-green-600 bg-white hover:bg-green-50 text-sm sm:text-base transition"
          disabled={loading}
        >
          {loading ? 'Please wait…' : mode === 'signIn' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
        className="text-sm underline"
      >
        {mode === 'signIn' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>

      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </main>
  );
}

// --- Page exported with Suspense wrapper ---
export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthInner />
    </Suspense>
  );
}
