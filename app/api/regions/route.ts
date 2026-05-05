import { connectDB } from '@/lib/mongodb';
import Dentist from '@/lib/models/Dentist';

export async function GET() {
  try {
    await connectDB();

    const regions = await Dentist.aggregate<{ _id: string; count: number }>([
      { $unwind: '$clinics' },
      { $group: { _id: '$clinics.region', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return Response.json(regions);
  } catch {
    return Response.json({ error: 'Failed to fetch regions' }, { status: 500 });
  }
}
