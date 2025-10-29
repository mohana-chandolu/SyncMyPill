'use client';

import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';

type SearchParams = { next?: string };

function SignUpInner({ searchParams }: { searchParams: SearchParams }) {
  const next = searchParams?.next || '/authed';

  // Auth fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [phone, setPhone] = useState('');

  // Notification prefs
  const [notifSecondary, setNotifSecondary] = useState<string[]>([]); // push | sms | email | all

  // Pill fields
  const [pillTime, setPillTime] = useState('08:00');
  const [pillType, setPillType] = useState('combined'); // combined | progestin_only | emergency
  const [packStart, setPackStart] = useState('');
  const [activePills, setActivePills] = useState(21);
  const [inactivePills, setInactivePills] = useState(7);
  const [remindPlacebo, setRemindPlacebo] = useState(true);
  const [sideEffects, setSideEffects] = useState('');

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggle(k: string) {
    setNotifSecondary((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!fullName || !email || !pwd) {
      setMsg('Full name, email, and password are required.');
      return;
    }

    setLoading(true);

    // ✅ Sign up ONLY — put all custom fields in user metadata to avoid RLS issues
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: {
        data: {
          full_name: fullName,
          phone,
          notif_primary: 'alarm',
          notif_secondary: notifSecondary, // array OK
          pill_time: pillTime + ':00',
          pill_type: pillType,
          pack_start: packStart || null,
          active_pills: activePills,
          inactive_pills: inactivePills,
          remind_placebo: remindPlacebo,
          side_effects: sideEffects || null,
        },
        // If you use email confirmations, uncomment this:
        // emailRedirectTo: `${location.origin}${next}`,
      },
    });

    setLoading(false);

    if (error) {
      setMsg(error.message || 'Sign up failed.');
      return;
    }

    // If confirmations are ON, there may be no session yet
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      setMsg('Check your email to confirm your account, then sign in.');
      return;
    }

    // Logged in immediately → go to next
    window.location.replace(next);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-50 px-4 py-16 sm:px-6 sm:py-20">
      <section className="w-full max-w-md sm:max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Create your <span className="text-pink-600">She</span>
          <span className="text-green-600">Sync</span> account
        </h1>

        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name */}
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1 text-gray-700">Full name</label>
            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2 placeholder-gray-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email / phone */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2 placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700">Phone (optional)</label>
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2 placeholder-gray-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2 placeholder-gray-500"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>

          {/* Notification preference */}
          <div className="sm:col-span-2">
            <label className="block text-sm mb-2 text-gray-700">Notification preferences</label>
            <div className="text-sm text-gray-700 mb-2">Primary: Alarm (always on)</div>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'push', label: 'Push notification' },
                { key: 'sms', label: 'SMS message' },
                { key: 'email', label: 'Email' },
                { key: 'all', label: 'All of the above' },
              ].map((opt) => (
                <label key={opt.key} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifSecondary.includes(opt.key)}
                    onChange={() => toggle(opt.key)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Daily pill time */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Daily pill time</label>
            <input
              type="time"
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2"
              value={pillTime}
              onChange={(e) => setPillTime(e.target.value)}
            />
          </div>

          {/* Pill type */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Pill type</label>
            <select
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2"
              value={pillType}
              onChange={(e) => setPillType(e.target.value)}
            >
              <option value="combined">Combined pill</option>
              <option value="progestin_only">Progestin-only pill</option>
              <option value="emergency">Emergency pill</option>
            </select>
          </div>

          {/* Start date */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Start date of current pack</label>
            <input
              type="date"
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2"
              value={packStart}
              onChange={(e) => setPackStart(e.target.value)}
            />
          </div>

          {/* Active / inactive pills */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Active pills in pack</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2"
              value={activePills}
              onChange={(e) => setActivePills(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700">Inactive (placebo) pills</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2"
              value={inactivePills}
              onChange={(e) => setInactivePills(Number(e.target.value))}
            />
          </div>

          {/* Remind placebo */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Remind for placebo pills?</label>
            <select
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2"
              value={remindPlacebo ? 'yes' : 'no'}
              onChange={(e) => setRemindPlacebo(e.target.value === 'yes')}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Side effects */}
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1 text-gray-700">Symptoms / side effects (optional)</label>
            <textarea
              rows={3}
              placeholder="e.g., nausea, mood changes, cramps…"
              className="w-full rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 px-3 py-2 placeholder-gray-500"
              value={sideEffects}
              onChange={(e) => setSideEffects(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 font-medium transition"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </div>
        </form>

        {msg && <p className="mt-4 text-sm text-center text-rose-600">{msg}</p>}

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <a href={`/login?next=${encodeURIComponent('/authed')}`} className="text-pink-600 hover:underline">
            Sign in
          </a>
        </p>
      </section>
    </main>
  );
}

export default function SignUpPage(props: any) {
  return (
    <Suspense fallback={null}>
      <SignUpInner {...props} />
    </Suspense>
  );
}
