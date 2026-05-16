/**
 * List every city/municipality in the dentist dataset, grouped by region,
 * with clinic count per city. Useful when cleaning the dataset — match these
 * exact strings to keep filtering/search consistent.
 *
 *   npx tsx scripts/list-cities.ts
 */
import './_env';
import mongoose from 'mongoose';
import { connectDB } from '../lib/mongodb';
import Dentist, { type DentistClinic } from '../lib/models/Dentist';

// Same canonical order as /find-a-dentist region grid.
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

async function main() {
  await connectDB();
  const dentists = (await Dentist.find({}).select('clinics').lean()) as unknown as Array<{
    clinics?: DentistClinic[];
  }>;

  // region → city → count
  const byRegion = new Map<string, Map<string, number>>();
  for (const d of dentists) {
    for (const c of d.clinics ?? []) {
      if (!byRegion.has(c.region)) byRegion.set(c.region, new Map());
      const cityMap = byRegion.get(c.region)!;
      cityMap.set(c.city, (cityMap.get(c.city) ?? 0) + 1);
    }
  }

  const orderedRegions = [
    ...REGION_ORDER.filter((r) => byRegion.has(r)),
    ...[...byRegion.keys()].filter((r) => !REGION_ORDER.includes(r)),
  ];

  let totalCities = 0;
  for (const region of orderedRegions) {
    const cityMap = byRegion.get(region)!;
    const cities = [...cityMap.entries()].sort((a, b) => b[1] - a[1]);
    console.log(`\n═══ ${region}  (${cities.length} ${cities.length === 1 ? 'city' : 'cities'}) ═══`);
    for (const [city, n] of cities) {
      console.log(`   ${String(n).padStart(4)}  ${city}`);
    }
    totalCities += cities.length;
  }

  console.log(`\n────────────────────────`);
  console.log(`TOTAL unique city entries across all regions: ${totalCities}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
