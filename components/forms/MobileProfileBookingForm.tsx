'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import PhoneInput from '@/components/ui/PhoneInput';
import { formatCity } from '@/lib/utils';

interface MobileProfileBookingFormProps {
  /** Dentist slug — used by the back link to return to the profile. */
  slug: string;
  dentistName: string;
  initials: string;
  clinicName: string;
  city: string;
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

function minDateString(daysFromToday: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
}

// Cutoff hours (24h) past which a slot is no longer bookable for today.
// Morning ends at noon, Afternoon at 5 PM, Evening at 9 PM. Same logic as
// BookingWizard.tsx so the two flows agree on which today-slots are open.
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

const IconChevD = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="6 9 12 15 18 9" />
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

const IconBack = () => (
  <svg width="11" height="18" viewBox="0 0 11 18" fill="none" aria-hidden>
    <path d="M9 1L1 9l8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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

export default function MobileProfileBookingForm({
  slug,
  dentistName,
  initials,
  clinicName,
  city,
}: MobileProfileBookingFormProps) {
  const [visitType, setVisitType] = useState<'in-person' | 'teleconsult'>('in-person');
  const [name, setName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState<TimeSlot>('Morning');
  const [reason, setReason] = useState('');
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [refNum, setRefNum] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');

  const earliestDate =
    visitType === 'teleconsult'
      ? minDateString(allSlotsPastToday() ? 1 : 0)
      : minDateString(3);
  const dateHint =
    visitType === 'teleconsult'
      ? allSlotsPastToday()
        ? "Today's slots are closed — earliest is tomorrow."
        : 'Same-day booking available.'
      : 'Earliest: 3 days from today.';
  const isToday = date === todayDateString();

  // Switching to in-person requires earliest 3 days — drop any date that
  // no longer satisfies the minimum so the user is forced to re-pick.
  function handleVisitType(v: 'in-person' | 'teleconsult') {
    setVisitType(v);
    if (v === 'in-person' && date && date < minDateString(3)) {
      setDate('');
    }
  }

  // When the user picks today (teleconsult) and their current time slot
  // has already passed, shift to the next still-open slot. If every slot
  // is past, leave the time as-is — the input's `min` will already have
  // bumped the date to tomorrow, so this branch shouldn't fire there.
  function handleDate(newDate: string) {
    setDate(newDate);
    if (newDate === todayDateString() && isSlotPast(time)) {
      const nextOpen = TIME_OPTIONS.find((t) => !isSlotPast(t));
      if (nextOpen) setTime(nextOpen);
    }
  }

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
      /* fall through */
    }
    el.focus();
    el.click();
  }

  async function handleSubmit() {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Required';
    if (!memberId.trim()) err.memberId = 'Required';
    if (!phone.trim()) err.phone = 'Required';
    if (!date) err.date = 'Pick a date';
    if (!reason) err.reason = 'Select a reason';
    if (!consent) err.consent = 'Required';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setStatus('loading');

    const reasonLabel =
      REASON_OPTIONS.find((r) => r.id === reason)?.label ?? reason;
    const modeLabel =
      visitType === 'teleconsult' ? 'Teleconsultation (virtual)' : 'In-person visit';
    const composedNotes = [`Mode: ${modeLabel}`, `Reason: ${reasonLabel}`].join('\n');

    const body = {
      memberName: name,
      memberId,
      dentistName,
      // Teleconsult bookings route to EGDN's virtual queue rather than the
      // partner clinic, so the clinic name is overridden and the source is
      // tagged for the admin dashboard.
      clinicName: visitType === 'teleconsult' ? 'Virtual consultation' : clinicName,
      preferredDate: date,
      preferredTime: time,
      contactNumber: phone,
      notes: composedNotes,
      source: visitType === 'teleconsult' ? 'profile-teleconsult' : 'profile',
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setRefNum('EGDN-' + Math.floor(100000 + Math.random() * 900000));
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <SuccessPanel
        firstName={name.split(' ')[0] || 'member'}
        phone={phone}
        date={date}
        time={time}
        refNum={refNum}
        visitType={visitType}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-bg pb-32">
      {/* Sticky sub-header — sits just under the global Navbar (h-18). */}
      <div className="sticky top-18 z-30 border-b border-border bg-bg">
        <div className="flex min-h-[48px] items-center gap-3 px-4 py-2.5">
          <Link
            href={`/dentist/${slug}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-text"
            aria-label="Back to dentist profile"
          >
            <IconBack />
          </Link>
          <span className="text-[15px] font-semibold text-text">Book appointment</span>
        </div>
      </div>

      <div className="px-5 pb-4 pt-5">
        {/* Selected dentist chip */}
        <div className="mb-4 flex items-center gap-3 rounded-[14px] border border-border bg-surface p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-light text-[14px] font-bold text-brand">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-text">{dentistName}</div>
            <div className="mt-0.5 truncate text-[11px] text-text-muted">
              {visitType === 'teleconsult'
                ? 'Virtual consult'
                : `${clinicName}${city ? ` · ${formatCity(city)}` : ''}`}
            </div>
          </div>
        </div>

        {/* Visit-type toggle — in-person routes to the partner clinic;
            teleconsult routes to EGDN's virtual queue. Mirrors the desktop
            AppointmentForm's pattern but mobile-sized. */}
        <FieldBlock label="How would you like to be seen?">
          <div className="grid grid-cols-2 gap-2">
            <VisitTypeCard
              icon={<IconClinic />}
              label="In-person"
              meta="1 business day"
              active={visitType === 'in-person'}
              onClick={() => handleVisitType('in-person')}
            />
            <VisitTypeCard
              icon={<IconVideo />}
              label="Teleconsultation"
              meta={
                <span className="inline-flex items-center gap-1 text-brand">
                  <IconBolt /> 1 business hour
                </span>
              }
              active={visitType === 'teleconsult'}
              onClick={() => handleVisitType('teleconsult')}
            />
          </div>
        </FieldBlock>

        <h2 className="m-0 mt-1 font-display text-[22px] font-semibold text-text">Your visit</h2>
        <p className="mb-4 mt-0 text-[13px] text-text-muted">
          EGDN confirms within{' '}
          {visitType === 'teleconsult' ? '1 business hour' : '1 business day'}.
        </p>

        <FieldBlock label="Full name" error={errors.name}>
          <TextInput
            value={name}
            onChange={setName}
            placeholder="Juan Dela Cruz"
            invalid={!!errors.name}
          />
        </FieldBlock>

        <FieldBlock label="EGDN Member ID" error={errors.memberId}>
          <TextInput
            value={memberId}
            onChange={setMemberId}
            placeholder="EGDN-000000"
            invalid={!!errors.memberId}
          />
        </FieldBlock>

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
              <span className={date ? 'text-text' : 'text-text-muted'}>
                {date ? formatPrettyDate(date) : 'Pick a date'}
              </span>
            </span>
            <span className="text-text-muted"><IconChevD /></span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            min={earliestDate}
            value={date}
            onChange={(e) => handleDate(e.target.value)}
            className="sr-only"
            aria-label="Preferred date"
            tabIndex={-1}
          />
        </FieldBlock>

        <FieldBlock label="Preferred time">
          <div className="flex gap-2">
            {TIME_OPTIONS.map((t) => {
              // Only disable past slots when the user picked today —
              // tomorrow+ all three slots remain bookable.
              const disabled = isToday && isSlotPast(t);
              return (
                <SegChip
                  key={t}
                  label={t}
                  active={time === t}
                  disabled={disabled}
                  onClick={() => !disabled && setTime(t)}
                />
              );
            })}
          </div>
        </FieldBlock>

        <FieldBlock label="Reason for visit" error={errors.reason}>
          <div className="flex flex-col gap-2">
            {REASON_OPTIONS.map((r) => (
              <RadioRow
                key={r.id}
                active={reason === r.id}
                onClick={() => setReason(r.id)}
                label={r.label}
              />
            ))}
          </div>
        </FieldBlock>

        <FieldBlock label="Contact number" error={errors.phone}>
          <PhoneInput
            id="phone"
            value={phone}
            onChange={setPhone}
            hasError={!!errors.phone}
            bare
            seamless
          />
        </FieldBlock>

        <button
          type="button"
          onClick={() => setConsent(!consent)}
          aria-pressed={consent}
          className={[
            'mt-1 flex w-full items-start gap-2.5 rounded-[12px] border bg-bg-deep px-3.5 py-3 text-left',
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
          <span className="text-[12px] leading-[1.5] text-text">
            I agree to EGDN&apos;s privacy policy and consent to being contacted about this booking.
          </span>
        </button>
        {errors.consent && (
          <p className="mt-1.5 text-[11px] text-error">{errors.consent}</p>
        )}

        {status === 'error' && (
          <p className="mt-3 text-[12px] text-error">
            {errorMessage || 'Something went wrong submitting your request. Please try again.'}
          </p>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-[14px] bg-brand text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Request Appointment'}
          {status !== 'loading' && <IconArrow />}
        </button>
      </div>
    </div>
  );
}

/* ─── Success panel ──────────────────────────────────────────────────── */

function SuccessPanel({
  firstName,
  phone,
  date,
  time,
  refNum,
  visitType,
}: {
  firstName: string;
  phone: string;
  date: string;
  time: TimeSlot;
  refNum: string;
  visitType: 'in-person' | 'teleconsult';
}) {
  const slaLabel = visitType === 'teleconsult' ? '1 business hour' : '1 business day';
  const visitLabel = visitType === 'teleconsult' ? 'teleconsultation' : 'appointment';
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
        <p className="mx-auto max-w-[280px] text-[14px] leading-[1.55] text-text-muted">
          EGDN will call <strong className="text-text">{phone}</strong> within {slaLabel} to confirm your {visitLabel}.
        </p>
      </div>

      <div className="px-5 pb-5 pt-2">
        <div className="grid grid-cols-2 gap-4 rounded-[16px] border border-border bg-surface px-[18px] py-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Reference
            </div>
            <div className="mt-1 font-display text-[18px] font-bold tracking-[-0.3px] text-text">
              {refNum}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Preferred date
            </div>
            <div className="mt-1 text-[14px] font-semibold text-text">
              {formatPrettyDate(date)} · {time}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
          What happens next
        </h3>
        <ol className="overflow-hidden rounded-[16px] border border-border bg-surface">
          {(visitType === 'teleconsult'
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

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <Link
          href="/find-a-dentist"
          className="flex h-13 w-full items-center justify-center rounded-[14px] bg-brand text-[15px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Back to directory
        </Link>
        <Link
          href="/"
          className="mt-1 flex h-12 w-full items-center justify-center text-[14px] font-semibold text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

/* ─── Building blocks ────────────────────────────────────────────────── */

function FieldBlock({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-[12px] font-semibold text-text">
        {label}
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
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-3 rounded-[12px] border px-3.5 py-3 text-left transition-colors',
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
      <span className="text-[14px] font-medium text-text">{label}</span>
    </button>
  );
}
