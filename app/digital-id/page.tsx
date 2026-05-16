import type { Metadata } from 'next';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Digital Member ID — Coming Soon — EGDN',
  description:
    "EGDN's digital member ID portal is on the way. In the meantime, contact us directly to request or replace your member ID.",
  robots: { index: false },
};

const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function DigitalIdPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[560px] flex-col items-center justify-center px-5 py-16 text-center sm:px-6 sm:py-20 lg:px-10">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-light text-brand">
        <ClockIcon />
      </span>
      <span className="mt-6 block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
        Coming soon
      </span>
      <h1 className="mt-1.5 font-display text-[28px] font-bold leading-[1.2] text-text sm:text-[34px]">
        Digital Member ID
      </h1>
      <p
        className="mt-3 text-[16px] leading-[1.55] text-text-muted"
        style={{ textWrap: 'pretty' } as React.CSSProperties}
      >
        This portal is still being built. In the meantime, reach out and we&apos;ll send your
        member ID within 1 business day.
      </p>
      <Button href="/contact" variant="primary" size="default" className="mt-6">
        Contact EGDN
      </Button>
    </section>
  );
}
