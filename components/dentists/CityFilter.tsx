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
      <div className="relative flex-1">
        <select
          value={selectedCity ?? ''}
          onChange={handleChange}
          className="w-full rounded-input border border-border bg-surface py-3 pl-4 pr-10 text-[14px] text-text focus:outline-none focus:border-brand focus:ring-2 focus:ring-[rgba(27,127,168,0.12)] appearance-none cursor-pointer"
        >
          <option value="">All cities & municipalities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="6 9 12 15 18 9" />
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
          className="text-[13px] font-semibold text-brand hover:underline underline-offset-[3px] whitespace-nowrap"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
