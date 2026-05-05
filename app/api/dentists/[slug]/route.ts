import { connectDB } from '@/lib/mongodb';
import Dentist from '@/lib/models/Dentist';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await connectDB();

    const dentist = await Dentist.findOne({ slug }).lean();

    if (!dentist) {
      return Response.json({ error: 'Dentist not found' }, { status: 404 });
    }

    return Response.json(dentist);
  } catch {
    return Response.json({ error: 'Failed to fetch dentist' }, { status: 500 });
  }
}
