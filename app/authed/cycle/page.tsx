'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

// --- helpers ---
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function ymd(d: Date) { return d.toISOString().slice(0, 10); } // "YYYY-MM-DD"
function fmtShort(d: Date) { return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }

function calcStreak(dates: string[]) {
  const set = new Set(dates);
  let s = 0;
  const d = new Date();
  while (set.has(ymd(d))) { s++; d.setDate(d.getDate() - 1); }
  return s;
}

export default function CyclePage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  // metadata
  const [pillTime, setPillTime] = useState('08:00');
  const [packStart, setPackStart] = useState<string | null>(null);
  const [active, setActive] = useState(21);
  const [inactive, setInactive] = useState(7);
  const [intakeDates, setIntakeDates] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  const todayStr = useMemo(() => ymd(new Date()), []);
  const takenSet = useMemo(() => new Set(intakeDates), [intakeDates]);

  // Build cycle days (active first, then inactive)
  const days = useMemo(() => {
    const start = packStart ? new Date(packStart) : new Date(); // fallback: today
    const arr: { date: string; kind: 'active' | 'inactive' }[] = [];
    for (let i = 0; i < active; i++) arr.push({ date: ymd(addDays(start, i)), kind: 'active' });
    for (let j = 0; j < inactive; j++) arr.push({ date: ymd(addDays(start, active + j)), kind: 'inactive' });
    return arr;
  }, [packStart, active, inactive]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const m: any = data?.user?.user_metadata || {};
      setPillTime((m.pill_time || '08:00:00').slice(0, 5));
      setPackStart(m.pack_start || null);
      setActive(m.active_pills ?? 21);
      setInactive(m.inactive_pills ?? 7);

      const dates: string[] = Array.isArray(m.intake_dates) ? m.intake_dates : [];
      setIntakeDates(dates);
      setStreak(m.streak_days ?? calcStreak(dates));
      setLoading(false);
    })();
  }, []);

  async function markTakenToday() {
    setMsg(null);
    if (takenSet.has(todayStr)) { setMsg('Already marked for today ✓'); return; }

    // Update local first (snappy UI)
    const next = [...intakeDates, todayStr].slice(-60); // keep last 60 days
    const nextStreak = calcStreak(next);
    setIntakeDates(next);
    setStreak(nextStreak);

    // Persist in Auth metadata
    const { error } = await supabase.auth.updateUser({
      data: { intake_dates: next, streak_days: nextStreak }
    });
    if (error) setMsg(error.message);
    else setMsg('Marked taken for today ✓');
  }

  if (loading) return <main className="min-h-screen bg-pink-50 px-4 py-8">Loading…</main>;

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header / actions */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold">Your Birth Control Pill Cycle</h1>
            <p className="text-gray-600">
              Dose time: <span className="font-semibold">{pillTime}</span> •
              {' '}Active: <span className="font-semibold">{active}</span> •
              {' '}Inactive: <span className="font-semibold">{inactive}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-emerald-700">{streak}</div>
              <div className="text-xs text-gray-600 -mt-1">day streak</div>
            </div>
            <button
              onClick={markTakenToday}
              disabled={takenSet.has(todayStr)}
              className={`rounded-xl px-4 py-2 font-semibold transition
                ${takenSet.has(todayStr)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
            >
              {takenSet.has(todayStr) ? 'Taken today ✓' : 'Mark taken today'}
            </button>
          </div>
        </div>

        {/* 28-day grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((d, i) => {
            const isToday = d.date === todayStr;
            const taken = takenSet.has(d.date);
            const base = d.kind === 'active'
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-rose-50 border-rose-200';
            return (
              <div
                key={i}
                className={`rounded-xl p-3 text-center text-sm border ${base}
                            ${isToday ? 'ring-2 ring-pink-400' : ''}`}
              >
                <div className="font-semibold">{fmtShort(new Date(d.date))}</div>
                <div className={`mt-1 text-xs ${d.kind === 'active' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {d.kind === 'active' ? 'Active pill' : 'Inactive pill'}
                </div>

                {/* Taken badge */}
                {taken && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/10 text-emerald-800 px-2 py-0.5 text-xs font-semibold">
                    ✓ Taken
                  </div>
                )}

                {/* Today hint if not yet taken */}
                {isToday && !taken && (
                  <div className="mt-2 text-[11px] text-gray-600">Today</div>
                )}
              </div>
            );
          })}
        </div>

        {msg && <p className="mt-4 text-center text-sm text-gray-700">{msg}</p>}

        <p className="mt-6 text-center text-gray-600">
          After the inactive pills, start a new pack immediately to stay protected.
        </p>
      </div>
    </main>
  );
}
