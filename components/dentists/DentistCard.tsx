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
  /**
   * Number of OTHER clinics this dentist practices at, in addition to the
   * one shown via `city`/`clinicName`. Surfaces a "+N more" indicator on
   * `sm:` and up so members see a multi-clinic dentist at a glance without
   * having to tap into the profile. Defaults to 0 (single-clinic).
   */
  additionalLocationCount?: number;
}

function initials(name: string): string {
  const formatted = formatDentistName(name);
  // Headline initials keep the honorific as the first letter so every chip
  // reads "Dr.+first-name initial" (e.g. "DL" for "Dr. Lyn Obias", "DM" for
  // "Dr. Maria Santos"). Consistent doctor-prefix across all cards.
  return formatted
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
  additionalLocationCount = 0,
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

        {specializations.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {/* Mobile: only the primary specialty fits without crowding the
                tight 2-col / 1-col card. From `sm:` (tablet+desktop) we have
                room to show the full set so members see the dentist's
                breadth without tapping into the profile. */}
            {specializations.map((s, i) => (
              <span
                key={s}
                className={[
                  'items-center rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-semibold text-brand',
                  i === 0 ? 'inline-flex' : 'hidden sm:inline-flex',
                ].join(' ')}
              >
                {s}
              </span>
            ))}
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
              className="shrink-0 text-text-muted"
              aria-hidden
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">{city}</span>
            {/* Multi-clinic indicator — web only. Mobile cards stay tight
                with just the primary city; on tablet/desktop there's room
                to surface that the dentist has additional locations. */}
            {additionalLocationCount > 0 && (
              <span className="hidden shrink-0 text-[10px] font-normal text-text-muted sm:inline">
                +{additionalLocationCount} more
              </span>
            )}
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
