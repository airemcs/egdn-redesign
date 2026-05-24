import { connectDB } from '@/lib/mongodb';
import ContactSubmission from '@/lib/models/ContactSubmission';
import { sendNotification } from '@/lib/email';

const VALID_ROLES = ['member', 'company', 'provider', 'general'] as const;
type Role = (typeof VALID_ROLES)[number];

// Topic dropdown was removed from the contact form — the role already routes
// the inquiry. We auto-compose a subject line so the underlying
// ContactSubmission.subject required field still validates and inbox triage
// retains a human-readable label.
const ROLE_LABEL: Record<Role, string> = {
  member: 'Member inquiry',
  company: 'Company / HR inquiry',
  provider: 'Dental provider inquiry',
  general: 'General inquiry',
};

function composeSubject(role: Role | undefined, name: string): string {
  const prefix = role ? ROLE_LABEL[role] : 'General inquiry';
  return `${prefix} — ${name}`;
}

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      contactNumber,
      message,
      role,
      memberId,
      company,
      region,
      employeeCount,
    } = await request.json();

    // Required: name, email, message. Phone (contactNumber) and the
    // role/memberId/company/region/employeeCount context fields are optional —
    // client-side enforces stricter rules per role. Subject is auto-derived
    // from role + name so we never expose a topic picker in the UI.
    if (!name || !email || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role && !VALID_ROLES.includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    const subject = composeSubject(role, name);

    // Preview-mode short-circuit: skip the DB write and the email send when
    // MONGODB_URI isn't configured (bundled-JSON demo deploy). Reviewers can
    // still walk the full success flow; the submission is logged so we can
    // audit demo traffic later if needed.
    if (!process.env.MONGODB_URI) {
      console.info('[contact POST] preview mode — submission logged:', {
        name, email, contactNumber, subject, message, role, memberId, company, region, employeeCount,
      });
      return Response.json({ ok: true }, { status: 201 });
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
      region: region || undefined,
      employeeCount: employeeCount || undefined,
    });

    await sendNotification(
      `Contact Form — ${subject}`,
      `<p><b>Name:</b> ${name}</p>
       <p><b>Email:</b> ${email}</p>
       ${contactNumber ? `<p><b>Phone:</b> ${contactNumber}</p>` : ''}
       ${role ? `<p><b>Reaching out as:</b> ${role}</p>` : ''}
       ${memberId ? `<p><b>Member ID:</b> ${memberId}</p>` : ''}
       ${company ? `<p><b>Company / Clinic:</b> ${company}</p>` : ''}
       ${region ? `<p><b>Region:</b> ${region}</p>` : ''}
       ${employeeCount ? `<p><b>Employees:</b> ${employeeCount}</p>` : ''}
       <p><b>Subject:</b> ${subject}</p>
       <p><b>Message:</b> ${message}</p>`,
    );

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
