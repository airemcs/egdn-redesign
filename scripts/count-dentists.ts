import './_env';
import mongoose from 'mongoose';
import { connectDB } from '../lib/mongodb';
import Dentist from '../lib/models/Dentist';

async function main() {
  await connectDB();
  const total = await Dentist.countDocuments();
  const slugs = (await Dentist.find({}).select('slug name').lean()) as unknown as Array<{
    slug: string;
    name?: string;
  }>;
  const slugSet = new Set(slugs.map((d) => d.slug));
  const duplicateSlugs = slugs.length - slugSet.size;

  console.log(`Total dentists in DB:          ${total}`);
  console.log(`Unique slugs:                  ${slugSet.size}`);
  console.log(`Duplicate-slug docs (should be 0 given unique index): ${duplicateSlugs}`);

  // Any slug ending in digit (catches -2, -3 OR slugs that legitimately end
  // in a digit like a year). Useful sanity check.
  const trailingDigit = slugs.filter((d) => /-\d+$/.test(d.slug));
  console.log(
    `\nSlugs ending with -<digit>:    ${trailingDigit.length}${
      trailingDigit.length ? ' (worth inspecting)' : ' ✓'
    }`,
  );
  trailingDigit.forEach((d) => console.log(`   ${d.slug}  →  ${d.name ?? ''}`));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
