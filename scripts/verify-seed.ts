import './_env';
import mongoose from 'mongoose';
import { connectDB } from '../lib/mongodb';
import Dentist from '../lib/models/Dentist';

async function main() {
  await connectDB();
  const total = await Dentist.countDocuments();
  const byRegion = await Dentist.aggregate([
    { $unwind: '$clinics' },
    {
      $group: {
        _id: '$clinics.region',
        clinics: { $sum: 1 },
        dentists: { $addToSet: '$_id' },
      },
    },
    {
      $project: {
        region: '$_id',
        clinics: 1,
        dentistCount: { $size: '$dentists' },
        _id: 0,
      },
    },
    { $sort: { clinics: -1 } },
  ]);

  console.log('Total dentists in DB:', total);
  console.log('Regions:', byRegion.length);
  byRegion.forEach((r) =>
    console.log('  ' + String(r.region).padEnd(36), 'clinics=' + r.clinics, 'dentists=' + r.dentistCount),
  );

  const cityAgg = await Dentist.aggregate([
    { $unwind: '$clinics' },
    { $group: { _id: { $concat: ['$clinics.region', '|', '$clinics.city'] } } },
    { $count: 'total' },
  ]);
  const totalClinics = await Dentist.aggregate([
    { $unwind: '$clinics' },
    { $count: 'total' },
  ]);
  console.log('Total clinics:', totalClinics[0]?.total ?? 0);
  console.log('Unique cities/munis (region+city):', cityAgg[0]?.total ?? 0);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
