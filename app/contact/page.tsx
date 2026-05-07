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
      {/* ── Page header ────────────────────────────────────────────────────── */}
      {/* Whole header block (breadcrumb + title) is pushed down so "Get in touch"
          aligns with the home hero's "Quality dental care" eyebrow. Breadcrumb stays
          tight against the eyebrow with a small mb. */}
      <section className="mx-auto max-w-300 px-5 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-12 lg:px-10 lg:pt-[58px] lg:pb-7">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px] text-text-muted">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="text-border-strong">›</span>
          <span className="text-text">Contact</span>
        </nav>
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:mb-3 sm:text-[12px]">
          Get in touch
        </span>
        <h1 className="mt-3 mb-[14px] font-display text-[28px] font-bold leading-[1.2] text-text sm:mt-4 sm:mb-[18px] sm:text-[34px] lg:text-[40px]">
          We're here to help.
        </h1>
        <p
          className="text-[16px] leading-[1.55] text-text-muted lg:text-[19px]"
          style={{ textWrap: 'pretty' } as React.CSSProperties}
        >
          Questions about your benefit, our network, or partnering with EGDN — reach us the
          way that works for you. We respond to most inquiries within one business day.
        </p>
      </section>

      {/* ── Form + Sidebar ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 pb-12 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
          {/* Form — order 2 on mobile (after tiles), 1 on desktop (left) */}
          <div className="order-2 rounded-card border border-border bg-surface p-6 sm:p-8 lg:order-1 lg:p-10">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:mb-3 sm:text-[12px]">
              Send a message
            </span>
            <h2 className="font-display text-[24px] font-semibold text-text sm:text-[28px]">
              Drop us a line.
            </h2>
            <p className="mt-2 mb-7 text-[15px] text-text-muted sm:mt-3 sm:mb-9">
              Fill out the form and we'll route it to the right person on our team.
            </p>
            <ContactForm />
            <p className="mt-5 text-[13px] leading-[1.5] text-text-muted sm:mt-6">
              By submitting, you agree to our <Link href="/privacy" className="underline underline-offset-[3px] hover:text-text">privacy policy</Link>. We never share your information.
            </p>
          </div>

          {/* Sidebar — order 1 on mobile (above form), 2 on desktop (right) */}
          <aside className="order-1 flex flex-col gap-3.5 lg:order-2">
            <ContactTile
              href="tel:+63288367181"
              label="Call us"
              value="(632) 8836.7181"
              sub="Mon–Fri, 9AM–6PM"
              icon={<PhoneIcon />}
            />
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

            {/* Hours card */}
            <div className="rounded-card border border-border bg-surface p-5 sm:p-[22px]">
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

      {/* ── FAQ strip ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
        <div className="mb-8 max-w-[640px] sm:mb-10">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:mb-3 sm:text-[12px]">
            Before you write
          </span>
          <h2 className="font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
            Common questions, quickly answered.
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-text-muted sm:mt-3 sm:text-[16px]">
            Many members find what they need here without sending a message.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-card border border-border bg-surface p-5 sm:p-7"
            >
              <h3 className="font-display text-[17px] font-semibold leading-[1.25] text-text sm:text-[19px]">
                {f.q}
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.55] text-text-muted">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 sm:mt-8">
          <Link
            href="/faqs"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand hover:gap-2 transition-[gap]"
          >
            See all FAQs
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Office / Map ───────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-bg-deep">
        <div className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
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
                <div className="flex gap-3.5">
                  <span className="mt-0.5 shrink-0 text-brand"><MapMiniIcon /></span>
                  <div>
                    <dt className="font-semibold text-[15px] text-text">Getting here</dt>
                    <dd className="mt-0.5 text-[14px] leading-[1.5] text-text-muted">
                      Within walking distance of Ayala Triangle • building parking available
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-pill border border-brand bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#166889] hover:border-[#166889]"
                >
                  Open in Google Maps
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-pill border-[1.5px] border-brand bg-surface px-6 py-3 text-[14px] font-semibold text-brand transition-colors hover:bg-brand-light"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Map illustration — stylized placeholder, not a real map */}
            <div className="relative aspect-5/3 overflow-hidden rounded-card border border-border bg-surface">
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
            </div>
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
    'flex items-start gap-4 rounded-card border border-border bg-surface p-5 sm:p-[22px] transition-colors';

  if (href) {
    return (
      <a href={href} className={`${cls} hover:border-brand`}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
