import { Resend } from 'resend';

const FROM = 'EGDN <noreply@elitegroup.com.ph>';

// Lazy-instantiate so the module can be imported in preview-mode deploys
// (no RESEND_API_KEY set) without crashing at module load. The API routes
// short-circuit before calling this function in that mode.
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not defined');
    resend = new Resend(key);
  }
  return resend;
}

export async function sendNotification(subject: string, html: string): Promise<void> {
  const to = process.env.EGDN_NOTIFY_EMAIL;
  if (!to) throw new Error('EGDN_NOTIFY_EMAIL is not defined');

  await getResend().emails.send({ from: FROM, to, subject, html });
}
