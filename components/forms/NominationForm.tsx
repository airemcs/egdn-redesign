'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function NominationForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const body = {
      nominatorName: data.get('nominatorName') as string,
      contactNumber: data.get('contactNumber') as string,
      dentistName: data.get('dentistName') as string,
      clinicName: data.get('clinicName') as string,
      clinicAddress: data.get('clinicAddress') as string,
      reason: data.get('reason') as string,
    };

    const errs: Record<string, string> = {};
    if (!body.nominatorName.trim()) errs.nominatorName = 'Required';
    if (!body.contactNumber.trim()) errs.contactNumber = 'Required';
    if (!body.dentistName.trim()) errs.dentistName = 'Required';
    if (!body.clinicName.trim()) errs.clinicName = 'Required';
    if (!body.clinicAddress.trim()) errs.clinicAddress = 'Required';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');

    try {
      const res = await fetch('/api/nominations', {
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
        <p className="font-semibold text-text">Thank you for your nomination!</p>
        <p className="mt-1 text-[14px] text-text-muted">
          We'll review it and reach out to the clinic soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="nominatorName" name="nominatorName" label="Your Name" required error={errors.nominatorName} />
        <Input id="contactNumber" name="contactNumber" label="Your Contact Number" type="tel" required error={errors.contactNumber} />
      </div>
      <Input id="dentistName" name="dentistName" label="Dentist / Doctor Name" required error={errors.dentistName} />
      <Input id="clinicName" name="clinicName" label="Clinic Name" required error={errors.clinicName} />
      <Textarea id="clinicAddress" name="clinicAddress" label="Clinic Address" required error={errors.clinicAddress} />
      <Textarea
        id="reason"
        name="reason"
        label="Reason for Nomination"
        placeholder="Why would you recommend this clinic?"
      />
      {status === 'error' && (
        <p className="text-[14px] text-error">Something went wrong. Please try again.</p>
      )}
      <Button type="submit" disabled={status === 'loading'} size="large">
        {status === 'loading' ? 'Submitting…' : 'Submit Nomination'}
      </Button>
    </form>
  );
}
