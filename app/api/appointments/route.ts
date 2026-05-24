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

    const ALLOWED_SOURCES = ['profile', 'profile-teleconsult', 'standalone', 'teleconsult'];
    if (!ALLOWED_SOURCES.includes(source)) {
      return Response.json({ error: 'Invalid source' }, { status: 400 });
    }

    // Date minimum depends on the visit type: teleconsult allows same-day
    // (the booking-wizard's date picker already gates by current time of day);
    // in-person requires 3 days lead time so the partner clinic can confirm.
    const isTeleconsult = source === 'teleconsult' || source === 'profile-teleconsult';
    const date = new Date(preferredDate);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + (isTeleconsult ? 0 : 3));
    minDate.setHours(0, 0, 0, 0);
    if (date < minDate) {
      const msg = isTeleconsult
        ? 'preferredDate cannot be in the past'
        : 'preferredDate must be at least 3 days from today';
      return Response.json({ error: msg }, { status: 400 });
    }

    await connectDB();

    // DB write is the source of truth — if this fails, surface the error.
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

    // Email notification is best-effort — don't fail the user's submission
    // if Resend is misconfigured (missing env, unverified domain, network).
    // The appointment is saved; the team can pick it up from the admin/DB
    // even if the email never reaches them. Log so prod alerts catch it.
    try {
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
    } catch (emailErr) {
      console.error('[appointments POST] notification email failed:', emailErr);
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    // Log the real error so server logs can diagnose future submit failures.
    // In development, surface the message to the client so the developer
    // doesn't have to switch to the terminal to read the actual cause.
    console.error('[appointments POST] failed to submit:', err);
    const detail =
      process.env.NODE_ENV === 'development' && err instanceof Error
        ? err.message
        : 'Failed to submit appointment request';
    return Response.json({ error: detail }, { status: 500 });
  }
}
