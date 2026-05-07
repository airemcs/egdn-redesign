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
    // Order by clinic count desc; alphabetical as a tiebreaker so ties (e.g.
    // CAR and Region IV-B both at 2) stay in a predictable order.
    const regions = await Dentist.aggregate<{ _id: string; count: number }>([
      { $unwind: '$clinics' },
      { $group: { _id: '$clinics.region', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    return (
      <>
        {/* ── Page header ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-300 px-5 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-10 lg:pt-[58px]">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Find a Dentist' }]} />
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:mb-3 sm:text-[12px]">
            Find a dentist
          </span>
          <h1 className="mt-3 mb-[14px] font-display text-[28px] font-bold leading-[1.2] text-text sm:mt-4 sm:mb-[18px] sm:text-[34px] lg:text-[40px]">
            Find a Dentist
          </h1>
          <p
            className="max-w-[620px] text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
            Choose your region to see partner clinics near you.
          </p>
        </section>

        {/* ── Region cards ───────────────────────────────────────────────── */}
        <section className="mx-auto max-w-300 px-5 pt-8 pb-16 sm:px-6 sm:pt-10 lg:px-10 lg:pb-24">
          <RegionGrid regions={regions} />
        </section>

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
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-10 lg:pt-[58px]">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Find a Dentist', href: '/find-a-dentist' },
            { label: region },
          ]}
        />
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:mb-3 sm:text-[12px]">
          Browse the network
        </span>
        <h1 className="mt-3 mb-[14px] font-display text-[28px] font-bold leading-[1.2] text-text sm:mt-4 sm:mb-[18px] sm:text-[34px] lg:text-[40px]">
          Dentists in {region}
        </h1>
        <p
          className="max-w-[620px] text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
          style={{ textWrap: 'pretty' } as React.CSSProperties}
        >
          {dentists.length} partner {dentists.length === 1 ? 'clinic' : 'clinics'}
          {city ? ` in ${city}` : ''}.
        </p>
      </section>

      {/* ── Dentist list ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 pt-8 pb-16 sm:px-6 sm:pt-10 lg:px-10 lg:pb-24">
        <DentistList
          dentists={dentists}
          region={region}
          cities={cities}
          selectedCity={city}
        />
      </section>

      <CtaSection
        headline="Can't find a dentist nearby?"
        subtext="Nominate a clinic and we'll look into adding them to the network."
        primaryLabel="Nominate a Dentist"
        primaryHref="/nominate"
      />
    </>
  );
}
