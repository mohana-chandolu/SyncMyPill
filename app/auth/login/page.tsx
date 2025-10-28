'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/today';

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // already logged in? go to next
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.replace(next);
    })();
  }, [router, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!email || !pwd) return setMsg('Please enter email and password.');

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setLoading(false);

    if (error) setMsg(error.message);
    else router.replace(next);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-50 px-6 py-12">
      <section className="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-2xl shadow p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Already a <span className="text-pink-600">SheSync</span> member?
        </h1>
        <p className="text-sm text-gray-600 mb-6">Log in with your credentials.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-green-600 bg-white text-green-600 hover:bg-green-50 transition px-4 py-2 font-medium"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}

        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup?next=/today" className="text-pink-600 hover:underline">
            Sign up
          </Link>
        </div>
      </section>
    </main>
  );
}
