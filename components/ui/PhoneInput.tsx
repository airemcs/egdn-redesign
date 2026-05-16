'use client';

import { useEffect, useState } from 'react';

interface PhoneInputProps {
  /** Full canonical value, e.g., "+63 917 123 4567". Empty string = unset. */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  /** Optional label rendered above the field (matches the shared Input API). */
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  hasError?: boolean;
  placeholder?: string;
  /**
   * When the PhoneInput is wrapped by an external `<Field>` (BookingWizard,
   * ContactForm), the parent handles label/error. Pass `bare` to skip the
   * internal label/error rendering.
   */
  bare?: boolean;
  /**
   * Render the +63 prefix as if it were pre-typed text inside the input:
   * no divider, same bg/text colour as the field. Visually it looks like
   * one continuous input; the user just can't edit the prefix.
   */
  seamless?: boolean;
}

/**
 * Strip a raw user input down to the local-digits portion (without the +63
 * country code and without the leading 0 that PH speakers often type).
 *
 *   "+63 917 123 4567" → "9171234567"
 *   "09171234567"      → "9171234567"
 *   "917 123 4567"     → "9171234567"
 *   "(02) 8836-7181"   → "2 8836-7181" stripped to "288367181"  (landline)
 *
 * Caps at 10 digits because PH mobiles are 10 (after the 0 / +63) and NCR
 * landlines are 9 — both fit comfortably.
 */
function stripToLocalDigits(raw: string): string {
  let digits = raw.replace(/^\s*\+?\s*63\s*/, '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/**
 * Format local digits with conventional spacing for readability. Two spaces
 * between groups creates noticeable separation (vs a single ASCII space which
 * blurs visually with the digits at small font sizes) without resorting to
 * unusual Unicode whitespace that some fonts render inconsistently.
 */
function formatLocal(digits: string): string {
  const SEP = '  ';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}${SEP}${digits.slice(3)}`;
  return `${digits.slice(0, 3)}${SEP}${digits.slice(3, 6)}${SEP}${digits.slice(6, 10)}`;
}

export default function PhoneInput({
  value,
  onChange,
  id,
  label,
  error,
  helper,
  required,
  hasError,
  placeholder = '000  000  0000',
  bare,
  seamless,
}: PhoneInputProps) {
  // Local display state — what's actually in the visible <input>. Driven by
  // the parent `value` but tolerates free-form typing (extra spaces, dashes,
  // partial digits) without fighting the caret. Normalized on blur.
  const [display, setDisplay] = useState(() => formatLocal(stripToLocalDigits(value)));

  // Sync display when the parent value changes externally (e.g., reset on
  // success). Only resync when the canonical form actually differs so we
  // don't trample what the user is currently typing.
  useEffect(() => {
    const local = stripToLocalDigits(value);
    if (stripToLocalDigits(display) !== local) {
      setDisplay(formatLocal(local));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const typed = input.value;
    const oldCaret = input.selectionStart ?? typed.length;

    // How many digits sit before the caret in what the user just typed?
    // We use that as an anchor so the caret lands after the same digit in
    // the reformatted value, even when the formatter inserts a new space.
    const digitsBeforeCaret = typed.slice(0, oldCaret).replace(/\D/g, '').length;

    const local = stripToLocalDigits(typed);
    const formatted = formatLocal(local);
    setDisplay(formatted);
    onChange(local ? `+63 ${formatted}` : '');

    // Re-position the caret on the next frame (after React commits the new
    // value). Find the index right after the Nth digit in the formatted
    // string. If the user was at position 0 (start), keep it there.
    requestAnimationFrame(() => {
      let newCaret = 0;
      if (digitsBeforeCaret > 0) {
        let seen = 0;
        newCaret = formatted.length;
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) seen++;
          if (seen === digitsBeforeCaret) {
            newCaret = i + 1;
            break;
          }
        }
      }
      input.setSelectionRange(newCaret, newCaret);
    });
  }

  function handleBlur() {
    // Display is already kept in canonical form during typing; nothing extra
    // to do on blur. Kept for parity with the previous API.
  }

  const isError = hasError || !!error;

  const fieldWrapper = (
    <div
      className={[
        'flex h-12 w-full overflow-hidden rounded-input border bg-surface transition-colors focus-within:ring-2 focus-within:ring-[rgba(27,127,168,0.12)]',
        isError ? 'border-error focus-within:border-error' : 'border-border focus-within:border-brand',
      ].join(' ')}
    >
      <span
        aria-hidden
        onClick={(e) => {
          // Tap on the prefix → focus the editable input (caret lands at end).
          const input = (e.currentTarget.nextElementSibling as HTMLInputElement | null);
          input?.focus();
        }}
        className={[
          // Size auto-adapts to the parent context: `bare` mode (BookingWizard
          // / ContactForm) wraps PhoneInput with a 14px local Input wrapper, so
          // match that. Full mode (PartnerInquiryForm / NominationForm /
          // AppointmentForm) sits next to the shared Input component which is
          // 15px. Pin font-body + font-normal so the prefix renders with the
          // same font metrics as the editable input (some browsers apply a
          // system UI font + slightly different weight to <input> by default).
          'font-body font-normal',
          bare ? 'text-[14px]' : 'text-[15px]',
          seamless
            ? // Right padding (~10px) gives the same visual gap between "+63"
              // and "917" as the two-space separator gives between digit
              // groups, so the whole line reads as one continuous string.
              'flex items-center pl-4 pr-2.5 leading-normal text-text select-none'
            : 'grid place-items-center border-r border-border bg-bg-deep px-3 leading-normal font-medium text-text-muted select-none',
        ].join(' ')}
      >
        +63
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        required={required}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={[
          // Size mirrors the prefix's auto-adapt rule so prefix + input read
          // as one continuous string at whichever size the surrounding form uses.
          'font-body font-normal',
          bare ? 'text-[14px]' : 'text-[15px]',
          'block flex-1 bg-transparent leading-normal text-text focus:outline-none placeholder:text-text-muted',
          seamless ? 'pl-0 pr-4' : 'px-4',
        ].join(' ')}
      />
    </div>
  );

  // `bare` mode: the parent (e.g., BookingWizard's <Field>) handles label and
  // error rendering, so we only emit the prefix + input wrapper.
  if (bare) return fieldWrapper;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-text">
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {fieldWrapper}
      {helper && !error && (
        <span id={`${id}-helper`} className="text-[12px] text-text-muted">
          {helper}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="text-[13px] text-error">
          {error}
        </span>
      )}
    </div>
  );
}
