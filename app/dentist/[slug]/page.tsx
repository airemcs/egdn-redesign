import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Dentist, { type DentistClinic } from '@/lib/models/Dentist';
import Avatar from '@/components/ui/Avatar';
import Breadcrumb from '@/components/ui/Breadcrumb';
import AppointmentForm from '@/components/forms/AppointmentForm';
import { splitPhoneNumbers } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const dentist = await Dentist.findOne({ slug }).select('name').lean();
  if (!dentist) return {};
  return {
    title: `${dentist.name} — EGDN`,
    description: `Book an appointment with ${dentist.name} through the Elite Group Dental Network.`,
  };
}

export default async function DentistProfilePage({ params }: PageProps) {
  const { slug } = await params;

  await connectDB();
  const dentist = await Dentist.findOne({ slug }).lean();

  if (!dentist) notFound();

  const firstClinic = dentist.clinics[0];

  return (
    <>
      <div className="mx-auto max-w-300 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">

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

        {/* Profile header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <Avatar name={dentist.name} src={dentist.headshotUrl} size={88} />
          <div>
            <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
              {dentist.name}
            </h1>
            <p className="mt-1.5 text-[17px] text-text-muted">{firstClinic?.clinicName}</p>
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
                  {firstClinic.city}, {firstClinic.region}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile body: sidebar + booking form */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">

          {/* Sidebar — sticky on desktop */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-card border border-border bg-surface p-6">
              <h3 className="mb-4 font-body text-[18px] font-semibold text-text">
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
                        ? `${firstClinic.city}, ${firstClinic.region}`
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
                      className="grid grid-cols-[110px_1fr] items-baseline gap-2 border-b border-border py-2.5 last:border-0"
                    >
                      <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-text-muted">
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
                  className="mt-4 rounded-card border border-border bg-surface p-6"
                >
                  <h3 className="mb-3 font-body text-[15px] font-semibold text-text">
                    Location {i + 2}
                  </h3>
                  <dl>
                    {(
                      [
                        { label: 'Clinic', value: clinic.clinicName },
                        { label: 'Address', value: clinic.address },
                        { label: 'City / Region', value: `${clinic.city}, ${clinic.region}` },
                        { label: 'Schedule', value: clinic.schedule },
                        { label: 'Contact', value: clinic.contactNumber },
                      ] as { label: string; value: string }[]
                    ).map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-[110px_1fr] items-baseline gap-2 border-b border-border py-2 last:border-0"
                      >
                        <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-text-muted">
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
                      <hr className="my-3 border-border" />
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

          {/* Booking form */}
          <div>
            <div className="rounded-card border border-border bg-surface p-6 sm:p-8">
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                Book an appointment
              </span>
              <h2 className="font-display text-2xl font-semibold text-text lg:text-3xl">
                Book with {dentist.name}
              </h2>
              <p className="mb-8 mt-2 text-[15px] text-text-muted">
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
    </>
  );
}
