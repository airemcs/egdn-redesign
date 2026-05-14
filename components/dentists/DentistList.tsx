import DentistCard from './DentistCard';
import FilterDropdown from './FilterDropdown';
import DentistSearchInput from './DentistSearchInput';
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
  selectedCity?: string;
  selectedSpecialization?: string;
  selectedName?: string;
}

const FilterFallback = ({ placeholder }: { placeholder: string }) => (
  <div className="flex h-12 items-center rounded-input border border-border bg-surface px-4">
    <span className="text-[14px] text-text-muted">{placeholder}</span>
  </div>
);

export default function DentistList({
  dentists,
  cities,
  specializations,
  selectedCity,
  selectedSpecialization,
  selectedName,
}: DentistListProps) {
  return (
    <div>
      {/* Filter card — name search on top (full-width), then city +
          specialization dropdowns in a 2-col grid (stacked on mobile). */}
      <div className="mb-5 sm:mb-6">
        <div className="rounded-card border border-border bg-surface p-5 sm:p-6">
          <span className="mb-3 block text-[13px] font-medium text-text">Filter by</span>
          <div className="flex flex-col gap-3 sm:gap-4">
            <Suspense fallback={<FilterFallback placeholder="Search by dentist name or phone number…" />}>
              <DentistSearchInput selected={selectedName} />
            </Suspense>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <Suspense fallback={<FilterFallback placeholder="All cities & municipalities" />}>
                <FilterDropdown
                  options={cities}
                  selected={selectedCity}
                  paramName="city"
                  placeholder="All cities & municipalities"
                  ariaLabel="Filter by city"
                />
              </Suspense>
              <Suspense fallback={<FilterFallback placeholder="All specializations" />}>
                <FilterDropdown
                  options={specializations}
                  selected={selectedSpecialization}
                  paramName="specialization"
                  placeholder="All specializations"
                  ariaLabel="Filter by specialization"
                />
              </Suspense>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-text-muted">
          {dentists.length} {dentists.length === 1 ? 'result' : 'results'}
        </p>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {dentists.map((d) => (
            <DentistCard key={d._id} {...d} />
          ))}
        </div>
      )}
    </div>
  );
}
