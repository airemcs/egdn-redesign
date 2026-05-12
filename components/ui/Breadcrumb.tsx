import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-text-muted"
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border-strong select-none">›</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-brand transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-text">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
