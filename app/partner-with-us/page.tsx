import type { Metadata } from 'next';
import Image from 'next/image';
import PartnerInquiryForm from '@/components/forms/PartnerInquiryForm';

export const metadata: Metadata = {
  title: 'Partner With Us — EGDN',
  description:
    "Give your employees a dental benefit they'll actually use. EGDN makes corporate dental coverage simple — trusted by Philippine companies since 2005.",
};

const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <polyline points="9 14 11 16 15 12" />
  </svg>
);

const LayersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const AwardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="8" r="6" />
    <polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const benefits = [
  {
    title: 'Nationwide coverage',
    body:
      'Partner clinics across the Philippines, so your team is covered wherever they are based or assigned.',
    icon: <MapPinIcon />,
  },
  {
    title: 'Simple to administer',
    body:
      'We handle enrollment, member IDs, and clinic coordination end-to-end. You focus on your business.',
    icon: <ClipboardCheckIcon />,
  },
  {
    title: 'Flexible plans',
    body:
      'Coverage options that match your team size and budget — from 50-person teams to enterprise rollouts.',
    icon: <LayersIcon />,
  },
  {
    title: 'Trusted since 2005',
    body:
      'Nearly two decades supporting Philippine companies with structured, dependable dental benefits.',
    icon: <AwardIcon />,
  },
];

const howItWorks = [
  {
    n: 1,
    title: 'Enroll your company',
    body: 'Tell us your team size and we walk you through plan options. Contracts are quick and straightforward.',
  },
  {
    n: 2,
    title: 'We onboard your employees',
    body: 'Each enrolled employee receives their EGDN member ID. We handle distribution and verification.',
  },
  {
    n: 3,
    title: 'Your team accesses care',
    body: "Employees find a partner dentist, book, and use their benefit. You get peace of mind.",
  },
];

export default function PartnerWithUsPage() {
  return (
    <>
      {/* ── Hero ─ full-bleed Unsplash image with cream gradient overlay,
          mirroring home + join-our-network heroes. Audience: HR/benefits
          decision-makers, so the image is corporate rather than clinical. ── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="hero-overlay absolute inset-0 z-[1]" />

        <div className="relative z-[2] mx-auto flex min-h-[420px] w-full max-w-300 items-end px-5 pt-12 pb-10 sm:min-h-125 sm:items-center sm:px-6 sm:py-16 lg:min-h-135 lg:px-10 lg:py-24">
          <div className="max-w-[560px]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
              For companies &amp; employers
            </span>
            <h1 className="mb-3 mt-2 font-display text-[28px] font-bold leading-[1.2] text-text sm:mt-3 sm:text-[34px] lg:text-[40px]">
              Give your employees a dental benefit they&apos;ll actually use.
            </h1>
            <p
              className="text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              EGDN makes it easy to offer dental coverage across our nationwide network of partner
              clinics — no complicated setup, no billing surprises.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why partner with EGDN ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mb-6 max-w-[720px] sm:mb-10">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
            Why partner with EGDN
          </span>
          <h2 className="mt-2 font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
            A benefit your team will actually use.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand sm:p-7"
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

      {/* ── How it works ─ employer-POV 3-step. Same numbered-card pattern
          as the eligibility section on /join-our-network for visual parity. ── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="mb-6 max-w-[720px] sm:mb-10">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
              How it works
            </span>
            <h2 className="mt-2 font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
              From contract to coverage in three steps.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.55] text-text-muted sm:text-[16px]">
              We take care of the operational pieces so you can offer dental as a benefit without
              adding overhead to your HR team.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {howItWorks.map((s) => (
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

      {/* ── Inquiry form ─ form on the left (with employer-mode fields:
          Company Name, contact details, Number of Employees dropdown, message),
          contact tiles on the right. Same layout as /join-our-network and
          /contact for cross-page consistency. ── */}
      <section className="mx-auto max-w-300 px-5 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 lg:px-10 lg:pt-20 lg:pb-24">
        <div className="grid gap-3.5 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
          {/* Form card */}
          <div className="rounded-card border border-border bg-surface p-6 sm:p-8 lg:p-10">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
              Send an inquiry
            </span>
            <h2 className="font-display text-[24px] font-semibold leading-tight text-text sm:text-[28px]">
              Tell us about your team.
            </h2>
            <p className="mt-2 mb-7 text-[15px] text-text-muted sm:mt-3 sm:mb-9">
              Send us your details and our partnerships team will follow up within 1 business day
              to walk through plan options.
            </p>
            <PartnerInquiryForm type="employer" />
          </div>

          {/* Sidebar — Call us + Email tiles. */}
          <aside className="flex flex-col gap-3.5">
            {/* Call us — three numbers (one landline + Smart/Globe mobile). */}
            <div className="flex items-start gap-4 rounded-card border border-border bg-surface p-5 sm:p-[22px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
                <PhoneIcon />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Call us
                </div>
                <ul className="mt-2 flex flex-col gap-1.5">
                  <li className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] text-text-muted">
                    <span>Telephone:</span>
                    <a
                      href="tel:+63288367181"
                      className="font-display text-[15px] font-semibold text-text"
                    >
                      (+632) 8836-7181
                    </a>
                  </li>
                  <li className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] text-text-muted">
                    <span>Smart Mobile:</span>
                    <a
                      href="tel:+639209517005"
                      className="font-display text-[15px] font-semibold text-text"
                    >
                      0920-951-7005
                    </a>
                  </li>
                  <li className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] text-text-muted">
                    <span>Globe Mobile:</span>
                    <a
                      href="tel:+639173154926"
                      className="font-display text-[15px] font-semibold text-text"
                    >
                      0917-315-4926
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Email tile */}
            <a
              href="mailto:info@elitegroupph.com"
              className="flex items-start gap-4 rounded-card border border-border bg-surface p-5 sm:p-[22px] cursor-default"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
                <MailIcon />
              </span>
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Email
                </div>
                <div className="mt-1 font-display text-[19px] font-semibold leading-[1.25] text-text break-all">
                  info@elitegroupph.com
                </div>
                <div className="mt-1 text-[13px] leading-[1.4] text-text-muted">
                  Replies within 1 business day
                </div>
              </div>
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
