'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import FilterSheet from './FilterSheet';

interface FilterBarProps {
  cities: string[];
  specializations: string[];
  selectedCity?: string;
  selectedSpecialization?: string;
}

type MenuKey = 'city' | 'specialization';

/**
 * Filter controls for the region detail page. Two layouts:
 *
 * - **Mobile + tablet (`<md`):** a chip row with a "Filters" pill (icon +
 *   active-count badge) that opens the bottom-sheet `FilterSheet`, plus one
 *   removable active chip per applied filter. Optimized for thumb reach.
 *
 * - **Desktop (`md:+`):** two chip-styled triggers (City and Specialization)
 *   that open a custom popover list — same surface/border/eyebrow vocabulary
 *   as the rest of the site (no plain native-UA dropdown). Only one menu can
 *   be open at a time; click-outside and Esc close it.
 */
export default function FilterBar({
  cities,
  specializations,
  selectedCity,
  selectedSpecialization,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);

  const activeCount = (selectedCity ? 1 : 0) + (selectedSpecialization ? 1 : 0);

  function clearFilter(key: MenuKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function setFilter(key: MenuKey, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      {/* ── Mobile + tablet (<md): chip row + bottom-sheet ──────────────── */}
      <div className="md:hidden">
        {/* Negative horizontal margins let the chip row run edge-to-edge when
            it overflows on narrow screens. The gradient fade on the right edge
            hints at off-screen content when chips overflow. */}
        <div className="relative -mx-5">
          <div className="flex items-center gap-2 overflow-x-auto px-5 pb-1">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-[12px] font-semibold text-text transition-colors hover:border-text-muted before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
              {activeCount > 0 && (
                <span className="grid h-4 min-w-[16px] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>

            {selectedCity && (
              <ActiveChip label={selectedCity} onRemove={() => clearFilter('city')} />
            )}
            {selectedSpecialization && (
              <ActiveChip
                label={selectedSpecialization}
                onRemove={() => clearFilter('specialization')}
              />
            )}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-bg to-transparent"
          />
        </div>

        <FilterSheet
          open={open}
          onClose={() => setOpen(false)}
          cities={cities}
          specializations={specializations}
        />
      </div>

      {/* ── Desktop (md+): inline dropdown popovers ────────────────────── */}
      {/* Aggregate "Clear filters" lives in DentistList's result-count row
          (rendered once for both viewports). Don't add a second one here. */}
      <div className="hidden md:flex md:flex-wrap md:items-center md:gap-2">
        <SelectMenu
          label="City"
          value={selectedCity ?? ''}
          options={cities}
          isOpen={openMenu === 'city'}
          onToggle={() => setOpenMenu(openMenu === 'city' ? null : 'city')}
          onClose={() => setOpenMenu(null)}
          onChange={(v) => {
            setFilter('city', v);
            setOpenMenu(null);
          }}
        />
        <SelectMenu
          label="Specialization"
          value={selectedSpecialization ?? ''}
          options={specializations}
          isOpen={openMenu === 'specialization'}
          onToggle={() => setOpenMenu(openMenu === 'specialization' ? null : 'specialization')}
          onClose={() => setOpenMenu(null)}
          onChange={(v) => {
            setFilter('specialization', v);
            setOpenMenu(null);
          }}
        />
      </div>
    </>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-brand bg-brand pl-3 pr-1 text-[12px] font-semibold text-white">
      <span className="max-w-[140px] truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="relative grid h-5 w-5 place-items-center rounded-full hover:bg-white/20 before:absolute before:-inset-2 before:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label={`Remove ${label} filter`}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}

/**
 * Chip-style trigger + custom popover list. Replaces native `<select>` so
 * the dropdown menu matches the surrounding EGDN UI (rounded card, brand-
 * light selected row, no system fonts/colors leaking through).
 *
 * Keyboard: Esc closes. Tab through options works because each option is a
 * focusable `<button>`. Full ARIA listbox semantics (arrow-key navigation,
 * type-ahead) intentionally deferred — mouse + Tab + Esc covers the bulk of
 * desktop flows; richer keyboard nav can land alongside a a11y audit pass.
 */
function SelectMenu({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onClose,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (v: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const active = !!value;
  const display = active ? value : label;

  // Click-outside + Esc to close — only registered while the menu is open.
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={[
          'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[12px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          active
            ? 'border-brand bg-brand text-white hover:bg-[#0F4D63] hover:border-[#0F4D63]'
            : 'border-border bg-surface text-text hover:border-text-muted',
        ].join(' ')}
      >
        <span className="max-w-[180px] truncate">{display}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={['transition-transform duration-200', isOpen ? 'rotate-180' : ''].join(' ')}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={`Filter by ${label.toLowerCase()}`}
          className="absolute left-0 top-full z-20 mt-1.5 max-h-72 min-w-[220px] overflow-y-auto rounded-card border border-border bg-surface py-1"
        >
          <li>
            <MenuOption
              selected={!value}
              muted
              onClick={() => onChange('')}
            >
              Any {label.toLowerCase()}
            </MenuOption>
          </li>
          {options.length > 0 && (
            <li aria-hidden>
              <div className="my-1 h-px bg-border" />
            </li>
          )}
          {options.map((opt) => (
            <li key={opt}>
              <MenuOption
                selected={value === opt}
                onClick={() => onChange(opt)}
              >
                {opt}
              </MenuOption>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MenuOption({
  selected,
  muted,
  onClick,
  children,
}: {
  selected: boolean;
  muted?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={[
        'flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-[13px] transition-colors focus:outline-none focus-visible:bg-bg-deep',
        selected
          ? 'bg-brand-light font-semibold text-brand'
          : muted
            ? 'text-text-muted hover:bg-bg-deep'
            : 'text-text hover:bg-bg-deep',
      ].join(' ')}
    >
      <span className="truncate">{children}</span>
      {selected && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="shrink-0 text-brand"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}
