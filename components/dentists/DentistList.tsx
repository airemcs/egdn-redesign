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
      {/* Filter bar */}
      <div className="mb-6 rounded-card border border-border bg-surface p-6 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
          <span className="text-[13px] font-medium text-text">Filter by city</span>
          <Suspense>
            <CityFilter cities={cities} region={region} selectedCity={selectedCity} />
          </Suspense>
        </div>
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
