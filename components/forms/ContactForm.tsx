'use client';

import { useState } from 'react';
import Link from 'next/link';
import PhoneInput from '@/components/ui/PhoneInput';

type Role = 'member' | 'company' | 'provider' | 'general';

interface RoleOption {
  id: Role;
  label: string;
  sub: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'general',
    label: 'General Inquiry',
    sub: 'Press, partnerships, or other questions.',
  },
  {
    id: 'member',
    label: 'EGDN Member',
    sub: 'I have a member ID or my employer offers EGDN.',
  },
  {
    id: 'provider',
    label: 'Dental Provider',
    sub: 'I represent a clinic or dental practice.',
  },
  {
    id: 'company',
    label: 'Company / HR',
    sub: 'I want to add dental coverage for my team.',
  },
];

// Mirrors PartnerInquiryForm's region list so values stored match across forms.
const REGION_OPTIONS = [
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

// Mirrors PartnerInquiryForm's employer range list.
const EMPLOYEE_COUNT_OPTIONS = [
  { value: '1–50', label: '1–50' },
  { value: '51–200', label: '51–200' },
  { value: '201–500', label: '201–500' },
  { value: '500+', label: '500+' },
];

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
    role: 'general' as Role,
    name: '',
    email: '',
    phone: '',
    message: '',
    memberId: '',
    company: '',
    region: '',
    employeeCount: '',
    consent: false,
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Clear role-specific fields when role changes so stale values don't
      // get submitted when the user switches between role contexts.
      if (key === 'role') {
        next.memberId = '';
        next.company = '';
        next.region = '';
        next.employeeCount = '';
      }
      return next;
    });
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: '' }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err: Record<string, string> = {};
    const isProvider = form.role === 'provider';
    const isCompany = form.role === 'company';

    if (!form.name.trim()) err.name = 'Required';
    if (!form.email.trim()) err.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email';

    // Provider / company roles mirror the requirements of the dedicated
    // inquiry forms — org name, phone, and (for provider) region are all
    // required so we never lose the details we'd otherwise gather there.
    if (isProvider || isCompany) {
      if (!form.company.trim()) err.company = 'Required';
      if (!form.phone.trim()) err.phone = 'Required';
    }
    if (isProvider && !form.region) err.region = 'Required';

    if (!form.message.trim()) err.message = 'Please share a few details';
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
          // subject is now auto-composed server-side from role + name.
          message: form.message,
          role: form.role,
          memberId: form.role === 'member' ? form.memberId || undefined : undefined,
          company: isCompany || isProvider ? form.company || undefined : undefined,
          region: isProvider ? form.region || undefined : undefined,
          employeeCount: isCompany ? form.employeeCount || undefined : undefined,
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

  const isProvider = form.role === 'provider';
  const isCompany = form.role === 'company';
  const isPartner = isProvider || isCompany;

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

      {isPartner ? (
        // Provider / Company — mirrors the PartnerInquiryForm layout so we
        // gather the same required details (org name + name pair, email +
        // phone pair, then Region or Number of Employees on its own row).
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="ccomp"
              label={isCompany ? 'Company name' : 'Clinic name'}
              required
              error={errors.company}
            >
              <Input
                id="ccomp"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder={isCompany ? 'Your company' : 'Your clinic'}
                hasError={!!errors.company}
              />
            </Field>
            <Field id="cname" label="Your name" required error={errors.name}>
              <Input
                id="cname"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Juan Dela Cruz"
                hasError={!!errors.name}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
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
            <Field id="cphone" label="Mobile number" required error={errors.phone}>
              <PhoneInput
                id="cphone"
                value={form.phone}
                onChange={(v) => update('phone', v)}
                hasError={!!errors.phone}
                bare
                seamless
              />
            </Field>
          </div>
          {isProvider && (
            <Field id="cregion" label="Region" required error={errors.region}>
              <div className="relative">
                <select
                  id="cregion"
                  value={form.region}
                  onChange={(e) => update('region', e.target.value)}
                  className={[
                    'block h-12 w-full cursor-pointer appearance-none rounded-input border bg-surface pl-4 pr-10 text-[14px] text-text transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]',
                    errors.region ? 'border-error focus:border-error' : 'border-border focus:border-brand',
                  ].join(' ')}
                >
                  <option value="">Select a region…</option>
                  {REGION_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <ChevronDown />
                </span>
              </div>
            </Field>
          )}
          {isCompany && (
            <Field
              id="cemp"
              label={
                <>
                  Number of employees{' '}
                  <span className="font-normal text-text-muted">(optional)</span>
                </>
              }
            >
              <div className="relative">
                <select
                  id="cemp"
                  value={form.employeeCount}
                  onChange={(e) => update('employeeCount', e.target.value)}
                  className="block h-12 w-full cursor-pointer appearance-none rounded-input border border-border bg-surface pl-4 pr-10 text-[14px] text-text transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]"
                >
                  <option value="">Select range</option>
                  {EMPLOYEE_COUNT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <ChevronDown />
                </span>
              </div>
            </Field>
          )}
        </>
      ) : (
        // Member / General — name + email pair, then phone + (member ID).
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="cname" label="Your name" required error={errors.name}>
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
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="cphone"
              label={
                <>
                  Mobile number <span className="font-normal text-text-muted">(optional)</span>
                </>
              }
            >
              <PhoneInput
                id="cphone"
                value={form.phone}
                onChange={(v) => update('phone', v)}
                bare
                seamless
              />
            </Field>
            {form.role === 'member' ? (
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
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        </>
      )}

      <Field id="cmsg" label="Your message" required error={errors.message}>
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
          className="inline-flex items-center justify-center gap-2 rounded-pill border border-brand bg-brand px-[24px] py-[12px] text-[14px] font-semibold leading-none text-white transition-colors hover:bg-[#0F4D63] hover:border-[#0F4D63] disabled:opacity-60"
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
        'block h-12 w-full rounded-input border bg-surface px-4 text-[14px] text-text transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-[rgba(27,127,168,0.12)]',
        hasError ? 'border-error focus:border-error' : 'border-border focus:border-brand',
      ].join(' ')}
    />
  );
}
