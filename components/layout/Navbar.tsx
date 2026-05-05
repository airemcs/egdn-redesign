'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';

const links = [
  { href: '/find-a-dentist', label: 'Find a Dentist' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-bold text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm">
          EGDN
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                'text-[14px] font-medium transition-colors hover:text-brand',
                pathname === l.href || pathname.startsWith(l.href + '/')
                  ? 'text-brand'
                  : 'text-text',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
          <Button href="/book-appointment" size="default">
            Book an Appointment
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-bold text-brand" onClick={() => setOpen(false)}>
              EGDN
            </Link>
            <button
              className="p-2 text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  'text-[18px] font-medium transition-colors',
                  pathname === l.href ? 'text-brand' : 'text-text',
                ].join(' ')}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <Button href="/book-appointment" size="large" className="w-full justify-center" onClick={() => setOpen(false)}>
              Book an Appointment
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
