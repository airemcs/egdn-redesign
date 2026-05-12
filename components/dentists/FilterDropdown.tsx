'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface FilterDropdownProps {
  options: string[];
  selected?: string;
  /** URL search-param key to read/write (e.g., "city", "specialization"). */
  paramName: string;
  /** Shown as the first option / empty-state label inside the select. */
  placeholder: string;
  /** Accessible label for the underlying <select>. */
  ariaLabel: string;
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FilterDropdown({
  options,
  selected,
  paramName,
  placeholder,
  ariaLabel,
}: FilterDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set(paramName, e.target.value);
    } else {
      params.delete(paramName);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramName);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 min-w-0 flex-1">
        <select
          value={selected ?? ''}
          onChange={handleChange}
          aria-label={ariaLabel}
          className="block h-12 w-full cursor-pointer appearance-none rounded-input border border-border bg-surface pl-4 pr-10 text-[14px] text-text transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <ChevronDown />
        </span>
      </div>

      {selected && (
        <button
          type="button"
          onClick={clear}
          className="text-[13px] font-semibold text-brand underline-offset-[3px] hover:underline whitespace-nowrap"
          aria-label={`Clear ${paramName} filter`}
        >
          Clear
        </button>
      )}
    </div>
  );
}
