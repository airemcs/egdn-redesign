import type { Metadata } from 'next';
import Link from 'next/link';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'How It Works — EGDN',
  description: 'Learn how to use your EGDN dental benefit in three simple steps.',
};

const steps = [
  {
    n: 1,
    title: 'Your employer enrolls you',
    body: 'Your company partners with EGDN to give you access to dental care as part of your benefits package.',
    link: null,
  },
  {
    n: 2,
    title: 'You receive your member ID',
    body: 'EGDN issues your member ID card — your key to accessing any partner clinic in the network.',
    link: null,
  },
  {
    n: 3,
    title: 'Find a partner dentist near you',
    body: 'Browse our network of partner clinics by region or city. Filter by location and find one that fits your schedule.',
    link: { label: 'Browse the directory →', href: '/find-a-dentist' },
  },
  {
    n: 4,
    title: 'Book an appointment',
    body: 'Call the clinic directly or book through our site. Mention you\'re an EGDN member when scheduling.',
    link: { label: 'Book online →', href: '/book-appointment' },
  },
  {
    n: 5,
    title: 'Present your IDs, get treated',
    body: 'Bring your EGDN member ID and a valid government-issued ID. The clinic verifies your benefit with EGDN — covered procedures are processed through your plan; anything outside your plan is paid directly at the clinic.',
    link: null,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">How It Works</h1>
        <p className="mt-3 text-[16px] text-text-muted">
          Using your EGDN dental benefit is straightforward. Here's what to expect.
        </p>

        {/* Steps */}
        <ol className="mt-12 relative">
          {/* Connector line */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-border" aria-hidden />

          <div className="space-y-10">
            {steps.map((step) => (
              <li key={step.n} className="flex gap-6">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-text-on-brand font-semibold text-[14px]">
                  {step.n}
                </div>
                <div className="pt-1.5">
                  <h2 className="font-display text-[18px] font-semibold text-text">{step.title}</h2>
                  <p className="mt-1.5 text-[15px] text-text-muted leading-relaxed">{step.body}</p>
                  {step.link && (
                    <Link
                      href={step.link.href}
                      className="mt-2 inline-block text-[14px] text-brand hover:underline"
                    >
                      {step.link.label}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </div>
        </ol>

        {/* Coverage scope — flagged separately so members don't read step 5
            as a blanket "everything is free" promise. Coverage depends on
            the employer's specific EGDN plan; non-covered services are paid
            at the clinic. */}
        <div className="mt-12 rounded-card border border-border bg-surface p-6 sm:p-7">
          <h3 className="font-display text-[18px] font-semibold text-text">
            What&apos;s covered?
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
            Coverage depends on your employer&apos;s specific EGDN plan. Procedures included in
            your plan are processed directly through your benefit; anything outside your plan —
            cosmetic work, optional add-ons, lab fees not included, etc. — is paid at the clinic
            on the day. If you&apos;re unsure about a procedure,{' '}
            <Link href="/contact" className="text-brand hover:underline">
              contact EGDN
            </Link>{' '}
            before your appointment to confirm.
          </p>
        </div>
      </div>

      <CtaSection
        headline="Ready to find your dentist?"
        subtext="Browse partner clinics nationwide."
        primaryLabel="Find a Dentist"
        primaryHref="/find-a-dentist"
        secondaryLabel="Book an Appointment"
        secondaryHref="/book-appointment"
      />
    </>
  );
}
