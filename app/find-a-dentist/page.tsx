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
  searchParams: Promise<{ region?: string; city?: string; specialization?: string }>;
}

export default async function FindADentistPage({ searchParams }: PageProps) {
  const { region, city, specialization } = await searchParams;

  await connectDB();

  // ── No region selected — show region picker ──────────────────────────────
  if (!region) {
    // Standard Philippine region order — NCR, CAR, then I → XIII numerically.
    // Anything not in this list (future regions, typos) falls to the bottom.
    const REGION_ORDER = [
      'NCR',
      'CAR',
      'Region I (Ilocos)',
      'Region II (Cagayan Valley)',
      'Region III (Central Luzon)',
      'Region IV-A (CALABARZON)',
      'Region IV-B (MIMAROPA)',
      'Region V (Bicol)',
      'Region VI (Western Visayas)',
      'Region VII (Central Visayas)',
      'Region VIII (Eastern Visayas)',
      'Region IX (Zamboanga Peninsula)',
      'Region X (Northern Mindanao)',
      'Region XI (Davao)',
      'Region XII (SOCCSKSARGEN)',
      'Region XIII (Caraga)',
      'BARMM (Bangsamoro)',
    ];
    const regions = await Dentist.aggregate<{ _id: string; count: number }>([
      { $unwind: '$clinics' },
      { $group: { _id: '$clinics.region', count: { $sum: 1 } } },
    ]);
    regions.sort((a, b) => {
      const ia = REGION_ORDER.indexOf(a._id);
      const ib = REGION_ORDER.indexOf(b._id);
      const ra = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
      const rb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
      if (ra !== rb) return ra - rb;
      return a._id.localeCompare(b._id);
    });

    return (
      <>
        {/* ── Page header ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-300 px-5 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-10">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Find a Dentist' }]} />
          {/* Only the title block (eyebrow + h1 + subtitle) is constrained —
              breadcrumb stays at full container width. Matches the design's
              <div className="section-head" style={{maxWidth: 720}}> pattern. */}
          <div className="max-w-[720px]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
              Find a dentist
            </span>
            <h1 className="mb-3 font-display text-[28px] font-bold leading-[1.2] text-text sm:text-[34px] lg:text-[40px]">
              Find a Dentist
            </h1>
            <p
              className="text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Choose your region to see partner clinics near you.
            </p>
          </div>
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
  if (specialization) filter.specializations = specialization;

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

  // Aggregate all available cities and specializations IN THIS REGION
  // (independent of current city/specialization filter so users can switch).
  const allInRegion = await Dentist.find({ 'clinics.region': region })
    .select('clinics specializations')
    .lean();
  const cities = [
    ...new Set(
      allInRegion.flatMap((d) =>
        d.clinics
          .filter((c: DentistClinic) => c.region === region)
          .map((c: DentistClinic) => c.city)
      )
    ),
  ].sort();
  const specializations = [
    ...new Set(allInRegion.flatMap((d) => d.specializations as string[])),
  ].sort();

  return (
    <>
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-10">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Find a Dentist', href: '/find-a-dentist' },
            { label: region },
          ]}
        />
        <div className="max-w-[720px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
            Browse the network
          </span>
          <h1 className="mb-3 font-display text-[28px] font-bold leading-[1.2] text-text sm:text-[34px] lg:text-[40px]">
            Dentists in {region}
          </h1>
          <p
            className="text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
            {dentists.length} partner {dentists.length === 1 ? 'clinic' : 'clinics'}
            {city ? ` in ${city}` : ''}.
          </p>
        </div>
      </section>

      {/* ── Dentist list ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 py-8 sm:px-6 sm:py-10 lg:px-10">
        <DentistList
          dentists={dentists}
          region={region}
          cities={cities}
          specializations={specializations}
          selectedCity={city}
          selectedSpecialization={specialization}
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
