import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — EGDN',
  description: 'Send EGDN a message. We respond within 1 business day.',
};

const OFFICE_ADDRESS_LINES = [
  'Elite Group Health Access (Phils.), Inc.',
  '7th Floor Zeta II Bldg.',
  '191 Salcedo St., Legaspi Village',
  'Makati City, Philippines 1229',
];
const MAPS_QUERY =
  'Zeta+II+Building+191+Salcedo+Street+Legaspi+Village+Makati+City';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

const faqs = [
  {
    q: 'How do I find a partner dentist?',
    a: 'Use Find a Dentist to browse partner clinics by region or city. Bring your member ID to your visit — that\'s all you need.',
  },
  {
    q: 'What if I lost my member ID?',
    a: 'Email info@elitegroupph.com with your full name and date of birth. We\'ll send a digital replacement within 1 business day.',
  },
  {
    q: 'How does my company partner with EGDN?',
    a: 'Tell us roughly how many employees you\'d like to cover and a partnerships lead will reach out within a day.',
  },
];

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

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MapMiniIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

export default function ContactPage() {
  return (
    <>
      {/* ── Page header ─ title block constrained to 720px, tight rhythm
          (eyebrow → h1 → subtitle, no extra mt/mb on h1). ── */}
      <section className="mx-auto max-w-300 px-5 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-10">
        <div className="max-w-[720px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
            Get in touch
          </span>
          <h1 className="mb-3 font-display text-[28px] font-bold leading-[1.2] text-text sm:text-[34px] lg:text-[40px]">
            We&apos;re here to help.
          </h1>
          <p
            className="text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
            Questions about your benefit, our network, or partnering with EGDN — reach us the
            way that works for you.
          </p>
        </div>
      </section>

      {/* ── Form + Sidebar ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 pb-12 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        <div className="grid gap-3.5 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
          {/* Form — first on mobile, left column on desktop */}
          <div className="rounded-card border border-border bg-surface p-6 sm:p-8 lg:p-10">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:mb-3 sm:text-[12px]">
              Send a message
            </span>
            <h2 className="font-display text-[24px] font-semibold leading-tight text-text sm:text-[28px]">
              Tell us what&apos;s going on
            </h2>
            <p className="mt-2 mb-7 text-[15px] text-text-muted sm:mt-3 sm:mb-9">
              We typically reply within 1 business day. For urgent issues, call our hotline.
            </p>
            <ContactForm />
          </div>

          {/* Sidebar — below form on mobile (Hours card first via order-first),
              right column on desktop with tiles → hours in source order */}
          <aside className="flex flex-col gap-3.5">
            {/* Call us — three numbers (one landline, two mobile carriers).
                Each number is a tel: link; the carrier tag and "Telephone/Mobile"
                labels stay muted so the number is the focal point. */}
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

            <ContactTile
              href="mailto:info@elitegroupph.com"
              label="Email"
              value="info@elitegroupph.com"
              sub="Replies within 1 business day"
              icon={<MailIcon />}
              valueClassName="break-all"
            />
            <ContactTile
              label="Office"
              value="Zeta II Building, Makati"
              sub="7th Floor, 191 Salcedo St., Legaspi Village"
              icon={<PinIcon />}
            />

            {/* Hours card — order-first on mobile floats it above the tiles
                (right after the form); on desktop it stays at the bottom of the
                sidebar via lg:order-none (resets to default 0 = source order). */}
            <div className="order-first rounded-card border border-border bg-surface p-5 sm:p-[22px] lg:order-0">
              <h4 className="mb-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                Office hours
              </h4>
              <dl className="flex flex-col gap-2.5 text-[14px]">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <dt className="font-medium text-text">Monday – Friday</dt>
                  <dd className="text-text-muted tabular-nums">9:00 AM – 6:00 PM</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-text">Saturday &amp; Sunday</dt>
                  <dd className="text-error">Closed</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Office / Map ───────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
            <div>
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:mb-3 sm:text-[12px]">
                Visit us
              </span>
              <h2 className="font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
                Stop by our office.
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-text-muted sm:mt-3 sm:text-[16px]">
                Walk-ins are welcome during office hours. We're located in the heart of
                Salcedo Village, Makati's central business district.
              </p>

              <dl className="mt-7 flex flex-col gap-5 sm:mt-8">
                <div className="flex gap-3.5">
                  <span className="mt-0.5 shrink-0 text-brand"><PinIcon /></span>
                  <div>
                    <dt className="font-semibold text-[15px] text-text">Zeta II Building, 7th Floor</dt>
                    <dd className="mt-0.5 text-[14px] leading-[1.5] text-text-muted">
                      191 Salcedo St., Legaspi Village
                      <br />
                      Makati City, Metro Manila 1229
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <span className="mt-0.5 shrink-0 text-brand"><ClockIcon /></span>
                  <div>
                    <dt className="font-semibold text-[15px] text-text">Mon–Fri, 9AM–6PM</dt>
                    <dd className="mt-0.5 text-[14px] leading-[1.5] text-text-muted">
                      Closed Saturdays, Sundays, and Philippine holidays.
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Map illustration — stylized placeholder that links to the real
                map in Google Maps. */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open EGDN office in Google Maps"
              className="relative block aspect-5/3 overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-brand"
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 40% 60% at 60% 50%, rgba(27,127,168,0.12), transparent 70%), linear-gradient(120deg, #EAE3D8 0%, #DDD2C2 100%)',
                }}
              />
              {/* grid overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(45,58,46,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(45,58,46,0.06) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />
              {/* center pin */}
              <div className="absolute inset-0 grid place-items-center">
                <div
                  className="relative grid h-14 w-14 place-items-center rounded-full bg-brand text-white"
                  style={{
                    boxShadow:
                      '0 8px 24px rgba(27,127,168,0.35), 0 0 0 8px rgba(27,127,168,0.18)',
                  }}
                >
                  <PinIcon />
                  <span
                    aria-hidden
                    className="absolute left-1/2 -bottom-1.5 h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-brand"
                    style={{ boxShadow: '0 4px 8px rgba(27,127,168,0.3)' }}
                  />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-surface/95 px-2.5 py-1 text-[11px] font-semibold text-brand">
                Open in Maps →
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactTile({
  href,
  label,
  value,
  sub,
  icon,
  valueClassName = '',
}: {
  href?: string;
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  valueClassName?: string;
}) {
  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
        {icon}
      </span>
      <div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
          {label}
        </div>
        <div className={`mt-1 font-display text-[19px] font-semibold leading-[1.25] text-text ${valueClassName}`}>
          {value}
        </div>
        <div className="mt-1 text-[13px] leading-[1.4] text-text-muted">{sub}</div>
      </div>
    </>
  );

  const cls =
    'flex items-start gap-4 rounded-card border border-border bg-surface p-5 sm:p-[22px]';

  if (href) {
    // Anchor stays so tel:/mailto: still works on tap, but cursor-default
    // removes the pointer hover so the card visually matches the static Office tile.
    return (
      <a href={href} className={`${cls} cursor-default`}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
