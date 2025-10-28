'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  // ❗ If you want these pages locked to signed-in users, keep this guard.
  // If you want them public, delete this effect.
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        const next = encodeURIComponent(pathname || '/home');
        router.replace(`/login?next=${next}`);
      } else {
        setChecked(true);
      }
    })();
  }, [router, pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/welcome');
  }

  const nav = useMemo(() => ([
    { href: '/home',                 label: 'Home' },
    { href: '/about',                label: 'About' },
    { href: '/common-side-effects',  label: 'Common & Adverse Side Effects' },
    { href: '/contraindications',    label: 'Contraindications' },
    { href: '/faq-pills',            label: 'FAQ: Birth Control Pills' },
    { href: '/missed-pills',         label: 'If You Miss Pills' },
  ]), []);

  if (!checked) return null; // while auth check runs

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 flex items-center h-14 justify-between">
          {/* Logo left */}
          <Link href="/home" className="flex items-center gap-2 font-semibold">
            <img src="/shesync-logo.png" alt="SheSync" className="h-7 w-7 rounded-full" />
            <span className="text-gray-900">SheSync</span>
          </Link>

          {/* Desktop menu (right) */}
          <nav className="hidden md:flex items-center gap-6">
            {nav.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm hover:text-pink-600 transition ${
                  pathname === n.href ? 'text-pink-600 font-medium' : 'text-gray-800'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="text-sm border border-pink-500 text-pink-600 rounded px-3 py-1.5 hover:bg-pink-50"
            >
              Sign out
            </button>
          </nav>

          {/* Mobile hamburger (right) */}
          <button
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded hover:bg-pink-100"
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
          >
            <span className="block h-0.5 w-5 bg-gray-900 relative">
              <span className="absolute -top-2 h-0.5 w-5 bg-gray-900" />
              <span className="absolute  top-2 h-0.5 w-5 bg-gray-900" />
            </span>
          </button>
        </div>

        {/* Mobile slide-down menu */}
        {open && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 flex flex-col gap-2">
              {nav.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`py-2 text-sm ${
                    pathname === n.href ? 'text-pink-600 font-medium' : 'text-gray-800'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <button
                onClick={() => { setOpen(false); signOut(); }}
                className="text-left py-2 text-sm text-pink-600"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
