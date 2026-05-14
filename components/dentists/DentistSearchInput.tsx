'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Props {
  selected?: string;
  paramName?: string;
  placeholder?: string;
}

const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function DentistSearchInput({
  selected = '',
  paramName = 'name',
  placeholder = 'Search by dentist name or phone number…',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(selected);

  // Sync input when URL changes externally (back/forward, link clicks).
  useEffect(() => {
    setValue(selected);
  }, [selected]);

  // Debounce the URL write so we don't navigate on every keystroke.
  // 300ms feels responsive without spamming server-side fetches.
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === (selected ?? '')) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) params.set(paramName, trimmed);
      else params.delete(paramName);
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
    return () => clearTimeout(t);
    // We intentionally omit router/pathname/searchParams — they're stable
    // refs from Next that change on every render and would re-fire the
    // debounce timer for unrelated reasons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function clear() {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramName);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 min-w-0 flex-1">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Search by dentist name or phone number"
          className="block h-12 w-full rounded-input border border-border bg-surface pl-10 pr-4 text-[14px] text-text transition-colors placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]"
        />
      </div>
      {value && (
        <button
          type="button"
          onClick={clear}
          className="text-[13px] font-semibold text-brand underline-offset-[3px] hover:underline whitespace-nowrap"
          aria-label="Clear name filter"
        >
          Clear
        </button>
      )}
    </div>
  );
}
