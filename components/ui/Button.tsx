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
  primary: 'bg-brand text-text-on-brand border-brand hover:opacity-90',
  secondary: 'bg-surface text-brand border-[1.5px] border-brand hover:bg-brand-light',
  ghost: 'bg-transparent text-brand border-transparent hover:underline',
};

const sizes: Record<Size, string> = {
  default: 'px-[22px] py-[10px] text-[13px] leading-none',
  large: 'px-[28px] py-[12px] text-[14px] leading-none',
};

const base =
  'inline-flex items-center justify-center font-body font-semibold rounded-pill border ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ' +
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
