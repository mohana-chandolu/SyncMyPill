'use client';
import React from 'react';

export default function PostLoginHome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-6 py-6 sm:py-8 text-center">
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 sm:mb-6">
        <span className="text-pink-600">She</span>
        <span className="text-green-600">Sync</span>
      </h1>
      <p className="max-w-3xl text-gray-700 text-lg leading-relaxed">
        Staying on top of your birth control shouldn’t be stressful—
        that’s where we come in. Our app is designed to help you stay
        consistent with daily reminders and alarms, so you never miss a dose.
        Plus, you’ll have quick, easy access to trusted information about
        different birth control options, side effects, and tips—all in one place.
        Whether you're new to birth control or just looking for a little extra
        support, we’re here to make it simpler for you.
      </p>
    </main>
  );
}
