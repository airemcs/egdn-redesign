import Link from 'next/link';
import Button from '@/components/ui/Button';

interface DentistCardProps {
  name: string;
  slug: string;
  clinicName: string;
  city: string;
  address: string;
  contactNumber: string;
  specializations: string[];
  multipleLocations?: boolean;
}

export default function DentistCard({
  name,
  slug,
  clinicName,
  city,
  address,
  contactNumber,
  specializations,
  multipleLocations,
}: DentistCardProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-6 flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-display text-[18px] font-semibold text-text">{name}</h3>
          {multipleLocations && (
            <span className="text-[11px] font-medium text-brand bg-brand-light rounded-full px-2.5 py-1 shrink-0">
              Multiple locations
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[14px] text-text-muted">{clinicName}</p>
      </div>

      {specializations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specializations.map((s) => (
            <span key={s} className="text-[12px] font-medium text-brand bg-brand-light rounded-full px-2.5 py-1">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1 text-[14px] text-text-muted">
        <p>{city}</p>
        <p className="line-clamp-2">{address}</p>
        <p>{contactNumber}</p>
      </div>

      <div className="mt-auto pt-2">
        <Button href={`/dentist/${slug}`} variant="secondary" size="default">
          View Profile
        </Button>
      </div>
    </div>
  );
}
