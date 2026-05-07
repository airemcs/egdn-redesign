import DentistCard from './DentistCard';
import CityFilter from './CityFilter';
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
  multipleLocations?: boolean;
}

interface DentistListProps {
  dentists: Dentist[];
  region: string;
  cities: string[];
  selectedCity?: string;
}

export default function DentistList({ dentists, region, cities, selectedCity }: DentistListProps) {
  return (
    <div>
      {/* Filter bar — block layout on mobile (filter, then count below),
          flex-row on sm+. The width-controlling div around the filter has
          `w-full max-w-sm` so the select inside always has real width to
          claim, regardless of flex behavior. */}
      <div className="mb-5 sm:mb-6 sm:flex sm:items-center sm:gap-5">
        <div className="">
          <Suspense
            fallback={
              <div className="flex h-12 items-center rounded-input border border-border bg-surface px-4">
                <span className="text-[14px] text-text-muted">All cities &amp; municipalities</span>
              </div>
            }
          >
            <CityFilter cities={cities} region={region} selectedCity={selectedCity} />
          </Suspense>
        </div>
        <p className="mt-2 text-[13px] text-text-muted sm:mt-0">
          {dentists.length} {dentists.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {dentists.length === 0 ? (
        <div className="rounded-card border border-border bg-surface p-10 text-center">
          <p className="text-[15px] text-text-muted">
            No dentists found{selectedCity ? ` in ${selectedCity}` : ''}. Try a nearby city or{' '}
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
