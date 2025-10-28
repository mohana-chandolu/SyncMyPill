'use client';
import React from 'react';

export default function MissedPills() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-6 py-6 sm:py-8 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 sm:mb-6">
        <span className="text-pink-600">What to Do If You Miss Your Birth Control Pills?</span>
      </h1>
      <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        <span className='text-green-600'>If You Miss 1 Pill:</span>
      </h3>
      <p className="max-w-3xl text-gray-700 text-lg leading-relaxed">
        <li>Take the missed pill, as soon as you remember — even if it means taking two pills in one day.</li>
        <li>Then, continue taking the rest of your pills at the usual time.</li>
        <li>No backup contraception needed.</li>
      </p>
      <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        <span className='text-green-600'>If You Miss 2 Pills in Week 1 or 2:</span>
      </h3>
      <p className="max-w-xl text-gray-700 text-lg leading-relaxed">
        <li>Take 2 pills on the day you remember and discard the pill from the first day missed.</li>
        <li>Continue taking the remaining pills as normal.</li>
        <li>Use backup contraception (like condoms) or avoid sex for the next 7 days.</li>
        <li>If you had sex in the past 5 days, consider using emergency contraception.</li>
      </p>
      <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        <span className='text-green-600'>If You Miss 3 or More Pills (consecutive) or Miss Pills in Week 3:</span>
      </h3>
      <p className="max-w-3xl text-gray-700 text-lg leading-relaxed">
        <li>Stop the current pill pack.</li>
        <li>Start a new pack immediately (don’t take the placebo pills).</li>
        <li>Use backup contraception or avoid sex for 7 days.</li>
        <li>If you had sex in the past 5 days, consider emergency contraception.</li>
      </p>    
    </main>
    )
    
}