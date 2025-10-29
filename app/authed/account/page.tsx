'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Basic
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Pill
  const [pillType, setPillType] = useState<'combined' | 'progestin_only' | 'emergency'>('combined');
  const [pillTime, setPillTime] = useState('08:00');
  const [packStart, setPackStart] = useState('');
  const [active, setActive] = useState(21);
  const [inactive, setInactive] = useState(7);

  // Notifications (kept here, no separate tab)
  const [beforeMin, setBeforeMin] = useState(10);
  const [afterMin, setAfterMin] = useState(15);
  const [repeatEveryMin, setRepeatEveryMin] = useState(10);
  const [repeatCount, setRepeatCount] = useState(2);

  // Local timezone (for display only)
  const tzGuess = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const m: any = data?.user?.user_metadata || {};
      setFullName(m.full_name || '');
      setPhone(m.phone || '');
      setPillType(m.pill_type || 'combined');
      setPillTime((m.pill_time || '08:00:00').slice(0, 5));
      setPackStart(m.pack_start || '');
      setActive(m.active_pills ?? 21);
      setInactive(m.inactive_pills ?? 7);
      setBeforeMin(m.notif_before_min ?? 10);
      setAfterMin(m.notif_after_min ?? 15);
      setRepeatEveryMin(m.notif_repeat_every_min ?? 10);
      setRepeatCount(m.notif_repeat_count ?? 2);
      setLoading(false);
    })();
  }, []);

  async function save() {
    setMsg(null);
    setSaving(true);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone,
        pill_type: pillType,
        pill_time: pillTime + ':00',
        pack_start: packStart || null,
        active_pills: Number(active),
        inactive_pills: Number(inactive),
        notif_before_min: Number(beforeMin),
        notif_after_min: Number(afterMin),
        notif_repeat_every_min: Number(repeatEveryMin),
        notif_repeat_count: Number(repeatCount),
        timezone: tz,
      },
    });
    setSaving(false);
    setMsg(error ? error.message : 'Saved ✓');
  }

  if (loading) {
    return <main className="min-h-screen bg-pink-50 px-4 py-10">Loading…</main>;
  }

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-10">
      <div className="mx-auto max-w-2xl bg-white/80 backdrop-blur rounded-3xl shadow p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold mb-4">My Account</h1>

        {/* Basic info */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Your info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-pink-300 px-3 py-2 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone (optional)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123-456-7890"
                className="w-full rounded-lg border border-pink-300 px-3 py-2 placeholder-gray-500"
              />
            </div>
          </div>
        </section>

        {/* Pill settings */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Pill settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Pill type</label>
              <select
                value={pillType}
                onChange={(e) => setPillType(e.target.value as any)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              >
                <option value="combined">Combined pill</option>
                <option value="progestin_only">Progestin-only pill</option>
                <option value="emergency">Emergency pill</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Daily pill time</label>
              <input
                type="time"
                value={pillTime}
                onChange={(e) => setPillTime(e.target.value)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Pack start date</label>
              <input
                type="date"
                value={packStart}
                onChange={(e) => setPackStart(e.target.value)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Active pills (days)</label>
              <input
                type="number"
                min={1}
                value={active}
                onChange={(e) => setActive(+e.target.value)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Inactive pills (days)</label>
              <input
                type="number"
                min={0}
                value={inactive}
                onChange={(e) => setInactive(+e.target.value)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Notifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Before reminder (mins)</label>
              <input
                type="number"
                min={0}
                value={beforeMin}
                onChange={(e) => setBeforeMin(+e.target.value)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">After reminder (mins)</label>
              <input
                type="number"
                min={0}
                value={afterMin}
                onChange={(e) => setAfterMin(+e.target.value)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Repeat every (mins)</label>
              <input
                type="number"
                min={0}
                value={repeatEveryMin}
                onChange={(e) => setRepeatEveryMin(+e.target.value)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Repeat count</label>
              <input
                type="number"
                min={0}
                value={repeatCount}
                onChange={(e) => setRepeatCount(+e.target.value)}
                className="w-full rounded-lg border border-pink-300 px-3 py-2"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Timezone detected: <span className="font-medium">{tzGuess}</span>
          </p>
        </section>

        {/* Save */}
        <button
          onClick={save}
          disabled={saving}
          className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 text-white py-3 font-semibold transition"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        {msg && <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>}
      </div>
    </main>
  );
}


