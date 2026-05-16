'use client';

import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import PhoneInput from '@/components/ui/PhoneInput';

export interface DentistSummary {
  slug: string;
  name: string;
  initials: string;
  region: string;
  city: string;
  specialty: string;
  clinicName: string;
  /** All clinic phone numbers for this dentist — used for phone-search. */
  contactNumbers: string[];
}

interface BookingWizardProps {
  regions: { _id: string; count: number }[];
  dentists: DentistSummary[];
  specialties: string[];
}

const REASON_OPTIONS = [
  { id: 'checkup', label: 'Routine check-up & cleaning' },
  { id: 'pain', label: 'Tooth pain or discomfort' },
  { id: 'procedure', label: 'Specific procedure' },
  { id: 'other', label: 'Other / not sure yet' },
];

const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening'] as const;

// Specializations to hide from the Step 2 chip picker. The dentists who
// hold these as their primary specialty are still findable — they just
// don't surface a dedicated filter chip. Keeping the set centralized so
// it's easy to toggle later.
const HIDDEN_SPECIALTIES = new Set<string>([
  'CPS',
  'Cosmetic Dentistry',
  'Dental Sleep Medicine',
  'Implant Dentistry',
  'Prosthodontics',
  'TMJ',
]);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Check = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClinicIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M10 11h4" />
    <path d="M12 9v4" />
    <path d="M10 17h4" />
  </svg>
);

const VideoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <polyline points="22 8 16 12 22 16 22 8" />
  </svg>
);

const BoltIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
);

const minDateString = (daysFromToday: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
};

// Cutoff hours (24h) past which a slot is no longer bookable for today.
// Morning ends at noon, Afternoon at 5 PM, Evening at 9 PM.
const SLOT_CUTOFF_HOUR: Record<(typeof TIME_OPTIONS)[number], number> = {
  Morning: 12,
  Afternoon: 17,
  Evening: 21,
};

const todayDateString = () => new Date().toISOString().split('T')[0];

const isSlotPast = (slot: (typeof TIME_OPTIONS)[number]) =>
  new Date().getHours() >= SLOT_CUTOFF_HOUR[slot];

const allSlotsPastToday = () =>
  TIME_OPTIONS.every((t) => isSlotPast(t));

export default function BookingWizard({ regions, dentists, specialties }: BookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [refNum, setRefNum] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Local dentist search — kicks in when region has more than 5 matches.
  // Resets whenever the upstream filters (region/city/specialty) change.
  const [dentistQuery, setDentistQuery] = useState('');

  const [form, setForm] = useState({
    // Step 1
    name: '',
    memberId: '',
    phone: '',
    email: '',
    // Step 2
    visitType: 'in-person' as 'in-person' | 'teleconsult',
    regionId: '',
    city: '',
    specialty: '',
    dentistSlug: '',
    date: '',
    time: 'Morning' as (typeof TIME_OPTIONS)[number],
    // Step 3
    reason: '',
    notes: '',
    isFirstVisit: 'yes' as 'yes' | 'no' | 'unknown',
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Switching to teleconsult wipes any in-person location/dentist picks.
      // Switching back leaves them empty (user will fill in fresh).
      if (key === 'visitType' && value === 'teleconsult') {
        next.regionId = '';
        next.city = '';
        next.dentistSlug = '';
      }
      // Reset downstream selectors when upstream changes
      if (key === 'regionId') {
        next.city = '';
        next.dentistSlug = '';
      }
      if (key === 'city') {
        next.dentistSlug = '';
      }
      // Specialty preservation: if the user already picked a specialty and a
      // region/city change makes it unavailable, drop it back to "Any".
      if ((key === 'regionId' || key === 'city') && next.specialty) {
        const stillAvailable = dentists
          .filter((d) => d.region === next.regionId)
          .filter((d) => !next.city || d.city === next.city)
          .some((d) => d.specialty === next.specialty);
        if (!stillAvailable) next.specialty = '';
      }
      // When the user picks today (teleconsult) but their current time slot
      // has already passed, shift to the next available slot. If every slot
      // is past, leave the field unchanged — the date input's min will have
      // already bumped to tomorrow so this shouldn't happen.
      if (key === 'date' && next.date === todayDateString()) {
        if (isSlotPast(next.time)) {
          const nextOpen = TIME_OPTIONS.find((t) => !isSlotPast(t));
          if (nextOpen) next.time = nextOpen;
        }
      }
      return next;
    });
    // Wipe stale dentist search when the filter set changes
    if (key === 'regionId' || key === 'city' || key === 'specialty') {
      setDentistQuery('');
    }
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: '' }));
  };

  // Derived data
  const region = useMemo(
    () => regions.find((r) => r._id === form.regionId),
    [regions, form.regionId],
  );
  const cities = useMemo(() => {
    if (!form.regionId) return [];
    return [
      ...new Set(dentists.filter((d) => d.region === form.regionId).map((d) => d.city)),
    ].sort();
  }, [dentists, form.regionId]);
  const matchingDentists = useMemo(() => {
    if (!form.regionId) return [];
    return dentists
      .filter((d) => d.region === form.regionId)
      .filter((d) => !form.city || d.city === form.city)
      .filter((d) => !form.specialty || d.specialty === form.specialty);
  }, [dentists, form.regionId, form.city, form.specialty]);
  // Specialties available given the current region + city filters. Before a
  // region is picked, fall back to the full list passed in from the server.
  // The HIDDEN_SPECIALTIES set strips a few specialties from the chip picker
  // (still findable via "Any" — just no dedicated chip).
  const availableSpecialties = useMemo(() => {
    const base = !form.regionId
      ? specialties
      : [
          ...new Set(
            dentists
              .filter((d) => d.region === form.regionId)
              .filter((d) => !form.city || d.city === form.city)
              .map((d) => d.specialty)
              .filter(Boolean),
          ),
        ].sort();
    return base.filter((s) => !HIDDEN_SPECIALTIES.has(s));
  }, [dentists, specialties, form.regionId, form.city]);
  // Dropdown results — only computed/shown while the user is searching.
  // No default top-5; the picker stays compact ("Let EGDN match me" + search)
  // until the user types, at which point matches drop down from the input.
  // Matches on name, clinic name, or any of the dentist's clinic phone numbers
  // (digits-only comparison so "(02) 6159-4010" matches "6159").
  const searchResults = useMemo(() => {
    const raw = dentistQuery.trim();
    if (!raw) return [];
    const q = raw.toLowerCase();
    const digits = raw.replace(/\D/g, '');
    return matchingDentists
      .filter((d) => {
        if (d.name.toLowerCase().includes(q)) return true;
        if (d.clinicName.toLowerCase().includes(q)) return true;
        if (digits.length >= 3) {
          return d.contactNumbers.some((p) => p.replace(/\D/g, '').includes(digits));
        }
        return false;
      })
      .slice(0, 10);
  }, [matchingDentists, dentistQuery]);
  const selectedDentist = useMemo(
    () => dentists.find((d) => d.slug === form.dentistSlug),
    [dentists, form.dentistSlug],
  );

  function validateStep(s: 1 | 2 | 3 | 4) {
    const err: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) err.name = 'Required';
      if (!form.memberId.trim()) err.memberId = 'Required';
      if (!form.phone.trim()) err.phone = 'Required';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        err.email = 'Enter a valid email';
      }
    }
    // Step 2 (visit type) — always has a default ('in-person'), so no validation.
    if (s === 3) {
      // Region is only required for in-person visits — teleconsult skips
      // location entirely (EGDN matches you with any partner).
      if (form.visitType === 'in-person' && !form.regionId) {
        err.regionId = 'Choose a region';
      }
      if (!form.date) err.date = 'Required';
    }
    if (s === 4) {
      if (!form.reason) err.reason = 'Select a reason';
    }
    return err;
  }

  function goNext() {
    const err = validateStep(step);
    setErrors(err);
    if (Object.keys(err).length === 0) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  }

  function goBack() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStep((step - 1) as 1 | 2 | 3 | 4);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validateStep(4);
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setStatus('loading');

    const reasonLabel = REASON_OPTIONS.find((r) => r.id === form.reason)?.label ?? form.reason;
    const visitLabel =
      form.isFirstVisit === 'yes'
        ? 'First visit'
        : form.isFirstVisit === 'no'
          ? 'Returning patient'
          : 'EGDN to assign';

    const modeLabel =
      form.visitType === 'teleconsult' ? 'Teleconsultation (virtual)' : 'In-person visit';

    const composedNotes = [
      `Mode: ${modeLabel}`,
      `Reason: ${reasonLabel}`,
      `Visit type: ${visitLabel}`,
      form.email ? `Email: ${form.email}` : '',
      form.specialty ? `Specialty preference: ${form.specialty}` : '',
      form.notes ? `Notes: ${form.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const body = {
      memberName: form.name,
      memberId: form.memberId,
      dentistName:
        form.visitType === 'teleconsult'
          ? 'EGDN teleconsult — to be assigned'
          : (selectedDentist?.name ?? `EGDN match — ${region?._id ?? ''}`),
      clinicName:
        form.visitType === 'teleconsult'
          ? 'Virtual consultation'
          : (selectedDentist?.clinicName ?? 'To be assigned'),
      preferredDate: form.date,
      preferredTime: form.time,
      contactNumber: form.phone,
      notes: composedNotes,
      source:
        form.visitType === 'teleconsult'
          ? 'teleconsult'
          : selectedDentist
            ? 'profile'
            : 'standalone',
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      // Reference number is client-side display only — the real source of
      // truth is the DB record's _id, but we keep a friendly user-visible code.
      setRefNum('EGDN-' + Math.floor(100000 + Math.random() * 900000));
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      setStatus('error');
    }
  }

  // ─── Success state ───────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="mx-auto max-w-[720px]">
        <div className="rounded-card border border-border bg-surface p-8 text-center sm:px-10 sm:py-12">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-brand-light text-brand">
            <Check size={28} />
          </div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
            Request received
          </span>
          <h1 className="mt-2 font-display text-[28px] font-bold leading-tight text-text sm:text-[34px]">
            You're all set, {form.name.split(' ')[0] || 'member'}.
          </h1>
          <p className="mt-3 text-[16px] leading-[1.55] text-text-muted">
            EGDN will contact you at <strong className="text-text">{form.phone}</strong> within{' '}
            <strong className="text-text">
              {form.visitType === 'teleconsult' ? '1 business hour' : '1 business day'}
            </strong>{' '}
            to confirm your{' '}
            {form.visitType === 'teleconsult' ? 'teleconsultation' : 'appointment'}
            {form.visitType === 'in-person' && selectedDentist ? (
              <>
                {' '}with <strong className="text-text">{selectedDentist.name}</strong>
              </>
            ) : form.visitType === 'in-person' ? (
              <>
                {' '}at a partner clinic in <strong className="text-text">{region?._id}</strong>
              </>
            ) : null}
            .
          </p>

          <div className="mt-6 grid gap-4 rounded-input border border-border bg-bg-deep p-5 text-left sm:grid-cols-2 sm:p-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                Reference number
              </div>
              <div className="mt-1 font-display text-[22px] font-bold text-text">{refNum}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                Preferred date
              </div>
              <div className="mt-1 text-[15px] font-semibold text-text">
                {form.date} · {form.time}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-input border border-border bg-surface p-5 text-left sm:p-6">
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              What happens next
            </h3>
            <ol className="ml-5 flex list-decimal flex-col gap-2 text-[14px] leading-[1.5] text-text marker:font-bold marker:text-brand">
              {form.visitType === 'teleconsult' ? (
                <>
                  <li>EGDN reviews your request and assigns an on-call partner dentist.</li>
                  <li>We call you back to confirm within 1 business hour.</li>
                  <li>You receive a secure video-call link by SMS and email.</li>
                  <li>Join the call at your scheduled time — no clinic visit needed.</li>
                </>
              ) : (
                <>
                  <li>EGDN reviews your request and matches you with the right clinic.</li>
                  <li>We confirm the appointment by phone within 1 business day.</li>
                  <li>You receive an SMS with the final date, time, and clinic details.</li>
                  <li>On the day, bring your member ID — the clinic handles the rest.</li>
                </>
              )}
            </ol>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <a
              href="/find-a-dentist"
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-brand bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#166889]"
            >
              Back to directory
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-pill border-[1.5px] border-brand bg-surface px-6 py-3 text-[14px] font-semibold text-brand transition-colors hover:bg-brand-light"
            >
              Return home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Wizard form ─────────────────────────────────────────────────────────
  const stepLabels = ['Your info', 'Visit type', 'Where & when', 'Visit details'] as const;

  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
      {/* MAIN — stepper + form */}
      <div className="min-w-0">
        {/* Stepper — stacked on mobile, row on sm+ with a connector line
            between each step. Non-last items take flex-1 so the line stretches
            to fill the space; the line turns brand-light once the step is done. */}
        <ol className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
          {stepLabels.map((label, i) => {
            const n = (i + 1) as 1 | 2 | 3 | 4;
            const state = step === n ? 'active' : step > n ? 'done' : 'todo';
            const isLast = i === stepLabels.length - 1;
            return (
              <li
                key={n}
                className={[
                  'flex items-center gap-3 py-2',
                  isLast ? '' : 'sm:flex-1',
                ].join(' ')}
              >
                <button
                  type="button"
                  className={[
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[13px] font-bold transition-all',
                    state === 'active'
                      ? 'border-brand bg-brand text-white'
                      : state === 'done'
                        ? 'cursor-pointer border-brand-light bg-brand-light text-brand hover:bg-brand hover:text-white'
                        : 'cursor-not-allowed border-border bg-bg text-text-muted',
                  ].join(' ')}
                  onClick={() => state === 'done' && setStep(n)}
                  disabled={state !== 'done'}
                  aria-current={state === 'active' ? 'step' : undefined}
                >
                  {state === 'done' ? <Check size={14} /> : n}
                </button>
                <div className="flex flex-col leading-[1.2]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                    Step {n}
                  </span>
                  <span
                    className={[
                      'mt-0.5 text-[14px] font-semibold',
                      state === 'active' ? 'text-brand' : 'text-text',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </div>
                {!isLast && (
                  <span
                    aria-hidden
                    className={[
                      'hidden h-px min-w-[20px] flex-1 sm:mx-3 sm:block',
                      state === 'done' ? 'bg-brand-light' : 'bg-border',
                    ].join(' ')}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-hidden rounded-card border border-border bg-surface"
        >
          <div className="p-6 sm:p-8">
            {/* ===== Step 1 ===== */}
            {step === 1 && (
              <>
                <header className="mb-6">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
                    Step 1 of 4
                  </span>
                  <h2 className="mt-1.5 font-display text-[24px] font-semibold text-text sm:text-[28px]">
                    Your information
                  </h2>
                  <p className="mt-2 text-[15px] text-text-muted">
                    We need this to confirm your coverage and reach you by phone.
                  </p>
                </header>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Your name" error={errors.name}>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Juan Dela Cruz"
                      hasError={!!errors.name}
                    />
                  </Field>
                  <Field
                    id="memberId"
                    label="EGDN Member ID"
                    error={errors.memberId}
                    helper="Find this on your member card or with your HR team."
                  >
                    <Input
                      id="memberId"
                      value={form.memberId}
                      onChange={(e) => update('memberId', e.target.value)}
                      placeholder="EGDN-000000"
                      hasError={!!errors.memberId}
                    />
                  </Field>
                  <Field id="phone" label="Mobile number" error={errors.phone}>
                    <PhoneInput
                      id="phone"
                      value={form.phone}
                      onChange={(v) => update('phone', v)}
                      hasError={!!errors.phone}
                      bare
                      seamless
                    />
                  </Field>
                  <Field
                    id="email"
                    label={
                      <>
                        Email <span className="font-normal text-text-muted">(optional)</span>
                      </>
                    }
                    error={errors.email}
                  >
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@email.com"
                      hasError={!!errors.email}
                    />
                  </Field>
                </div>
              </>
            )}

            {/* ===== Step 2: Visit type ===== */}
            {step === 2 && (
              <>
                <header className="mb-6">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
                    Step 2 of 4
                  </span>
                  <h2 className="mt-1.5 font-display text-[24px] font-semibold text-text sm:text-[28px]">
                    How would you like to be seen?
                  </h2>
                  <p className="mt-2 text-[15px] text-text-muted">
                    Choose between an in-person clinic visit or a virtual consultation. You can change this later.
                  </p>
                </header>

                <div className="grid gap-3 sm:grid-cols-2">
                  <VisitTypeCard
                    active={form.visitType === 'in-person'}
                    onClick={() => update('visitType', 'in-person')}
                    icon={<ClinicIcon />}
                    label="In-person visit"
                    sub="Get treated at a partner clinic near you. Best for cleanings, exams, and procedures."
                    meta="Confirmed within 1 business day"
                  />
                  <VisitTypeCard
                    active={form.visitType === 'teleconsult'}
                    onClick={() => update('visitType', 'teleconsult')}
                    icon={<VideoIcon />}
                    label="Teleconsultation"
                    sub="Talk to a partner dentist over video for advice, second opinions, or a referral."
                    meta={
                      <span className="inline-flex items-center gap-1 text-brand">
                        <BoltIcon /> Confirmed within 1 business hour
                      </span>
                    }
                  />
                </div>
              </>
            )}

            {/* ===== Step 3: Where & when ===== */}
            {step === 3 && (
              <>
                <header className="mb-6">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
                    Step 3 of 4
                  </span>
                  <h2 className="mt-1.5 font-display text-[24px] font-semibold text-text sm:text-[28px]">
                    {form.visitType === 'teleconsult' ? 'When works for you?' : 'Where & when'}
                  </h2>
                  <p className="mt-2 text-[15px] text-text-muted">
                    {form.visitType === 'teleconsult'
                      ? 'Pick a date for your virtual consult. EGDN matches you with an on-call partner dentist and confirms within 1 business hour.'
                      : 'Pick a region and city. You can choose a specific dentist or let EGDN match you.'}
                  </p>
                </header>

                {form.visitType === 'in-person' && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="region" label="Region" error={errors.regionId}>
                    <SelectShell hasError={!!errors.regionId}>
                      <select
                        id="region"
                        value={form.regionId}
                        onChange={(e) => update('regionId', e.target.value)}
                        className="block h-12 w-full cursor-pointer appearance-none bg-transparent pl-4 pr-10 text-[14px] text-text focus:outline-none"
                      >
                        <option value="">Select a region…</option>
                        {regions.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r._id}
                          </option>
                        ))}
                      </select>
                    </SelectShell>
                  </Field>
                  <Field
                    id="city"
                    label={
                      <>
                        City <span className="font-normal text-text-muted">(optional)</span>
                      </>
                    }
                  >
                    <SelectShell disabled={!form.regionId}>
                      <select
                        id="city"
                        value={form.city}
                        onChange={(e) => update('city', e.target.value)}
                        disabled={!form.regionId}
                        className="block h-12 w-full cursor-pointer appearance-none bg-transparent pl-4 pr-10 text-[14px] text-text focus:outline-none disabled:cursor-not-allowed disabled:text-text-muted"
                      >
                        <option value="">
                          {form.regionId ? 'Any city in this region' : 'Pick a region first'}
                        </option>
                        {cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </SelectShell>
                  </Field>
                </div>
                )}

                <div className="mt-5">
                  <Label>
                    Specialization needed
                    {form.regionId && (
                      <span className="font-normal text-text-muted">
                        {' '}
                        ({availableSpecialties.length} available in {form.city || form.regionId})
                      </span>
                    )}
                  </Label>
                  <ChipRow>
                    <Chip active={!form.specialty} onClick={() => update('specialty', '')}>
                      Any
                    </Chip>
                    {availableSpecialties.map((s) => (
                      <Chip
                        key={s}
                        active={form.specialty === s}
                        onClick={() => update('specialty', s)}
                      >
                        {s}
                      </Chip>
                    ))}
                  </ChipRow>
                </div>

                {form.regionId && (
                  <div className="mt-5">
                    <Label>
                      Preferred dentist{' '}
                      <span className="font-normal text-text-muted">
                        (optional — {matchingDentists.length} match
                        {matchingDentists.length === 1 ? '' : 'es'})
                      </span>
                    </Label>
                    <div className="flex flex-col gap-2">
                      {/* "Let EGDN match me" — active when no specific dentist
                          is selected. Always at the top of the picker. */}
                      <DentistPickItem
                        active={form.dentistSlug === ''}
                        onClick={() => {
                          update('dentistSlug', '');
                          setDentistQuery('');
                        }}
                      >
                        <div>
                          <strong className="text-text">Let EGDN match me</strong>
                          <div className="mt-0.5 text-[13px] text-text-muted">
                            We&apos;ll pick the best partner clinic for your area and preferences.
                          </div>
                        </div>
                      </DentistPickItem>

                      {/* Currently selected dentist — only shown when the user
                          has picked one from the dropdown. */}
                      {selectedDentist && (
                        <DentistPickItem
                          active
                          onClick={() => {
                            /* clicking the selected card does nothing — to
                               deselect, click "Let EGDN match me" above */
                          }}
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-light text-[13px] font-semibold text-brand">
                            {selectedDentist.initials}
                          </span>
                          <div className="min-w-0 flex-1">
                            <strong className="text-text">{selectedDentist.name}</strong>
                            <div className="mt-0.5 truncate text-[13px] text-text-muted">
                              {selectedDentist.clinicName} · {selectedDentist.specialty} ·{' '}
                              {selectedDentist.city}
                            </div>
                          </div>
                        </DentistPickItem>
                      )}

                      {/* Search input — anchor for the dropdown. relative so the
                          absolute-positioned results panel below can align to it. */}
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                          <SearchIcon />
                        </span>
                        <input
                          type="text"
                          value={dentistQuery}
                          onChange={(e) => setDentistQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setDentistQuery('');
                          }}
                          placeholder={
                            selectedDentist
                              ? 'Search to choose a different dentist…'
                              : `Search ${matchingDentists.length} dentist${matchingDentists.length === 1 ? '' : 's'} by name or phone number…`
                          }
                          aria-label="Search dentists by name or phone number"
                          aria-expanded={dentistQuery.trim().length > 0}
                          className="block h-11 w-full rounded-input border border-border bg-surface pl-10 pr-3.5 text-[14px] text-text transition-colors placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]"
                        />

                        {/* Dropdown — drops from the search bar. Absolute so it
                            overlays content below instead of pushing the form
                            around as the user types. */}
                        {dentistQuery.trim() && (
                          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-80 overflow-y-auto rounded-input border border-border bg-surface shadow-lg">
                            {searchResults.length === 0 ? (
                              <p className="px-4 py-3 text-[13px] text-text-muted">
                                No dentists match &quot;{dentistQuery}&quot;.
                              </p>
                            ) : (
                              <ul className="py-1" role="listbox">
                                {searchResults.map((d) => (
                                  <li key={d.slug}>
                                    <button
                                      type="button"
                                      role="option"
                                      aria-selected={form.dentistSlug === d.slug}
                                      onClick={() => {
                                        update('dentistSlug', d.slug);
                                        setDentistQuery('');
                                      }}
                                      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-brand-light"
                                    >
                                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-light text-[13px] font-semibold text-brand">
                                        {d.initials}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <strong className="text-text">{d.name}</strong>
                                        <div className="mt-0.5 truncate text-[13px] text-text-muted">
                                          {d.clinicName} · {d.specialty} · {d.city}
                                        </div>
                                      </div>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <hr className="my-6 border-border" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="date"
                    label="Preferred date"
                    error={errors.date}
                    helper={
                      form.visitType === 'teleconsult'
                        ? allSlotsPastToday()
                          ? "Today's slots are closed — earliest is tomorrow."
                          : 'Same-day booking available.'
                        : 'Earliest: 3 days from today.'
                    }
                  >
                    <Input
                      id="date"
                      type="date"
                      min={
                        form.visitType === 'teleconsult'
                          ? minDateString(allSlotsPastToday() ? 1 : 0)
                          : minDateString(3)
                      }
                      value={form.date}
                      onChange={(e) => update('date', e.target.value)}
                      hasError={!!errors.date}
                    />
                  </Field>
                  <div>
                    <Label>Preferred time</Label>
                    <ChipRow>
                      {TIME_OPTIONS.map((t) => {
                        // A slot is disabled only when today's date is picked
                        // AND the slot's cutoff hour has already passed.
                        const disabled =
                          form.date === todayDateString() && isSlotPast(t);
                        return (
                          <Chip
                            key={t}
                            active={form.time === t}
                            onClick={() => !disabled && update('time', t)}
                            disabled={disabled}
                          >
                            {t}
                          </Chip>
                        );
                      })}
                    </ChipRow>
                    <p className="mt-1.5 text-[12px] text-text-muted">
                      Final time confirmed by the clinic.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ===== Step 4: Visit details ===== */}
            {step === 4 && (
              <>
                <header className="mb-6">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
                    Step 4 of 4
                  </span>
                  <h2 className="mt-1.5 font-display text-[24px] font-semibold text-text sm:text-[28px]">
                    Visit details
                  </h2>
                  <p className="mt-2 text-[15px] text-text-muted">
                    A few last things to help the clinic prepare for your appointment.
                  </p>
                </header>

                <div className="mb-5">
                  <Label>Reason for visit</Label>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {REASON_OPTIONS.map((r) => (
                      <ReasonCard
                        key={r.id}
                        active={form.reason === r.id}
                        onClick={() => update('reason', r.id)}
                      >
                        {r.label}
                      </ReasonCard>
                    ))}
                  </div>
                  {errors.reason && <p className="mt-1.5 text-[12px] text-error">{errors.reason}</p>}
                </div>

                <div className="mb-5">
                  <Label>Is this your first visit to this clinic?</Label>
                  <ChipRow>
                    <Chip
                      active={form.isFirstVisit === 'yes'}
                      onClick={() => update('isFirstVisit', 'yes')}
                    >
                      Yes
                    </Chip>
                    <Chip
                      active={form.isFirstVisit === 'no'}
                      onClick={() => update('isFirstVisit', 'no')}
                    >
                      No, returning patient
                    </Chip>
                    <Chip
                      active={form.isFirstVisit === 'unknown'}
                      onClick={() => update('isFirstVisit', 'unknown')}
                    >
                      Not sure / EGDN to assign
                    </Chip>
                  </ChipRow>
                </div>

                <div className="mb-5">
                  <Label htmlFor="notes">
                    Notes for the clinic{' '}
                    <span className="font-normal text-text-muted">(optional)</span>
                  </Label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    placeholder="Allergies, accessibility needs, or anything the dentist should know in advance."
                    className="block min-h-[100px] w-full resize-y rounded-input border border-border bg-surface px-4 py-3 text-[14px] text-text transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]"
                  />
                </div>

                <div className="rounded-input border border-border bg-bg-deep p-4">
                  <p className="text-[13px] leading-[1.55] text-text-muted">
                    By submitting, you authorize EGDN to share your member info with the partner
                    clinic for the purpose of this appointment. Your data is handled per EGDN&apos;s
                    privacy policy.
                  </p>
                </div>

                {status === 'error' && (
                  <p className="mt-3 text-[13px] text-error">
                    Something went wrong submitting your request. Please try again.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Step actions */}
          <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 sm:px-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="text-[14px] font-semibold text-brand hover:underline"
              >
                ← Back
              </button>
            ) : (
              <a
                href="/"
                className="text-[14px] font-semibold text-brand hover:underline"
              >
                Cancel
              </a>
            )}

            {step < 4 ? (
              <Button type="button" onClick={goNext} size="default">
                Continue
                <ArrowRight />
              </Button>
            ) : (
              <Button type="submit" disabled={status === 'loading'} size="default">
                {status === 'loading' ? 'Sending…' : 'Request appointment'}
                {status !== 'loading' && <ArrowRight />}
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* SIDEBAR — booking summary + help */}
      <aside className="flex flex-col gap-4 md:sticky md:top-24">
        <div className="rounded-card border border-border bg-surface p-6">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[12px]">
            Booking summary
          </span>
          <h3 className="mt-1.5 font-display text-[20px] font-semibold text-text">Your request</h3>

          <dl className="mt-4">
            <SummaryRow label="Member" value={form.name} />
            <SummaryRow label="Member ID" value={form.memberId} />
            <SummaryRow label="Contact" value={form.phone} />
            <SummaryRow
              label="Visit type"
              value={form.visitType === 'teleconsult' ? 'Teleconsultation' : 'In-person'}
            />
            {form.visitType === 'in-person' && (
              <SummaryRow label="Region" value={region?._id} />
            )}
            {form.visitType === 'in-person' && (
              <SummaryRow
                label="City"
                value={form.city || (region ? 'Any in region' : '')}
                muted={!form.city}
              />
            )}
            {form.visitType === 'in-person' && (
              <SummaryRow
                label="Dentist"
                value={
                  selectedDentist
                    ? selectedDentist.name
                    : form.regionId
                      ? 'EGDN to match'
                      : ''
                }
                muted={!selectedDentist}
              />
            )}
            <SummaryRow label="Specialty" value={form.specialty || 'Any'} muted={!form.specialty} />
            <SummaryRow
              label="Date"
              value={form.date ? `${form.date} · ${form.time}` : ''}
            />
          </dl>

          <hr className="my-5 border-border" />

          <ul className="flex flex-col gap-2 text-[13px] text-text">
            <li className="flex items-center gap-2">
              <span className="text-brand"><Check size={14} /></span>
              No paperwork at the clinic
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand"><Check size={14} /></span>
              Confirmed within{' '}
              {form.visitType === 'teleconsult' ? '1 business hour' : '1 business day'}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand"><Check size={14} /></span>
              {regions.reduce((sum, r) => sum + r.count, 0)}+ vetted partner clinics
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-bg-deep p-5">
          <h4 className="mb-2 text-[14px] font-semibold text-text">Need help booking?</h4>
          <p className="text-[13px] leading-[1.55] text-text-muted">
            Call EGDN at <strong className="text-text">(632) 8836-7181</strong>, Mon–Fri 9AM–6PM.
            Or{' '}
            <a href="/contact" className="text-brand hover:underline">
              message us
            </a>
            .
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[14px] font-medium text-text"
    >
      {children}
    </label>
  );
}

function Field({
  id,
  label,
  error,
  helper,
  children,
}: {
  id?: string;
  label: React.ReactNode;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {helper && !error && (
        <p className="mt-1.5 text-[12px] text-text-muted">{helper}</p>
      )}
      {error && <p className="mt-1.5 text-[12px] text-error">{error}</p>}
    </div>
  );
}

function Input({
  hasError,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      className={[
        'block h-12 w-full rounded-input border bg-surface px-4 text-[14px] text-text transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]',
        hasError ? 'border-error focus:border-error' : 'border-border focus:border-brand',
      ].join(' ')}
    />
  );
}

function SelectShell({
  children,
  hasError,
  disabled,
}: {
  children: React.ReactNode;
  hasError?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={[
        'relative rounded-input border bg-surface transition-colors focus-within:ring-2 focus-within:ring-[rgba(27,127,168,0.12)]',
        hasError
          ? 'border-error focus-within:border-error'
          : 'border-border focus-within:border-brand',
        disabled ? 'bg-bg-deep opacity-60' : '',
      ].join(' ')}
    >
      {children}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
        <ChevronDown />
      </span>
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-2 text-[13px] font-medium transition-colors',
        disabled
          ? 'cursor-not-allowed border-border bg-bg-deep text-text-muted line-through opacity-60'
          : active
            ? 'border-brand bg-brand text-white'
            : 'border-border bg-bg text-text hover:border-text-muted',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function DentistPickItem({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-3 rounded-xl border bg-bg px-4 py-3 text-left transition-colors',
        active
          ? 'border-brand bg-brand-light'
          : 'border-border hover:border-text-muted',
      ].join(' ')}
    >
      <span
        className={[
          'relative h-4 w-4 shrink-0 rounded-full border-2 bg-bg',
          active ? 'border-brand' : 'border-border',
        ].join(' ')}
      >
        {active && (
          <span className="absolute inset-0.5 rounded-full bg-brand" />
        )}
      </span>
      {children}
    </button>
  );
}

function VisitTypeCard({
  active,
  onClick,
  icon,
  label,
  sub,
  meta,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
  meta: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'relative flex h-full flex-col items-start gap-4 rounded-card border bg-bg p-5 text-left transition-colors sm:p-6',
        active
          ? 'border-brand bg-brand-light shadow-[0_0_0_1px_var(--color-brand)]'
          : 'border-border hover:border-text-muted',
      ].join(' ')}
    >
      <span className="flex w-full items-start justify-between gap-3">
        <span
          className={[
            'grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors',
            active ? 'bg-brand text-white' : 'bg-brand-light text-brand',
          ].join(' ')}
        >
          {icon}
        </span>
        <span
          className={[
            'relative mt-1 h-[18px] w-[18px] shrink-0 rounded-full border-2 bg-bg transition-colors',
            active ? 'border-brand' : 'border-border',
          ].join(' ')}
          aria-hidden
        >
          {active && <span className="absolute inset-[3px] rounded-full bg-brand" />}
        </span>
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[16px] font-semibold leading-tight text-text">{label}</span>
        <span className="text-[13px] leading-[1.5] text-text-muted">{sub}</span>
      </span>
      <span className="mt-auto pt-1 text-[12px] font-medium text-text-muted">{meta}</span>
    </button>
  );
}

function ReasonCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-3 rounded-[12px] border bg-bg p-4 text-left text-[14px] font-medium transition-colors',
        active
          ? 'border-brand bg-brand-light text-text'
          : 'border-border text-text hover:border-text-muted',
      ].join(' ')}
    >
      <span
        className={[
          'relative h-[18px] w-[18px] shrink-0 rounded-full border-2 bg-bg',
          active ? 'border-brand' : 'border-border',
        ].join(' ')}
      >
        {active && <span className="absolute inset-[3px] rounded-full bg-brand" />}
      </span>
      <span>{children}</span>
    </button>
  );
}

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string;
  value?: string;
  muted?: boolean;
}) {
  const displayValue = value || '—';
  const isMuted = muted || !value;
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3 border-b border-border py-2.5 last:border-b-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
        {label}
      </dt>
      <dd
        className={[
          'text-[13px] font-medium leading-tight',
          isMuted ? 'text-text-muted' : 'text-text',
        ].join(' ')}
      >
        {displayValue}
      </dd>
    </div>
  );
}
