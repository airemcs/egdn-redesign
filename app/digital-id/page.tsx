import type { Metadata } from 'next';
import Link from 'next/link';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Digital Member ID — EGDN',
  description: 'Learn how to get your EGDN digital member ID.',
};

export default function DigitalIdPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
          Your Digital Member ID
        </h1>
        <p className="mt-3 text-[16px] text-text-muted">
          Your EGDN member ID is your pass to accessing dental care at any partner clinic.
        </p>

        {/* How to get it */}
        <div className="mt-10 rounded-card border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-semibold text-text">How do I get mine?</h2>
          <p className="mt-3 text-[15px] text-text-muted leading-relaxed">
            Digital member IDs are issued directly by EGDN. If you haven't received yours, or need a
            replacement, contact us using the details below and we'll sort it out. Please have your
            full name and employer name ready when you reach out.
          </p>
        </div>

        {/* Contact details */}
        <div className="mt-6 rounded-card border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-semibold text-text mb-4">Contact for ID Requests</h2>
          <dl className="space-y-3 text-[15px]">
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 font-medium text-text">Hotline</dt>
              <dd className="text-text-muted">(02) XXXX-XXXX {/* [CONFIRM WITH CLIENT] */}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 font-medium text-text">Email</dt>
              <dd>
                <a href="mailto:info@elitegroup.com.ph" className="text-brand hover:underline">
                  info@elitegroup.com.ph {/* [CONFIRM WITH CLIENT] */}
                </a>
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 font-medium text-text">Hours</dt>
              <dd className="text-text-muted">Monday–Friday, 8:00 AM – 5:00 PM {/* [CONFIRM WITH CLIENT] */}</dd>
            </div>
          </dl>
        </div>

        {/* What the ID contains */}
        <div className="mt-6 rounded-card border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-semibold text-text mb-3">
            What your ID contains
          </h2>
          <ul className="space-y-2 text-[15px] text-text-muted">
            {['Member name', 'Member ID number', 'Plan type / employer', 'Validity period'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-text-muted italic">
            Fields may vary depending on your employer's plan. {/* [CONFIRM WITH CLIENT] */}
          </p>
        </div>

        <p className="mt-8 text-[14px] text-text-muted">
          Need help with something else?{' '}
          <Link href="/contact" className="text-brand hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>

      <CtaSection
        headline="Ready to use your benefit?"
        subtext="Find a trusted dentist near you and book your appointment today."
        primaryLabel="Find a Dentist"
        primaryHref="/find-a-dentist"
        secondaryLabel="Book an Appointment"
        secondaryHref="/book-appointment"
      />
    </>
  );
}
