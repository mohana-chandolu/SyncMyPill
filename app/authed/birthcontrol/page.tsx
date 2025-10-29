'use client';
import React from 'react';

export default function BirthControlInfo() {
  return (
    <main className="min-h-screen bg-pink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 font-[times]">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
            Birth Control — General Information
          </span>
        </h1>
        <p className="mt-3 text-center text-gray-700 text-base sm:text-lg">
          Overview of mechanisms and key statistics for oral contraceptive pills.
        </p>

        {/* Stats Card */}
        <section className="mt-8 bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center">
            Statistics Related to Birth Control
          </h2>

          <ul className="mt-5 text-gray-900 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-2">
            <li>
              The birth control pill is used by ~<span className="font-semibold">151 million</span> women aged 15–49.
              <span className="block text-gray-700 text-sm sm:text-base italic">Source: PubMed</span>
            </li>
            <li>
              Around <span className="font-semibold">15%–51%</span> of users forget to take 1–3 pills per cycle.
              <span className="block text-gray-700 text-sm sm:text-base italic">Source: PubMed</span>
            </li>
            <li>
              Inconsistent pill use is the #1 reason for pill failures.
              <ul className="list-disc list-inside pl-5 space-y-1 mt-2">
                <li>Typical-use failure rate: ~<span className="font-semibold">9%</span> per year</li>
                <li>Perfect-use failure rate: ~<span className="font-semibold">0.3%</span> per year</li>
              </ul>
              <span className="block text-gray-700 text-sm sm:text-base italic mt-1">Source: CDC</span>
            </li>
            <li>
              A 2022 survey found <span className="font-semibold">25%–35%</span> of users missed ≥1 dose each month.
              <span className="block text-gray-700 text-sm sm:text-base">
                Reasons: forgetting, travel, running out of pills, no reminders.
              </span>
              <span className="block text-gray-700 text-sm sm:text-base italic">Source: Guttmacher Institute</span>
            </li>
          </ul>

          <div className="mt-6 rounded-xl bg-rose-50/70 border border-rose-100 px-4 py-3 text-rose-800 text-sm sm:text-base">
            Tip: Setting daily reminders and keeping spare packs on hand can reduce missed doses.
          </div>
        </section>

        {/* Mechanisms Card */}
        <section className="mt-8 bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center">
            Mechanism & Types of Pills
          </h2>

          {/* Combined Pill */}
          <div className="mt-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-rose-700">
              Combined Pill (Estrogen + Progestin)
            </h3>
            <ul className="mt-3 text-gray-900 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
              <li>Prevents ovulation (no egg is released).</li>
              <li>Thickens cervical mucus to block sperm.</li>
              <li>Thins the uterine lining, reducing chance of implantation.</li>
            </ul>
          </div>

          {/* Progestin-only Pill */}
          <div className="mt-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-rose-700">
              Progestin-Only Pill (POP / “Mini-pill”)
            </h3>
            <ul className="mt-3 text-gray-900 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
              <li>Primarily thickens cervical mucus to block sperm.</li>
              <li>May suppress ovulation (varies by formulation/user).</li>
            </ul>
          </div>

          {/* Emergency Pill */}
          <div className="mt-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-rose-700">
              Emergency Contraceptive Pill (ECP)
            </h3>
            <ul className="mt-3 text-gray-900 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
              <li>Mainly delays or prevents ovulation to avoid fertilization.</li>
              <li>Best taken as soon as possible after unprotected sex.</li>
            </ul>
          </div>

          <p className="mt-8 text-emerald-700 font-semibold text-center text-base sm:text-lg">
            Pills do not protect against STIs — use condoms for STI protection.
          </p>
        </section>

        {/* Footer note */}
        <p className="mt-8 text-center text-sm text-gray-600">
          This page is for general information and doesn’t replace medical advice. Please consult a clinician for guidance specific to you.
        </p>
      </div>
    </main>
  );
}
