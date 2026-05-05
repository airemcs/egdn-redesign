import Link from 'next/link';

const membersLinks = [
  { href: '/find-a-dentist', label: 'Find a Dentist' },
  { href: '/book-appointment', label: 'Book an Appointment' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/digital-id', label: 'Digital ID' },
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-xl font-bold text-brand">
              EGDN
            </Link>
            <p className="mt-3 text-[14px] leading-relaxed text-text-muted">
              Quality dental care, wherever you are.
            </p>
            <a
              href="https://www.facebook.com/egdn2005/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EGDN on Facebook"
              className="mt-4 inline-flex items-center text-text-muted hover:text-brand transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          {/* For Members */}
          <FooterColumn title="For Members" links={membersLinks} />

          {/* For Partners */}
          <FooterColumn title="For Partners" links={partnersLinks} />

          {/* Company */}
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div className="mt-10 border-t border-border pt-6 text-[13px] text-text-muted">
          © {new Date().getFullYear()} Elite Group Dental Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-text">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14px] text-text-muted hover:text-brand transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
