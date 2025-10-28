'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/today';

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.replace(next);
    })();
  }, [router, next]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pwd,
      });
      if (error) throw error;
      router.replace(next);
    } catch (err: any) {
      setMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 text-center p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">
        Already a <span className="text-pink-600 font-bold">SheSync</span> member?
      </h1>
      <p className="text-gray-600 text-sm">Login with your credentials below</p>

      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-pink-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-pink-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <button
          type="submit"
          className="w-full border border-green-600 text-green-600 bg-white rounded-lg py-2 hover:bg-green-50 transition"
          disabled={loading}
        >
          {loading ? 'Please wait…' : 'Sign in'}
        </button>
      </form>

      <button
        onClick={() => router.push('/signup')}
        className="text-sm text-pink-600 underline hover:text-pink-800"
      >
        Don’t have an account? Sign up
      </button>

      {msg && <p className="text-sm text-red-500 mt-2">{msg}</p>}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
