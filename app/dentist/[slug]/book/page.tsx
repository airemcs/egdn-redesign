import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Dentist from '@/lib/models/Dentist';
import MobileProfileBookingForm from '@/components/forms/MobileProfileBookingForm';
import { formatDentistName } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const dentist = await Dentist.findOne({ slug }).select('name').lean();
  if (!dentist) return { title: 'Book Appointment — EGDN' };
  return {
    title: `Book with ${dentist.name} — EGDN`,
    description: `Request a dental appointment with ${dentist.name}. EGDN confirms within 1 business day.`,
  };
}

function initialsOf(name: string): string {
  const formatted = formatDentistName(name);
  const stripped = formatted.replace(/^(Dr\.?|Doc\.?|Prof\.?)\s+/i, '');
  return stripped
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default async function DentistBookPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();
  const dentist = await Dentist.findOne({ slug }).lean();
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
