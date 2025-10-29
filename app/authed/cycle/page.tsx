'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ---------- helpers ----------
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

/** count how many intake dates fall within the active window [pack_start, pack_start + active - 1] */
function countTakenInActive(packStart: string | null, active: number, intake: string[]) {
  if (!packStart) return 0;
  const start = new Date(packStart);
  const end = addDays(start, active); // exclusive upper bound
  const sStr = ymd(start);
  const eStr = ymd(addDays(start, active - 1));
  const set = new Set(intake);
  let cnt = 0;
  for (let i = 0; i < active; i++) {
    const day = ymd(addDays(start, i));
    if (set.has(day)) cnt++;
  }
  return cnt;
}

const QUOTES = [
  "Small steps, big changes.",
  "Consistency is your superpower.",
  "You’re building a healthy habit—one dose at a time.",
  "Stay in rhythm, stay in control.",
  "Today’s pill is tomorrow’s peace of mind.",
  "Proud of you for showing up 💪",
  "Your future self is high-fiving you!",
];

// ---------- page ----------
export default function CyclePage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [motivation, setMotivation] = useState<string | null>(null);

  // metadata
  const [pillTime, setPillTime] = useState('08:00');
  const [packStart, setPackStart] = useState<string | null>(null);
  const [active, setActive] = useState(21);
  const [inactive, setInactive] = useState(7);

  const [intakeDates, setIntakeDates] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  // progress (derived + stored)
  const [pillsTakenCount, setPillsTakenCount] = useState(0);
  const [phase, setPhase] = useState<'active' | 'inactive'>('active');

  const todayStr = useMemo(() => ymd(new Date()), []);
  const takenSet = useMemo(() => new Set(intakeDates), [intakeDates]);

  // build grid days from current pack
  const days = useMemo(() => {
    const start = packStart ? new Date(packStart) : new Date(); // fallback: today
    const arr: { date: string; kind: 'active' | 'inactive' }[] = [];
    for (let i = 0; i < active; i++) arr.push({ date: ymd(addDays(start, i)), kind: 'active' });
    for (let j = 0; j < inactive; j++) arr.push({ date: ymd(addDays(start, active + j)), kind: 'inactive' });
    return arr;
  }, [packStart, active, inactive]);

  const cycleEndStr = useMemo(() => {
    if (!packStart) return null;
    const end = addDays(new Date(packStart), active + inactive - 1);
    return ymd(end);
  }, [packStart, active, inactive]);

  const activeLeft = useMemo(() => {
    // Prefer stored pillsTakenCount; if missing, derive from intake dates in active window
    const stored = pillsTakenCount;
    if (stored > 0) return Math.max(0, active - stored);
    const derived = countTakenInActive(packStart, active, intakeDates);
    return Math.max(0, active - derived);
  }, [active, pillsTakenCount, packStart, intakeDates]);

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

      const storedCount = Number.isFinite(m.pills_taken_count) ? Number(m.pills_taken_count) : 0;

      // if current_phase not stored, infer from packStart + active window
      let ph: 'active' | 'inactive' = m.current_phase || 'active';
      if (packStart) {
        const start = new Date(m.pack_start);
        const diffDays = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        ph = diffDays >= (m.active_pills ?? 21) ? 'inactive' : 'active';
      }

      setPillsTakenCount(storedCount);
      setPhase(ph);

      setLoading(false);
    })();
  }, []);

  async function markTakenToday() {
    setMsg(null);
    if (takenSet.has(todayStr)) { setMsg('Already marked for today ✓'); return; }

    // Update local first (snappy UI)
    const nextIntakes = [...intakeDates, todayStr].slice(-60); // keep last 60 days
    const nextStreak = calcStreak(nextIntakes);

    // recompute taken in active window
    const takenInActive = countTakenInActive(packStart, active, nextIntakes);
    const nextCount = Math.max(takenInActive, pillsTakenCount + 1); // keep monotonic
    const nextPhase: 'active' | 'inactive' = nextCount >= active ? 'inactive' : 'active';

    setIntakeDates(nextIntakes);
    setStreak(nextStreak);
    setPillsTakenCount(nextCount);
    setPhase(nextPhase);

    // Persist in Auth metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        intake_dates: nextIntakes,
        streak_days: nextStreak,
        pills_taken_count: nextCount,
        current_phase: nextPhase,
      }
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg('Marked taken for today ✓');
      const line = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setMotivation(line);
      setTimeout(() => setMotivation(null), 6000);
    }
  }

  async function startNewPackToday() {
    if (!confirm('Start a new pack from today? This resets your active count.')) return;
    const today = todayStr;

    // Keep intake history (last 60), but reset active progress
    setPackStart(today);
    setPillsTakenCount(0);
    setPhase('active');

    const { error } = await supabase.auth.updateUser({
      data: {
        pack_start: today,
        pills_taken_count: 0,
        current_phase: 'active',
      }
    });
    if (error) setMsg(error.message);
    else setMsg('New pack started ✓');
  }

  const isCycleOver = useMemo(() => {
    if (!packStart) return false;
    const end = addDays(new Date(packStart), active + inactive - 1);
    return new Date() > end; // strictly after last inactive day
  }, [packStart, active, inactive]);

  if (loading) return <main className="min-h-screen bg-pink-50 px-4 py-8">Loading…</main>;

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header / actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-pink-600">Your Birth Control Pill Cycle</h1>
            <p className="text-gray-600">
              Dose time: <span className="font-semibold">{pillTime}</span> •{' '}
              Active left: <span className="font-semibold">{activeLeft}</span> •{' '}
              Inactive: <span className="font-semibold">{inactive}</span> •{' '}
              Phase: <span className={`font-semibold ${phase === 'active' ? 'text-emerald-700' : 'text-rose-700'}`}>{phase}</span>
            </p>
            {packStart && (
              <p className="text-xs text-gray-500 mt-1">
                Pack start: {new Date(packStart).toLocaleDateString()} {cycleEndStr ? `• Ends: ${new Date(cycleEndStr).toLocaleDateString()}` : ''}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="text-center">
              <div className="text-2xl font-extrabold text-emerald-700">{streak}</div>
              <div className="text-xs text-gray-600 -mt-1">day streak</div>
            </div>

            {/* Mark taken */}
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

            {/* Start new pack (visible if cycle is over or you're already in inactive) */}
            {(isCycleOver || phase === 'inactive') && (
              <button
                onClick={startNewPackToday}
                className="rounded-xl px-4 py-2 font-semibold border border-pink-400 text-pink-700 hover:bg-pink-50"
              >
                Start new pack
              </button>
            )}
          </div>
        </div>

        {/* Motivation banner */}
        {motivation && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm font-semibold text-center">
            {motivation}
          </div>
        )}

        {/* 28-day grid (or active+inactive window) */}
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
