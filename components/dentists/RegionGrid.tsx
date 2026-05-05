import Link from 'next/link';

interface Region {
  _id: string;
  count: number;
}

interface RegionGridProps {
  regions: Region[];
}

export default function RegionGrid({ regions }: RegionGridProps) {
  if (regions.length === 0) {
    return (
      <p className="text-text-muted text-[15px]">No regions found. Check back soon.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {regions.map((region) => (
        <Link
          key={region._id}
          href={`/find-a-dentist?region=${encodeURIComponent(region._id)}`}
          className="group flex flex-col justify-between rounded-card border border-border bg-surface p-5 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <span className="font-body text-[14px] font-semibold text-text group-hover:text-brand transition-colors leading-snug">
            {region._id}
          </span>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[13px] text-text-muted">
              {region.count} {region.count === 1 ? 'clinic' : 'clinics'}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-brand">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
