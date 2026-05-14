'use client';

import { useState } from 'react';
import Link from 'next/link';

type Role = 'member' | 'company' | 'provider' | 'general';

interface RoleOption {
  id: Role;
  label: string;
  sub: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'member',
    label: 'EGDN Member',
    sub: 'I have a member ID or my employer offers EGDN.',
  },
  {
    id: 'company',
    label: 'Company / HR',
    sub: 'I want to add dental coverage for my team.',
  },
  {
    id: 'provider',
    label: 'Dental Provider',
    sub: 'I represent a clinic or dental practice.',
  },
  {
    id: 'general',
    label: 'General Inquiry',
    sub: 'Press, partnerships, or other questions.',
  },
];

const CONTACT_TOPICS: Record<Role, string[]> = {
  member: [
    'Help finding a dentist',
    'Booking question',
    'Coverage / benefits question',
    'Member ID / Digital ID',
    'Update my information',
    'Something else',
  ],
  company: [
    'Add EGDN to our benefits',
    'Pricing & coverage details',
    'Renew our partnership',
    'Onboard new employees',
    'Something else',
  ],
  provider: [
    'Join the network',
    'Update clinic information',
    'Billing & reimbursement',
    'Something else',
  ],
  general: [
    'Press / media inquiry',
    'Partnership opportunity',
    'Feedback or suggestion',
    'Something else',
  ],
};

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

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    role: 'member' as Role,
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    memberId: '',
    company: '',
    consent: false,
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Reset topic when role changes — topic options depend on role
      if (key === 'role') next.topic = '';
      return next;
    });
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: '' }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = 'Required';
    if (!form.email.trim()) err.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email';
    if (!form.topic) err.topic = 'Select a topic';
    if (!form.message.trim()) err.message = 'Please share a few details';
    else if (form.message.trim().length < 10) err.message = 'A bit more detail, please (min 10 chars)';
    if (!form.consent) err.consent = 'Please agree before submitting';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          contactNumber: form.phone || undefined,
          subject: form.topic,
          message: form.message,
          role: form.role,
          memberId: form.role === 'member' ? form.memberId || undefined : undefined,
          company:
            form.role === 'company' || form.role === 'provider'
              ? form.company || undefined
              : undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  // ─── Success state ───────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="rounded-card border border-border bg-surface p-6 text-center sm:p-8">
        <p className="font-display text-[20px] font-semibold text-text">
          Thanks, {form.name.split(' ')[0] || 'friend'}.
        </p>
        <p className="mt-2 text-[14px] text-text-muted">
          Your message is in our inbox. We&apos;ll reply within 1 business day at{' '}
          <strong className="text-text">{form.email}</strong>.
        </p>
      </div>
    );
  }

  const topics = CONTACT_TOPICS[form.role];
  const showMemberId = form.role === 'member';
  const showCompany = form.role === 'company' || form.role === 'provider';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Role grid */}
      <div>
        <Label>I&apos;m reaching out as a…</Label>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => update('role', r.id)}
              className={[
                'flex items-start gap-3 rounded-xl border bg-bg p-4 text-left transition-colors',
                form.role === r.id
                  ? 'border-brand bg-brand-light'
                  : 'border-border hover:border-text-muted',
              ].join(' ')}
            >
              <span
                className={[
                  'relative mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 bg-bg',
                  form.role === r.id ? 'border-brand' : 'border-border',
                ].join(' ')}
              >
                {form.role === r.id && (
                  <span className="absolute inset-0.5 rounded-full bg-brand" />
                )}
              </span>
              <div>
                <strong className="text-[14px] font-semibold text-text">{r.label}</strong>
                <div className="mt-0.5 text-[12px] leading-snug text-text-muted">{r.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cname" label="Full name" required error={errors.name}>
          <Input
            id="cname"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Juan Dela Cruz"
            hasError={!!errors.name}
          />
        </Field>
        <Field id="cemail" label="Email" required error={errors.email}>
          <Input
            id="cemail"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@email.com"
            hasError={!!errors.email}
          />
        </Field>
      </div>

      {/* Phone + (Member ID or Company) */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="cphone"
          label={
            <>
              Phone <span className="font-normal text-text-muted">(optional)</span>
            </>
          }
        >
          <Input
            id="cphone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+63 9XX XXX XXXX"
          />
        </Field>
        {showMemberId && (
          <Field
            id="cmid"
            label={
              <>
                Member ID <span className="font-normal text-text-muted">(optional)</span>
              </>
            }
          >
            <Input
              id="cmid"
              value={form.memberId}
              onChange={(e) => update('memberId', e.target.value)}
              placeholder="EGDN-000000"
            />
          </Field>
        )}
        {showCompany && (
          <Field
            id="ccomp"
            label={form.role === 'company' ? 'Company name' : 'Clinic name'}
          >
            <Input
              id="ccomp"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              placeholder={form.role === 'company' ? 'Your company' : 'Your clinic'}
            />
          </Field>
        )}
        {form.role === 'general' && <div className="hidden sm:block" />}
      </div>

      {/* Topic */}
      <Field id="ctopic" label="What's this about?" error={errors.topic}>
        <div className="relative">
          <select
            id="ctopic"
            value={form.topic}
            onChange={(e) => update('topic', e.target.value)}
            className={[
              'block h-12 w-full cursor-pointer appearance-none rounded-input border bg-surface pl-4 pr-10 text-[14px] text-text transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]',
              errors.topic ? 'border-error focus:border-error' : 'border-border focus:border-brand',
            ].join(' ')}
          >
            <option value="">Choose a topic…</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            <ChevronDown />
          </span>
        </div>
      </Field>

      {/* Message + char count */}
      <Field id="cmsg" label="Your message" error={errors.message}>
        <textarea
          id="cmsg"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Share a few details so we can help you faster — clinic name, dates, anything relevant."
          className={[
            'block min-h-[140px] w-full resize-y rounded-input border bg-surface px-4 py-3 text-[14px] text-text transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]',
            errors.message ? 'border-error focus:border-error' : 'border-border focus:border-brand',
          ].join(' ')}
        />
        <p className="mt-1.5 text-[12px] text-text-muted">
          {form.message.length} character{form.message.length === 1 ? '' : 's'}
        </p>
      </Field>

      {/* Consent — styled card with inline link to privacy policy */}
      <label
        className={[
          'flex cursor-pointer items-start gap-3 rounded-input border p-4 text-[13px] leading-[1.5] text-text transition-colors',
          errors.consent
            ? 'border-error bg-bg-deep'
            : form.consent
              ? 'border-brand bg-brand-light'
              : 'border-border bg-bg-deep',
        ].join(' ')}
      >
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update('consent', e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand"
        />
        <span>
          I agree to EGDN&apos;s{' '}
          <Link
            href="/privacy"
            className="text-brand underline underline-offset-[3px] hover:text-text"
          >
            privacy policy
          </Link>{' '}
          and consent to being contacted about this inquiry.
        </span>
      </label>
      {errors.consent && <p className="text-[12px] text-error">{errors.consent}</p>}

      {status === 'error' && (
        <p className="text-[13px] text-error">
          Something went wrong. Please try again or call our hotline.
        </p>
      )}

      {/* Submit — bottom right, separated by a thin top border per the design */}
      <div className="flex justify-end border-t border-border pt-5">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 rounded-pill border border-brand bg-brand px-[24px] py-[12px] text-[14px] font-semibold leading-none text-white transition-colors hover:bg-[#166889] hover:border-[#166889] disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Send message'}
          {status !== 'loading' && <ArrowRight />}
        </button>
      </div>
    </form>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[14px] font-medium text-text">
      {children}
    </label>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id?: string;
  label: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
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
        'block h-12 w-full rounded-input border bg-surface px-4 text-[14px] text-text transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]',
        hasError ? 'border-error focus:border-error' : 'border-border focus:border-brand',
      ].join(' ')}
    />
  );
}
