import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import PageContainer from '@/components/layout/PageContainer';

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
    <PageContainer width="narrow" className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center sm:py-20">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-light text-brand">
        <ClockIcon />
      </span>
      <span className="eyebrow mt-6">
        Coming soon
      </span>
      <h1 className="mt-1.5 h1 text-text">
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
    </PageContainer>
  );
}
