/**
 * Audit suffix-collided slugs in the Dentist collection.
 *
 * Finds every slug ending in `-N` (N=2..9), pairs it with the matching base
 * slug if one exists, and prints both records side-by-side so you can tell
 * a real namesake from a Wix duplicate.
 *
 *   npm run -s tsx scripts/audit-slug-collisions.ts
 */
import './_env';
import mongoose from 'mongoose';
import { connectDB } from '../lib/mongodb';
import Dentist from '../lib/models/Dentist';

interface ClinicLite {
  clinicName?: string;
  address?: string;
  region?: string;
  city?: string;
  contactNumber?: string;
}

interface DentistRecord {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name?: string;
  specializations?: string[];
  clinics?: ClinicLite[];
}

function summariseClinics(d: DentistRecord): string {
  if (!d.clinics?.length) return '(no clinics)';
  return d.clinics
    .map((c) => `${c.clinicName ?? '?'} — ${c.city ?? '?'}, ${c.region ?? '?'}`)
    .join('\n      ');
}

async function main() {
  await connectDB();

  // Pull every slug that ends with `-N` (any single digit). Mongoose returns
  // lean objects so we can stringify cleanly.
  const suffixed = (await Dentist.find({ slug: { $regex: /-[2-9]$/ } })
    .select('slug name specializations clinics')
    .lean()) as unknown as DentistRecord[];

  if (suffixed.length === 0) {
    console.log('No suffixed slugs found — directory is clean.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${suffixed.length} suffixed slug${suffixed.length === 1 ? '' : 's'}.\n`);

  for (const dup of suffixed) {
    const base = dup.slug.replace(/-[2-9]$/, '');
    const baseDoc = (await Dentist.findOne({ slug: base })
      .select('slug name specializations clinics')
      .lean()) as unknown as DentistRecord | null;

    console.log('─'.repeat(80));
    console.log(`SUFFIXED  /dentist/${dup.slug}`);
    console.log(`   name:           ${dup.name ?? '(none)'}`);
    console.log(`   specializations: ${dup.specializations?.join(', ') ?? '(none)'}`);
    console.log(`   clinics:        ${summariseClinics(dup)}`);
    if (!baseDoc) {
      console.log(`BASE      /dentist/${base}   →  ❌ NOT FOUND (orphan suffix — bad seed)`);
      continue;
    }
    console.log(`BASE      /dentist/${base}`);
    console.log(`   name:           ${baseDoc.name ?? '(none)'}`);
    console.log(`   specializations: ${baseDoc.specializations?.join(', ') ?? '(none)'}`);
    console.log(`   clinics:        ${summariseClinics(baseDoc)}`);

    const sameName = baseDoc.name?.toLowerCase().trim() === dup.name?.toLowerCase().trim();
    const sameSpec =
      (baseDoc.specializations ?? []).sort().join('|') ===
      (dup.specializations ?? []).sort().join('|');
    console.log(`\n   →  same name?            ${sameName ? 'YES' : 'no'}`);
    console.log(`   →  same specialization?  ${sameSpec ? 'YES' : 'no'}`);
    console.log(
      `   →  verdict:              ${
        sameName ? '⚠️ likely Wix duplicate — merge into base' : '✓ probable namesake — keep both'
      }`,
    );
  }
  console.log('─'.repeat(80));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
