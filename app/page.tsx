import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import CtaSection from '@/components/sections/CtaSection';
import { connectDB } from '@/lib/mongodb';
import Dentist from '@/lib/models/Dentist';

export const metadata: Metadata = {
  title: 'Elite Group Dental Network — Quality Dental Care, Wherever You Are',
  description:
    'Find a trusted EGDN partner dentist near you. Present your member ID. Get the care you deserve.',
};

// Re-render at most once an hour; the network only grows on a clinic-onboarding cadence.
export const revalidate = 3600;

async function getNetworkStats() {
  await connectDB();
  // Run the per-clinic aggregation and the per-dentist count in parallel —
  // the aggregation $unwinds clinics so it can't count distinct dentists
  // directly, hence the separate countDocuments call.
  const [aggResult, dentistsCount] = await Promise.all([
    Dentist.aggregate<{
      clinics: number;
      regions: number;
      cities: number;
    }>([
      { $unwind: '$clinics' },
      {
        $group: {
          _id: null,
          clinics: { $sum: 1 },
          regions: { $addToSet: '$clinics.region' },
          // region+city composite — same city name in different regions stays distinct
          cities: { $addToSet: { $concat: ['$clinics.region', '|', '$clinics.city'] } },
        },
      },
      {
        $project: {
          _id: 0,
          clinics: 1,
          regions: { $size: '$regions' },
          cities: { $size: '$cities' },
        },
      },
    ]),
    Dentist.countDocuments(),
  ]);
  const agg = aggResult[0] ?? { clinics: 0, regions: 0, cities: 0 };
  return { ...agg, dentists: dentistsCount };
}


const audienceCards = [
  {
    eyebrow: "I'm a member",
    title: 'Find your nearest partner dentist',
    linkLabel: 'Search the directory',
    href: '/find-a-dentist',
  },
  {
    eyebrow: 'I represent a company',
    title: 'Add dental coverage to your employee benefits',
    linkLabel: 'Partner with us',
    href: '/partner-with-us',
  },
  {
    eyebrow: "I'm a dental provider",
    title: 'Join our growing network of clinics',
    linkLabel: 'Join our network',
    href: '/join-our-network',
  },
];

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default async function HomePage() {
  const networkStats = await getNetworkStats();
  const stats: { value: string; label: string; shortLabel?: string }[] = [
    { value: String(networkStats.clinics), label: 'Partner Clinics' },
    { value: String(networkStats.dentists), label: 'Dentists' },
    {
      value: String(networkStats.cities),
      label: 'Cities & Municipalities',
      shortLabel: 'Cities & Munis',
    },
  ];

  const steps = [
    {
      n: '01',
      title: 'Find a dentist',
      body: `Search by region or city. ${networkStats.clinics} partner clinics nationwide.`,
    },
    {
      n: '02',
      title: 'Book an appointment',
      body: 'Call or book online. Bring your member ID and a valid government-issued ID.',
    },
    {
      n: '03',
      title: 'Get treated',
      body: "Present your ID at the clinic. They'll verify your coverage with us and you're set.",
    },
  ];

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="hero-overlay absolute inset-0 z-[1]" />

        {/* Content — flex+min-height live here to match .hero-full-content */}
        <div className="relative z-[2] mx-auto flex min-h-[420px] w-full max-w-300 items-end px-5 pt-12 pb-10 sm:min-h-125 sm:items-center sm:px-6 sm:py-16 lg:min-h-135 lg:px-10 lg:py-24">
          <div className="max-w-[560px]">
            <span className="eyebrow mb-2 sm:mb-3">
              Quality dental care, nationwide
            </span>
            <h1 className="mt-3 mb-3.5 h1 text-text sm:mt-4 sm:mb-4.5">
              Your dental benefit, everywhere you need it.
            </h1>
            <p
              className="mb-5 max-w-[480px] text-[16px] leading-[1.55] text-text-muted sm:mb-[40px] lg:text-[19px]"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Find a trusted partner dentist near you — and get the care you deserve.
            </p>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
              <Button href="/find-a-dentist" size="large" className="w-full justify-center sm:w-auto">
                Find a Dentist
                <ArrowIcon />
              </Button>
              <Button href="/how-it-works" variant="secondary" size="large" className="w-full justify-center sm:w-auto">
                How It Works
              </Button>
            </div>

            {/* Trust block */}
            <div className="mt-[22px] flex max-w-[420px] items-center gap-3 sm:mt-[40px] sm:gap-[14px] sm:border-t sm:border-border sm:pt-4">
              <div className="flex shrink-0">
                {[
                  { initials: 'MS', bg: '#E8D9C7' },
                  { initials: 'JC', bg: '#D9D2C2' },
                  { initials: 'AR', bg: '#CFD8C8' },
                ].map((a, i) => (
                  <span
                    key={a.initials}
                    className="flex h-[30px] w-[30px] select-none items-center justify-center rounded-full border-2 border-bg font-body text-[10px] font-semibold text-text sm:h-9 sm:w-9 sm:text-[12px]"
                    style={{ background: a.bg, marginLeft: i === 0 ? 0 : '-7px' }}
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <div className="flex flex-col text-[12px] leading-[1.3] sm:text-[14px]">
                <strong className="text-text">Trusted since 2005</strong>
                <span className="text-text-muted">by partner clinics across the Philippines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-bg-deep">
        <div className="mx-auto max-w-300 px-5 py-6 sm:px-6 sm:py-10 lg:px-10">
          <dl className="grid grid-cols-3 gap-3 sm:gap-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={[
                  'flex flex-1 flex-col justify-start gap-1.5 sm:flex-row sm:items-baseline sm:gap-4 sm:px-6',
                  i > 0 ? 'border-l border-border-strong pl-4 sm:pl-6' : '',
                ].join(' ')}
              >
                <dt className="font-display text-[32px] font-bold leading-none tracking-[-0.02em] text-brand sm:text-[52px] lg:text-[64px]">
                  {s.value}
                </dt>
                <dd className="max-w-40 text-[11px] font-medium leading-[1.3] text-balance text-text sm:text-[14px] lg:text-[15px]">
                  <span className="sm:hidden">{s.shortLabel ?? s.label}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mb-6 grid items-center gap-6 sm:mb-[40px] sm:gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-[640px]">
            <span className="eyebrow mb-2 sm:mb-3">
              How it works
            </span>
            <h2 className="font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
              Using your benefit is simple.
            </h2>
            <p className="mt-2 leading-relaxed text-text-muted sm:mt-3 lg:text-[17px]">
              Three steps from start to treatment. Your EGDN member card is your key to any
              partner clinic in the network.
            </p>
          </div>

          {/* Member ID card — container aspect matches the source image
              (1536×1024 = 3:2) so object-cover fills the frame with no
              letterboxing, and the card sits centered by default. */}
          <div className="relative aspect-3/2 overflow-hidden rounded-card border border-border">
            <Image
              src="/images/member-card.png"
              alt="EGDN member ID card"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>
        </div>

        <ol className="grid list-none gap-3 p-0 sm:grid-cols-3 sm:gap-[24px]">
          {steps.map((c) => (
            <li
              key={c.n}
              className="flex flex-col gap-1.5 rounded-card border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand sm:gap-3 sm:p-6 lg:p-10"
            >
              <span className="font-display text-[24px] font-bold leading-none text-brand sm:text-[28px] lg:text-[32px]">
                {c.n}
              </span>
              <h3 className="mt-0.5 font-body text-[16px] font-semibold text-text sm:mt-1 sm:text-[18px]">{c.title}</h3>
              <p className="meta leading-relaxed">{c.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-4 sm:mt-[24px]">
          <Button href="/how-it-works" variant="ghost">
            See the full process
            <ArrowIcon />
          </Button>
        </div>
      </section>

      {/* ── About EGDN ─────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-[64px] lg:items-center">
            {/*
              Image placeholder — replace this entire <div> with:
              <Image src="/images/about-egdn.jpg" alt="..." fill className="rounded-card object-cover" />
              wrapped in <div className="relative aspect-[5/4] overflow-hidden rounded-card">
            */}
            {/* Image slot — replace with a real <Image> (clinic or member
                photo) when an asset is available. The dashed border + bracket
                copy is intentional: it signals "needs an image" to whoever
                opens this file, rather than reading like a finished panel. */}
            <div className="relative grid aspect-5/4 place-items-center overflow-hidden rounded-card border-2 border-dashed border-border-strong bg-bg-deep">
              <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-muted">
                [ photo: clinic / member ]
              </span>
            </div>

            <div>
              <span className="eyebrow mb-2 sm:mb-3">
                About EGDN
              </span>
              <h2 className="font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
                A dental network built around you.
              </h2>
              <p
                className="mt-4 text-[16px] leading-[1.65] text-text sm:mt-5 sm:leading-[1.7] lg:text-[19px]"
                style={{ textWrap: 'pretty' } as React.CSSProperties}
              >
                Elite Group Dental Network has been connecting members with quality dental care across
                the Philippines since 2005. We partner with trusted clinics so you always have a
                dentist near home, near work, or wherever life takes you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Audience cards ─────────────────────────────────────────────────── */}
      {/* asymmetric padding — CTA below has its own top padding, so pb is intentionally smaller */}
      <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mb-6 sm:mb-[40px]">
          <span className="eyebrow mb-2 sm:mb-3">
            Find your path
          </span>
          <h2 className="font-display text-[22px] font-semibold text-text sm:text-[26px] lg:text-[30px]">
            Made for everyone in the network.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-[24px]">
          {audienceCards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col gap-2 rounded-card border border-border bg-surface p-5 text-text transition-all duration-200 hover:-translate-y-0.5 hover:border-brand sm:min-h-45 sm:justify-between sm:gap-0 sm:p-6 lg:min-h-55 lg:p-8"
            >
              <div>
                <span className="eyebrow text-text-muted">
                  {c.eyebrow}
                </span>
                <h3 className="mt-2 font-display text-[19px] font-semibold leading-[1.25] text-text sm:mt-3 lg:text-[22px]">
                  {c.title}
                </h3>
              </div>
              <span className="mt-1 inline-flex items-center gap-[6px] text-[13px] font-semibold text-brand transition-[gap] duration-[180ms] group-hover:gap-[10px] sm:mt-0 sm:text-[14px]">
                {c.linkLabel}
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
