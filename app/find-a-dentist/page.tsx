import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import Dentist, { type DentistClinic } from '@/lib/models/Dentist';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RegionGrid from '@/components/dentists/RegionGrid';
import DentistList from '@/components/dentists/DentistList';
import DentistCard from '@/components/dentists/DentistCard';
import DentistSearchInput from '@/components/dentists/DentistSearchInput';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Find a Dentist — EGDN',
  description: 'Search our nationwide network of partner dental clinics across the Philippines.',
};

interface PageProps {
  searchParams: Promise<{
    region?: string;
    city?: string;
    specialization?: string;
    name?: string;
  }>;
}

export default async function FindADentistPage({ searchParams }: PageProps) {
  const { region, city, specialization, name } = await searchParams;

  await connectDB();

  // ── No region selected ────────────────────────────────────────────────────
  if (!region) {
    // ── Global search (name/phone set, no region) ────────────────────────
    // Mirrors the mobile design's "Search results" screen: matches across
    // every region, no region constraint applied.
    if (name?.trim()) {
      const trimmed = name.trim();
      const escapedName = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const digits = trimmed.replace(/\D/g, '');
      const or: Record<string, unknown>[] = [
        { name: { $regex: escapedName, $options: 'i' } },
      ];
      if (digits.length >= 3) {
        const phoneRegex = digits.split('').join('\\D*');
        or.push({ 'clinics.contactNumber': { $regex: phoneRegex } });
      }
      const globalFilter: Record<string, unknown> = { $or: or };
      if (specialization) globalFilter.specializations = specialization;

      const rawResults = await Dentist.find(globalFilter)
        .select('name slug specializations clinics')
        .limit(60)
        .lean();
      const results = rawResults.map((d) => {
        const clinic = d.clinics[0];
        return {
          _id: String(d._id),
          name: d.name,
          slug: d.slug,
          specializations: d.specializations,
          clinicName: clinic?.clinicName ?? '',
          city: clinic?.city ?? '',
          address: clinic?.address ?? '',
          contactNumber: clinic?.contactNumber ?? '',
        };
      });

      return (
        <>
          <section className="mx-auto max-w-110 px-5 sm:max-w-[640px] sm:px-6 md:max-w-300 md:px-8 lg:px-10 pt-10 sm:pt-14 lg:pt-20 pb-2">
            <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Find a Dentist', href: '/find-a-dentist' }, { label: 'Search' }]} />
            <span className="eyebrow">
              {results.length} {results.length === 1 ? 'match' : 'matches'}
            </span>
            <h1 className="mt-1.5 h1 text-text">
              Results for &ldquo;{trimmed}&rdquo;
            </h1>
          </section>

          <section className="mx-auto max-w-110 px-5 sm:max-w-[640px] sm:px-6 md:max-w-300 md:px-8 lg:px-10 py-5">
            {/* Refine the search */}
            <div className="mb-4">
              <Suspense fallback={null}>
                <DentistSearchInput
                  selected={trimmed}
                  placeholder="Search dentists, clinics, cities…"
                />
              </Suspense>
            </div>

            {results.length === 0 ? (
              <div className="rounded-card border border-border bg-surface p-8 text-center">
                <p className="text-[14px] leading-normal text-text-muted">
                  No dentists or clinics match &ldquo;{trimmed}&rdquo;. Try a different spelling, browse by{' '}
                  <a href="/find-a-dentist" className="text-brand hover:underline">region</a>, or{' '}
                  <a href="/nominate" className="text-brand hover:underline">nominate a clinic</a> if they should be in the network.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:gap-5">
                {results.map((d) => (
                  <DentistCard key={d._id} {...d} />
                ))}
              </div>
            )}
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

    // ── Default landing: search bar + region grid ────────────────────────
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

    // Round total clinic count down to the nearest 100 for the marketing
    // subtitle ("600+ partner clinics"). Falls back to a flat "partner
    // clinics" phrasing if we somehow have fewer than 100.
    const totalClinics = regions.reduce((sum, r) => sum + r.count, 0);
    const roundedClinics = Math.floor(totalClinics / 100) * 100;

    return (
      <>
        {/* Section-padding note: Find-a-Dentist intentionally departs from the
            standard `py-12 sm:py-16 lg:py-20` body rhythm. The header, search
            bar, and region grid use tighter top/bottom paddings so the search
            input tucks under the page title and the region grid follows
            without an extra "gap" line. Don't normalize these to the standard
            rhythm without re-thinking the directory layout. */}
        {/* ── Page header ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-110 px-5 sm:max-w-[640px] sm:px-6 md:max-w-300 md:px-8 lg:px-10 pt-10 sm:pt-14 lg:pt-20 pb-4">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Find a Dentist' }]} />
          <h1 className="mb-2 h1 text-text">
            Find your dentist.
          </h1>
          <p
            className="text-[14px] leading-normal text-text-muted sm:text-[16px] lg:text-[19px]"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
            {roundedClinics >= 100
              ? `Search the EGDN directory of ${roundedClinics}+ partner clinics.`
              : 'Search the EGDN directory of partner clinics.'}
          </p>
        </section>

        {/* ── Global search bar ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-110 px-5 sm:max-w-[640px] sm:px-6 md:max-w-300 md:px-8 lg:px-10 pt-4">
          <Suspense fallback={null}>
            <DentistSearchInput placeholder="Search dentists, clinics, cities…" />
          </Suspense>
        </section>

        {/* ── Region cards ───────────────────────────────────────────────── */}
        <section className="mx-auto max-w-110 px-5 sm:max-w-[640px] sm:px-6 md:max-w-300 md:px-8 lg:px-10 pt-6 pb-16">
          <div className="mb-3 flex items-baseline justify-between sm:mb-4">
            <span className="eyebrow text-text-muted">
              Browse by region
            </span>
            <span className="text-[11px] text-text-muted sm:text-[12px]">
              {regions.length} {regions.length === 1 ? 'region' : 'regions'}
            </span>
          </div>
          <RegionGrid regions={regions} />
        </section>
      </>
    );
  }

  // ── Region selected — fetch and filter dentists ──────────────────────────
  const filter: Record<string, unknown> = { 'clinics.region': region };
  if (city) filter['clinics.city'] = city;
  if (specialization) filter.specializations = specialization;
  if (name) {
    // Single search field matches either dentist name OR clinic phone number.
    // - Name search is a case-insensitive substring (names are stored uppercase
    //   like "DR. MELISSA M. GATMAITAN").
    // - Phone search strips the query to digits-only and builds a regex that
    //   allows arbitrary non-digit separators between each digit, so a query
    //   of "6159" matches "(02) 6159-4010".
    const trimmed = name.trim();
    const escapedName = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const digits = trimmed.replace(/\D/g, '');
    const or: Record<string, unknown>[] = [
      { name: { $regex: escapedName, $options: 'i' } },
    ];
    if (digits.length >= 3) {
      const phoneRegex = digits.split('').join('\\D*');
      or.push({ 'clinics.contactNumber': { $regex: phoneRegex } });
    }
    filter.$or = or;
  }

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
      <section className="mx-auto max-w-110 px-5 sm:max-w-[640px] sm:px-6 md:max-w-300 md:px-8 lg:px-10 pt-10 sm:pt-14 lg:pt-20 pb-2">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Find a Dentist', href: '/find-a-dentist' },
            { label: region },
          ]}
        />
        <span className="eyebrow">
          {allInRegion.length} partner {allInRegion.length === 1 ? 'clinic' : 'clinics'}
        </span>
        <h1 className="mt-1.5 h1 text-text">
          Dentists in {region}
        </h1>
      </section>

      {/* ── Dentist list ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-110 px-5 sm:max-w-[640px] sm:px-6 md:max-w-300 md:px-8 lg:px-10 py-5">
        <DentistList
          dentists={dentists}
          region={region}
          cities={cities}
          specializations={specializations}
          total={allInRegion.length}
          selectedCity={city}
          selectedSpecialization={specialization}
          selectedName={name}
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
