import { connectDB } from '@/lib/mongodb';
import AppointmentRequest from '@/lib/models/AppointmentRequest';
import { sendNotification } from '@/lib/email';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      memberName,
      memberId,
      dentistId,
      dentistName,
      clinicName,
      preferredDate,
      preferredTime,
      contactNumber,
      notes,
      source,
    } = body;

    if (!memberName || !memberId || !dentistName || !clinicName || !preferredDate || !preferredTime || !contactNumber || !source) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['Morning', 'Afternoon', 'Evening'].includes(preferredTime)) {
      return Response.json({ error: 'Invalid preferredTime' }, { status: 400 });
    }

    if (!['profile', 'standalone'].includes(source)) {
      return Response.json({ error: 'Invalid source' }, { status: 400 });
    }

    const date = new Date(preferredDate);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    minDate.setHours(0, 0, 0, 0);
    if (date < minDate) {
      return Response.json({ error: 'preferredDate must be at least 3 days from today' }, { status: 400 });
    }

    await connectDB();

    await AppointmentRequest.create({
      memberName,
      memberId,
      ...(dentistId && mongoose.Types.ObjectId.isValid(dentistId) && { dentistId }),
      dentistName,
      clinicName,
      preferredDate: date,
      preferredTime,
      contactNumber,
      notes: notes || undefined,
      source,
    });

    await sendNotification(
      `New Appointment Request — ${dentistName}`,
      `<p><b>Member:</b> ${memberName} (${memberId})</p>
       <p><b>Dentist:</b> ${dentistName}</p>
       <p><b>Clinic:</b> ${clinicName}</p>
       <p><b>Date:</b> ${preferredDate}</p>
       <p><b>Time:</b> ${preferredTime}</p>
       <p><b>Contact:</b> ${contactNumber}</p>
       ${notes ? `<p><b>Notes:</b> ${notes}</p>` : ''}
       <p><b>Source:</b> ${source}</p>`
    );

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to submit appointment request' }, { status: 500 });
  }
}
