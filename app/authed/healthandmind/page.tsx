'use client';
import React from 'react';

type Units = 'metric' | 'imperial';
type Symptom =
  | 'Happy' | 'Tired' | 'Low energy' | 'Emotional'
  | 'Tense' | 'Depressed' | 'Calm' | 'Confused';

const symptoms: Symptom[] = [
  'Happy','Tired','Low energy','Emotional','Tense','Depressed','Calm','Confused'
];

export default function HealthAndMind() {
  // Units and inputs
  const [units, setUnits] = React.useState<Units>('metric');
  const [weight, setWeight] = React.useState<string>(''); // kg or lb
  const [heightA, setHeightA] = React.useState<string>(''); // cm or feet
  const [heightB, setHeightB] = React.useState<string>(''); // (unused in metric) inches
  // BMI
  const [bmi, setBmi] = React.useState<number | null>(null);
  const [bmiCat, setBmiCat] = React.useState<string>('');
  // Mood tabs
  const [activeSymptom, setActiveSymptom] = React.useState<Symptom>('Happy');
  const [moodChecked, setMoodChecked] = React.useState<Record<Symptom, boolean>>(
    () => Object.fromEntries(symptoms.map(s => [s, false])) as Record<Symptom, boolean>
  );
  const [moodNotes, setMoodNotes] = React.useState<Record<Symptom, string>>(
    () => Object.fromEntries(symptoms.map(s => [s, ''])) as Record<Symptom, string>
  );
  const [savedBanner, setSavedBanner] = React.useState<string>('');

  // Helpers
  function toNumber(v: string) {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  }

  function computeBMI() {
    const w = toNumber(weight);
    if (units === 'metric') {
      const hCm = toNumber(heightA);
      if (!w || !hCm) return { value: null, cat: '' };
      const hM = hCm / 100;
      const val = w / (hM * hM);
      return { value: val, cat: categorize(val) };
    } else {
      const ft = toNumber(heightA);
      const inch = toNumber(heightB);
      if (!w || (!ft && ft !== 0) || (!inch && inch !== 0)) return { value: null, cat: '' };
      const totalIn = (ft * 12) + inch;
      const val = (w / (totalIn * totalIn)) * 703;
      return { value: val, cat: categorize(val) };
    }
  }

  function categorize(v: number | null) {
    if (v == null) return '';
    if (v < 18.5) return 'Underweight';
    if (v < 25) return 'Normal';
    if (v < 30) return 'Overweight';
    return 'Obesity';
  }

  React.useEffect(() => {
    const { value, cat } = computeBMI();
    setBmi(value ? Number(value.toFixed(1)) : null);
    setBmiCat(cat);
  }, [units, weight, heightA, heightB]);

  // Save today
  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `healthMind:${y}-${m}-${day}`;
  }

  function handleSave() {
    const payload = {
      date: new Date().toISOString(),
      units,
      weight,
      heightA,
      heightB,
      bmi,
      bmiCat,
      moodChecked,
      moodNotes,
    };
    try {
      localStorage.setItem(todayKey(), JSON.stringify(payload));
      setSavedBanner('Saved for today ✔️');
      setTimeout(() => setSavedBanner(''), 2000);
    } catch {
      setSavedBanner('Could not save (storage full?)');
      setTimeout(() => setSavedBanner(''), 3000);
    }
  }

  const selectedCount = Object.values(moodChecked).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-pink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 font-[times]">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
            Health & Mind
          </span>
        </h1>
        <p className="mt-3 text-center text-gray-700 text-base sm:text-lg">
          Track your body metrics and reflect on your mood today.
        </p>

        {/* Metrics Card */}
        <section className="mt-8 bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center">
            Body Metrics
          </h2>

          {/* Unit Toggle */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={() => setUnits('metric')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${units==='metric' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              Metric (kg / cm)
            </button>
            <button
              onClick={() => setUnits('imperial')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${units==='imperial' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              Imperial (lb / ft,in)
            </button>
          </div>

          {/* Inputs */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weight */}
            <div className="col-span-1 sm:col-span-1">
              <label className="block text-sm font-semibold text-gray-800">Weight</label>
              <div className="mt-1 relative">
                <input
                  inputMode="decimal"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder={units === 'metric' ? 'e.g. 75' : 'e.g. 165'}
                  className="w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {units === 'metric' ? 'kg' : 'lb'}
                </span>
              </div>
            </div>

            {/* Height */}
            {units === 'metric' ? (
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800">Height</label>
                <div className="mt-1 relative">
                  <input
                    inputMode="decimal"
                    value={heightA}
                    onChange={e => setHeightA(e.target.value)}
                    placeholder="e.g. 165"
                    className="w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-200"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">cm</span>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-800">Height (feet)</label>
                  <input
                    inputMode="numeric"
                    value={heightA}
                    onChange={e => setHeightA(e.target.value)}
                    placeholder="e.g. 5"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-semibold text-gray-800">Height (inches)</label>
                  <input
                    inputMode="numeric"
                    value={heightB}
                    onChange={e => setHeightB(e.target.value)}
                    placeholder="e.g. 4"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </>
            )}
          </div>

          {/* BMI Display */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2">
              <div className="rounded-xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm sm:text-base text-rose-900">
                <strong>BMI</strong>: {bmi ?? '—'} {bmi ? `(${bmiCat})` : ''}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
              BMI = weight / height² (kg/m²) • 703× for lb/in
            </div>
          </div>
        </section>

        {/* Mood Tabs Card */}
        <section className="mt-8 bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center">
            Mood Insights
          </h2>
          <p className="mt-2 text-center text-gray-700 text-sm sm:text-base">
            Select a tab and tick how you feel today. Selected: <span className="font-semibold">{selectedCount}</span>
          </p>

          {/* Tabs */}
          <div className="mt-5 overflow-x-auto">
            <div className="inline-flex gap-2 min-w-full">
              {symptoms.map((s) => {
                const active = activeSymptom === s;
                return (
                  <button
                    key={s}
                    onClick={() => setActiveSymptom(s)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border transition
                      ${active ? 'bg-rose-100 border-rose-200 text-rose-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    aria-pressed={active}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{activeSymptom}</h3>
                <p className="text-sm text-gray-600">Tick if this applies today and optionally add a note.</p>
              </div>

              <button
                onClick={() => {
                  setMoodChecked(prev => ({ ...prev, [activeSymptom]: !prev[activeSymptom] }));
                }}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border
                  ${moodChecked[activeSymptom]
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'}`}
                aria-pressed={moodChecked[activeSymptom]}
              >
                {moodChecked[activeSymptom] ? 'Ticked ✔️' : 'Tick for today'}
              </button>
            </div>

            <label className="block mt-4 text-sm font-medium text-gray-800">
              Notes
            </label>
            <textarea
              value={moodNotes[activeSymptom]}
              onChange={e => setMoodNotes(prev => ({ ...prev, [activeSymptom]: e.target.value }))}
              placeholder="(Optional) e.g., Slept late, exam stress, had a great workout, etc."
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {/* Save */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600">
              Saved locally per day (private to your device).
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl font-semibold border bg-rose-600 text-white hover:bg-rose-700 active:scale-[.98] transition"
            >
              Save today
            </button>
          </div>

          {savedBanner && (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800 text-sm text-center">
              {savedBanner}
            </div>
          )}
        </section>

        {/* Footer note */}
        <p className="mt-8 text-center text-sm text-gray-600">
          This is a wellness helper and does not replace medical advice.
        </p>
      </div>
    </main>
  );
}
