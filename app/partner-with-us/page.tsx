import type { Metadata } from 'next';
import PartnerInquiryForm from '@/components/forms/PartnerInquiryForm';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Partner With Us — EGDN',
  description: 'Give your employees a dental benefit they\'ll actually use. Partner with EGDN.',
};

const benefits = [
  {
    title: 'Nationwide coverage',
    body: 'Partner clinics in 16 regions and 138 cities, so your team is covered wherever they are.',
  },
  {
    title: 'Simple to administer',
    body: 'We handle enrollment, IDs, and clinic coordination. You focus on your business.',
  },
  {
    title: 'Flexible plans',
    body: 'Coverage options that match your team size and budget.', // [CONFIRM WITH CLIENT]
  },
  {
    title: 'Trusted since 2005', // [CONFIRM WITH CLIENT]
    body: 'Hundreds of companies across the Philippines rely on EGDN for their dental benefits.',
  },
];

const steps = [
  { n: 1, title: 'Enroll your company', body: 'Contact EGDN to set up your corporate plan.' },
  { n: 2, title: 'We onboard your employees', body: 'Each employee receives their EGDN member ID.' },
  { n: 3, title: 'Your team accesses care', body: 'They find a dentist, book, and use their benefit. You get peace of mind.' },
];

export default function PartnerWithUsPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-brand-tint">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-brand mb-3">
            For Companies & Employers
          </p>
          <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
            Give your employees a dental benefit they'll actually use.
          </h1>
          <p className="mt-4 text-[16px] text-text-muted max-w-2xl mx-auto">
            EGDN makes it easy to offer dental coverage across 600+ clinics nationwide — no
            complicated setup, no billing surprises.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Benefits */}
        <h2 className="font-display text-2xl font-semibold text-text lg:text-3xl">
          Why partner with EGDN?
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-card border border-border bg-surface p-6">
              <h3 className="font-body text-[16px] font-semibold text-text">{b.title}</h3>
              <p className="mt-2 text-[14px] text-text-muted leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <h2 className="font-display text-2xl font-semibold text-text mt-14 mb-8">How it works</h2>
        <ol className="space-y-6">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-text-on-brand text-[13px] font-semibold">
                {s.n}
              </span>
              <div>
                <p className="font-semibold text-text">{s.title}</p>
                <p className="mt-1 text-[14px] text-text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Inquiry form */}
        <div className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-text mb-8">Get in touch</h2>
          <PartnerInquiryForm type="employer" />
        </div>
      </div>

      <CtaSection
        headline="Questions before you sign up?"
        subtext="Reach our team directly."
        primaryLabel="Contact EGDN"
        primaryHref="/contact"
        secondaryLabel={undefined}
        secondaryHref={undefined}
      />
    </>
  );
}
