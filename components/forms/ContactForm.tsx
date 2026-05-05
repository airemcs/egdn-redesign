'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

const subjectOptions = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Membership', label: 'Membership' },
  { value: 'Appointment', label: 'Appointment' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Other', label: 'Other' },
];

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const body = {
      name: data.get('name') as string,
      email: data.get('email') as string,
      contactNumber: data.get('contactNumber') as string,
      subject: data.get('subject') as string,
      message: data.get('message') as string,
    };

    const errs: Record<string, string> = {};
    if (!body.name.trim()) errs.name = 'Required';
    if (!body.email.trim()) errs.email = 'Required';
    if (!body.contactNumber.trim()) errs.contactNumber = 'Required';
    if (!body.subject) errs.subject = 'Required';
    if (!body.message.trim()) errs.message = 'Required';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
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
        <p className="font-semibold text-text">Your message has been sent.</p>
        <p className="mt-1 text-[14px] text-text-muted">
          We'll get back to you within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input id="name" name="name" label="Your Name" required error={errors.name} />
      <Input id="email" name="email" label="Email Address" type="email" required error={errors.email} />
      <Input id="contactNumber" name="contactNumber" label="Contact Number" type="tel" required error={errors.contactNumber} />
      <Select id="subject" name="subject" label="Subject" options={subjectOptions} placeholder="Select a subject" required error={errors.subject} />
      <Textarea id="message" name="message" label="Message" required error={errors.message} />
      {status === 'error' && (
        <p className="text-[14px] text-error">Something went wrong. Please try again.</p>
      )}
      <Button type="submit" disabled={status === 'loading'} size="large">
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
