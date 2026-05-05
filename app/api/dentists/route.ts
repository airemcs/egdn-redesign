import { connectDB } from '@/lib/mongodb';
import Dentist, { type DentistClinic } from '@/lib/models/Dentist';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const city = searchParams.get('city');

    if (!region) {
      return Response.json({ error: 'region is required' }, { status: 400 });
    }

    await connectDB();

    const filter: Record<string, string> = { 'clinics.region': region };
    if (city) filter['clinics.city'] = city;

    const dentists = await Dentist.find(filter)
      .select('name slug specializations clinics')
      .lean();

    const list = dentists.map((d) => {
      const matchingClinic = d.clinics.find(
        (c: DentistClinic) => c.region === region && (!city || c.city === city)
      );
      return {
        _id: d._id,
        name: d.name,
        slug: d.slug,
        specializations: d.specializations,
        clinicName: matchingClinic?.clinicName ?? d.clinics[0]?.clinicName,
        city: matchingClinic?.city ?? d.clinics[0]?.city,
        address: matchingClinic?.address ?? d.clinics[0]?.address,
        contactNumber: matchingClinic?.contactNumber ?? d.clinics[0]?.contactNumber,
        multipleLocations: d.clinics.length > 1,
      };
    });

    return Response.json(list);
  } catch {
    return Response.json({ error: 'Failed to fetch dentists' }, { status: 500 });
  }
}
