import Link from 'next/link';
import { formatDentistName } from '@/lib/utils';

interface DentistCardProps {
  name: string;
  slug: string;
  clinicName: string;
  city: string;
  address: string;
  contactNumber: string;
  specializations: string[];
}

function initials(name: string): string {
  const formatted = formatDentistName(name);
  // Drop a leading honorific like "Dr." so the chip reads "MS" not "DM".
  const stripped = formatted.replace(/^(Dr\.?|Doc\.?|Prof\.?)\s+/i, '');
  return stripped
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function DentistCard({
  name,
  slug,
  clinicName,
  city,
  specializations,
}: DentistCardProps) {
  const formattedName = formatDentistName(name);

  return (
    <Link
      href={`/dentist/${slug}`}
      aria-label={`View profile for ${formattedName}`}
      className="group flex items-start gap-3.5 rounded-[16px] border border-border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {/* Initials avatar — 48×48 squircle, brand-tinted */}
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-light font-body text-[15px] font-bold text-brand">
        {initials(name)}
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="truncate font-display text-[17px] font-semibold leading-[1.2] text-text"
          title={formattedName}
        >
          {formattedName}
        </h3>
        {clinicName && (
          <p className="mt-0.5 truncate text-[12px] text-text-muted">{clinicName}</p>
        )}

        {specializations[0] && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-semibold text-brand">
              {specializations[0]}
            </span>
          </div>
        )}

        {city && (
          <div className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-text">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted"
              aria-hidden
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">{city}</span>
          </div>
        )}
      </div>

      {/* Chevron — visual affordance that the card is tappable */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-1 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
        aria-hidden
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
