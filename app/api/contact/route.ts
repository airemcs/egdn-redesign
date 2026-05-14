import { connectDB } from '@/lib/mongodb';
import ContactSubmission from '@/lib/models/ContactSubmission';
import { sendNotification } from '@/lib/email';

const VALID_ROLES = ['member', 'company', 'provider', 'general'] as const;

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      contactNumber,
      subject,
      message,
      role,
      memberId,
      company,
    } = await request.json();

    // Required: name, email, subject, message. Phone (contactNumber) and the
    // role/memberId/company context fields are optional.
    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role && !VALID_ROLES.includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    await connectDB();
    await ContactSubmission.create({
      name,
      email,
      contactNumber: contactNumber || undefined,
      subject,
      message,
      role: role || undefined,
      memberId: memberId || undefined,
      company: company || undefined,
    });

    await sendNotification(
      `Contact Form — ${subject}`,
      `<p><b>Name:</b> ${name}</p>
       <p><b>Email:</b> ${email}</p>
       ${contactNumber ? `<p><b>Phone:</b> ${contactNumber}</p>` : ''}
       ${role ? `<p><b>Reaching out as:</b> ${role}</p>` : ''}
       ${memberId ? `<p><b>Member ID:</b> ${memberId}</p>` : ''}
       ${company ? `<p><b>Company / Clinic:</b> ${company}</p>` : ''}
       <p><b>Subject:</b> ${subject}</p>
       <p><b>Message:</b> ${message}</p>`,
    );

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
