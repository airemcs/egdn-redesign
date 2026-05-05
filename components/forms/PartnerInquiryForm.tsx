'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

type FormType = 'employer' | 'clinic';

const employeeCountOptions = [
  { value: '1–50', label: '1–50' },
  { value: '51–200', label: '51–200' },
  { value: '201–500', label: '201–500' },
  { value: '500+', label: '500+' },
];

export default function PartnerInquiryForm({ type }: { type: FormType }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEmployer = type === 'employer';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const body = {
      type,
      organizationName: data.get('organizationName') as string,
      contactName: data.get('contactName') as string,
      email: data.get('email') as string,
      contactNumber: data.get('contactNumber') as string,
      ...(isEmployer && { employeeCount: data.get('employeeCount') as string }),
      ...(!isEmployer && { region: data.get('region') as string }),
      message: data.get('message') as string,
    };

    const errs: Record<string, string> = {};
    if (!body.organizationName.trim()) errs.organizationName = 'Required';
    if (!body.contactName.trim()) errs.contactName = 'Required';
    if (!body.email.trim()) errs.email = 'Required';
    if (!body.contactNumber.trim()) errs.contactNumber = 'Required';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');

    try {
      const res = await fetch('/api/partner-inquiries', {
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
        <p className="font-semibold text-text">
          {isEmployer ? 'Your inquiry has been sent.' : 'Your application has been submitted.'}
        </p>
        <p className="mt-1 text-[14px] text-text-muted">
          We'll get back to you within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        id="organizationName"
        name="organizationName"
        label={isEmployer ? 'Company Name' : 'Clinic Name'}
        required
        error={errors.organizationName}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="contactName" name="contactName" label="Your Name" required error={errors.contactName} />
        <Input id="email" name="email" label="Email" type="email" required error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="contactNumber" name="contactNumber" label="Contact Number" type="tel" required error={errors.contactNumber} />
        {isEmployer ? (
          <Select
            id="employeeCount"
            name="employeeCount"
            label="Number of Employees"
            options={employeeCountOptions}
            placeholder="Select range"
          />
        ) : (
          <Input id="region" name="region" label="Region" placeholder="e.g. Region IV-A (CALABARZON)" />
        )}
      </div>
      <Textarea
        id="message"
        name="message"
        label="Message"
        placeholder="Optional — tell us more about your situation."
      />
      {status === 'error' && (
        <p className="text-[14px] text-error">Something went wrong. Please try again.</p>
      )}
      <Button type="submit" disabled={status === 'loading'} size="large">
        {status === 'loading'
          ? 'Sending…'
          : isEmployer
          ? 'Send Inquiry'
          : 'Apply to Join'}
      </Button>
    </form>
  );
}
