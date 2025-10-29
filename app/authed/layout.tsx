'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  // auth gate (keep if you want these pages protected)
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

  const nav = useMemo(() => ([
    { href: '/authed',                label: 'Home' },
    { href: '/authed/birthcontrol',          label: 'Birth Control' },
    { href: '/authed/drug-interactions', label: 'Drug Interactions' },
    { href: '/authed/common-side-effects', label: 'Common & Adverse Side Effects' },
    { href: '/authed/contraindications',   label: 'Contraindications' },
    { href: '/authed/healthandmind',   label: 'Health & Mind' },
    { href: '/authed/faq-pills',           label: 'FAQs' },
    { href: '/authed/missed-pills',        label: 'If You Miss Pills' },
  ]), []);

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl h-14 px-4 flex items-center">
          {/* LEFT: Bigger logo (no text) */}
          <Link href="/authed" className="flex items-center">
            {/* ↑ increase size to 36px */}
            <Image src="/logo-transparent.png" alt="SheSync" width={36} height={36} className="rounded-full" />
          </Link>

          {/* CENTER: nav links */}
          <nav className="hidden md:flex flex-1 justify-center gap-6">
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
          </nav>

          {/* RIGHT: sign out */}
          <div className="ml-auto hidden md:flex">
            <button
              onClick={signOut}
              className="text-sm border border-pink-500 text-pink-600 rounded px-3 py-1.5 hover:bg-pink-50"
            >
              Sign out
            </button>
          </div>

          {/* MOBILE: hamburger */}
          <button
            className="md:hidden ml-auto inline-flex items-center justify-center h-9 w-9 rounded hover:bg-pink-100"
            onClick={() => setOpen(v => !v)}
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

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
