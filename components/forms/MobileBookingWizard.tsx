'use client';

import { useMemo, useRef, useState } from 'react';
import PhoneInput from '@/components/ui/PhoneInput';
import { formatCity } from '@/lib/utils';
import type { DentistSummary } from '@/components/forms/BookingWizard';

interface MobileBookingWizardProps {
  regions: { _id: string; count: number }[];
  dentists: DentistSummary[];
  specialties: string[];
}

const REASON_OPTIONS = [
  { id: 'checkup', label: 'Routine check-up & cleaning' },
  { id: 'pain', label: 'Tooth pain or discomfort' },
  { id: 'cosmetic', label: 'Cosmetic / orthodontic consult' },
  { id: 'procedure', label: 'Specific procedure' },
  { id: 'other', label: 'Other / not sure yet' },
];

const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening'] as const;
type TimeSlot = (typeof TIME_OPTIONS)[number];

type FormShape = {
  name: string;
  memberId: string;
  phone: string;
  email: string;
  visitType: 'in-person' | 'teleconsult';
  regionId: string;
  city: string;
  specialty: string;
  dentistSlug: string;
  date: string;
  time: TimeSlot;
  reason: string;
  isFirstVisit: 'yes' | 'no' | 'unknown';
  notes: string;
};

type Updater = <K extends keyof FormShape>(key: K, value: FormShape[K]) => void;

// Same spec-hide set as BookingWizard so the chip pickers stay in sync.
const HIDDEN_SPECIALTIES = new Set<string>([
  'CPS',
  'Cosmetic Dentistry',
  'Dental Sleep Medicine',
  'Implant Dentistry',
  'Prosthodontics',
  'TMJ',
]);

function minDateString(daysFromToday: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
}

// Cutoff hours (24h) past which a slot is no longer bookable for today.
// Morning ends at noon, Afternoon at 5 PM, Evening at 9 PM. Mirrors the
// desktop BookingWizard + MobileProfileBookingForm so the three flows
// agree on which today-slots are open for teleconsult.
const SLOT_CUTOFF_HOUR: Record<TimeSlot, number> = {
  Morning: 12,
  Afternoon: 17,
  Evening: 21,
};

const todayDateString = () => new Date().toISOString().split('T')[0];
const isSlotPast = (slot: TimeSlot) =>
  new Date().getHours() >= SLOT_CUTOFF_HOUR[slot];
const allSlotsPastToday = () => TIME_OPTIONS.every((t) => isSlotPast(t));

function formatPrettyDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
}

/* ─── Icons ──────────────────────────────────────────────────────────── */

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconCheck = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconBack = () => (
  <svg width="11" height="18" viewBox="0 0 11 18" fill="none" aria-hidden>
    <path d="M9 1L1 9l8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChevD = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconCal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconClinic = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M10 11h4" />
    <path d="M12 9v4" />
    <path d="M10 17h4" />
  </svg>
);

const IconVideo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <polyline points="22 8 16 12 22 16 22 8" />
  </svg>
);

const IconBolt = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
);

/* ─── Component ──────────────────────────────────────────────────────── */

export default function MobileBookingWizard({
  regions,
  dentists,
  specialties,
}: MobileBookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [refNum, setRefNum] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(true);

  const [form, setForm] = useState<FormShape>({
    // Step 1
    name: '',
    memberId: '',
    phone: '',
    email: '',
    // Step 2
    visitType: 'in-person',
    // Step 3
    regionId: '',
    city: '',
    specialty: '',
    dentistSlug: '',
    date: '',
    time: 'Morning' as TimeSlot,
    // Step 4
    reason: '',
    isFirstVisit: 'yes' as 'yes' | 'no' | 'unknown',
    notes: '',
  });

  function update<K extends keyof FormShape>(key: K, value: FormShape[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Switching to teleconsult wipes any in-person location/dentist picks
      // since the virtual queue doesn't need them. Also drop a date that no
      // longer meets the in-person 3-day minimum, in either direction.
      if (key === 'visitType' && value === 'teleconsult') {
        next.regionId = '';
        next.city = '';
        next.dentistSlug = '';
      }
      if (key === 'visitType' && value === 'in-person' && next.date) {
        if (next.date < minDateString(3)) next.date = '';
      }
      if (key === 'regionId') {
        next.city = '';
        next.dentistSlug = '';
      }
      if (key === 'city') {
        next.dentistSlug = '';
      }
      // If the new region/city makes the current specialty unavailable, reset.
      if ((key === 'regionId' || key === 'city') && next.specialty) {
        const stillAvailable = dentists
          .filter((d) => d.region === next.regionId)
          .filter((d) => !next.city || d.city === next.city)
          .some((d) => d.specialty === next.specialty);
        if (!stillAvailable) next.specialty = '';
      }
      // When picking today (teleconsult) but the current time slot has
      // already passed, shift to the next still-open slot.
      if (key === 'date' && next.date === todayDateString() && isSlotPast(next.time)) {
        const nextOpen = TIME_OPTIONS.find((t) => !isSlotPast(t));
        if (nextOpen) next.time = nextOpen;
      }
      return next;
    });
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: '' }));
  }

  // Derived data ──────────────────────────────────────────────────────
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
  const selectedDentist = useMemo(
    () => dentists.find((d) => d.slug === form.dentistSlug),
    [dentists, form.dentistSlug],
  );

  // Validation ────────────────────────────────────────────────────────
  function validateStep(s: 1 | 2 | 3 | 4): Record<string, string> {
    const err: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) err.name = 'Required';
      if (!form.memberId.trim()) err.memberId = 'Required';
      if (!form.phone.trim()) err.phone = 'Required';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        err.email = 'Enter a valid email';
      }
    }
    // Step 2 (visit type) always has a default — no validation.
    if (s === 3) {
      // Region only required for in-person; teleconsult routes to EGDN's
      // virtual queue regardless of region.
      if (form.visitType === 'in-person' && !form.regionId) {
        err.regionId = 'Choose a region';
      }
      if (!form.date) err.date = 'Pick a date';
    }
    if (s === 4) {
      if (!form.reason) err.reason = 'Select a reason';
      if (!consent) err.consent = 'Required';
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

  async function handleSubmit() {
    const err = validateStep(4);
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setStatus('loading');

    const reasonLabel =
      REASON_OPTIONS.find((r) => r.id === form.reason)?.label ?? form.reason;
    const firstVisitLabel =
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
      `Visit type: ${firstVisitLabel}`,
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
      setRefNum('EGDN-' + Math.floor(100000 + Math.random() * 900000));
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      setStatus('error');
    }
  }

  /* ─── Success screen ──────────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <SuccessScreen
        name={form.name}
        phone={form.phone}
        date={form.date}
        time={form.time}
        refNum={refNum}
        visitType={form.visitType}
      />
    );
  }

  const ctaLabel = step === 4 ? 'Request Appointment' : 'Continue';

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-bg pb-32">
      {/* Sticky progress header — sits just under the global Navbar (h-18). */}
      <div className="sticky top-18 z-30 border-b border-border bg-bg">
        <div className="flex min-h-[48px] items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-text"
                aria-label="Back"
              >
                <IconBack />
              </button>
            ) : (
              <div className="h-9 w-9" aria-hidden />
            )}
            <span className="text-[15px] font-semibold text-text">Book appointment</span>
          </div>
          <a
            href="/"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-text"
            aria-label="Cancel and return home"
          >
            <IconClose />
          </a>
        </div>

        <div className="flex items-center gap-2 px-4 pb-3.5">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={[
                'h-1 flex-1 rounded-full transition-colors duration-200',
                s <= step ? 'bg-brand' : 'bg-border',
              ].join(' ')}
              aria-hidden
            />
          ))}
          <span className="ml-1.5 min-w-[28px] text-right text-[11px] font-semibold tabular-nums text-text-muted">
            {step}/4
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1">
        {step === 1 && (
          <Step1
            form={form}
            errors={errors}
            update={update}
          />
        )}
        {step === 2 && (
          <Step2VisitType
            form={form}
            update={update}
          />
        )}
        {step === 3 && (
          <Step3
            form={form}
            errors={errors}
            regions={regions}
            cities={cities}
            availableSpecialties={availableSpecialties}
            matchingDentists={matchingDentists}
            selectedDentist={selectedDentist}
            update={update}
          />
        )}
        {step === 4 && (
          <Step4
            form={form}
            errors={errors}
            consent={consent}
            setConsent={setConsent}
            region={region}
            selectedDentist={selectedDentist}
            update={update}
            status={status}
          />
        )}
      </div>

      {/* Sticky footer CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg px-4 pt-3 pb-7">
        <button
          type="button"
          onClick={step === 4 ? handleSubmit : goNext}
          disabled={status === 'loading'}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-[14px] bg-brand text-[15px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(27,127,168,0.45)] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : ctaLabel}
          {status !== 'loading' && <IconArrow />}
        </button>
        {status === 'error' && (
          <p className="mt-2 text-center text-[12px] text-error">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Step 1: Your info ──────────────────────────────────────────────── */

function Step1({
  form,
  errors,
  update,
}: {
  form: Pick<FormShape, 'name' | 'memberId' | 'phone' | 'email'>;
  errors: Record<string, string>;
  update: Updater;
}) {
  return (
    <>
      <StepHeader
        eyebrow="Step 1 of 4"
        title="Your information"
        sub="We need this to confirm your coverage and reach you by phone."
      />

      <div className="px-5 pb-5">
        <FieldBlock label="Full name" error={errors.name}>
          <TextInput
            value={form.name}
            onChange={(v) => update('name', v)}
            placeholder="Juan Dela Cruz"
            invalid={!!errors.name}
          />
        </FieldBlock>

        <FieldBlock
          label="EGDN Member ID"
          hint="Find this on your member card or with HR."
          error={errors.memberId}
        >
          <TextInput
            value={form.memberId}
            onChange={(v) => update('memberId', v)}
            placeholder="EGDN-000000"
            invalid={!!errors.memberId}
          />
        </FieldBlock>

        <FieldBlock label="Contact number" error={errors.phone}>
          <PhoneInput
            id="phone"
            value={form.phone}
            onChange={(v) => update('phone', v)}
            hasError={!!errors.phone}
            bare
            seamless
          />
        </FieldBlock>

        <FieldBlock label="Email" optional error={errors.email}>
          <TextInput
            value={form.email}
            onChange={(v) => update('email', v)}
            placeholder="you@email.com"
            invalid={!!errors.email}
          />
        </FieldBlock>

        {/* Trust footer */}
        <div className="mt-6 flex items-start gap-2.5 rounded-[12px] border border-border bg-bg-deep px-3.5 py-3">
          <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
            <IconCheck size={11} />
          </span>
          <span className="text-[11px] leading-[1.5] text-text">
            Your info is shared only with the partner clinic for this booking. EGDN handles your privacy.
          </span>
        </div>
      </div>
    </>
  );
}

/* ─── Step 2: Visit type ─────────────────────────────────────────────── */

function Step2VisitType({
  form,
  update,
}: {
  form: Pick<FormShape, 'visitType'>;
  update: Updater;
}) {
  return (
    <>
      <StepHeader
        eyebrow="Step 2 of 4"
        title="How would you like to be seen?"
        sub="Choose between an in-person clinic visit or a virtual consultation."
      />

      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-2">
          <VisitTypeCard
            icon={<IconClinic />}
            label="In-person"
            meta="1 business day"
            active={form.visitType === 'in-person'}
            onClick={() => update('visitType', 'in-person')}
          />
          <VisitTypeCard
            icon={<IconVideo />}
            label="Teleconsultation"
            meta={
              <span className="inline-flex items-center gap-1 text-brand">
                <IconBolt /> 1 business hour
              </span>
            }
            active={form.visitType === 'teleconsult'}
            onClick={() => update('visitType', 'teleconsult')}
          />
        </div>
      </div>
    </>
  );
}

/* ─── Step 3: Where & when ───────────────────────────────────────────── */

function Step3({
  form,
  errors,
  regions,
  cities,
  availableSpecialties,
  matchingDentists,
  selectedDentist,
  update,
}: {
  form: Pick<FormShape, 'visitType' | 'regionId' | 'city' | 'specialty' | 'dentistSlug' | 'date' | 'time'>;
  errors: Record<string, string>;
  regions: { _id: string; count: number }[];
  cities: string[];
  availableSpecialties: string[];
  matchingDentists: DentistSummary[];
  selectedDentist: DentistSummary | undefined;
  update: Updater;
}) {
  const isTele = form.visitType === 'teleconsult';

  // Top N dentists to surface inline — the rest are reachable via "show all".
  const [showAllDentists, setShowAllDentists] = useState(false);
  const visibleDentists = showAllDentists ? matchingDentists : matchingDentists.slice(0, 3);

  // Native date picker is invoked programmatically on tap. `opacity-0` overlays
  // are unreliable on iOS Safari — it refuses to show the picker for hidden
  // inputs — so the input stays in the DOM as `sr-only` and we call
  // `showPicker()` from the visible button's click handler.
  const dateInputRef = useRef<HTMLInputElement>(null);
  function openDatePicker() {
    const el = dateInputRef.current;
    if (!el) return;
    try {
      if (typeof el.showPicker === 'function') {
        el.showPicker();
        return;
      }
    } catch {
      /* showPicker can throw if the input isn't visible enough — fall through */
    }
    el.focus();
    el.click();
  }

  const earliestDate = isTele
    ? minDateString(allSlotsPastToday() ? 1 : 0)
    : minDateString(3);
  const dateHint = isTele
    ? allSlotsPastToday()
      ? "Today's slots are closed — earliest is tomorrow."
      : 'Same-day booking available.'
    : 'Earliest: 3 days from today.';
  const isToday = form.date === todayDateString();

  return (
    <>
      <StepHeader
        eyebrow="Step 3 of 4"
        title={isTele ? 'When works for you?' : 'Where & when'}
        sub={
          isTele
            ? 'Pick a date for your virtual consult. EGDN matches you with an on-call partner dentist and confirms within 1 business hour.'
            : 'Pick a region and date. You can choose a specific dentist or let EGDN match you.'
        }
      />

      <div className="px-5 pb-5">
        {!isTele && (
          <>
            <FieldBlock label="Region" error={errors.regionId}>
              <NativeSelectRow
                icon={<span className="text-brand"><IconPin /></span>}
                value={form.regionId}
                onChange={(v) => update('regionId', v)}
                placeholder="Choose a region"
                options={regions.map((r) => ({ value: r._id, label: r._id }))}
                invalid={!!errors.regionId}
              />
            </FieldBlock>

            <FieldBlock label="City" optional>
              <NativeSelectRow
                value={form.city}
                onChange={(v) => update('city', v)}
                placeholder={form.regionId ? 'Any city in this region' : 'Pick a region first'}
                options={cities.map((c) => ({ value: c, label: formatCity(c) }))}
                disabled={!form.regionId}
              />
            </FieldBlock>

            {availableSpecialties.length > 0 && (
              <FieldBlock label="Specialization">
                <div className="flex flex-wrap gap-1.5">
                  <PillChip
                    label="Any"
                    active={!form.specialty}
                    onClick={() => update('specialty', '')}
                  />
                  {availableSpecialties.map((s) => (
                    <PillChip
                      key={s}
                      label={s}
                      active={form.specialty === s}
                      onClick={() => update('specialty', s)}
                    />
                  ))}
                </div>
              </FieldBlock>
            )}

            {form.regionId && (
              <FieldBlock label="Preferred dentist" optional>
                <div className="flex flex-col gap-2">
                  <RadioRow
                    active={!form.dentistSlug}
                    onClick={() => update('dentistSlug', '')}
                    label="Let EGDN match me"
                    sub="We'll pick the best clinic for your area & date."
                  />
                  {visibleDentists.map((d) => (
                    <DentistOption
                      key={d.slug}
                      dentist={d}
                      active={form.dentistSlug === d.slug}
                      onClick={() => update('dentistSlug', d.slug)}
                    />
                  ))}
                  {matchingDentists.length > visibleDentists.length && (
                    <button
                      type="button"
                      onClick={() => setShowAllDentists(true)}
                      className="self-start px-1 text-[11px] font-semibold text-brand"
                    >
                      + {matchingDentists.length - visibleDentists.length} more dentist
                      {matchingDentists.length - visibleDentists.length === 1 ? '' : 's'} →
                    </button>
                  )}
                  {showAllDentists && matchingDentists.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllDentists(false)}
                      className="self-start px-1 text-[11px] font-semibold text-text-muted"
                    >
                      Show fewer
                    </button>
                  )}
                  {matchingDentists.length === 0 && (
                    <p className="px-1 text-[11px] text-text-muted">
                      No dentists match the current filters. Clear specialty or pick a different city.
                    </p>
                  )}
                </div>
              </FieldBlock>
            )}

            <div className="my-5 border-t border-border" />
          </>
        )}

        <FieldBlock label="Preferred date" hint={dateHint} error={errors.date}>
          <button
            type="button"
            onClick={openDatePicker}
            className={[
              'flex w-full items-center justify-between gap-2 rounded-[12px] border bg-surface px-3.5 py-3 text-[15px]',
              errors.date ? 'border-error' : 'border-border',
            ].join(' ')}
          >
            <span className="flex items-center gap-2">
              <span className="text-brand"><IconCal /></span>
              <span className={form.date ? 'text-text' : 'text-text-muted'}>
                {form.date ? formatPrettyDate(form.date) : 'Pick a date'}
              </span>
            </span>
            <span className="text-text-muted"><IconChevD /></span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            min={earliestDate}
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className="sr-only"
            aria-label="Preferred date"
            tabIndex={-1}
          />
        </FieldBlock>

        <FieldBlock label="Preferred time">
          <div className="flex gap-2">
            {TIME_OPTIONS.map((t) => {
              // Past slots get disabled only when today is the chosen date.
              const disabled = isToday && isSlotPast(t);
              return (
                <SegChip
                  key={t}
                  label={t}
                  active={form.time === t}
                  disabled={disabled}
                  onClick={() => !disabled && update('time', t)}
                />
              );
            })}
          </div>
        </FieldBlock>
      </div>
    </>
  );
}

function DentistOption({
  dentist,
  active,
  onClick,
}: {
  dentist: DentistSummary;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-3 rounded-[12px] border px-3.5 py-2.5 text-left transition-colors',
        active ? 'border-brand bg-brand-light' : 'border-border bg-surface',
      ].join(' ')}
    >
      <span
        className={[
          'relative h-[18px] w-[18px] shrink-0 rounded-full border-2 bg-surface',
          active ? 'border-brand' : 'border-border',
        ].join(' ')}
        aria-hidden
      >
        {active && <span className="absolute inset-[3px] rounded-full bg-brand" />}
      </span>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-light text-[11px] font-bold text-brand">
        {dentist.initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-text">{dentist.name}</span>
        <span className="block truncate text-[11px] text-text-muted">
          {dentist.clinicName} · {formatCity(dentist.city)}
        </span>
      </span>
    </button>
  );
}

/* ─── Step 4: Visit details ──────────────────────────────────────────── */

function Step4({
  form,
  errors,
  consent,
  setConsent,
  region,
  selectedDentist,
  update,
  status,
}: {
  form: Pick<FormShape, 'name' | 'visitType' | 'reason' | 'isFirstVisit' | 'notes' | 'regionId' | 'city' | 'date' | 'time'>;
  errors: Record<string, string>;
  consent: boolean;
  setConsent: (v: boolean) => void;
  region: { _id: string; count: number } | undefined;
  selectedDentist: DentistSummary | undefined;
  update: Updater;
  status: 'idle' | 'loading' | 'success' | 'error';
}) {
  const isTele = form.visitType === 'teleconsult';
  return (
    <>
      <StepHeader
        eyebrow="Step 4 of 4"
        title="Visit details"
        sub="A few last things to help the clinic prepare for your appointment."
      />

      <div className="px-5 pb-5">
        <FieldBlock label="Reason for visit" error={errors.reason}>
          <div className="flex flex-col gap-2">
            {REASON_OPTIONS.map((r) => (
              <RadioRow
                key={r.id}
                active={form.reason === r.id}
                onClick={() => update('reason', r.id)}
                label={r.label}
              />
            ))}
          </div>
        </FieldBlock>

        <FieldBlock label="Is this your first visit to this clinic?">
          <div className="flex gap-2">
            <SegChip
              label="Yes"
              active={form.isFirstVisit === 'yes'}
              onClick={() => update('isFirstVisit', 'yes')}
            />
            <SegChip
              label="Returning"
              active={form.isFirstVisit === 'no'}
              onClick={() => update('isFirstVisit', 'no')}
            />
            <SegChip
              label="Not sure"
              active={form.isFirstVisit === 'unknown'}
              onClick={() => update('isFirstVisit', 'unknown')}
            />
          </div>
        </FieldBlock>

        <FieldBlock label="Notes for the clinic" optional>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Allergies, accessibility needs, or anything the dentist should know in advance."
            className="block min-h-[80px] w-full resize-y rounded-[12px] border border-border bg-surface px-3.5 py-3 text-[13px] leading-[1.5] text-text transition-colors placeholder:text-text-muted focus:border-brand focus:outline-none"
          />
        </FieldBlock>

        {/* Summary card */}
        <div className="mt-1 rounded-[14px] border border-border bg-bg-deep px-4 py-3.5">
          <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Your request
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-2 text-[12px]">
            <dt className="text-text-muted">Member</dt>
            <dd className="font-semibold text-text">{form.name || '—'}</dd>
            <dt className="text-text-muted">Visit type</dt>
            <dd className="font-semibold text-text">
              {isTele ? 'Teleconsultation' : 'In-person'}
            </dd>
            {!isTele && (
              <>
                <dt className="text-text-muted">Region</dt>
                <dd className="font-semibold text-text">
                  {region?._id ?? '—'}
                  {form.city ? ` · ${formatCity(form.city)}` : ''}
                </dd>
                <dt className="text-text-muted">Dentist</dt>
                <dd className="font-semibold text-text">
                  {selectedDentist ? selectedDentist.name : 'EGDN to match'}
                </dd>
              </>
            )}
            <dt className="text-text-muted">Date</dt>
            <dd className="font-semibold text-text">
              {form.date ? `${formatPrettyDate(form.date)} · ${form.time}` : '—'}
            </dd>
          </dl>
        </div>

        {/* Consent */}
        <button
          type="button"
          onClick={() => setConsent(!consent)}
          aria-pressed={consent}
          className={[
            'mt-3.5 flex w-full items-start gap-2.5 rounded-[12px] border bg-surface px-3.5 py-3 text-left',
            errors.consent ? 'border-error' : 'border-border',
          ].join(' ')}
        >
          <span
            className={[
              'mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[4px] border-2',
              consent ? 'border-brand bg-brand text-white' : 'border-border bg-surface',
            ].join(' ')}
            aria-hidden
          >
            {consent && <IconCheck size={11} />}
          </span>
          <span className="text-[11px] leading-[1.5] text-text">
            I authorize EGDN to share my member info with the partner clinic for this appointment.
          </span>
        </button>
        {errors.consent && (
          <p className="mt-1.5 text-[11px] text-error">{errors.consent}</p>
        )}

        {status === 'error' && (
          <p className="mt-3 text-[12px] text-error">
            Something went wrong submitting your request. Please try again.
          </p>
        )}
      </div>
    </>
  );
}

/* ─── Success screen ─────────────────────────────────────────────────── */

function SuccessScreen({
  name,
  phone,
  date,
  time,
  refNum,
  visitType,
}: {
  name: string;
  phone: string;
  date: string;
  time: TimeSlot;
  refNum: string;
  visitType: 'in-person' | 'teleconsult';
}) {
  const firstName = name.split(' ')[0] || 'member';
  const isTele = visitType === 'teleconsult';
  const slaLabel = isTele ? '1 business hour' : '1 business day';
  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-bg pb-32">
      <div className="px-5 pb-4 pt-8 text-center">
        <div className="mx-auto mb-5 grid h-[72px] w-[72px] place-items-center rounded-full bg-brand text-white shadow-[0_8px_24px_-8px_rgba(27,127,168,0.6)]">
          <IconCheck size={28} />
        </div>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          Request received
        </span>
        <h1 className="mt-2 mb-3 font-display text-[26px] font-bold leading-[1.15] tracking-[-0.4px] text-text">
          You&apos;re all set, {firstName}.
        </h1>
        <p className="mx-auto max-w-[300px] text-[14px] leading-[1.55] text-text-muted">
          EGDN will call <strong className="text-text">{phone}</strong> within {slaLabel} to confirm your {isTele ? 'teleconsultation' : 'appointment'}.
        </p>
      </div>

      <div className="px-5 pb-3">
        <div className="grid grid-cols-2 gap-4 rounded-[16px] border border-border bg-surface px-4 py-3.5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Reference
            </div>
            <div className="mt-0.5 font-display text-[17px] font-bold tracking-[-0.3px] text-text">
              {refNum}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Preferred
            </div>
            <div className="mt-0.5 text-[13px] font-semibold text-text">
              {formatPrettyDate(date)} · {time}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
          What happens next
        </h3>
        <ol className="overflow-hidden rounded-[16px] border border-border bg-surface">
          {(isTele
            ? [
                'EGDN reviews your request and assigns an on-call partner dentist.',
                'We confirm by phone within 1 business hour.',
                'You receive a secure video-call link by SMS and email.',
                'Join the call at your scheduled time — no clinic visit needed.',
              ]
            : [
                'EGDN reviews your request and matches you with the clinic.',
                'We confirm by phone within 1 business day.',
                'You get an SMS with final time and clinic details.',
                "Bring your member ID on the day — that's it.",
              ]
          ).map((s, i, arr) => (
            <li
              key={i}
              className={[
                'flex items-start gap-3 px-4 py-3',
                i < arr.length - 1 ? 'border-b border-border' : '',
              ].join(' ')}
            >
              <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-brand-light font-display text-[12px] font-bold text-brand">
                {i + 1}
              </span>
              <span className="text-[13px] leading-[1.5] text-text">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg px-4 pt-3 pb-7">
        <a
          href="/"
          className="flex h-13 w-full items-center justify-center rounded-[14px] bg-brand text-[15px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(27,127,168,0.45)]"
        >
          Done
        </a>
        <a
          href="/find-a-dentist"
          className="mt-1 flex h-10 w-full items-center justify-center text-[13px] font-medium text-text-muted"
        >
          Back to directory
        </a>
      </div>
    </div>
  );
}

/* ─── Building blocks ────────────────────────────────────────────────── */

function StepHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="px-5 pb-3 pt-5">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
        {eyebrow}
      </span>
      <h1 className="mb-2 mt-2 font-display text-[26px] font-bold leading-[1.15] tracking-[-0.4px] text-text">
        {title}
      </h1>
      <p className="text-[14px] leading-[1.5] text-text-muted" style={{ textWrap: 'pretty' } as React.CSSProperties}>
        {sub}
      </p>
    </div>
  );
}

function FieldBlock({
  label,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 flex items-baseline justify-between text-[12px] font-semibold text-text">
        <span>{label}</span>
        {optional && <span className="text-[11px] font-medium text-text-muted">Optional</span>}
      </label>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[11px] text-error">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-[11px] text-text-muted">{hint}</span>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={[
        'block w-full rounded-[12px] border bg-surface px-3.5 py-3 text-[15px] text-text transition-colors placeholder:text-text-muted focus:outline-none',
        invalid
          ? 'border-error focus:border-error'
          : 'border-border focus:border-brand',
      ].join(' ')}
    />
  );
}

function NativeSelectRow({
  icon,
  value,
  onChange,
  placeholder,
  options,
  invalid,
  disabled,
}: {
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  invalid?: boolean;
  disabled?: boolean;
}) {
  const display = options.find((o) => o.value === value)?.label;
  return (
    <div
      className={[
        'relative flex items-center justify-between rounded-[12px] border bg-surface px-3.5 py-3 text-[15px]',
        disabled ? 'opacity-60' : '',
        invalid ? 'border-error' : 'border-border focus-within:border-brand',
      ].join(' ')}
    >
      <span className="flex items-center gap-2 truncate">
        {icon}
        <span className={display ? 'text-text' : 'text-text-muted'}>{display ?? placeholder}</span>
      </span>
      <span className="text-text-muted"><IconChevD /></span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PillChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors',
        active
          ? 'border-brand bg-brand text-white'
          : 'border-border bg-surface text-text',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function SegChip({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex-1 rounded-full border px-2 py-2.5 text-center text-[13px] font-semibold transition-colors',
        disabled
          ? 'cursor-not-allowed border-border bg-bg-deep text-text-muted line-through opacity-60'
          : active
            ? 'border-brand bg-brand text-white'
            : 'border-border bg-surface text-text',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function VisitTypeCard({
  icon,
  label,
  meta,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  meta: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'flex h-full flex-col items-start gap-2 rounded-[12px] border p-3 text-left transition-colors',
        active ? 'border-brand bg-brand-light' : 'border-border bg-surface',
      ].join(' ')}
    >
      <span
        className={[
          'grid h-8 w-8 place-items-center rounded-full transition-colors',
          active ? 'bg-brand text-white' : 'bg-brand-light text-brand',
        ].join(' ')}
      >
        {icon}
      </span>
      <span className="text-[13px] font-semibold leading-tight text-text">{label}</span>
      <span className="mt-auto text-[11px] font-medium text-text-muted">{meta}</span>
    </button>
  );
}

function RadioRow({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-start gap-3 rounded-[12px] border px-3.5 py-3 text-left transition-colors',
        active ? 'border-brand bg-brand-light' : 'border-border bg-surface',
      ].join(' ')}
    >
      <span
        className={[
          'relative mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border-2 bg-surface',
          active ? 'border-brand' : 'border-border',
        ].join(' ')}
        aria-hidden
      >
        {active && <span className="absolute inset-[3px] rounded-full bg-brand" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-text">{label}</span>
        {sub && (
          <span className="mt-0.5 block text-[11px] leading-[1.4] text-text-muted">{sub}</span>
        )}
      </span>
    </button>
  );
}
