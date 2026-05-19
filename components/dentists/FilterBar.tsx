'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import FilterSheet from './FilterSheet';

interface FilterBarProps {
  cities: string[];
  specializations: string[];
  selectedCity?: string;
  selectedSpecialization?: string;
}

/**
 * Mobile filter chip row. Renders a "Filters" pill with an active-count
 * badge, followed by one chip per active filter. Tapping the Filters pill
 * opens the FilterSheet; tapping an active chip's × removes that one filter
 * without opening the sheet.
 */
export default function FilterBar({
  cities,
  specializations,
  selectedCity,
  selectedSpecialization,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeCount = (selectedCity ? 1 : 0) + (selectedSpecialization ? 1 : 0);

  function clearFilter(key: 'city' | 'specialization') {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      {/* Negative horizontal margins let the chip row run edge-to-edge when
          it overflows on narrow screens. The gradient fade on the right edge
          hints at off-screen content when chips overflow. */}
      <div className="relative -mx-5">
        <div className="flex items-center gap-2 overflow-x-auto px-5 pb-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-[12px] font-semibold text-text transition-colors hover:border-text-muted"
          >
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
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="grid h-4 min-w-[16px] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          {selectedCity && (
            <ActiveChip label={selectedCity} onRemove={() => clearFilter('city')} />
          )}
          {selectedSpecialization && (
            <ActiveChip
              label={selectedSpecialization}
              onRemove={() => clearFilter('specialization')}
            />
          )}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-bg to-transparent"
        />
      </div>

      <FilterSheet
        open={open}
        onClose={() => setOpen(false)}
        cities={cities}
        specializations={specializations}
      />
    </>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-brand bg-brand pl-3 pr-1 text-[12px] font-semibold text-white">
      <span className="max-w-[140px] truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="grid h-5 w-5 place-items-center rounded-full hover:bg-white/20"
        aria-label={`Remove ${label} filter`}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}
