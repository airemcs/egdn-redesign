'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface CityFilterProps {
  cities: string[];
  region: string;
  selectedCity?: string;
}

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

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          value={selectedCity ?? ''}
          onChange={handleChange}
          className="rounded-input border border-border bg-surface py-2.5 pl-4 pr-10 text-[14px] text-text focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 appearance-none cursor-pointer min-w-[220px]"
        >
          <option value="">All cities & municipalities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {selectedCity && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('city');
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="text-[13px] text-text-muted hover:text-brand transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
