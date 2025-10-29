'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function UserMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState('U');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const name = (data?.user?.user_metadata?.full_name as string) || (data?.user?.email as string) || 'User';
      setInitial(name.trim().charAt(0).toUpperCase());
    })();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-3 py-1.5
                   text-sm font-medium text-gray-800 hover:bg-pink-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-pink-700 text-sm font-bold">
          {initial}
        </span>
        <span>My Account</span>
        <svg className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 0 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z" clipRule="evenodd"/>
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
          onMouseLeave={() => setOpen(false)}
        >
          <Link href="/authed/account" className="block px-4 py-2.5 text-sm hover:bg-pink-50" onClick={() => setOpen(false)}>
            My Account
          </Link>
          <Link href="/authed/cycle" className="block px-4 py-2.5 text-sm hover:bg-pink-50" onClick={() => setOpen(false)}>
            Calendar
          </Link>
          <Link href="/authed/eco" className="block px-4 py-2.5 text-sm hover:bg-pink-50" onClick={() => setOpen(false)}>
            Eco & Motivation
          </Link>
          <button
            onClick={() => { setOpen(false); onSignOut(); }}
            className="w-full text-left px-4 py-2.5 text-sm text-pink-700 hover:bg-pink-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  // Auth check
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        const next = encodeURIComponent(pathname || '/authed');
        router.replace(`/login?next=${next}`);
      } else setChecked(true);
    })();
  }, [router, pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/welcome');
  }

  const nav = useMemo(() => [
    { href: '/authed', label: 'Home' },
    { href: '/authed/birthcontrol', label: 'Birth Control' },
    { href: '/authed/drug-interactions', label: 'Drug Interactions' },
    { href: '/authed/common-side-effects', label: 'Common & Adverse Side Effects' },
    { href: '/authed/contraindications', label: 'Contraindications' },
    { href: '/authed/healthandmind', label: 'Health & Mind' },
    { href: '/authed/faq-pills', label: 'FAQs' },
    { href: '/authed/missed-pills', label: 'If You Miss Pills' },
  ], []);

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl h-20 px-4 flex items-center">
          {/* LEFT: Logo */}
          <Link href="/authed" className="flex items-center">
            <Image
              src="/logo-transparent.png"
              alt="SheSync"
              width={88}
              height={88}
              className="rounded-full object-contain"
              priority
            />
          </Link>

          {/* CENTER: nav links */}
          <nav className="hidden md:flex flex-1 justify-center gap-6">
            {nav.map((n) => (
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
          </nav>

          {/* RIGHT: User / My Account dropdown */}
          <div className="ml-auto hidden md:flex">
            <UserMenu onSignOut={signOut} />
          </div>

          {/* MOBILE: hamburger */}
          <button
            className="md:hidden ml-auto inline-flex items-center justify-center h-9 w-9 rounded hover:bg-pink-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="block h-0.5 w-5 bg-gray-900 relative">
              <span className="absolute -top-2 h-0.5 w-5 bg-gray-900" />
              <span className="absolute  top-2 h-0.5 w-5 bg-gray-900" />
            </span>
          </button>
        </div>

        {/* MOBILE dropdown */}
        {open && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 flex flex-col gap-2">
              {nav.map((n) => (
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

              <div className="my-2 border-t" />

              {/* Mobile equivalents of the user menu */}
              <Link href="/authed/account" onClick={() => setOpen(false)} className="py-2 text-sm text-gray-800">
                My Account
              </Link>
              <Link href="/authed/cycle" onClick={() => setOpen(false)} className="py-2 text-sm text-gray-800">
                Calendar
              </Link>
              <Link href="/authed/eco" onClick={() => setOpen(false)} className="py-2 text-sm text-gray-800">
                Eco & Motivation
              </Link>
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

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
