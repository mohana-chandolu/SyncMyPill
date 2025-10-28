'use client';
import React from 'react';

export default function MissedPills() {
  return (
    <main className="min-h-screen bg-pink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Big page title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
            What to Do If You Miss Your Birth Control Pills?
          </span>
        </h1>

        {/* Section 1 */}
        <section className="mt-8 bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-600">
            If You Miss 1 Pill
          </h2>
          <ul className="mt-4 text-gray-700 text-lg leading-relaxed list-disc list-outside pl-6 space-y-2 text-left">
            <li>Take the missed pill as soon as you remember — even if that means taking two pills in one day.</li>
            <li>Continue taking the rest of your pills at your usual time.</li>
            <li>No backup contraception is needed.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mt-6 bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-600">
            If You Miss 2 Pills in Week 1 or 2
          </h2>
          <ul className="mt-4 text-gray-700 text-lg leading-relaxed list-disc list-outside pl-6 space-y-2 text-left">
            <li>Take 2 pills on the day you remember and discard the pill from the first day missed.</li>
            <li>Continue taking the remaining pills as normal.</li>
            <li>Use backup contraception (like condoms) or avoid sex for the next 7 days.</li>
            <li>If you had sex in the past 5 days, consider emergency contraception.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mt-6 bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-600">
            If You Miss 3+ Pills in a Row or Miss Pills in Week 3
          </h2>
          <ul className="mt-4 text-gray-700 text-lg leading-relaxed list-disc list-outside pl-6 space-y-2 text-left">
            <li>Stop the current pill pack.</li>
            <li>Start a new pack immediately (skip placebo pills).</li>
            <li>Use backup contraception or avoid sex for 7 days.</li>
            <li>If you had sex in the past 5 days, consider emergency contraception.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
