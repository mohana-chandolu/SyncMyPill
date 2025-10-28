'use client';
import React from 'react';

export default function SideEffects() {
  return (
    <main className="min-h-screen bg-pink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 font-[times]">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
            Common & Adverse Side Effects
          </span>
        </h1>

        {/* COMMON SIDE EFFECTS */}
        <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center">
            Common Side Effects
          </h2>

          <h3 className="mt-6 text-xl font-semibold text-rose-700">
            Mild or Temporary
          </h3>
          <ul className="mt-3 text-gray-700 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
            <li>Nausea or upset stomach</li>
            <li>Breast tenderness or swelling</li>
            <li>Headache or light-headedness</li>
            <li>Spotting or lighter/darker menstrual bleeding between periods</li>
            <li>Mood changes or mild depression/anxiety</li>
            <li>Bloating or abdominal cramps</li>
            <li>Changes in appetite or weight (usually small)</li>
          </ul>

          <h3 className="mt-6 text-xl font-semibold text-rose-700">
            Common but Less Frequent
          </h3>
          <ul className="mt-3 text-gray-700 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
            <li>Fatigue or tiredness</li>
            <li>Acne or skin changes</li>
            <li>Trouble sleeping or insomnia</li>
            <li>Hair thinning or hair growth in unusual areas (rare)</li>
          </ul>

          <h3 className="mt-6 text-xl font-semibold text-rose-700">Quick Notes</h3>
          <ul className="mt-3 text-gray-700 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
            <li>
              It often takes 2–3 months for your body to adjust to a new pill. If side effects
              persist or become bothersome, talk to a healthcare provider.
            </li>
            <li>
              Different brands/formulations (combined vs. progestin-only) can cause different side
              effects.
            </li>
            <li>
              If you miss pills or have vomiting/diarrhea, use backup contraception temporarily and
              check product guidelines or ask a clinician.
            </li>
          </ul>
        </section>

        {/* ADVERSE SIDE EFFECTS */}
        <section className="mt-8 bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-600">
            Adverse (Serious) Side Effects
          </h2>

          <h3 className="mt-6 text-xl font-semibold text-rose-700">
            Seek Medical Advice Promptly If You Experience:
          </h3>
          <ul className="mt-3 text-gray-700 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
            <li>Severe chest pain, shortness of breath, or coughing up blood</li>
            <li>Severe leg pain or swelling (possible blood clots)</li>
            <li>Severe abdominal pain</li>
            <li>Jaundice (yellowing of skin/eyes)</li>
            <li>Severe or worsening headaches, especially with weakness on one side</li>
            <li>Vision changes or severe dizziness</li>
          </ul>

          <p className="mt-6 text-gray-700 text-base sm:text-lg leading-relaxed text-center">
            If you notice new or worsening symptoms or any red-flag signs, contact a healthcare
            provider promptly.
          </p>
        </section>
      </div>
    </main>
  );
}
