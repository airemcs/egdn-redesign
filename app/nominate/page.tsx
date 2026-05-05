import type { Metadata } from 'next';
import NominationForm from '@/components/forms/NominationForm';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Nominate a Dentist — EGDN',
  description: 'Know a great dentist? Nominate them to join the EGDN network.',
};

export default function NominatePage() {
  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">Nominate a Dentist</h1>
        <p className="mt-3 text-[16px] text-text-muted">
          Know a great dentist who should be part of our network? Let us know — we'll reach out to them.
        </p>
        <div className="mt-10">
          <NominationForm />
        </div>
      </div>
      <CtaSection
        headline="Already have a dentist in mind?"
        subtext="Search the directory to see if they're already a partner clinic."
        primaryLabel="Find a Dentist"
        primaryHref="/find-a-dentist"
        secondaryLabel={undefined}
        secondaryHref={undefined}
      />
    </>
  );
}
