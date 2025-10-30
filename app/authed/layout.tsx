'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ensurePushSubscription } from '@/lib/pushClient';

/* ---------- helpers ---------- */
function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isStandalone() {
  if (typeof window === 'undefined') return false;
  // iOS: navigator.standalone; others: display-mode media query
  // @ts-ignore
  const iosStandalone = !!window.navigator?.standalone;
  const displayModeStandalone =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;
  return !!(iosStandalone || displayModeStandalone);
}

/* ---------- User menu (desktop) ---------- */
function UserMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState('U');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const name =
        (data?.user?.user_metadata?.full_name as string) ||
        (data?.user?.email as string) ||
        'User';
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
          <Link href="/authed/healthandmind" className="block px-4 py-2.5 text-sm hover:bg-pink-50" onClick={() => setOpen(false)}>
            Health &amp; Mind
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

/* ---------- Layout ---------- */
export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  // push state
  const [showPushCta, setShowPushCta] = useState(false);
  const [pushMsg, setPushMsg] = useState<string | null>(null);
  const [iosNeedsPwa, setIosNeedsPwa] = useState(false);

  // Auth gate
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        const next = encodeURIComponent(pathname || '/authed');
        router.replace(`/login?next=${next}`);
      } else {
        setChecked(true);
      }
    })();
  }, [router, pathname]);

  // Decide when to show CTA / hint, and auto-register if already granted
  useEffect(() => {
    if (!checked) return;
    if (typeof window === 'undefined') return;

    const hasNotifications = 'Notification' in window;
    const hasSW = 'serviceWorker' in navigator;

    if (!hasNotifications || !hasSW) {
      setShowPushCta(false);
      setIosNeedsPwa(false);
      return;
    }

    if (isIOS() && !isStandalone()) {
      // iOS needs PWA install to enable push
      setIosNeedsPwa(true);
      setShowPushCta(false);
      return;
    }

    setIosNeedsPwa(false);

    if (Notification.permission === 'granted') {
      // User already granted → ensure subscription silently
      void enablePush(true);
      setShowPushCta(false);
    } else {
      setShowPushCta(true);
    }
  }, [checked]);

  async function enablePush(silent = false) {
    if (!silent) setPushMsg(null);
    try {
      const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;
      if (!pub) {
        setPushMsg('Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY.');
        return;
      }
      const res = await ensurePushSubscription(pub);
      if (res.ok) {
        setShowPushCta(false);
        if (!silent) setPushMsg('Push reminders enabled ✓');
      } else {
        if (!silent) setPushMsg(res.reason || 'Could not enable reminders.');
      }
    } catch (e: any) {
      if (!silent) setPushMsg(e?.message || 'Push failed.');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/welcome');
  }

  const nav = useMemo(
    () => [
      { href: '/authed', label: 'Home' },
      { href: '/authed/birthcontrol', label: 'Birth Control' },
      { href: '/authed/drug-interactions', label: 'Drug Interactions' },
      { href: '/authed/common-side-effects', label: 'Common & Adverse Side Effects' },
      { href: '/authed/contraindications', label: 'Contraindications' },
      // Health & Mind intentionally NOT here (moved under My Account)
      { href: '/authed/faq-pills', label: 'FAQs' },
      { href: '/authed/missed-pills', label: 'If You Miss Pills' },
    ],
    []
  );

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl h-20 px-4 flex items-center gap-3">
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

          {/* CENTER: nav */}
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

          {/* RIGHT: iOS hint / enable push / user */}
          <div className="ml-auto hidden md:flex items-center gap-3">
            {iosNeedsPwa && (
              <div className="text-xs sm:text-sm rounded-lg border border-pink-300 text-pink-800 px-3 py-1.5 bg-pink-50">
                Install SheSync to enable notifications:&nbsp;
                <span className="font-semibold">Share → “Add to Home Screen”</span>
              </div>
            )}
            {showPushCta && (
              <button
                onClick={() => enablePush(false)}
                className="text-xs sm:text-sm rounded-lg border border-emerald-400 text-emerald-700 px-3 py-1.5 hover:bg-emerald-50"
              >
                Enable reminders
              </button>
            )}
            <UserMenu onSignOut={signOut} />
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

              <div className="my-2 border-t" />

              {/* iOS PWA hint (mobile) */}
              {iosNeedsPwa && (
                <div className="py-2 text-xs text-pink-800">
                  Install for notifications: <span className="font-semibold">Share → Add to Home Screen</span>
                </div>
              )}

              {/* Enable push button (mobile) */}
              {showPushCta && (
                <button
                  onClick={() => {
                    enablePush(false);
                    setOpen(false);
                  }}
                  className="py-2 text-sm text-emerald-700"
                >
                  Enable reminders
                </button>
              )}

              {/* Account-only items (no Eco; Health & Mind lives here) */}
              <Link href="/authed/account" onClick={() => setOpen(false)} className="py-2 text-sm text-gray-800">
                My Account
              </Link>
              <Link href="/authed/cycle" onClick={() => setOpen(false)} className="py-2 text-sm text-gray-800">
                Calendar
              </Link>
              <Link href="/authed/healthandmind" onClick={() => setOpen(false)} className="py-2 text-sm text-gray-800">
                Health &amp; Mind
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="text-left py-2 text-sm text-pink-600"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* tiny feedback line for push enable */}
      {pushMsg && <div className="bg-emerald-50 text-emerald-800 text-sm text-center py-2">{pushMsg}</div>}

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
