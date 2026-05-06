import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'default' | 'large';

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  href?: string;
}

type ButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-text-on-brand border-brand hover:bg-[#166889] hover:border-[#166889] hover:-translate-y-px',
  secondary:
    'bg-surface text-brand border-[1.5px] border-brand hover:bg-brand-light hover:-translate-y-px',
  ghost: 'bg-transparent text-brand border-transparent hover:underline underline-offset-[3px]',
};

const sizes: Record<Size, string> = {
  default: 'px-[24px] py-[12px] text-[14px] leading-none',
  large: 'px-[30px] py-[14px] text-[15px] leading-none',
};

const base =
  'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-pill border ' +
  'transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

export default function Button({
  variant = 'primary',
  size = 'default',
  href,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = [base, variants[variant], sizes[size], className].join(' ');

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
