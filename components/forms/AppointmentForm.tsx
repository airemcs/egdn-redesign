'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface Clinic {
  clinicName: string;
  city: string;
}

interface AppointmentFormProps {
  dentist?: {
    id: string;
    name: string;
    clinics: Clinic[];
  };
}

const timeOptions = [
  { value: 'Morning', label: 'Morning' },
  { value: 'Afternoon', label: 'Afternoon' },
  { value: 'Evening', label: 'Evening' },
];

function minDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split('T')[0];
}

export default function AppointmentForm({ dentist }: AppointmentFormProps) {
  const isProfile = !!dentist;
  const [selectedClinic, setSelectedClinic] = useState(dentist?.clinics[0]?.clinicName ?? '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clinicOptions = dentist?.clinics.map((c) => ({
    value: c.clinicName,
    label: `${c.clinicName} — ${c.city}`,
  })) ?? [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const body = {
      memberName: data.get('memberName') as string,
      memberId: data.get('memberId') as string,
      dentistName: isProfile ? dentist!.name : (data.get('dentistName') as string),
      clinicName: isProfile ? selectedClinic : (data.get('dentistName') as string),
      preferredDate: data.get('preferredDate') as string,
      preferredTime: data.get('preferredTime') as string,
      contactNumber: data.get('contactNumber') as string,
      notes: data.get('notes') as string,
      source: isProfile ? 'profile' : 'standalone',
      ...(isProfile && { dentistId: dentist!.id }),
    };

    // Client-side validation
    const errs: Record<string, string> = {};
    if (!body.memberName.trim()) errs.memberName = 'Required';
    if (!body.memberId.trim()) errs.memberId = 'Required';
    if (!isProfile && !body.dentistName.trim()) errs.dentistName = 'Required';
    if (!body.preferredDate) errs.preferredDate = 'Required';
    if (!body.preferredTime) errs.preferredTime = 'Required';
    if (!body.contactNumber.trim()) errs.contactNumber = 'Required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setStatus('loading');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-card border border-border bg-surface p-6 text-center">
        <p className="font-semibold text-text">Your request has been sent.</p>
        <p className="mt-1 text-[14px] text-text-muted">
          EGDN will contact you within 1 business day to confirm your appointment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Member identity */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="memberName"
          name="memberName"
          label="Member Name"
          placeholder="Juan Dela Cruz"
          required
          error={errors.memberName}
        />
        <Input
          id="memberId"
          name="memberId"
          label="Member ID"
          placeholder="EGDN-000000"
          required
          error={errors.memberId}
        />
      </div>

      {/* Standalone-only dentist text field. Profile flow shows the selected
          dentist as a read-only block near the bottom of the form instead. */}
      {!isProfile && (
        <Input
          id="dentistName"
          name="dentistName"
          label="Dentist / Clinic Name"
          placeholder="Not sure? Find a dentist first"
          error={errors.dentistName}
        />
      )}

      {/* Preferred date + time */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="preferredDate"
          name="preferredDate"
          label="Preferred Date"
          type="date"
          min={minDate()}
          helper="Earliest: 3 days from today"
          required
          error={errors.preferredDate}
        />
        <Select
          id="preferredTime"
          name="preferredTime"
          label="Preferred Time"
          options={timeOptions}
          placeholder="Select a time"
          required
          error={errors.preferredTime}
        />
      </div>

      <Input
        id="contactNumber"
        name="contactNumber"
        label="Contact Number"
        type="tel"
        placeholder="+63 9XX XXX XXXX"
        required
        error={errors.contactNumber}
      />

      <Textarea
        id="notes"
        name="notes"
        label={
          <>
            Notes / Special Requests{' '}
            <span className="font-normal text-text-muted">(optional)</span>
          </>
        }
        placeholder="Any allergies, preferences, or context for the dentist."
      />

      {/* Selected Dentist — readonly display at the bottom of the form so the
          form input fields lead, and the pre-chosen dentist sits as a summary
          right above the submit button. */}
      {isProfile && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-text">Selected Dentist</span>
          <div className="rounded-input border border-border bg-bg px-4 py-3 text-[15px] text-text">
            <strong className="font-semibold">{dentist!.name}</strong>
            {selectedClinic && (
              <span className="text-text-muted"> — {selectedClinic}</span>
            )}
          </div>
          {dentist!.clinics.length > 1 && (
            <div className="mt-1.5">
              <Select
                id="clinicName"
                label="Select Clinic Location"
                options={clinicOptions}
                value={selectedClinic}
                onChange={(e) => setSelectedClinic(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <p className="text-[14px] text-error">
          Something went wrong. Please try again or contact us directly.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        size="default"
        className="w-full justify-center sm:w-auto"
      >
        {status === 'loading' ? 'Sending…' : 'Request Appointment'}
        {status !== 'loading' && (
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
        )}
      </Button>
    </form>
  );
}
