import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { DentistClinic } from '@/lib/models/Dentist';
import { findDentistBySlug } from '@/lib/dentist-source';
import Avatar from '@/components/ui/Avatar';
import Breadcrumb from '@/components/ui/Breadcrumb';
import AppointmentForm from '@/components/forms/AppointmentForm';
import { formatCity, splitPhoneNumbers } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dentist = await findDentistBySlug(slug);
  if (!dentist) return {};
  return {
    title: `${dentist.name} — EGDN`,
    description: `Book an appointment with ${dentist.name} through the Elite Group Dental Network.`,
  };
}

export default async function DentistProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const dentist = await findDentistBySlug(slug);

  if (!dentist) notFound();

  const firstClinic = dentist.clinics[0];

  return (
    <>
      <div className="mx-auto max-w-300 px-5 pt-10 pb-28 sm:px-6 sm:pt-14 sm:pb-32 lg:px-10 lg:py-20">

        {/* Breadcrumb */}
        <Breadcrumb
          crumbs={[
            { label: 'Find a Dentist', href: '/find-a-dentist' },
            {
              label: firstClinic?.region ?? 'Region',
              href: firstClinic?.region
                ? `/find-a-dentist?region=${encodeURIComponent(firstClinic.region)}`
                : '/find-a-dentist',
            },
            { label: dentist.name },
          ]}
        />

        {/* Profile header — squircle avatar above the name. Name + clinic +
            chips flow underneath (mirrors the mobile design). Top spacing
            comes from the Breadcrumb component's built-in mb-6. */}
        <div>
          <Avatar name={dentist.name} src={dentist.headshotUrl ?? undefined} size={84} shape="rounded" />
          {/* Intentionally one step smaller than the .h1 page-title utility.
              Dentist names are naturally shorter than page titles, so 26/30/36
              reads better here than 28/34/40. Documented exception per
              egdn-design-prompt.md. */}
          <h1 className="mt-4 font-display text-[26px] font-bold leading-tight text-text sm:text-3xl lg:text-4xl">
            {dentist.name}
          </h1>
          <p className="mt-1 text-[15px] text-text-muted sm:mt-1.5 sm:text-[16px] lg:text-[17px]">
            {firstClinic?.clinicName}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {dentist.specializations.map((s: string) => (
              <span
                key={s}
                className="rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-semibold text-brand"
              >
                {s}
              </span>
            ))}
            {firstClinic && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[12px] font-semibold text-text-muted">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {formatCity(firstClinic.city)}
              </span>
            )}
          </div>
        </div>

        {/* Mobile-only quick actions — from the design's 3-button row. Hidden
            on lg+ since the sticky sidebar already exposes Call (phone),
            Directions (Google Maps), and Hours (schedule). */}
        {firstClinic && (
          <div className="mt-6 grid grid-cols-3 gap-2 lg:hidden">
            {(() => {
              const phones = splitPhoneNumbers(firstClinic.contactNumber);
              const firstPhone = phones[0];
              const telHref = firstPhone ? `tel:${firstPhone.replace(/[^0-9+]/g, '')}` : undefined;
              const actions: Array<{
                key: string;
                label: string;
                href?: string;
                target?: string;
                icon: React.ReactNode;
              }> = [
                {
                  key: 'call',
                  label: 'Call',
                  href: telHref,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                },
                {
                  key: 'directions',
                  label: 'Directions',
                  // Google Maps directions endpoint — opens "navigate to"
                  // straight from the user's current location. Including the
                  // clinic name helps Maps match the business listing
                  // (better than address alone, especially in malls/clusters).
                  href:
                    `https://www.google.com/maps/dir/?api=1&destination=` +
                    encodeURIComponent(
                      [
                        firstClinic.clinicName,
                        firstClinic.address,
                        firstClinic.city,
                        firstClinic.region,
                      ]
                        .filter(Boolean)
                        .join(', '),
                    ),
                  target: '_blank',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  ),
                },
                {
                  key: 'hours',
                  label: 'Hours',
                  href: '#clinic-details',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                },
              ];
              return actions.map((a) =>
                a.href ? (
                  <a
                    key={a.key}
                    href={a.href}
                    target={a.target}
                    rel={a.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="flex flex-col items-center gap-1.5 rounded-input border border-border bg-surface px-2 py-3.5 text-[12px] font-semibold text-text transition-colors hover:border-brand hover:text-brand"
                  >
                    <span className="text-brand">{a.icon}</span>
                    {a.label}
                  </a>
                ) : (
                  <span
                    key={a.key}
                    className="flex flex-col items-center gap-1.5 rounded-input border border-border bg-bg-deep px-2 py-3.5 text-[12px] font-semibold text-text-muted"
                  >
                    <span>{a.icon}</span>
                    {a.label}
                  </span>
                ),
              );
            })()}
          </div>
        )}

        {/* Profile body: sidebar + booking form */}
        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[360px_1fr] lg:items-start">

          {/* Sidebar — sticky on desktop */}
          <aside id="clinic-details" className="lg:sticky lg:top-24">
            <div className="rounded-card border border-border bg-surface p-5 sm:p-6">
              <h3 className="mb-4 font-body text-[17px] font-semibold text-text sm:text-[18px]">
                Clinic Details
              </h3>
              <dl>
                {(
                  [
                    { label: 'Clinic', value: firstClinic?.clinicName },
                    { label: 'Address', value: firstClinic?.address },
                    { label: 'Nearest Landmark', value: firstClinic?.nearestLandmark },
                    {
                      label: 'City / Region',
                      value: firstClinic
                        ? `${formatCity(firstClinic.city)}, ${firstClinic.region}`
                        : undefined,
                    },
                    { label: 'Schedule', value: firstClinic?.schedule },
                    { label: 'Contact', value: firstClinic?.contactNumber },
                  ] as { label: string; value: string | undefined }[]
                )
                  .filter((row) => row.value)
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col gap-0.5 border-b border-border py-2.5 last:border-0 sm:grid sm:grid-cols-[110px_1fr] sm:items-baseline sm:gap-2"
                    >
                      <dt className="eyebrow text-text-muted">
                        {row.label}
                      </dt>
                      <dd className="text-[14px] leading-snug text-text">
                        {row.label === 'Contact' && row.value ? (
                          <div className="flex flex-col">
                            {splitPhoneNumbers(row.value).map((p) => (
                              <span key={p}>{p}</span>
                            ))}
                          </div>
                        ) : (
                          row.value
                        )}
                      </dd>
                    </div>
                  ))}
              </dl>
              {firstClinic?.googleMapsUrl && (
                <>
                  <hr className="my-4 border-border" />
                  <a
                    href={firstClinic.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-pill border border-brand bg-surface py-2.5 text-[13px] font-semibold text-brand transition-all hover:-translate-y-px hover:bg-brand-light"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                    View on Google Maps
                  </a>
                </>
              )}
            </div>

            {/* Additional locations list */}
            {dentist.clinics.length > 1 &&
              dentist.clinics.slice(1).map((clinic: DentistClinic, i: number) => (
                <div
                  key={i}
                  className="mt-4 rounded-card border border-border bg-surface p-5 sm:p-6"
                >
                  <h3 className="mb-3 font-body text-[15px] font-semibold text-text">
                    {clinic.clinicName || `Location ${i + 2}`}
                  </h3>
                  <dl>
                    {(
                      [
                        { label: 'Clinic', value: clinic.clinicName },
                        { label: 'Address', value: clinic.address },
                        { label: 'City / Region', value: `${formatCity(clinic.city)}, ${clinic.region}` },
                        { label: 'Schedule', value: clinic.schedule },
                        { label: 'Contact', value: clinic.contactNumber },
                      ] as { label: string; value: string }[]
                    ).map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-col gap-0.5 border-b border-border py-2.5 last:border-0 sm:grid sm:grid-cols-[110px_1fr] sm:items-baseline sm:gap-2"
                      >
                        <dt className="eyebrow text-text-muted">
                          {row.label}
                        </dt>
                        <dd className="text-[14px] leading-snug text-text">
                        {row.label === 'Contact' && row.value ? (
                          <div className="flex flex-col">
                            {splitPhoneNumbers(row.value).map((p) => (
                              <span key={p}>{p}</span>
                            ))}
                          </div>
                        ) : (
                          row.value
                        )}
                      </dd>
                      </div>
                    ))}
                  </dl>
                  {clinic.googleMapsUrl && (
                    <>
                      <hr className="my-4 border-border" />
                      <a
                        href={clinic.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-medium text-brand hover:underline underline-offset-[3px]"
                      >
                        View on Google Maps →
                      </a>
                    </>
                  )}
                </div>
              ))}
          </aside>

          {/* Booking form — hidden on mobile (<md) where the sticky CTA
              routes to /dentist/[slug]/book instead. Tablet/desktop keep
              the inline form. */}
          <div id="book" className="hidden md:block">
            <div className="rounded-card border border-border bg-surface p-5 sm:p-6 lg:p-8">
              <span className="eyebrow mb-2 sm:mb-3">
                Book an appointment
              </span>
              <h2 className="font-display text-[22px] font-semibold leading-tight text-text sm:text-2xl lg:text-3xl">
                Book with {dentist.name}
              </h2>
              <p className="mb-6 mt-2 text-[14px] text-text-muted sm:mb-8 sm:text-[15px]">
                Fill out the form below and EGDN will confirm your booking within 1 business day.
              </p>
              <AppointmentForm
                dentist={{
                  id: String(dentist._id),
                  name: dentist.name,
                  clinics: dentist.clinics.map((c: DentistClinic) => ({
                    clinicName: c.clinicName,
                    city: c.city,
                  })),
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Sticky bottom CTA — mobile (<md) routes to the new full-screen
          booking form at /dentist/[slug]/book; tablet (md..<lg) keeps the
          in-page scroll-to-form behavior since the inline card is still
          visible there. Hidden on lg+ where the form sits next to the sidebar. */}
      <a
        href={`/dentist/${slug}/book`}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset md:hidden"
      >
        <span className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-semibold text-white transition-colors hover:bg-[#0F4D63]">
          Book an Appointment
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </a>
      <a
        href="#book"
        className="fixed bottom-0 left-0 right-0 z-40 hidden border-t border-border bg-bg px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset md:block lg:hidden"
      >
        <span className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-semibold text-white transition-colors hover:bg-[#0F4D63]">
          Book an Appointment
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </a>
    </>
  );
}
