'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface CityFilterProps {
  cities: string[];
  region: string;
  selectedCity?: string;
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function CityFilter({ cities, region, selectedCity }: CityFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('region', region);
    if (e.target.value) {
      params.set('city', e.target.value);
    } else {
      params.delete('city');
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilter() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('region', region);
    params.delete('city');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      {/* Width is owned by the parent wrapper in DentistList. flex-1 here
          just means "fill that wrapper". min-w-0 prevents the select's intrinsic
          option text width from forcing the flex item wider than its share. */}
      <div className="relative h-12 min-w-0 flex-1">
        <select
          value={selectedCity ?? ''}
          onChange={handleChange}
          aria-label="Filter by city"
          className="block h-12 w-full cursor-pointer appearance-none rounded-input border border-border bg-surface pl-4 pr-10 text-[14px] text-text transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]"
        >
          <option value="">All cities &amp; municipalities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <ChevronDown />
        </span>
      </div>

      {selectedCity && (
        <button
          type="button"
          onClick={clearFilter}
          className="text-[13px] font-semibold text-brand underline-offset-[3px] hover:underline whitespace-nowrap"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
