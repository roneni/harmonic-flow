"use client";

import { useInView } from "@/hooks/use-in-view";

const STEPS = [
  {
    number: "01",
    title: "Upload",
    description:
      "Drop your Rekordbox XML, CSV, or TXT playlist export. We parse everything client-side - your files never leave your browser.",
  },
  {
    number: "02",
    title: "Choose Energy",
    description:
      "Pick your energy mode: Ramp Up builds intensity, Ramp Down cools off, or Wave alternates between peaks and valleys.",
  },
  {
    number: "03",
    title: "Download",
    description:
      "Get the mathematically optimal order in seconds. See the before/after comparison, quality score, and circle-of-fifths visualization. Export as CSV.",
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView();

  return (
    <section id="how-it-works" className="px-4 py-20">
      <div ref={ref} className="mx-auto max-w-4xl">
        <h2
          className={`text-center text-3xl font-bold transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          How It Works
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`transition-all duration-700 ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mb-4 text-4xl font-black text-primary/20">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
