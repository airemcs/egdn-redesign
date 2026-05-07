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
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="memberName" name="memberName" label="Member Name" required error={errors.memberName} />
        <Input id="memberId" name="memberId" label="Member ID" required error={errors.memberId} />
      </div>

      {isProfile ? (
        <>
          <div className="rounded-input border border-border bg-bg px-4 py-3 text-[15px] text-text-muted">
            {dentist!.name}
            {selectedClinic && ` — ${selectedClinic}`}
          </div>
          {dentist!.clinics.length > 1 && (
            <Select
              id="clinicName"
              label="Select Clinic Location"
              options={clinicOptions}
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
            />
          )}
        </>
      ) : (
        <Input
          id="dentistName"
          name="dentistName"
          label="Dentist / Clinic Name"
          placeholder="Not sure? Find a dentist first"
          error={errors.dentistName}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="preferredDate"
          name="preferredDate"
          label="Preferred Date"
          type="date"
          min={minDate()}
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
        required
        error={errors.contactNumber}
      />

      <Textarea
        id="notes"
        name="notes"
        label="Notes / Special Requests"
        placeholder="Optional — let us know if you have any special needs or questions."
      />

      {status === 'error' && (
        <p className="text-[14px] text-error">
          Something went wrong. Please try again or contact us directly.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        size="large"
        className="w-full justify-center sm:w-auto"
      >
        {status === 'loading' ? 'Sending…' : 'Request Appointment'}
      </Button>
    </form>
  );
}
