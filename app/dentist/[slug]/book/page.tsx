import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findDentistBySlug } from '@/lib/dentist-source';
import MobileProfileBookingForm from '@/components/forms/MobileProfileBookingForm';
import { formatDentistName } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dentist = await findDentistBySlug(slug);
  if (!dentist) return { title: 'Book Appointment — EGDN' };
  return {
    title: `Book with ${dentist.name} — EGDN`,
    description: `Request a dental appointment with ${dentist.name}. EGDN confirms within 1 business day.`,
  };
}

function initialsOf(name: string): string {
  // Keep the honorific as the first letter so the avatar reads "D" +
  // first-name initial (e.g. "DL" for "Dr. Lyn Obias"). Matches the
  // DentistCard convention across the site.
  const formatted = formatDentistName(name);
  return formatted
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default async function DentistBookPage({ params }: PageProps) {
  const { slug } = await params;
  const dentist = await findDentistBySlug(slug);
  if (!dentist) notFound();

  const firstClinic = dentist.clinics[0];

  return (
    <MobileProfileBookingForm
      slug={dentist.slug}
      dentistName={dentist.name}
      initials={initialsOf(dentist.name)}
      clinicName={firstClinic?.clinicName ?? ''}
      city={firstClinic?.city ?? ''}
    />
  );
}
