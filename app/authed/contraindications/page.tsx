'use client';
import React from 'react';

export default function Contraindications() {
  return (
    <main className="min-h-screen bg-pink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 font-[times]">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
            Contraindications
          </span>
        </h1>

        {/* Main Section */}
        <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center">
            Who Should Avoid Birth Control Pills?
          </h2>

          <ul className="mt-6 text-gray-900 text-base sm:text-lg leading-relaxed list-disc list-inside space-y-2">
            <li>
              History of blood clots or clotting disorders
              <span className="block text-gray-700 text-sm sm:text-base italic">
                (Risk of serious clots increases)
              </span>
            </li>
            <li>
              Stroke or heart attack history
              <span className="block text-gray-700 text-sm sm:text-base italic">
                (Especially if under 35 and smoke)
              </span>
            </li>
            <li>Uncontrolled high blood pressure</li>
            <li>
              Certain types of migraines
              <span className="block text-gray-700 text-sm sm:text-base italic">
                (Especially migraines with aura)
              </span>
            </li>
            <li>Breast cancer or other hormone-sensitive cancers</li>
            <li>Liver disease or liver tumors</li>
            <li>Pregnancy</li>
            <li>Smoking if over age 35</li>
            <li>Known allergy to pill ingredients</li>
          </ul>

          <p className="mt-8 text-rose-700 font-semibold text-base sm:text-lg leading-relaxed text-center">
            Always talk to your healthcare provider before starting or stopping birth control pills,
            especially if you have any of the above conditions.
          </p>
        </section>
      </div>
    </main>
  );
}
