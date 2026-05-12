import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { formatDentistName } from '@/lib/utils';

interface DentistCardProps {
  name: string;
  slug: string;
  clinicName: string;
  city: string;
  address: string;
  contactNumber: string;
  specializations: string[];
  multipleLocations?: boolean;
}

export default function DentistCard({
  name,
  slug,
  clinicName,
  city,
  address,
  contactNumber,
  specializations,
  multipleLocations,
}: DentistCardProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand">
      <div className="flex gap-4 items-start">
        <Avatar name={name} size={56} />
        <div className="flex-1 min-w-0">
          {/* Head row — name + specialty tag. flex-wrap lets them sit on one
              line normally and wrap to the next line when the name is long.
              No truncation: per the design's .dentist-head pattern. */}
          <div className="mb-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="font-display text-[20px] font-semibold leading-tight text-text">
              {formatDentistName(name)}
            </h3>
            {specializations[0] && (
              <span className="rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-semibold text-brand">
                {specializations[0]}
              </span>
            )}
          </div>
          <p className="text-[14px] text-text-muted leading-snug">{clinicName}</p>
          <ul className="mt-3 space-y-1.5">
            <li className="flex items-start gap-2 text-[13px] text-text">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-text-muted" aria-hidden>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{address}, {city}</span>
            </li>
            {contactNumber && (
              <li className="flex items-start gap-2 text-[13px] text-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-text-muted" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{contactNumber}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Footer — (multiple locations) on the left, View Profile on the right */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[12px] text-text-muted">
          {multipleLocations ? '(multiple locations)' : ''}
        </span>
        <Button href={`/dentist/${slug}`} variant="secondary" size="default">
          View Profile →
        </Button>
      </div>
    </div>
  );
}
