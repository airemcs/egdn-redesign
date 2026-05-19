import type { Metadata } from 'next';
import Image from 'next/image';
import PartnerInquiryForm from '@/components/forms/PartnerInquiryForm';
import ContactSidebar from '@/components/sections/ContactSidebar';

export const metadata: Metadata = {
  title: 'Join Our Network — EGDN',
  description:
    'Become a partner clinic with the Elite Group Dental Network. Grow your practice and serve corporate members nationwide.',
  // Brief Screen 10 notes this should stay low-profile on the live site —
  // accessible but not indexed. [CONFIRM WITH CLIENT].
  robots: { index: false },
};

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const BoltIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const benefits = [
  {
    title: 'Access to corporate members',
    body:
      "Serve corporate employees and their dependents — a steady stream of patients backed by EGDN's nationwide partnerships.",
    icon: <UsersIcon />,
  },
  {
    title: 'Structured coverage system',
    body:
      'Clear, transparent verification and coverage rules so you know exactly what each member is entitled to before each visit.',
    icon: <ShieldCheckIcon />,
  },
  {
    title: 'Fast claims processing',
    body:
      'Payment within 15 working days, subject to complete documentation. No long waits, no chasing — just clean, predictable cycles.',
    icon: <BoltIcon />,
  },
  {
    title: 'Long-term partnership',
    body:
      'Built on compliance, transparency, and quality care — a professional relationship that grows alongside your practice.',
    icon: <HeartIcon />,
  },
];

const eligibility = [
  {
    n: 1,
    title: 'Licensed dentist',
    body: 'You hold a valid PRC registration as a practicing dentist in the Philippines.',
  },
  {
    n: 2,
    title: 'Registered clinic',
    body:
      'Your clinic is legally registered with the appropriate business and BIR permits on file.',
  },
  {
    n: 3,
    title: 'Ethical practice',
    body:
      'Your practice is committed to professional and ethical standards — every application is credential-checked before approval.',
  },
];

export default function JoinOurNetworkPage() {
  return (
    <>
      {/* ── Hero ─ full-bleed Unsplash image with the same cream gradient
          overlay as the home hero. ── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="hero-overlay absolute inset-0 z-[1]" />

        <div className="relative z-[2] mx-auto flex min-h-[420px] w-full max-w-300 items-end px-5 pt-12 pb-10 sm:min-h-125 sm:items-center sm:px-6 sm:py-16 lg:min-h-135 lg:px-10 lg:py-24">
          <div className="max-w-[560px]">
            <span className="eyebrow">
              For dental providers
            </span>
            <h1 className="mb-3 mt-2 h1 text-text sm:mt-3">
              Grow your clinic with Elite Group Dental Network.
            </h1>
            <p
              className="text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              We&apos;re continuously expanding our nationwide network of accredited dental
              clinics. EGDN invites qualified dental professionals to deliver accessible,
              structured, high-quality care to corporate members and their dependents.
            </p>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mb-6 sm:mb-10">
          <span className="eyebrow">
            Why partner with EGDN
          </span>
          <h2 className="mt-2 font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
            Built on compliance, transparency, and quality care.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand sm:p-8"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-light text-brand">
                {b.icon}
              </span>
              <h3 className="font-display text-[18px] font-semibold leading-tight text-text sm:text-[19px]">
                {b.title}
              </h3>
              <p className="text-[14px] leading-[1.55] text-text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Eligibility ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="mb-6 max-w-[720px] sm:mb-10">
            <span className="eyebrow">
              Eligibility
            </span>
            <h2 className="mt-2 font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
              Who can apply?
            </h2>
            <p className="mt-3 text-[15px] leading-[1.55] text-text-muted sm:text-[16px]">
              All applications go through a credential evaluation before approval. Here&apos;s what
              we look for.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {eligibility.map((s) => (
              <li
                key={s.n}
                className="flex flex-col gap-3 rounded-card border border-border bg-bg p-6"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-[14px] font-semibold text-white">
                  {s.n}
                </span>
                <h3 className="font-display text-[18px] font-semibold leading-tight text-text">
                  {s.title}
                </h3>
                <p className="text-[14px] leading-[1.55] text-text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Inquiry form ─ form on the left, contact tiles on the right. ── */}
      <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid gap-3.5 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
          {/* Form card */}
          <div className="rounded-card border border-border bg-surface p-6 sm:p-8 lg:p-10">
            <span className="eyebrow">
              Apply to join
            </span>
            <h2 className="font-display text-[24px] font-semibold leading-tight text-text sm:text-[28px]">
              Tell us about your clinic.
            </h2>
            <p className="mt-2 mb-7 text-[15px] text-text-muted sm:mt-3 sm:mb-9">
              Send us your clinic details and our Provider Relations team will follow up
              within 1 business day to walk through next steps.
            </p>
            <PartnerInquiryForm type="clinic" />
          </div>

          <ContactSidebar variant="clinic" />
        </div>
      </section>
    </>
  );
}
