type Padding = 'compact' | 'standard' | 'panel';

interface CardProps {
  children: React.ReactNode;
  /**
   * Card padding tier. See `egdn-design-prompt.md` for canonical use:
   * - `compact`  — list rows (DentistCard, RegionGrid).
   * - `standard` — info tiles, content cards, audience cards (default).
   * - `panel`    — form containers, big content panels.
   */
  padding?: Padding;
  className?: string;
}

const paddings: Record<Padding, string> = {
  compact: 'p-4',
  standard: 'p-5 sm:p-6',
  panel: 'p-6 sm:p-8 lg:p-10',
};

export default function Card({ children, padding = 'standard', className = '' }: CardProps) {
  return (
    <div
      className={['rounded-card border border-border bg-surface', paddings[padding], className].join(' ')}
    >
      {children}
    </div>
  );
}
