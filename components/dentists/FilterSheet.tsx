'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  cities: string[];
  specializations: string[];
}

/**
 * Bottom-sheet modal for the region detail filter UI. Stages selections
 * locally and commits them to the URL on "Apply" — cancel/backdrop drops
 * pending changes. URL-state is the source of truth, so closing without
 * applying always restores whatever was already active.
 */
export default function FilterSheet({
  open,
  onClose,
  cities,
  specializations,
}: FilterSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pendingCity, setPendingCity] = useState<string | null>(null);
  const [pendingSpec, setPendingSpec] = useState<string | null>(null);

  // Re-seed local state from the URL each time the sheet opens. Without this,
  // staged changes from a previous open-then-cancel would leak across opens.
  useEffect(() => {
    if (open) {
      setPendingCity(searchParams.get('city'));
      setPendingSpec(searchParams.get('specialization'));
    }
  }, [open, searchParams]);

  // Lock background scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Esc closes the sheet — matches native dialog behavior.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function apply() {
    const params = new URLSearchParams(searchParams.toString());
    if (pendingCity) params.set('city', pendingCity);
    else params.delete('city');
    if (pendingSpec) params.set('specialization', pendingSpec);
    else params.delete('specialization');
    router.push(`${pathname}?${params.toString()}`);
    onClose();
  }

  function reset() {
    setPendingCity(null);
    setPendingSpec(null);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[20px] bg-bg shadow-[0_-8px_32px_rgba(0,0,0,0.18)]"
      >
        {/* Grabber */}
        <div className="flex justify-center pt-2.5">
          <div className="h-1 w-9 rounded-full bg-border-strong" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="m-0 font-display text-[22px] font-semibold text-text">Filters</h2>
          <button
            type="button"
            onClick={reset}
            className="text-[13px] font-semibold text-brand hover:underline"
          >
            Reset
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-auto py-1">
          {cities.length > 0 && (
            <Section title="City or municipality">
              <ChipPicker
                items={cities}
                selected={pendingCity}
                onSelect={setPendingCity}
                allLabel="All cities"
              />
            </Section>
          )}

          {cities.length > 0 && specializations.length > 0 && <Divider />}

          {specializations.length > 0 && (
            <Section title="Specialization">
              <ChipPicker
                items={specializations}
                selected={pendingSpec}
                onSelect={setPendingSpec}
                allLabel="Any"
              />
            </Section>
          )}
        </div>

        {/* Sticky footer */}
        <div className="border-t border-border bg-bg px-4 pb-7 pt-3">
          <button
            type="button"
            onClick={apply}
            className="h-[52px] w-full rounded-[14px] bg-brand text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4">
      <h3 className="eyebrow text-text-muted m-0 mb-2.5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-5 h-px bg-border" />;
}

function ChipPicker({
  items,
  selected,
  onSelect,
  allLabel,
}: {
  items: string[];
  selected: string | null;
  onSelect: (val: string | null) => void;
  allLabel: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip label={allLabel} active={!selected} onClick={() => onSelect(null)} />
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          active={selected === item}
          onClick={() => onSelect(item)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "relative rounded-full border border-brand bg-brand px-3 py-1.5 text-[12px] font-semibold text-white before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          : "relative rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-text hover:border-text-muted before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      }
    >
      {label}
    </button>
  );
}
