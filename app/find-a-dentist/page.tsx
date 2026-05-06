import type { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import Dentist, { type DentistClinic } from '@/lib/models/Dentist';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RegionGrid from '@/components/dentists/RegionGrid';
import DentistList from '@/components/dentists/DentistList';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Find a Dentist — EGDN',
  description: 'Search 600+ partner dental clinics across 16 regions in the Philippines.',
};

interface PageProps {
  searchParams: Promise<{ region?: string; city?: string }>;
}

export default async function FindADentistPage({ searchParams }: PageProps) {
  const { region, city } = await searchParams;

  await connectDB();

  // ── No region selected — show region picker ──────────────────────────────
  if (!region) {
    const regions = await Dentist.aggregate<{ _id: string; count: number }>([
      { $unwind: '$clinics' },
      { $group: { _id: '$clinics.region', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return (
      <>
        <div className="mx-auto max-w-300 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Find a Dentist' }]} />
          <div className="mb-10 max-w-2xl">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Find a dentist
            </span>
            <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
              Find a Dentist
            </h1>
            <p className="mt-3 text-[16px] text-text-muted">
              Choose your region to see partner clinics near you.
            </p>
          </div>
          <RegionGrid regions={regions} />
        </div>
        <CtaSection
          headline="Don't know your region?"
          subtext="Contact us and we'll help you find the right clinic."
          primaryLabel="Contact EGDN"
          primaryHref="/contact"
        />
      </>
    );
  }

  // ── Region selected — fetch and filter dentists ──────────────────────────
  const filter: Record<string, string> = { 'clinics.region': region };
  if (city) filter['clinics.city'] = city;

  const rawDentists = await Dentist.find(filter).select('name slug specializations clinics').lean();

  const dentists = rawDentists.map((d) => {
    const match = d.clinics.find(
      (c: DentistClinic) => c.region === region && (!city || c.city === city)
    );
    const clinic = match ?? d.clinics[0];
    return {
      _id: String(d._id),
      name: d.name,
      slug: d.slug,
      specializations: d.specializations,
      clinicName: clinic?.clinicName ?? '',
      city: clinic?.city ?? '',
      address: clinic?.address ?? '',
      contactNumber: clinic?.contactNumber ?? '',
      multipleLocations: d.clinics.length > 1,
    };
  });

  const allInRegion = await Dentist.find({ 'clinics.region': region }).select('clinics').lean();
  const cities = [
    ...new Set(
      allInRegion.flatMap((d) =>
        d.clinics
          .filter((c: DentistClinic) => c.region === region)
          .map((c: DentistClinic) => c.city)
      )
    ),
  ].sort();

  return (
    <>
      <div className="mx-auto max-w-300 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <Breadcrumb
          crumbs={[
            { label: 'Find a Dentist', href: '/find-a-dentist' },
            { label: region },
          ]}
        />
        <div className="mb-10 max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
            Dentists in {region}
          </h1>
          <p className="mt-3 text-[16px] text-text-muted">
            {dentists.length} partner {dentists.length === 1 ? 'clinic' : 'clinics'}
            {city ? ` in ${city}` : ''}
          </p>
        </div>
        <DentistList
          dentists={dentists}
          region={region}
          cities={cities}
          selectedCity={city}
        />
      </div>
      <CtaSection
        headline="Can't find a dentist nearby?"
        subtext="Nominate a clinic and we'll look into adding them to the network."
        primaryLabel="Nominate a Dentist"
        primaryHref="/nominate"
      />
    </>
  );
}
