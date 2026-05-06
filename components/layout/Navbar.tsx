'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';

const links = [
  { href: '/', label: 'Home' },
  { href: '/find-a-dentist', label: 'Find a Dentist' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-50 flex h-18 items-center transition-all duration-200',
        scrolled
          ? 'bg-[rgba(250,247,244,0.92)] border-b border-border backdrop-blur-sm backdrop-saturate-150'
          : 'bg-bg border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex w-full max-w-300 items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-[11px] font-bold text-white tracking-wide select-none">
            EG
          </span>
          <span className="font-display text-xl font-bold text-text">EGDN</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => {
            const active =
              l.href === '/'
                ? pathname === '/'
                : pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  'relative px-1 py-2 text-[14px] font-medium transition-colors hover:text-brand',
                  active ? 'text-brand' : 'text-text',
                ].join(' ')}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-1 right-1 h-0.5 rounded-xs bg-brand" />
                )}
              </Link>
            );
          })}
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
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-[11px] font-bold text-white tracking-wide select-none">EG</span>
              <span className="font-display text-xl font-bold text-text">EGDN</span>
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
