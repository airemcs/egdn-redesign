import { connectDB } from '@/lib/mongodb';
import PartnerInquiry from '@/lib/models/PartnerInquiry';
import { sendNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { type, organizationName, contactName, email, contactNumber, employeeCount, region, message } =
      await request.json();

    if (!type || !organizationName || !contactName || !email || !contactNumber) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['employer', 'clinic'].includes(type)) {
      return Response.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Preview-mode short-circuit (bundled-JSON deploy without MONGODB_URI).
    if (!process.env.MONGODB_URI) {
      console.info('[partner-inquiries POST] preview mode — submission logged:', {
        type, organizationName, contactName, email, contactNumber, employeeCount, region, message,
      });
      return Response.json({ ok: true }, { status: 201 });
    }

    await connectDB();
    await PartnerInquiry.create({
      type,
      organizationName,
      contactName,
      email,
      contactNumber,
      employeeCount: employeeCount || undefined,
      region: region || undefined,
      message: message || undefined,
    });

    await sendNotification(
      `Partner Inquiry — ${type === 'employer' ? 'Employer' : 'Clinic'}: ${organizationName}`,
      `<p><b>Type:</b> ${type}</p>
       <p><b>Organization:</b> ${organizationName}</p>
       <p><b>Contact:</b> ${contactName}</p>
       <p><b>Email:</b> ${email}</p>
       <p><b>Phone:</b> ${contactNumber}</p>
       ${employeeCount ? `<p><b>Employees:</b> ${employeeCount}</p>` : ''}
       ${region ? `<p><b>Region:</b> ${region}</p>` : ''}
       ${message ? `<p><b>Message:</b> ${message}</p>` : ''}`
    );

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
