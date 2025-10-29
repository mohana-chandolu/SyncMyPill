'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/authed';

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6">
      <section className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center">
          Already a <span className="text-pink-600">She</span>
          <span className="text-green-600">Sync</span> member?
        </h1>
        <p className="mt-1 text-center text-gray-600 text-sm">Log in with your credentials</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-pink-300 bg-white/90 px-3 py-2 text-base
                         focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400
                         placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-pink-300 bg-white/90 px-3 py-2 text-base
                           focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400
                           placeholder-gray-500"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-2 my-1 px-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white py-2.5 font-semibold transition"
          >
            {loading ? 'Please wait…' : 'Sign in'}
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-sm text-rose-600">{msg}</p>}

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => router.push('/signup')}
            className="text-pink-600 hover:underline"
          >
            Don’t have an account? Sign up
          </button>
          <span className="mx-2 text-gray-400">•</span>
          <a
            href="/reset-password"
            className="text-gray-700 hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </section>
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
