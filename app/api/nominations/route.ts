import { connectDB } from '@/lib/mongodb';
import NominationSubmission from '@/lib/models/NominationSubmission';
import { sendNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { nominatorName, contactNumber, dentistName, clinicName, clinicAddress, reason } =
      await request.json();

    if (!nominatorName || !contactNumber || !dentistName || !clinicName || !clinicAddress) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Preview-mode short-circuit (bundled-JSON deploy without MONGODB_URI).
    if (!process.env.MONGODB_URI) {
      console.info('[nominations POST] preview mode — submission logged:', {
        nominatorName, contactNumber, dentistName, clinicName, clinicAddress, reason,
      });
      return Response.json({ ok: true }, { status: 201 });
    }

    await connectDB();
    await NominationSubmission.create({ nominatorName, contactNumber, dentistName, clinicName, clinicAddress, reason: reason || undefined });

    await sendNotification(
      `New Dentist Nomination — ${dentistName}`,
      `<p><b>Nominator:</b> ${nominatorName}</p>
       <p><b>Contact:</b> ${contactNumber}</p>
       <p><b>Dentist:</b> ${dentistName}</p>
       <p><b>Clinic:</b> ${clinicName}</p>
       <p><b>Address:</b> ${clinicAddress}</p>
       ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ''}`
    );

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
