import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — EGDN',
  description: 'Send EGDN a message. We respond within 1 business day.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">Contact Us</h1>
      <p className="mt-3 text-[16px] text-text-muted">
        We're here to help. Send us a message and we'll get back to you within 1 business day.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_2fr]">
        {/* Contact info */}
        <div>
          <h2 className="font-display text-xl font-semibold text-text mb-5">Get in Touch</h2>
          <dl className="space-y-4 text-[15px]">
            <div>
              <dt className="text-[13px] font-medium uppercase tracking-wide text-text-muted">Phone</dt>
              <dd className="mt-1 text-text">(02) XXXX-XXXX {/* [CONFIRM WITH CLIENT] */}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium uppercase tracking-wide text-text-muted">Email</dt>
              <dd className="mt-1">
                <a href="mailto:info@elitegroup.com.ph" className="text-brand hover:underline">
                  info@elitegroup.com.ph {/* [CONFIRM WITH CLIENT] */}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium uppercase tracking-wide text-text-muted">Facebook</dt>
              <dd className="mt-1">
                <a
                  href="https://www.facebook.com/egdn2005/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  facebook.com/egdn2005
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium uppercase tracking-wide text-text-muted">Office Hours</dt>
              <dd className="mt-1 text-text">Monday–Friday, 8:00 AM – 5:00 PM {/* [CONFIRM WITH CLIENT] */}</dd>
            </div>
          </dl>
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}
