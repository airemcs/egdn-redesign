import DentistCard from './DentistCard';
import DentistSearchInput from './DentistSearchInput';
import FilterBar from './FilterBar';
import ClearFiltersLink from './ClearFiltersLink';
import { Suspense } from 'react';

interface Dentist {
  _id: string;
  name: string;
  slug: string;
  clinicName: string;
  city: string;
  address: string;
  contactNumber: string;
  specializations: string[];
}

interface DentistListProps {
  dentists: Dentist[];
  region: string;
  cities: string[];
  specializations: string[];
  /** Total partner clinics in this region, ignoring any active filter. Used
   *  for the "Showing 12 of 64" line below the chip row. */
  total: number;
  selectedCity?: string;
  selectedSpecialization?: string;
  selectedName?: string;
}

const SearchFallback = () => (
  <div className="flex h-12 items-center rounded-input border border-border bg-surface px-4">
    <span className="text-[14px] text-text-muted">Search dentists, clinics, cities…</span>
  </div>
);

const FilterBarFallback = () => (
  <div className="-mx-5 flex items-center gap-2 px-5 pb-1">
    <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-[12px] font-semibold text-text">
      Filters
    </span>
  </div>
);

export default function DentistList({
  dentists,
  cities,
  specializations,
  total,
  selectedCity,
  selectedSpecialization,
  selectedName,
}: DentistListProps) {
  const isFiltered = !!(selectedCity || selectedSpecialization || selectedName);

  return (
    <div>
      <div className="mb-3">
        <Suspense fallback={<SearchFallback />}>
          <DentistSearchInput
            selected={selectedName}
            placeholder="Search dentists, clinics, cities…"
          />
        </Suspense>
      </div>

      <Suspense fallback={<FilterBarFallback />}>
        <FilterBar
          cities={cities}
          specializations={specializations}
          selectedCity={selectedCity}
          selectedSpecialization={selectedSpecialization}
        />
      </Suspense>

      {/* "Showing 12 of 64 in Makati" + Clear filters link — matches the
          design's row beneath the chip strip. */}
      <div className="mt-3 mb-4 flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-text-muted">
          {isFiltered ? `Showing ${dentists.length} of ${total}` : `Showing ${dentists.length}`}
          {selectedCity ? ` in ${selectedCity}` : ''}
        </span>
        <Suspense fallback={null}>
          <ClearFiltersLink />
        </Suspense>
      </div>

      {dentists.length === 0 ? (
        <div className="rounded-card border border-border bg-surface p-10 text-center">
          <p className="text-[15px] text-text-muted">
            No dentists found
            {selectedName ? ` matching "${selectedName}"` : ''}
            {selectedCity ? ` in ${selectedCity}` : ''}
            {selectedSpecialization ? ` for ${selectedSpecialization}` : ''}
            . Try a different filter or{' '}
            <a href="/contact" className="text-brand hover:underline">
              contact us
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:gap-5">
          {dentists.map((d) => (
            <DentistCard key={d._id} {...d} />
          ))}
        </div>
      )}
    </div>
  );
}
