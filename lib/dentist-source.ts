import 'server-only';
import type { PipelineStage } from 'mongoose';
import seed from '@/data/dentists.seed.json';
import type { DentistClinic } from './models/Dentist';

/**
 * Shape returned by every data-source function. Matches the lean Mongoose
 * doc shape (`_id` as string) so call sites don't need to know which
 * backend served the query.
 */
export interface DentistDoc {
  _id: string;
  slug: string;
  name: string;
  specializations: string[];
  clinics: DentistClinic[];
  headshotUrl?: string | null;
}

/**
 * `true` when the app is configured to talk to a live MongoDB. When `false`
 * we serve the bundled `data/dentists.seed.json` instead — used for preview
 * deploys that ship without database credentials. The seed is a snapshot of
 * the cleaned dataset (391 dentists / 515 clinics); the appointment-submit
 * route also degrades to a no-op write in that mode.
 */
function useMongo(): boolean {
  return !!process.env.MONGODB_URI;
}

interface RawSeedDentist {
  slug: string;
  name: string;
  specializations?: string[];
  clinics: DentistClinic[];
  headshotUrl?: string | null;
}

// Hydrate the seed at module load. The seed JSON doesn't carry _id values
// (DB-mode docs have ObjectIds); we synthesize a stable string id from the
// slug so call sites that key by `_id` (React keys, links, etc.) work
// identically in seed mode.
const seedDocs: DentistDoc[] = (seed as RawSeedDentist[]).map((d) => ({
  _id: d.slug,
  slug: d.slug,
  name: d.name,
  specializations: d.specializations ?? [],
  clinics: d.clinics,
  headshotUrl: d.headshotUrl ?? null,
}));

/**
 * `true` when we're running the JSON-seed preview mode (no `MONGODB_URI`).
 * Exposed so submission routes can short-circuit DB writes in the same mode.
 */
export function isPreviewMode(): boolean {
  return !useMongo();
}

/** Dynamic Mongoose import — only loaded when a DB-backed call actually runs. */
async function getMongoDentist() {
  const { default: Dentist } = await import('./models/Dentist');
  const { connectDB } = await import('./mongodb');
  await connectDB();
  return Dentist;
}

function toStringId(d: { _id: unknown }): DentistDoc {
  // Mongoose `.lean()` returns _id as ObjectId; stringify so the shape is
  // consistent across backends and JSON-serializable for client components.
  return { ...(d as object), _id: String(d._id) } as DentistDoc;
}

/* ─── Region grid ────────────────────────────────────────────────────── */

export interface RegionCount {
  _id: string;
  count: number;
}

export async function getRegionCounts(opts?: { sorted?: boolean }): Promise<RegionCount[]> {
  if (useMongo()) {
    const Dentist = await getMongoDentist();
    const pipeline: PipelineStage[] = [
      { $unwind: '$clinics' },
      { $group: { _id: '$clinics.region', count: { $sum: 1 } } },
    ];
    if (opts?.sorted) pipeline.push({ $sort: { count: -1, _id: 1 } });
    return Dentist.aggregate<RegionCount>(pipeline);
  }

  const counts = new Map<string, number>();
  for (const d of seedDocs) {
    for (const c of d.clinics) {
      counts.set(c.region, (counts.get(c.region) ?? 0) + 1);
    }
  }
  const result = Array.from(counts, ([region, count]) => ({ _id: region, count }));
  if (opts?.sorted) {
    result.sort((a, b) => b.count - a.count || a._id.localeCompare(b._id));
  }
  return result;
}

/* ─── Single dentist by slug ─────────────────────────────────────────── */

export async function findDentistBySlug(slug: string): Promise<DentistDoc | null> {
  if (useMongo()) {
    const Dentist = await getMongoDentist();
    const doc = await Dentist.findOne({ slug }).lean();
    if (!doc) return null;
    return toStringId(doc as { _id: unknown });
  }
  return seedDocs.find((d) => d.slug === slug) ?? null;
}

/* ─── All dentists (used by booking wizard's picker) ─────────────────── */

export async function findAllDentists(): Promise<DentistDoc[]> {
  if (useMongo()) {
    const Dentist = await getMongoDentist();
    const raw = await Dentist.find({}).select('name slug specializations clinics').lean();
    return (raw as Array<{ _id: unknown }>).map(toStringId);
  }
  return seedDocs;
}

/* ─── Global name/phone search ───────────────────────────────────────── */

export interface SearchOpts {
  name: string;
  specialization?: string;
  limit?: number;
}

export async function searchDentists(opts: SearchOpts): Promise<DentistDoc[]> {
  const { name, specialization, limit = 60 } = opts;
  const trimmed = name.trim();
  if (!trimmed) return [];

  if (useMongo()) {
    const Dentist = await getMongoDentist();
    const escapedName = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const digits = trimmed.replace(/\D/g, '');
    const or: Record<string, unknown>[] = [
      { name: { $regex: escapedName, $options: 'i' } },
    ];
    if (digits.length >= 3) {
      const phoneRegex = digits.split('').join('\\D*');
      or.push({ 'clinics.contactNumber': { $regex: phoneRegex } });
    }
    const filter: Record<string, unknown> = { $or: or };
    if (specialization) filter.specializations = specialization;
    const raw = await Dentist.find(filter)
      .select('name slug specializations clinics')
      .limit(limit)
      .lean();
    return (raw as Array<{ _id: unknown }>).map(toStringId);
  }

  const q = trimmed.toLowerCase();
  const digits = trimmed.replace(/\D/g, '');
  return seedDocs
    .filter((d) => {
      if (specialization && !d.specializations.includes(specialization)) return false;
      if (d.name.toLowerCase().includes(q)) return true;
      if (digits.length >= 3) {
        return d.clinics.some((c) =>
          (c.contactNumber ?? '').replace(/\D/g, '').includes(digits),
        );
      }
      return false;
    })
    .slice(0, limit);
}

/* ─── Region detail (filtered list) ──────────────────────────────────── */

export interface RegionFilterOpts {
  region: string;
  city?: string;
  specialization?: string;
  name?: string;
}

export async function findDentistsByRegion(opts: RegionFilterOpts): Promise<DentistDoc[]> {
  const { region, city, specialization, name } = opts;
  const trimmedName = (name ?? '').trim();

  if (useMongo()) {
    const Dentist = await getMongoDentist();
    const filter: Record<string, unknown> = { 'clinics.region': region };
    if (city) filter['clinics.city'] = city;
    if (specialization) filter.specializations = specialization;
    if (trimmedName) {
      const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const digits = trimmedName.replace(/\D/g, '');
      const or: Record<string, unknown>[] = [
        { name: { $regex: escapedName, $options: 'i' } },
      ];
      if (digits.length >= 3) {
        const phoneRegex = digits.split('').join('\\D*');
        or.push({ 'clinics.contactNumber': { $regex: phoneRegex } });
      }
      filter.$or = or;
    }
    const raw = await Dentist.find(filter)
      .select('name slug specializations clinics')
      .lean();
    return (raw as Array<{ _id: unknown }>).map(toStringId);
  }

  const q = trimmedName.toLowerCase();
  const digits = trimmedName.replace(/\D/g, '');
  return seedDocs.filter((d) => {
    if (!d.clinics.some((c) => c.region === region)) return false;
    if (city && !d.clinics.some((c) => c.region === region && c.city === city)) return false;
    if (specialization && !d.specializations.includes(specialization)) return false;
    if (trimmedName) {
      if (d.name.toLowerCase().includes(q)) return true;
      if (digits.length >= 3) {
        return d.clinics.some((c) =>
          (c.contactNumber ?? '').replace(/\D/g, '').includes(digits),
        );
      }
      return false;
    }
    return true;
  });
}

/**
 * Unfiltered set of dentists for a given region — used to compute the
 * complete list of available cities and specializations for the filter
 * dropdowns, independent of any other active filter.
 */
export async function findDentistsInRegion(region: string): Promise<DentistDoc[]> {
  if (useMongo()) {
    const Dentist = await getMongoDentist();
    const raw = await Dentist.find({ 'clinics.region': region })
      .select('clinics specializations')
      .lean();
    return (raw as Array<{ _id: unknown }>).map((d) => ({
      _id: String(d._id),
      slug: '',
      name: '',
      specializations: (d as { specializations?: string[] }).specializations ?? [],
      clinics: (d as { clinics?: DentistClinic[] }).clinics ?? [],
    }));
  }
  return seedDocs.filter((d) => d.clinics.some((c) => c.region === region));
}

/* ─── Home-page network stats ────────────────────────────────────────── */

export interface NetworkStats {
  dentists: number;
  clinics: number;
  regions: number;
  cities: number;
}

export async function getNetworkStats(): Promise<NetworkStats> {
  if (useMongo()) {
    const Dentist = await getMongoDentist();
    const [aggResult, dentistsCount] = await Promise.all([
      Dentist.aggregate<{ clinics: number; regions: number; cities: number }>([
        { $unwind: '$clinics' },
        {
          $group: {
            _id: null,
            clinics: { $sum: 1 },
            regions: { $addToSet: '$clinics.region' },
            // region+city composite — same city name in different regions stays distinct
            cities: { $addToSet: { $concat: ['$clinics.region', '|', '$clinics.city'] } },
          },
        },
        { $project: { _id: 0, clinics: 1, regions: { $size: '$regions' }, cities: { $size: '$cities' } } },
      ]),
      Dentist.countDocuments(),
    ]);
    const agg = aggResult[0] ?? { clinics: 0, regions: 0, cities: 0 };
    return { ...agg, dentists: dentistsCount };
  }

  const regions = new Set<string>();
  const cities = new Set<string>();
  let clinics = 0;
  for (const d of seedDocs) {
    for (const c of d.clinics) {
      clinics += 1;
      regions.add(c.region);
      cities.add(`${c.region}|${c.city}`);
    }
  }
  return { dentists: seedDocs.length, clinics, regions: regions.size, cities: cities.size };
}
