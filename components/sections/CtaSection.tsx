import Button from '@/components/ui/Button';

interface CtaSectionProps {
  headline?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CtaSection({
  headline = 'Ready to find your dentist?',
  subtext = 'Browse 600+ partner clinics across 16 regions.',
  primaryLabel = 'Find a Dentist',
  primaryHref = '/find-a-dentist',
  secondaryLabel = 'Book an Appointment',
  secondaryHref = '/book-appointment',
}: CtaSectionProps) {
  return (
    <section className="bg-brand-tint">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text lg:text-3xl">{headline}</h2>
            {subtext && <p className="mt-2 text-[15px] text-text-muted">{subtext}</p>}
          </div>
          <div className="flex flex-wrap gap-3 lg:shrink-0">
            <Button href={primaryHref} size="large">
              {primaryLabel}
            </Button>
            {secondaryLabel && secondaryHref && (
              <Button href={secondaryHref} variant="secondary" size="large">
                {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
