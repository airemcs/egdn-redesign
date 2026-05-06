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
  secondaryLabel,
  secondaryHref,
}: CtaSectionProps) {
  return (
    <div className="mx-auto max-w-300 px-5 py-10 sm:px-6 sm:py-24 lg:px-10">
      <div className="grid items-center gap-5 rounded-[18px] bg-brand-tint px-[22px] py-7 sm:gap-[40px] sm:rounded-[20px] sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:p-[64px]">
        <div>
          <h2 className="font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">{headline}</h2>
          {subtext && <p className="mt-2 text-[14px] text-text-muted sm:mt-2.5 sm:text-[16px]">{subtext}</p>}
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3 lg:justify-end">
          <Button href={primaryHref} size="large" className="w-full justify-center sm:w-auto">
            {primaryLabel}
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button href={secondaryHref} variant="secondary" size="large" className="w-full justify-center sm:w-auto">
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
