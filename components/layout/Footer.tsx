import Link from 'next/link';

const membersLinks = [
  { href: '/find-a-dentist', label: 'Find a Dentist' },
  { href: '/book-appointment', label: 'Book an Appointment' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faqs', label: 'FAQs' },
  // `/digital-id` is intentionally omitted: it's a coming-soon page reachable
  // via copy on /contact and /faqs. Surfacing it from the persistent footer
  // sends users into a dead-end empty state. Restore once the feature ships.
];

const partnersLinks = [
  { href: '/partner-with-us', label: 'Partner With Us' },
  { href: '/join-our-network', label: 'Join Our Network' },
  { href: '/nominate', label: 'Nominate a Dentist' },
];

const companyLinks = [{ href: '/contact', label: 'Contact Us' }];

export default function Footer() {
  return (
    <footer className="bg-footer-bg border-t border-border">
      <div className="mx-auto max-w-300 px-5 pt-8 pb-7 sm:px-6 sm:pt-10 sm:pb-10 lg:px-10 lg:pt-12">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-65">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-[11px] font-bold text-white tracking-wide select-none font-body">
                EG
              </span>
              <span className="font-display text-xl font-bold text-text">EGDN</span>
            </Link>
            <p className="mt-2.5 text-[13px] leading-[1.5] text-text-muted sm:mt-3 sm:text-[14px] sm:leading-relaxed">
              Quality dental care, wherever you are.
            </p>
          </div>

          {/* For Members */}
          <FooterColumn title="For Members" links={membersLinks} />

          {/* For Partners */}
          <FooterColumn title="For Partners" links={partnersLinks} />

          {/* Company */}
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div className="mt-7 border-t border-border pt-[18px] flex flex-col-reverse gap-4 text-[12px] text-text-muted sm:mt-16 sm:pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:text-[13px]">
          <span>© {new Date().getFullYear()} Elite Group Dental Network. All rights reserved.</span>
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/egdn2005/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EGDN on Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text transition-all hover:text-brand hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-body text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14px] text-text hover:text-brand transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
