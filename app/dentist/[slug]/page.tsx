import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Dentist, { type DentistClinic } from '@/lib/models/Dentist';
import Avatar from '@/components/ui/Avatar';
import AppointmentForm from '@/components/forms/AppointmentForm';
import CtaSection from '@/components/sections/CtaSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const dentist = await Dentist.findOne({ slug }).select('name').lean();
  if (!dentist) return {};
  return {
    title: `${dentist.name} — EGDN`,
    description: `Book an appointment with ${dentist.name} through the Elite Group Dental Network.`,
  };
}

export default async function DentistProfilePage({ params }: PageProps) {
  const { slug } = await params;

  await connectDB();
  const dentist = await Dentist.findOne({ slug }).lean();

  if (!dentist) notFound();

  const firstClinic = dentist.clinics[0];

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Breadcrumb */}
        <nav className="mb-6 text-[13px] text-text-muted" aria-label="Breadcrumb">
          <Link href="/find-a-dentist" className="hover:text-brand transition-colors">
            Find a Dentist
          </Link>
          <span className="mx-1.5">›</span>
          <Link
            href={`/find-a-dentist?region=${encodeURIComponent(firstClinic?.region ?? '')}`}
            className="hover:text-brand transition-colors"
          >
            {firstClinic?.region}
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-text">{dentist.name}</span>
        </nav>

        {/* Profile header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <Avatar name={dentist.name} src={dentist.headshotUrl} size={96} />
          <div>
            <h1 className="font-display text-3xl font-bold text-text">{dentist.name}</h1>
            <p className="mt-1 text-[15px] text-text-muted">{firstClinic?.clinicName}</p>
            {dentist.specializations.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {dentist.specializations.map((s: string) => (
                  <span key={s} className="text-[12px] font-medium text-brand bg-brand-light rounded-full px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clinic details */}
        <div className="mt-10 space-y-6">
          {dentist.clinics.map((clinic: DentistClinic, i: number) => (
            <div key={i} className="rounded-card border border-border bg-surface p-6">
              {dentist.clinics.length > 1 && (
                <h2 className="font-display text-[18px] font-semibold text-text mb-4">
                  Location {i + 1}
                </h2>
              )}
              <dl className="grid gap-3">
                <Row label="Clinic" value={clinic.clinicName} />
                <Row label="Address" value={clinic.address} />
                <Row label="Nearest Landmark" value={clinic.nearestLandmark} />
                <Row label="City / Region" value={`${clinic.city}, ${clinic.region}`} />
                <Row label="Schedule" value={clinic.schedule} />
                <Row label="Contact" value={clinic.contactNumber} />
                <div className="flex gap-4 text-[14px]">
                  <dt className="w-36 shrink-0 font-medium text-text">Map</dt>
                  <dd>
                    <a
                      href={clinic.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      View on Google Maps →
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {/* Appointment form */}
        <div className="mt-10 rounded-card border border-border bg-surface p-6">
          <h2 className="font-display text-2xl font-semibold text-text">
            Book an Appointment with {dentist.name}
          </h2>
          <p className="mt-2 mb-8 text-[15px] text-text-muted">
            Fill out the form below and EGDN will confirm your booking within 1 business day.
          </p>
          <AppointmentForm
            dentist={{
              id: String(dentist._id),
              name: dentist.name,
              clinics: dentist.clinics.map((c: DentistClinic) => ({ clinicName: c.clinicName, city: c.city })),
            }}
          />
        </div>
      </div>

      <CtaSection />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 text-[14px]">
      <dt className="w-36 shrink-0 font-medium text-text">{label}</dt>
      <dd className="text-text-muted">{value}</dd>
    </div>
  );
}
