interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: React.ReactNode;
  error?: string;
  id: string;
}

const fieldBase =
  'w-full rounded-input border border-border bg-surface px-4 py-3 text-[15px] text-text ' +
  'placeholder:text-text-muted resize-y min-h-[120px] ' +
  'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ' +
  'disabled:opacity-50';

export default function Textarea({
  label,
  error,
  id,
  className = '',
  required,
  ...rest
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-text">
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        required={required}
        className={[fieldBase, error ? 'border-error' : '', className].join(' ')}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="text-[13px] text-error">
          {error}
        </span>
      )}
    </div>
  );
}
