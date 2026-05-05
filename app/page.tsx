import type { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Elite Group Dental Network — Quality Dental Care, Wherever You Are',
  description:
    'Find a trusted EGDN partner dentist near you. Present your member ID. Get the care you deserve.',
};

const stats = [
  { value: '600+', label: 'Partner Clinics' },
  { value: '16', label: 'Regions' },
  { value: '138', label: 'Cities & Municipalities' },
  // [CONFIRM WITH CLIENT — verify these numbers before launch]
];

const howItWorksCards = [
  {
    n: '01',
    title: 'Find a dentist',
    body: 'Search by region or city. 600+ partner clinics nationwide.',
  },
  {
    n: '02',
    title: 'Book an appointment',
    body: 'Call or book online. Bring your member ID.',
  },
  {
    n: '03',
    title: 'Get treated',
    body: 'Present your ID at the clinic. We handle the rest.',
  },
];

const audienceCards = [
  {
    eyebrow: "I'm a member",
    title: 'Find your nearest partner dentist',
    linkLabel: 'Search the directory →',
    href: '/find-a-dentist',
  },
  {
    eyebrow: 'I represent a company',
    title: 'Add dental coverage to your employee benefits',
    linkLabel: 'Partner with us →',
    href: '/partner-with-us',
  },
  {
    eyebrow: "I'm a dental provider",
    title: 'Join our growing network of clinics',
    linkLabel: 'Join our network →',
    href: '/join-our-network',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — replace bg-brand-light with a real full-bleed photo via next/image once available */}
      <section className="relative bg-brand-light overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-bold text-text leading-tight lg:text-5xl">
              Your dental benefit, everywhere you need it.
            </h1>
            <p className="mt-5 text-[17px] text-text-muted leading-relaxed">
              Find a trusted partner dentist near you — and get the care you deserve.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/find-a-dentist" size="large">Find a Dentist</Button>
              <Button href="/how-it-works" variant="secondary" size="large">How It Works</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-4xl font-bold text-text-on-brand">{s.value}</dt>
                <dd className="mt-1 text-[14px] text-text-on-brand opacity-80">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works summary */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-text lg:text-3xl">
            Using your benefit is simple.
          </h2>
          <p className="mt-2 text-[16px] text-text-muted">Three steps from start to treatment.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {howItWorksCards.map((c) => (
            <div key={c.n} className="rounded-card border border-border bg-surface p-6">
              <span className="font-display text-3xl font-bold text-brand opacity-40">{c.n}</span>
              <h3 className="mt-3 font-body text-[16px] font-semibold text-text">{c.title}</h3>
              <p className="mt-2 text-[14px] text-text-muted leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/how-it-works" className="text-[14px] text-brand hover:underline">
            See the full process →
          </Link>
        </div>
      </section>

      {/* About EGDN */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl font-semibold text-text lg:text-3xl">
              A dental network built around you.
            </h2>
            <p className="mt-4 text-[16px] text-text-muted leading-relaxed">
              {/* [CONFIRM WITH CLIENT — verify founding year and messaging accuracy] */}
              Elite Group Dental Network has been connecting members with quality dental care across
              the Philippines since 2005. We partner with trusted clinics so you always have a
              dentist near home, near work, or wherever life takes you.
            </p>
          </div>
        </div>
      </section>

      {/* Three audience CTAs */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {audienceCards.map((c) => (
            <div key={c.href} className="rounded-card border border-border bg-surface p-8 flex flex-col">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-brand">{c.eyebrow}</p>
              <h3 className="mt-3 font-display text-[20px] font-semibold text-text leading-snug">
                {c.title}
              </h3>
              <Link href={c.href} className="mt-auto pt-6 text-[14px] font-medium text-brand hover:underline">
                {c.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        headline="Ready to get started?"
        subtext="Your benefit is already waiting — find a dentist near you today."
        primaryLabel="Find a Dentist"
        primaryHref="/find-a-dentist"
        secondaryLabel="Book an Appointment"
        secondaryHref="/book-appointment"
      />
    </>
  );
}
