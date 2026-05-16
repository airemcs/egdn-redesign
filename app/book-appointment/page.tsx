import type { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';
import BookingWizard, { type DentistSummary } from '@/components/forms/BookingWizard';
import MobileBookingWizard from '@/components/forms/MobileBookingWizard';
import { connectDB } from '@/lib/mongodb';
import Dentist, { type DentistClinic } from '@/lib/models/Dentist';
import { formatDentistName } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Book an Appointment — EGDN',
  description: "Request a dental appointment through EGDN. We'll confirm within 1 business day.",
};

// Re-render hourly; the partner network only grows on a clinic-onboarding cadence.
export const revalidate = 3600;

function initialsOf(name: string): string {
  // Pick first letter of given name + first letter of surname when possible.
  const tokens = name.replace(/^(DR\.?|Dr\.?)\s+/i, '').split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '?';
  const first = tokens[0][0];
  const last = tokens[tokens.length - 1][0];
  return (first + (tokens.length > 1 ? last : '')).toUpperCase();
}

async function fetchBookingData() {
  await connectDB();

  // Region list (ordered by clinic count desc, alphabetical tiebreaker)
  const regions = await Dentist.aggregate<{ _id: string; count: number }>([
    { $unwind: '$clinics' },
    { $group: { _id: '$clinics.region', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ]);

  // Per-dentist summary the client form needs. Each dentist is represented
  // once (using their first clinic) for the picker UI — the booking flow
  // doesn't need every clinic location at this stage.
  const rawDentists = await Dentist.find({})
    .select('name slug specializations clinics')
    .lean();

  const dentists: DentistSummary[] = rawDentists.map((d) => {
    const clinic = (d.clinics?.[0] ?? {}) as DentistClinic;
    const contactNumbers = ((d.clinics ?? []) as DentistClinic[])
      .map((c) => c.contactNumber)
      .filter((p): p is string => Boolean(p));
    return {
      slug: d.slug,
      name: formatDentistName(d.name),
      initials: initialsOf(d.name),
      region: clinic.region ?? '',
      city: clinic.city ?? '',
      specialty: d.specializations?.[0] ?? '',
      clinicName: clinic.clinicName ?? '',
      contactNumbers,
    };
  });

  const specialties = [
    ...new Set(rawDentists.flatMap((d) => (d.specializations ?? []) as string[])),
  ].sort();

  return { regions, dentists, specialties };
}

export default async function BookAppointmentPage() {
  const { regions, dentists, specialties } = await fetchBookingData();

  return (
    <>
      {/* ── Mobile (<md) — full-bleed wizard with sticky progress header ──── */}
      <div className="md:hidden">
        <MobileBookingWizard regions={regions} dentists={dentists} specialties={specialties} />
      </div>

      {/* ── Desktop (md+) — existing page header + sidebar wizard, unchanged */}
      <div className="hidden md:block">
        <section className="mx-auto max-w-300 px-5 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-10">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Book an Appointment' }]} />
          <div className="max-w-[720px]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
              Member benefit
            </span>
            <h1 className="mb-3 font-display text-[28px] font-bold leading-[1.2] text-text sm:text-[34px] lg:text-[40px]">
              Book your appointment
            </h1>
            <p
              className="text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Tell us a bit about you and where you&apos;d like to be seen. EGDN will confirm your
              booking by phone within 1 business day — no paperwork at the clinic.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-300 px-5 pt-8 pb-16 sm:px-6 sm:pt-10 lg:px-10 lg:pb-24">
          <BookingWizard regions={regions} dentists={dentists} specialties={specialties} />
        </section>
      </div>
    </>
  );
}
