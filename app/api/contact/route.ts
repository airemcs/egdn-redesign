import { connectDB } from '@/lib/mongodb';
import ContactSubmission from '@/lib/models/ContactSubmission';
import { sendNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, contactNumber, subject, message } = await request.json();

    if (!name || !email || !contactNumber || !subject || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    await ContactSubmission.create({ name, email, contactNumber, subject, message });

    await sendNotification(
      `Contact Form — ${subject}`,
      `<p><b>Name:</b> ${name}</p>
       <p><b>Email:</b> ${email}</p>
       <p><b>Contact:</b> ${contactNumber}</p>
       <p><b>Subject:</b> ${subject}</p>
       <p><b>Message:</b> ${message}</p>`
    );

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
