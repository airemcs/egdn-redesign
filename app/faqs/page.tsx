import type { Metadata } from 'next';
import Link from 'next/link';
import Accordion from '@/components/ui/Accordion';
import CtaSection from '@/components/sections/CtaSection';
import PageContainer from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: 'FAQs — EGDN',
  description: 'Frequently asked questions about the Elite Group Dental Network.',
};

// [CONFIRM WITH CLIENT — pull actual Q&A from live Wix /memberfaqs page]
const groups = [
  {
    title: 'For Members',
    items: [
      {
        question: 'How do I use my EGDN membership?',
        answer:
          'Find a partner clinic near you using the directory, book an appointment, then bring your member ID on the day of your visit. The clinic will verify your coverage with EGDN directly.',
      },
      {
        question: 'What do I bring to my appointment?',
        answer:
          'Bring your EGDN member ID card. If you have a physical card and a digital ID, either is accepted. Some clinics may also ask for a valid government ID.',
      },
      {
        question: 'What dental procedures are covered?',
        answer:
          'Coverage depends on your employer\'s specific plan. Contact EGDN or check with your HR department for the details of your benefit.',
      },
      {
        question: 'How do I find a dentist near me?',
        answer:
          'Use the Find a Dentist page to search by region, then filter by city or municipality. You can view each dentist\'s clinic details and book directly from their profile.',
      },
      {
        question: 'Can I use any dentist, or only partner clinics?',
        answer:
          'Your EGDN benefit covers visits to partner clinics only. Use the directory to find accredited clinics near you.',
      },
      {
        question: "What if my preferred dentist isn't in the network?",
        answer:
          'You can nominate a dentist to join the network. EGDN will reach out to them and assess whether they qualify as a partner clinic.',
      },
    ],
  },
  {
    title: 'Bookings & Appointments',
    items: [
      {
        question: 'How do I book an appointment?',
        answer:
          'You can book online through our website or call the clinic directly. When booking, mention that you\'re an EGDN member.',
      },
      {
        question: 'How far in advance do I need to book?',
        answer:
          'We recommend booking at least 3 days in advance to give the clinic enough time to prepare.',
      },
      {
        question: 'Can I walk in without an appointment?',
        answer:
          'This depends on the clinic. Some partner clinics accept walk-ins; others require a booking. Check the clinic\'s schedule on their profile or call ahead.',
      },
      {
        question: 'How do I cancel or reschedule?',
        answer:
          'Contact the clinic directly as soon as possible if you need to cancel or reschedule. For assistance, you can also reach EGDN through the Contact page.',
      },
    ],
  },
  {
    title: 'Membership & ID',
    items: [
      {
        question: 'How do I get my digital member ID?',
        answer:
          'Digital member IDs are issued directly by EGDN. If you haven\'t received yours, visit the Digital ID page for instructions on how to request one.',
      },
      {
        question: 'What if I lose my member ID card?',
        answer:
          'Contact EGDN and we\'ll arrange a replacement. See the Digital ID page or reach us through the Contact page.',
      },
      {
        question: 'Is my family covered under my membership?',
        answer:
          'Family coverage depends on your employer\'s plan. Check with your HR department or contact EGDN for clarification.',
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <>
      <PageContainer width="reading" className="py-12 sm:py-16 lg:py-20">
        <h1 className="h1 text-text">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-[16px] text-text-muted">
          Can't find an answer?{' '}
          <Link href="/contact" className="text-brand hover:underline">
            Contact us
          </Link>{' '}
          and we'll get back to you.
        </p>

        <div className="mt-12 space-y-12">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="font-display text-xl font-semibold text-text mb-4">{group.title}</h2>
              <Accordion items={group.items} />
            </section>
          ))}
        </div>
      </PageContainer>

      <CtaSection
        headline="Still have questions?"
        subtext="We're happy to help."
        primaryLabel="Contact EGDN"
        primaryHref="/contact"
        secondaryLabel={undefined}
        secondaryHref={undefined}
      />
    </>
  );
}
