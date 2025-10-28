'use client';
import React from 'react';

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: 'How do birth control pills work?',
    a: 'They prevent ovulation, thicken cervical mucus, and thin the uterine lining to stop pregnancy.',
  },
  {
    q: 'Can birth control pills cause weight gain?',
    a: 'Most studies show little or no link between the pill and weight gain, but some people may notice changes.',
  },
  {
    q: 'Will birth control pills protect me from sexually transmitted infections (STIs)?',
    a: 'No, pills do not protect against STIs. Use condoms for STI protection.',
  },
  {
    q: 'Can I take birth control pills if I smoke?',
    a: 'Smoking increases health risks with the pill, especially if you’re over 35. Talk to your doctor.',
  },
  {
    q: 'Can I use antibiotics while on birth control pills?',
    a: 'Most antibiotics do not affect the pill, except for rifampin and rifabutin. Always check with your healthcare provider.',
  },
  {
    q: 'How long does it take for birth control pills to become effective?',
    a: 'If you start during your period, they’re effective immediately. Otherwise, use backup protection for 7 days.',
  },
  {
    q: 'What are common side effects?',
    a: 'Some people experience nausea, spotting, mood changes, or headaches, which usually improve after a few months.',
  },
  {
    q: 'Can I get pregnant right after stopping the pill?',
    a: 'Yes, fertility can return quickly after stopping the pill.',
  },
  {
    q: 'Do I need a prescription for birth control pills?',
    a: 'In most places, yes, but some countries offer over-the-counter options.',
  },
];

export default function FAQBirthControl() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <main className="min-h-screen bg-pink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
            Frequently Asked Questions
          </span>
        </h1>
        <p className="mt-3 text-center text-gray-700">
          About Birth Control Pills
        </p>

        {/* Accordion */}
        <section className="mt-8 space-y-4">
          {faqs.map((item, idx) => {
            const expanded = open === idx;
            const panelId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur rounded-2xl shadow-sm"
              >
                <h2 className="text-base">
                  <button
                    id={buttonId}
                    aria-controls={panelId}
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : idx)}
                    className="w-full flex items-center justify-between text-left px-5 py-4 sm:px-6 sm:py-5"
                  >
                    <span className="font-semibold text-gray-900">
                      {idx + 1}. {item.q}
                    </span>
                    <span
                      className={`transition-transform ${
                        expanded ? 'rotate-45' : ''
                      } text-xl leading-none select-none`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                </h2>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-gray-700 text-lg leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Gentle disclaimer */}
        <p className="mt-8 text-sm text-gray-600 text-center">
          This FAQ is for general information only and does not replace medical advice. 
          Please consult a healthcare professional for guidance specific to you.
        </p>
      </div>

      {/* Optional: SEO JSON-LD for FAQ rich results */}
      <script
        type="application/ld+json"
        // JSON-LD must be a string
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
