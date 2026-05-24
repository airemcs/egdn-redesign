/**
 * Seed the Dentist collection from a JSON export.
 *
 *   npm run seed                            # uses default --file
 *   npm run seed -- --dry-run               # validate only, no DB writes
 *   npm run seed -- --reset                 # delete existing docs first
 *   npm run seed -- --file=path/to/dentists.json
 */
import './_env'; // must come first — populates process.env before lib/mongodb evaluates
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import mongoose from 'mongoose';
import { connectDB } from '../lib/mongodb';
import Dentist from '../lib/models/Dentist';

const DEFAULT_FILE = 'C:/Users/airelle/Documents/egdn-dentists-v2/dentists.json';

const REQUIRED_CLINIC_FIELDS = [
  'clinicName',
  'address',
  'region',
  'city',
  'schedule',
  'contactNumber',
  'nearestLandmark',
  'googleMapsUrl',
] as const;

interface ClinicInput {
  clinicName?: string;
  address?: string;
  region?: string;
  city?: string;
  schedule?: string;
  contactNumber?: string;
  nearestLandmark?: string;
  googleMapsUrl?: string;
}

interface DentistInput {
  slug?: string;
  name?: string;
  specializations?: string[];
  clinics?: ClinicInput[];
  headshotUrl?: string | null;
}

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    reset: args.includes('--reset'),
    file: args.find((a) => a.startsWith('--file='))?.split('=')[1] ?? DEFAULT_FILE,
  };
}

function isBlank(v: unknown): boolean {
  return v == null || (typeof v === 'string' && v.trim() === '');
}

function validate(records: DentistInput[]) {
  const valid: DentistInput[] = [];
  const skipped: { slug: string; reason: string }[] = [];

  for (const d of records) {
    if (isBlank(d.slug)) {
      skipped.push({ slug: d.name ?? '<unknown>', reason: 'missing slug' });
      continue;
    }
    if (isBlank(d.name)) {
      skipped.push({ slug: d.slug!, reason: 'missing name' });
      continue;
    }
    if (!Array.isArray(d.clinics) || d.clinics.length === 0) {
      skipped.push({ slug: d.slug!, reason: 'no clinics' });
      continue;
    }
    let ok = true;
    for (let i = 0; i < d.clinics.length; i++) {
      const c = d.clinics[i] as Record<string, unknown>;
      for (const f of REQUIRED_CLINIC_FIELDS) {
        if (isBlank(c[f])) {
          skipped.push({ slug: d.slug!, reason: `clinic[${i}] missing '${f}'` });
          ok = false;
          break;
        }
      }
      if (!ok) break;
    }
    if (ok) valid.push(d);
  }

  return { valid, skipped };
}

async function main() {
  const { dryRun, reset, file } = parseArgs(process.argv);
  const filePath = resolve(file);

  console.log(`📂 Reading ${filePath}`);
  const raw = readFileSync(filePath, 'utf-8');
  const records: DentistInput[] = JSON.parse(raw);
  console.log(`   → ${records.length} records`);

  const { valid, skipped } = validate(records);
  console.log(`✅ Valid:   ${valid.length}`);
  console.log(`⚠️  Skipped: ${skipped.length}`);
  if (skipped.length) {
    skipped.slice(0, 20).forEach((s) => console.log(`   - ${s.slug}: ${s.reason}`));
    if (skipped.length > 20) console.log(`   … (+${skipped.length - 20} more)`);
  }

  const totalClinics = valid.reduce((n, d) => n + (d.clinics?.length ?? 0), 0);
  console.log(`📊 ${valid.length} dentists across ${totalClinics} clinics`);

  if (dryRun) {
    console.log('\n[DRY RUN] No database writes performed.');
    return;
  }

  console.log('\n🔌 Connecting to MongoDB…');
  await connectDB();

  if (reset) {
    const { deletedCount } = await Dentist.deleteMany({});
    console.log(`🗑️  Cleared ${deletedCount} existing documents`);
  }

  console.log('💾 Upserting…');
  let written = 0;
  let failed = 0;
  for (const d of valid) {
    try {
      await Dentist.findOneAndUpdate({ slug: d.slug }, d, {
        upsert: true,
        returnDocument: 'after',
        runValidators: true,
        setDefaultsOnInsert: true,
      });
      written++;
      if (written % 50 === 0) console.log(`   …${written}/${valid.length}`);
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`   ✗ ${d.slug}: ${msg}`);
    }
  }

  console.log(`\n✨ Done. Wrote: ${written}, Failed: ${failed}, Skipped: ${skipped.length}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
