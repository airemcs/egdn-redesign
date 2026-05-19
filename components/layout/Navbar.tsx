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

  // Lock body scroll while the mobile menu overlay is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
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
          className="md:hidden -mr-2 flex h-11 w-11 items-center justify-center text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>

      {/* Mobile overlay — rendered as a SIBLING of the header, not a
          descendant. The scrolled header uses backdrop-filter which creates
          a containing block; if the overlay lives inside the header,
          `position: fixed` is clamped to the 72px header height and the
          page bleeds through underneath. Hoisting it out anchors the fixed
          overlay to the viewport as intended. z-60 so it sits above the
          sticky header. */}
      {open && (
        <div className="fixed inset-0 z-60 flex flex-col bg-bg animate-[mFadeIn_200ms_cubic-bezier(0.2,0.6,0.2,1)]">
          {/* Header — matches sticky navbar height (72px) and px so the
              logo doesn't shift when opening/closing the overlay. */}
          <div className="flex h-18 items-center justify-between border-b border-border px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-[11px] font-bold text-white tracking-wide select-none font-body">EG</span>
              <span className="font-display text-xl font-bold text-text">EGDN</span>
            </Link>
            <button
              className="-mr-2 grid h-10 w-10 place-items-center rounded-lg text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand active:bg-brand-light"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Link list — Lora serif, divider rows, chevron indicator */}
          <nav className="flex flex-1 flex-col px-5 pt-4">
            {links.map((l, i) => {
              const active =
                l.href === '/'
                  ? pathname === '/'
                  : pathname === l.href || pathname.startsWith(l.href + '/');
              const isLast = i === links.length - 1;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={[
                    'flex items-center justify-between py-4 font-display text-[18px] font-semibold transition-colors',
                    isLast ? '' : 'border-b border-border',
                    active ? 'text-brand' : 'text-text',
                  ].join(' ')}
                >
                  <span>{l.label}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={active ? 'text-brand' : 'text-text-muted'}
                    aria-hidden
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              );
            })}

            <div className="mt-auto pt-5 pb-7">
              <Button
                href="/book-appointment"
                size="large"
                className="w-full justify-center"
                onClick={() => setOpen(false)}
              >
                Book an Appointment
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
