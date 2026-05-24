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

interface RegionGridProps {
  regions: Region[];
}

export default function RegionGrid({ regions }: RegionGridProps) {
  if (regions.length === 0) {
    return (
      <p className="text-[15px] text-text-muted">No regions found. Check back soon.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4 lg:gap-6">
      {regions.map((region) => {
        const { name, sub } = splitRegion(region._id);
        return (
        <Link
          key={region._id}
          href={`/find-a-dentist?region=${encodeURIComponent(region._id)}`}
          className="group relative flex min-h-[124px] flex-col gap-1 rounded-[14px] border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:min-h-44 sm:gap-3 sm:p-6"
        >
          <div className="mb-1.5 flex items-center justify-between sm:mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light text-brand sm:h-9 sm:w-9 sm:rounded-input">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="sm:h-4 sm:w-4"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>

          {/* Headline is the readable long form (e.g. "National Capital
              Region", "CALABARZON"); the short code (e.g. "NCR", "Region
              IV-A") drops to the subtitle. Long form reads better as the
              primary at a glance; the code stays for cross-reference. The
              full DB id is preserved in the href so the server-side filter
              still matches "Region IV-A (CALABARZON)". */}
          <div className="font-display text-[16px] font-semibold leading-[1.15] text-text sm:text-[20px]">
            {sub ?? name}
          </div>
          {sub && <div className="text-[11px] text-text-muted sm:text-[13px]">{name}</div>}

          <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand sm:mt-auto sm:text-[12px]">
            {region.count} clinics
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>
        );
      })}
    </div>
  );
}
