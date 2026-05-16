import React from 'react';

type Width = 'wide' | 'narrow' | 'reading';

interface PageContainerProps {
  /**
   * - `wide`    — default page width (max-w-300 / 1200px). Use for marketing pages, list pages, profiles.
   * - `reading` — long-form content (max-w-3xl / 768px). Use for /how-it-works, /faqs.
   * - `narrow`  — single-column flow (max-w-[560px]). Use for /digital-id and other empty/centered states.
   */
  width?: Width;
  /** Additional classes appended after the standard padding. */
  className?: string;
  children: React.ReactNode;
}

const widths: Record<Width, string> = {
  wide: 'max-w-300',
  reading: 'max-w-3xl',
  narrow: 'max-w-[560px]',
};

/**
 * The single canonical page container. Every top-level page section should be wrapped in this
 * (or use these exact padding tokens directly). Horizontal padding is `px-5 sm:px-6 lg:px-10`
 * everywhere — DO NOT introduce other padding values at this level.
 */
export default function PageContainer({
  width = 'wide',
  className = '',
  children,
}: PageContainerProps) {
  return (
    <div className={`mx-auto ${widths[width]} px-5 sm:px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
