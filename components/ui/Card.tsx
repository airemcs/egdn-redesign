interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={['rounded-card border border-border bg-surface p-6', className].join(' ')}>
      {children}
    </div>
  );
}
