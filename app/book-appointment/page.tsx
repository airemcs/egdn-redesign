import type { Metadata } from 'next';
import Link from 'next/link';
import AppointmentForm from '@/components/forms/AppointmentForm';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Book an Appointment — EGDN',
  description: "Request a dental appointment through EGDN. We'll confirm within 1 business day.",
};

const beforeYouBook = [
  {
    n: '01',
    title: 'Pick a partner dentist',
    body: 'Already have one in mind? Great. If not, search our directory first.',
  },
  {
    n: '02',
    title: "We'll confirm within 1 business day",
    body: 'Expect a call or email to confirm your slot. Bookings need at least 3 days lead time.',
  },
  {
    n: '03',
    title: 'Bring your IDs to the clinic',
    body: 'Bring your EGDN member ID and a valid government-issued ID to your appointment.',
  },
];

export default function BookAppointmentPage() {
  return (
    <>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-text sm:text-[40px] lg:text-[52px]">
            Book an Appointment
          </h1>
          <p className="mt-5 max-w-[640px] text-[16px] leading-[1.65] text-text-muted sm:mt-6 sm:text-[18px] lg:text-[20px]">
            Tell us when you'd like to come in and we'll handle the rest. EGDN will confirm
            your booking within 1 business day.
          </p>
        </div>

        <div className="mt-10 grid gap-10 sm:mt-14 lg:mt-16 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
          {/* Sidebar — helpful context. Below the form on mobile via lg:order-1 */}
          <aside className="order-2 flex flex-col gap-6 lg:order-1 lg:sticky lg:top-24 lg:self-start">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-brand">
                Before you book
              </span>
              <h2 className="mt-2 font-display text-[20px] font-semibold text-text lg:text-[22px]">
                Three quick things to know
              </h2>
            </div>

            <ol className="flex flex-col gap-4">
              {beforeYouBook.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-light font-display text-[14px] font-bold text-brand">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-body text-[15px] font-semibold text-text">{s.title}</h3>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-card border border-border bg-surface p-5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                Need a dentist?
              </span>
              <p className="mt-1.5 text-[14px] leading-relaxed text-text">
                Browse our partner clinics by region or city — 16 regions, hundreds of clinics nationwide.
              </p>
              <Link
                href="/find-a-dentist"
                className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand hover:gap-2 transition-[gap]"
              >
                Find a Dentist
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </aside>

          {/* Form — first on mobile, right column on desktop */}
          <div className="order-1 lg:order-2 rounded-card border border-border bg-surface p-5 sm:p-7 lg:p-9">
            <AppointmentForm />
          </div>
        </div>
      </div>

      <CtaSection
        headline="Already have a dentist in mind?"
        subtext="Browse our directory of partner clinics to make sure they're in-network."
        primaryLabel="Find a Dentist"
        primaryHref="/find-a-dentist"
      />
    </>
  );
}
