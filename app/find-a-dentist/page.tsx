import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Dentist, { type DentistClinic } from '@/lib/models/Dentist';
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

  if (!region) {
    const regions = await Dentist.aggregate<{ _id: string; count: number }>([
      { $unwind: '$clinics' },
      { $group: { _id: '$clinics.region', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return (
      <>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">Find a Dentist</h1>
          <p className="mt-3 text-[16px] text-text-muted">
            Choose your region to see partner clinics near you.
          </p>
          <div className="mt-10">
            <RegionGrid regions={regions} />
          </div>
        </div>
        <CtaSection
          headline="Don't know your region?"
          subtext="Contact us and we'll help you find the right clinic."
          primaryLabel="Contact EGDN"
          primaryHref="/contact"
          secondaryLabel={undefined}
          secondaryHref={undefined}
        />
      </>
    );
  }

  // Region selected — fetch dentists
  const filter: Record<string, string> = { 'clinics.region': region };
  if (city) filter['clinics.city'] = city;

  const rawDentists = await Dentist.find(filter).select('name slug specializations clinics').lean();

  const dentists = rawDentists.map((d) => {
    const match = d.clinics.find((c: DentistClinic) => c.region === region && (!city || c.city === city));
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

  // Unique cities in this region
  const allInRegion = await Dentist.find({ 'clinics.region': region })
    .select('clinics')
    .lean();
  const cities = [
    ...new Set(
      allInRegion.flatMap((d) =>
        d.clinics.filter((c: DentistClinic) => c.region === region).map((c: DentistClinic) => c.city)
      )
    ),
  ].sort();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav className="mb-4 text-[13px] text-text-muted" aria-label="Breadcrumb">
          <Link href="/find-a-dentist" className="hover:text-brand transition-colors">
            Find a Dentist
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-text">{region}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
          Dentists in {region}
        </h1>
        <div className="mt-10">
          <DentistList
            dentists={dentists}
            region={region}
            cities={cities}
            selectedCity={city}
          />
        </div>
      </div>
      <CtaSection
        headline="Can't find a dentist nearby?"
        subtext="Nominate a clinic and we'll look into adding them to the network."
        primaryLabel="Nominate a Dentist"
        primaryHref="/nominate"
        secondaryLabel={undefined}
        secondaryHref={undefined}
      />
    </>
  );
}
