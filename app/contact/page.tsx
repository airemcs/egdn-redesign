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

      {/* Mobile-only quick-contact cards — one tap per channel */}
      <div className="mt-6 flex flex-col gap-3 lg:hidden">
        <a
          href="tel:+63288367181"
          className="flex items-center gap-4 rounded-card border border-border bg-surface px-4 py-3.5 transition-colors hover:border-brand"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Call us</span>
            <span className="text-[16px] font-bold leading-tight text-brand">(632) 8836.7181</span>
            <span className="mt-0.5 text-[12px] text-text-muted">Mon–Fri, 9AM–6PM</span>
          </span>
        </a>

        <a
          href="mailto:info@elitegroupph.com"
          className="flex items-center gap-4 rounded-card border border-border bg-surface px-4 py-3.5 transition-colors hover:border-brand"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="22 6 12 13 2 6" />
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Email</span>
            <span className="text-[16px] font-bold leading-tight text-brand break-all">info@elitegroupph.com</span>
            <span className="mt-0.5 text-[12px] text-text-muted">Replies within 1 business day</span>
          </span>
        </a>

        <div className="flex items-center gap-4 rounded-card border border-border bg-surface px-4 py-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Office</span>
            <span className="text-[16px] font-bold leading-tight text-text">Makati City</span>
            <span className="mt-0.5 text-[12px] text-text-muted">7th Floor Zeta II Bldg., Salcedo St.</span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-12 lg:mt-10 lg:grid-cols-[1fr_2fr]">
        {/* Form — first on mobile (order-1), right column on desktop (order-2) */}
        <div className="order-1 lg:order-2">
          <ContactForm />
        </div>

        {/* Full office details — below form on mobile, left column on desktop */}
        <div className="order-2 lg:order-1">
          <h2 className="font-display text-xl font-semibold text-text mb-5">Our Office</h2>
          <address className="not-italic text-[15px] leading-[1.6] text-text">
            Elite Group Health Access (Phils.), Inc.
            <br />
            7th Floor Zeta II Bldg.
            <br />
            191 Salcedo St., Legaspi Village
            <br />
            Makati City, Philippines 1229
          </address>

          <dl className="mt-6 space-y-4 text-[15px]">
            <div>
              <dt className="text-[13px] font-medium uppercase tracking-wide text-text-muted">Phone</dt>
              <dd className="mt-1 text-text">
                T:{' '}
                <a href="tel:+63288367181" className="text-brand hover:underline">
                  (632) 8836.7181
                </a>{' '}
                <span className="text-text-muted">|</span> M:{' '}
                <a href="tel:+639209517005" className="text-brand hover:underline">
                  (0920) 951.7005
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium uppercase tracking-wide text-text-muted">Email</dt>
              <dd className="mt-1">
                <a href="mailto:info@elitegroupph.com" className="text-brand hover:underline">
                  info@elitegroupph.com
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
              <dd className="mt-1 text-text">Monday–Friday, 9:00 AM – 6:00 PM</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
