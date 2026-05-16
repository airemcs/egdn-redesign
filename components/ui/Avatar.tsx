import Image from 'next/image';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  /** 'circle' (default) or 'rounded' for a squircle look used on the
   * mobile-native dentist profile design. */
  shape?: 'circle' | 'rounded';
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({ name, src, size = 80, shape = 'circle' }: AvatarProps) {
  const radius = shape === 'rounded' ? 'rounded-3xl' : 'rounded-full';

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`${radius} object-cover`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${radius} bg-brand-light font-body font-semibold text-brand select-none`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
