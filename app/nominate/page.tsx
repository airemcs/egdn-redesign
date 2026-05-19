import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import NominationForm from '@/components/forms/NominationForm';

export const metadata: Metadata = {
  title: 'Nominate a Dentist — EGDN',
  description:
    "Know a great dentist who should be part of EGDN's growing community? Share their contact info and we'll take care of the rest.",
};

const HandshakeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 17l-3 3a1 1 0 0 1-1.41 0L3.59 17a1 1 0 0 1 0-1.41L7 12.59" />
    <path d="M14 13l3 3 4-4-3-3" />
    <path d="M10 16l4-4" />
    <path d="M13 7l-3-3a1 1 0 0 0-1.41 0L4 8.59a1 1 0 0 0 0 1.41L7 13" />
  </svg>
);

export default function NominatePage() {
  return (
    <>
      {/* ── Hero ─ full-bleed Unsplash image with the same cream gradient
          overlay used by partner-with-us / join-our-network heroes. ── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="hero-overlay absolute inset-0 z-[1]" />

        <div className="relative z-[2] mx-auto flex min-h-[420px] w-full max-w-300 items-end px-5 pt-12 pb-10 sm:min-h-125 sm:items-center sm:px-6 sm:py-16 lg:min-h-135 lg:px-10 lg:py-24">
          <div className="max-w-[560px]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
              Help us grow the network
            </span>
            <h1 className="mb-3 mt-2 font-display text-[28px] font-bold leading-[1.2] text-text sm:mt-3 sm:text-[34px] lg:text-[40px]">
              Nominate a dentist.
            </h1>
            <p
              className="text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Want your dentist to join our growing community? Share their contact information
              with us and we&apos;ll take care of the rest.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form + sidebar ─ same 1.35fr_1fr split as the contact and
          partner-with-us pages. Form card on the left; "how nominations
          work" explainer + a directory-check shortcut on the right. ── */}
      <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid gap-3.5 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
          {/* Form card */}
          <div className="rounded-card border border-border bg-surface p-6 sm:p-8 lg:p-10">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
              Submit a nomination
            </span>
            <h2 className="font-display text-[24px] font-semibold leading-tight text-text sm:text-[28px]">
              Tell us about the clinic.
            </h2>
            <p className="mt-2 mb-7 text-[15px] text-text-muted sm:mt-3 sm:mb-9">
              Just the basics — we&apos;ll handle the outreach and credential check from there.
            </p>
            <NominationForm />
          </div>

          {/* Sidebar — what happens next + directory shortcut */}
          <aside className="flex flex-col gap-3.5">
            {/* What happens next */}
            <div className="rounded-card border border-border bg-surface p-5 sm:p-[22px]">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                What happens next
              </h3>
              <ol className="mt-4 flex flex-col gap-4">
                <li className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-semibold text-white">
                    1
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-[15px] font-semibold text-text">
                      You submit
                    </div>
                    <p className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">
                      Your name, contact, and the clinic&apos;s details.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-semibold text-white">
                    2
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-[15px] font-semibold text-text">
                      We review
                    </div>
                    <p className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">
                      Our team evaluates the clinic against EGDN&apos;s credentialing standards.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-semibold text-white">
                    3
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-[15px] font-semibold text-text">
                      We reach out
                    </div>
                    <p className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">
                      If they&apos;re a fit, we invite them to join the network.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Already in the network? — quick directory check */}
            <Link
              href="/find-a-dentist"
              className="flex items-start gap-4 rounded-card border border-border bg-bg-deep p-5 transition-colors hover:border-brand sm:p-[22px]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
                <HandshakeIcon />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Already in the network?
                </div>
                <div className="mt-1 font-display text-[16px] font-semibold leading-[1.25] text-text sm:text-[17px]">
                  Check the directory first
                </div>
                <div className="mt-1 text-[13px] leading-[1.4] text-text-muted">
                  Save yourself a step — they may already be a partner clinic.
                </div>
              </div>
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
