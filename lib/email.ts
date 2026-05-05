import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'EGDN <noreply@elitegroup.com.ph>';

export async function sendNotification(subject: string, html: string): Promise<void> {
  const to = process.env.EGDN_NOTIFY_EMAIL;
  if (!to) throw new Error('EGDN_NOTIFY_EMAIL is not defined');

  await resend.emails.send({ from: FROM, to, subject, html });
}
