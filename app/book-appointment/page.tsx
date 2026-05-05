import type { Metadata } from 'next';
import AppointmentForm from '@/components/forms/AppointmentForm';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Book an Appointment — EGDN',
  description: "Request a dental appointment through EGDN. We'll confirm within 1 business day.",
};

export default function BookAppointmentPage() {
  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
          Book an Appointment
        </h1>
        <p className="mt-3 text-[16px] text-text-muted">
          We'll confirm your booking within 1 business day.
        </p>
        <div className="mt-10">
          <AppointmentForm />
        </div>
      </div>
      <CtaSection
        headline="Looking for a specific dentist?"
        subtext="Search our directory to find a partner clinic near you."
        primaryLabel="Find a Dentist"
        primaryHref="/find-a-dentist"
        secondaryLabel={undefined}
        secondaryHref={undefined}
      />
    </>
  );
}
