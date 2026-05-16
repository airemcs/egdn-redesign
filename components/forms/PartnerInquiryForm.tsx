'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import PhoneInput from '@/components/ui/PhoneInput';

type FormType = 'employer' | 'clinic';

const employeeCountOptions = [
  { value: '1–50', label: '1–50' },
  { value: '51–200', label: '51–200' },
  { value: '201–500', label: '201–500' },
  { value: '500+', label: '500+' },
];

// Standard Philippine regions — matches the seeded Dentist data so the value
// posted by this form is consistent with what the directory queries against.
const regionOptions = [
  { value: 'NCR', label: 'NCR — National Capital Region' },
  { value: 'CAR', label: 'CAR — Cordillera' },
  { value: 'Region I (Ilocos)', label: 'Region I — Ilocos' },
  { value: 'Region II (Cagayan Valley)', label: 'Region II — Cagayan Valley' },
  { value: 'Region III (Central Luzon)', label: 'Region III — Central Luzon' },
  { value: 'Region IV-A (CALABARZON)', label: 'Region IV-A — CALABARZON' },
  { value: 'Region IV-B (MIMAROPA)', label: 'Region IV-B — MIMAROPA' },
  { value: 'Region V (Bicol)', label: 'Region V — Bicol' },
  { value: 'Region VI (Western Visayas)', label: 'Region VI — Western Visayas' },
  { value: 'Region VII (Central Visayas)', label: 'Region VII — Central Visayas' },
  { value: 'Region VIII (Eastern Visayas)', label: 'Region VIII — Eastern Visayas' },
  { value: 'Region IX (Zamboanga Peninsula)', label: 'Region IX — Zamboanga Peninsula' },
  { value: 'Region X (Northern Mindanao)', label: 'Region X — Northern Mindanao' },
  { value: 'Region XI (Davao)', label: 'Region XI — Davao' },
  { value: 'Region XII (SOCCSKSARGEN)', label: 'Region XII — SOCCSKSARGEN' },
  { value: 'Region XIII (Caraga)', label: 'Region XIII — Caraga' },
  { value: 'BARMM (Bangsamoro)', label: 'BARMM — Bangsamoro' },
];

export default function PartnerInquiryForm({ type }: { type: FormType }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Phone is controlled so PhoneInput can manage formatting / +63 prefix; the
  // other fields stay uncontrolled and read via FormData on submit.
  const [phone, setPhone] = useState('');

  const isEmployer = type === 'employer';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const body = {
      type,
      organizationName: data.get('organizationName') as string,
      contactName: data.get('contactName') as string,
      email: data.get('email') as string,
      contactNumber: phone,
      ...(isEmployer && { employeeCount: data.get('employeeCount') as string }),
      ...(!isEmployer && { region: data.get('region') as string }),
      message: data.get('message') as string,
    };

    const errs: Record<string, string> = {};
    if (!body.organizationName.trim()) errs.organizationName = 'Required';
    if (!body.contactName.trim()) errs.contactName = 'Required';
    if (!body.email.trim()) errs.email = 'Required';
    if (!body.contactNumber.trim()) errs.contactNumber = 'Required';
    if (!isEmployer && !(body as { region?: string }).region?.trim()) {
      errs.region = 'Required';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
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
          We&apos;ll get back to you within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {isEmployer ? (
        // Employer layout — Company Name full-width, then pairs.
        <>
          <Input
            id="organizationName"
            name="organizationName"
            label="Company Name"
            placeholder="Your company"
            required
            error={errors.organizationName}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input id="contactName" name="contactName" label="Your name" placeholder="Juan Dela Cruz" required error={errors.contactName} />
            <Input id="email" name="email" label="Email" type="email" placeholder="you@email.com" required error={errors.email} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <PhoneInput id="contactNumber" label="Mobile number" required value={phone} onChange={setPhone} error={errors.contactNumber} seamless />
            <Select
              id="employeeCount"
              name="employeeCount"
              label="Number of Employees"
              options={employeeCountOptions}
              placeholder="Select range"
            />
          </div>
        </>
      ) : (
        // Clinic layout — Clinic Name pairs with Your Name; Email pairs with
        // Contact Number; Region gets its own full-width row so the long
        // "Region IV-A — CALABARZON" labels don't get clipped in a half-col.
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="organizationName"
              name="organizationName"
              label="Clinic Name"
              placeholder="Smile Dental Clinic"
              required
              error={errors.organizationName}
            />
            <Input id="contactName" name="contactName" label="Your name" placeholder="Juan Dela Cruz" required error={errors.contactName} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input id="email" name="email" label="Email" type="email" placeholder="you@email.com" required error={errors.email} />
            <PhoneInput id="contactNumber" label="Mobile number" required value={phone} onChange={setPhone} error={errors.contactNumber} seamless />
          </div>
          <Select
            id="region"
            name="region"
            label="Region"
            options={regionOptions}
            placeholder="Select a region"
            required
            error={errors.region}
          />
        </>
      )}
      <Textarea
        id="message"
        name="message"
        label="Message"
        placeholder="Optional — tell us more about your situation."
      />
      {status === 'error' && (
        <p className="text-[14px] text-error">Something went wrong. Please try again.</p>
      )}
      <Button
        type="submit"
        disabled={status === 'loading'}
        size="default"
        className="w-full justify-center sm:w-auto"
      >
        {status === 'loading'
          ? 'Sending…'
          : isEmployer
            ? 'Send Inquiry'
            : 'Apply to Join'}
      </Button>
    </form>
  );
}
