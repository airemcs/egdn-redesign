'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * Brand-coloured text link shown on the right side of the result-count row.
 * Renders nothing unless at least one filter param (`city`, `specialization`,
 * or `name`) is active. Tapping it strips those three keys from the URL
 * while leaving `region` intact, so the user lands back on the unfiltered
 * region detail view.
 */
const FILTER_PARAMS = ['city', 'specialization', 'name'] as const;

export default function ClearFiltersLink() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasFilter = FILTER_PARAMS.some((key) => searchParams.get(key));
  if (!hasFilter) return null;

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_PARAMS.forEach((k) => params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <button
      type="button"
      onClick={clear}
      className="shrink-0 text-[12px] font-semibold text-brand transition-colors hover:underline sm:text-[13px]"
      aria-label="Clear all filters"
    >
      Clear filters
    </button>
  );
}
