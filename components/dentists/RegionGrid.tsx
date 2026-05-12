import Link from 'next/link';

interface Region {
  _id: string;
  count: number;
}

const SUBTITLES: Record<string, string> = {
  NCR: 'National Capital Region',
  CAR: 'Cordillera Administrative Region',
  'Region I': 'Ilocos Region',
  'Region II': 'Cagayan Valley',
  'Region III': 'Central Luzon',
  'Region IV-A': 'CALABARZON',
  'Region IV-B': 'MIMAROPA',
  'Region V': 'Bicol Region',
  'Region VI': 'Western Visayas',
  'Region VII': 'Central Visayas',
  'Region VIII': 'Eastern Visayas',
  'Region IX': 'Zamboanga Peninsula',
  'Region X': 'Northern Mindanao',
  'Region XI': 'Davao Region',
  'Region XII': 'SOCCSKSARGEN',
  'Region XIII': 'Caraga',
  BARMM: 'Bangsamoro',
};

// DB stores regions in the long form, e.g. "Region IV-A (CALABARZON)".
// Cards show the short name as the headline and the readable label as the
// subtitle. We prefer the SUBTITLES map for the subtitle (always present for
// the 16 known regions) and fall back to whatever was in the parentheses.
function splitRegion(id: string): { name: string; sub?: string } {
  const match = id.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  const name = match ? match[1].trim() : id;
  const sub = SUBTITLES[name] ?? (match ? match[2].trim() : undefined);
  return { name, sub };
}

export default function RegionGrid({ regions }: { regions: Region[] }) {
  if (regions.length === 0) {
    return (
      <p className="text-[15px] text-text-muted">No regions found. Check back soon.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {regions.map((region) => {
        const { name, sub } = splitRegion(region._id);
        return (
        <Link
          key={region._id}
          href={`/find-a-dentist?region=${encodeURIComponent(region._id)}`}
          className="group relative flex min-h-44 flex-col gap-4 rounded-card border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {/* Top row: pin icon left, clinic count right */}
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-input bg-brand-light text-brand">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="text-[12px] font-semibold text-text-muted">
              {region.count} {region.count === 1 ? 'clinic' : 'clinics'}
            </span>
          </div>

          {/* Region name (short form, e.g. "Region IV-A") + subtitle (long form,
              e.g. "CALABARZON"). The full ID is preserved in the href so the
              server-side filter still matches "Region IV-A (CALABARZON)". */}
          <div>
            <div className="font-display text-[22px] font-semibold leading-[1.15] text-text">
              {name}
            </div>
            {sub && (
              <div className="mt-0.5 text-[13px] text-text-muted">{sub}</div>
            )}
          </div>

          {/* Arrow on hover */}
          <div className="absolute bottom-5 right-5 text-brand opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </Link>
        );
      })}
    </div>
  );
}
