'use client';
import React from 'react';

export default function DrugInteractions() {
  return (
    <main className="min-h-screen bg-pink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 font-[times]">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
            Drug Interactions
          </span>
        </h1>

        {/* Main Card */}
        <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center">
            Common Antibiotics & Basic Drugs
          </h2>

          <p className="mt-4 text-gray-800 text-base sm:text-lg leading-relaxed text-center font-medium">
            Certain medications can make birth control pills less effective.
          </p>

          {/* Antibiotics */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-rose-700">
              Antibiotics
            </h3>
            <ul className="mt-3 text-gray-900 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
              <li>Rifampin</li>
              <li>Rifabutin</li>
            </ul>
            <p className="mt-1 text-gray-700 italic text-sm sm:text-base">
              (These are mainly used for tuberculosis)
            </p>
          </div>

          {/* Seizure / Epilepsy Medications */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-rose-700">
              Seizure / Epilepsy Medications
            </h3>
            <ul className="mt-3 text-gray-900 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
              <li>Carbamazepine (Tegretol)</li>
              <li>Phenytoin (Dilantin)</li>
              <li>Phenobarbital</li>
              <li>Topiramate (Topamax)</li>
              <li>Oxcarbazepine (Trileptal)</li>
            </ul>
          </div>

          {/* HIV Medications */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-rose-700">
              HIV Medications
            </h3>
            <ul className="mt-3 text-gray-900 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-1">
              <li>Efavirenz (Sustiva)</li>
              <li>Nevirapine (Viramune)</li>
              <li>Ritonavir (used in combination treatments)</li>
            </ul>
          </div>

          {/* Final Note */}
          <p className="mt-8 text-emerald-700 font-semibold text-base sm:text-lg leading-relaxed text-center">
            If you are prescribed new medications, always tell your healthcare provider
            you are using birth control pills — some drugs can reduce their effectiveness.
          </p>
        </section>
      </div>
    </main>
  );
}
