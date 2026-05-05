import type { Metadata } from 'next';
import PartnerInquiryForm from '@/components/forms/PartnerInquiryForm';

export const metadata: Metadata = {
  title: 'Join Our Network — EGDN',
  description: 'Expand your patient base by joining the EGDN dental provider network.',
  robots: { index: false }, // [CONFIRM WITH CLIENT — currently noindex on live site]
};

const benefits = [
  {
    title: 'More patients, less marketing',
    body: 'EGDN members actively search for partner clinics. Being listed puts you in front of them.',
  },
  {
    title: 'No referral fees',
    body: 'You pay nothing per patient sent your way.',
  },
  {
    title: 'Free listing in our directory',
    body: 'Your clinic appears in searches by region and city.',
  },
  {
    title: 'We handle the coordination',
    body: 'Membership verification, coverage questions — that\'s our job.',
  },
];

export default function JoinOurNetworkPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Header */}
      <p className="text-[13px] font-semibold uppercase tracking-widest text-brand mb-3">
        For Dental Providers
      </p>
      <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
        Expand your patient base by joining our network.
      </h1>
      <p className="mt-4 text-[16px] text-text-muted max-w-2xl">
        EGDN connects thousands of members with partner clinics across the Philippines. As a
        partner, you get a steady stream of referred patients — with zero referral fees.
      </p>

      {/* Benefits */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-body text-[16px] font-semibold text-text">{b.title}</h3>
            <p className="mt-2 text-[14px] text-text-muted leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>

      {/* Who can apply */}
      <div className="mt-12 rounded-card border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold text-text mb-3">Who can apply?</h2>
        <ul className="space-y-2 text-[15px] text-text-muted">
          {[
            'Licensed dental clinics and practitioners in the Philippines',
            'Clinics in any region (especially needed in underserved areas)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-text-muted italic">
          {/* [CONFIRM WITH CLIENT — minimum requirements: equipment, specializations, etc.] */}
          Specific requirements confirmed on application review.
        </p>
      </div>

      {/* Application form */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-text mb-8">Apply to join</h2>
        <PartnerInquiryForm type="clinic" />
      </div>
    </div>
  );
}
