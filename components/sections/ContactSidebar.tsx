type Variant = 'member' | 'employer' | 'clinic';

interface ContactSidebarProps {
  /**
   * Audience the sidebar is shown to. Currently informational — does not
   * affect output — but documents intent at the call site and reserves a
   * hook for per-variant copy variations later.
   */
  variant: Variant;
  /** Render the static "Office" tile (contact page only). */
  showOffice?: boolean;
  /** Render the "Office hours" card with the Sat/Sun closed row (contact only). */
  showHours?: boolean;
}

const PHONES = [
  { label: 'Telephone', number: '(+632) 8836-7181', href: 'tel:+63288367181' },
  { label: 'Smart Mobile', number: '0920-951-7005', href: 'tel:+639209517005' },
  { label: 'Globe Mobile', number: '0917-315-4926', href: 'tel:+639173154926' },
] as const;

const SUPPORT_EMAIL = 'info@elitegroupph.com';
const SUPPORT_EMAIL_HREF = `mailto:${SUPPORT_EMAIL}`;

const OFFICE_TITLE = 'Office';
const OFFICE_VALUE = 'Zeta II Building, Makati';
const OFFICE_SUB = '7th Floor, 191 Salcedo St., Legaspi Village';

/* ─── icons ──────────────────────────────────────────────────────────── */

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ─── component ──────────────────────────────────────────────────────── */

export default function ContactSidebar({ variant: _variant, showOffice, showHours }: ContactSidebarProps) {
  // _variant is currently unused at render time; kept on the API so call
  // sites self-document the audience and so per-variant copy can be wired
  // in without changing the props.
  void _variant;
  return (
    <aside className="flex flex-col gap-3.5">
      <CallUsTile />
      <EmailTile />
      {showOffice && <OfficeTile />}
      {showHours && <HoursCard />}
    </aside>
  );
}

/* ─── tiles ──────────────────────────────────────────────────────────── */

function TileFrame({ icon, children, href }: { icon: React.ReactNode; children: React.ReactNode; href?: string }) {
  const cls =
    'flex items-start gap-4 rounded-card border border-border bg-surface p-5 sm:p-6';
  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
        {icon}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </>
  );
  // Anchor stays so tel:/mailto: still works on tap, but `cursor-default`
  // removes pointer hover — the card reads as a static info tile, not a
  // link target. (Matches the existing behavior on /contact.)
  if (href) {
    return (
      <a href={href} className={`${cls} cursor-default`}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}

function CallUsTile() {
  return (
    <TileFrame icon={<PhoneIcon />}>
      <div className="eyebrow text-text-muted">Call us</div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {PHONES.map((p) => (
          <li
            key={p.label}
            className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] text-text-muted"
          >
            <span>{p.label}:</span>
            <a
              href={p.href}
              className="font-display text-[15px] font-semibold text-text"
            >
              {p.number}
            </a>
          </li>
        ))}
      </ul>
    </TileFrame>
  );
}

function EmailTile() {
  return (
    <TileFrame icon={<MailIcon />} href={SUPPORT_EMAIL_HREF}>
      <div className="eyebrow text-text-muted">Email</div>
      <div className="mt-1 font-display text-[19px] font-semibold leading-[1.25] text-text break-all">
        {SUPPORT_EMAIL}
      </div>
      <div className="mt-1 text-[13px] leading-[1.4] text-text-muted">
        Replies within 1 business day
      </div>
    </TileFrame>
  );
}

function OfficeTile() {
  return (
    <TileFrame icon={<PinIcon />}>
      <div className="eyebrow text-text-muted">{OFFICE_TITLE}</div>
      <div className="mt-1 font-display text-[19px] font-semibold leading-[1.25] text-text">
        {OFFICE_VALUE}
      </div>
      <div className="mt-1 text-[13px] leading-[1.4] text-text-muted">{OFFICE_SUB}</div>
    </TileFrame>
  );
}

function HoursCard() {
  // `order-first` on mobile floats the Hours card above the rest of the
  // tiles so it sits right after the contact form; `lg:order-0` releases
  // back to source order on desktop so it sits at the bottom of the
  // sidebar (matches the pre-extraction layout).
  return (
    <div className="order-first rounded-card border border-border bg-surface p-5 sm:p-6 lg:order-0">
      <h4 className="eyebrow text-text-muted mb-3.5">Office hours</h4>
      <dl className="flex flex-col gap-2.5 text-[14px]">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <dt className="font-medium text-text">Monday – Friday</dt>
          <dd className="text-text-muted tabular-nums">9:00 AM – 6:00 PM</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="font-medium text-text">Saturday &amp; Sunday</dt>
          <dd className="font-semibold text-error">— Closed</dd>
        </div>
      </dl>
    </div>
  );
}
