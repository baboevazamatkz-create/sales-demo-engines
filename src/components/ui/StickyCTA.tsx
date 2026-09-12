import type { ReactNode } from 'react';

export function StickyCTA({
  label,
  onClick,
  disabled,
  floating = false,
  leading,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** When true, floats above the content (used on the menu/catalog screen); otherwise sits in a bottom padding bar. */
  floating?: boolean;
  /** Optional left-aligned content (e.g. a bag icon + item count) for the floating variant. */
  leading?: ReactNode;
}) {
  const solid = 'bg-brand disabled:bg-stone-200 disabled:text-stone-400 text-brand-contrast rounded-2xl text-sm font-medium';
  if (floating) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`absolute bottom-5 left-4 right-4 shadow-lg py-3.5 flex items-center px-5 ${leading ? 'justify-between' : 'justify-center'} ${solid}`}
      >
        {leading}
        <span>{label}</span>
      </button>
    );
  }
  return (
    <div className="p-4">
      <button onClick={onClick} disabled={disabled} className={`w-full py-3.5 ${solid}`}>
        {label}
      </button>
    </div>
  );
}
