/**
 * Read-only audit of the live Dentist collection.
 *
 *   npx tsx scripts/audit-dataset.ts
 *
 * Reports total counts, per-region clinic counts, top specializations, and
 * data-quality flags (missing fields, slugs ending in digits, dentists with
 * no specializations, duplicate clinic addresses within a single dentist).
 */
import './_env';
import mongoose from 'mongoose';
import { connectDB } from '../lib/mongodb';
import Dentist, { type DentistClinic } from '../lib/models/Dentist';

interface DentistDoc {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  specializations?: string[];
  clinics?: DentistClinic[];
  headshotUrl?: string | null;
}

function pad(s: string, n: number) {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

async function main() {
  await connectDB();

  const dentists = (await Dentist.find({}).lean()) as unknown as DentistDoc[];

  // ── Top-line counts ───────────────────────────────────────────────────────
  const totalDentists = dentists.length;
  const totalClinics = dentists.reduce((n, d) => n + (d.clinics?.length ?? 0), 0);
  const regionSet = new Set<string>();
  const cityKeys = new Set<string>(); // "region|city" so duplicate city names in different regions count separately
  const specCount = new Map<string, number>();

  for (const d of dentists) {
    for (const c of d.clinics ?? []) {
      regionSet.add(c.region);
      cityKeys.add(`${c.region}|${c.city}`);
    }
    for (const s of d.specializations ?? []) {
      specCount.set(s, (specCount.get(s) ?? 0) + 1);
    }
  }

  console.log('═══ TOP-LINE ═══');
  console.log(`Dentists:        ${totalDentists}`);
  console.log(`Clinics:         ${totalClinics}`);
  console.log(`Regions covered: ${regionSet.size}`);
  console.log(`Cities/munis:    ${cityKeys.size}`);
  console.log(`Specializations: ${specCount.size}`);
  console.log(`Avg clinics/dentist: ${(totalClinics / totalDentists).toFixed(2)}`);

  // ── Clinics per region ────────────────────────────────────────────────────
  const regionCount = new Map<string, number>();
  for (const d of dentists) {
    for (const c of d.clinics ?? []) {
      regionCount.set(c.region, (regionCount.get(c.region) ?? 0) + 1);
    }
  }
  const regionRows = [...regionCount.entries()].sort((a, b) => b[1] - a[1]);
  console.log('\n═══ CLINICS PER REGION ═══');
  for (const [r, n] of regionRows) console.log(`  ${pad(r, 40)} ${String(n).padStart(4)}`);

  // ── Specialization counts ─────────────────────────────────────────────────
  const specRows = [...specCount.entries()].sort((a, b) => b[1] - a[1]);
  console.log('\n═══ SPECIALIZATIONS (count = # of dentists holding it) ═══');
  for (const [s, n] of specRows) console.log(`  ${pad(s, 40)} ${String(n).padStart(4)}`);

  // ── Clinic distribution (how many dentists have N clinics) ───────────────
  const distribution = new Map<number, number>();
  for (const d of dentists) {
    const n = d.clinics?.length ?? 0;
    distribution.set(n, (distribution.get(n) ?? 0) + 1);
  }
  console.log('\n═══ CLINIC-COUNT DISTRIBUTION ═══');
  for (const [n, count] of [...distribution.entries()].sort((a, b) => a[0] - b[0])) {
    console.log(`  ${pad(`${n} clinic${n === 1 ? '' : 's'}`, 12)} ${String(count).padStart(4)} dentists`);
  }

  // ── Data-quality flags ────────────────────────────────────────────────────
  console.log('\n═══ DATA-QUALITY FLAGS ═══');

  const noSpec = dentists.filter((d) => !d.specializations?.length);
  console.log(`Dentists with NO specializations:  ${noSpec.length}`);
  if (noSpec.length > 0 && noSpec.length <= 10) {
    noSpec.forEach((d) => console.log(`   - ${d.slug}  (${d.name})`));
  } else if (noSpec.length > 10) {
    noSpec.slice(0, 5).forEach((d) => console.log(`   - ${d.slug}  (${d.name})`));
    console.log(`   … (+${noSpec.length - 5} more)`);
  }

  const noHeadshot = dentists.filter((d) => !d.headshotUrl);
  console.log(`Dentists with NO headshot:         ${noHeadshot.length} of ${totalDentists}`);

  const suffixedSlugs = dentists.filter((d) => /-\d+$/.test(d.slug));
  console.log(`Slugs ending in -<digit>:          ${suffixedSlugs.length}`);
  suffixedSlugs.forEach((d) => console.log(`   - ${d.slug}  (${d.name})`));

  // Duplicate clinic name+address within a single dentist (probable Wix dup)
  let intraDupClinics = 0;
  for (const d of dentists) {
    const seen = new Set<string>();
    for (const c of d.clinics ?? []) {
      const key = `${c.clinicName}|${c.address}`.toLowerCase();
      if (seen.has(key)) intraDupClinics++;
      seen.add(key);
    }
  }
  console.log(`Intra-dentist duplicate clinics:   ${intraDupClinics}`);

  // Same-name dentists (probable Wix duplicates split into separate docs)
  const nameMap = new Map<string, DentistDoc[]>();
  for (const d of dentists) {
    const k = d.name?.toLowerCase().trim().replace(/\s+/g, ' ');
    if (!k) continue;
    if (!nameMap.has(k)) nameMap.set(k, []);
    nameMap.get(k)!.push(d);
  }
  const nameClashes = [...nameMap.entries()].filter(([, list]) => list.length > 1);
  console.log(`Same-name dentist groups:          ${nameClashes.length}`);
  if (nameClashes.length > 0 && nameClashes.length <= 15) {
    nameClashes.forEach(([n, list]) => {
      console.log(`   - "${n}"  →  ${list.map((d) => d.slug).join(', ')}`);
    });
  } else if (nameClashes.length > 15) {
    nameClashes.slice(0, 10).forEach(([n, list]) => {
      console.log(`   - "${n}"  →  ${list.map((d) => d.slug).join(', ')}`);
    });
    console.log(`   … (+${nameClashes.length - 10} more)`);
  }

  // Missing-field check on clinic subdocs (schema marks all required, but
  // older docs may have empty strings)
  const missingFieldCounts: Record<string, number> = {
    clinicName: 0,
    address: 0,
    region: 0,
    city: 0,
    schedule: 0,
    contactNumber: 0,
    nearestLandmark: 0,
    googleMapsUrl: 0,
  };
  for (const d of dentists) {
    for (const c of d.clinics ?? []) {
      for (const k of Object.keys(missingFieldCounts)) {
        const v = (c as unknown as Record<string, unknown>)[k];
        if (v == null || (typeof v === 'string' && v.trim() === '')) {
          missingFieldCounts[k]++;
        }
      }
    }
  }
  console.log(`\nBlank fields across ${totalClinics} clinic subdocs:`);
  for (const [k, n] of Object.entries(missingFieldCounts)) {
    console.log(`   ${pad(k, 20)} ${String(n).padStart(4)}  ${n ? '⚠️' : '✓'}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
