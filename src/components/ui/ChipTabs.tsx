export function ChipTabs({
  options,
  active,
  onSelect,
  className = 'px-4 py-3',
  wrap = false,
}: {
  options: string[];
  active: string;
  onSelect: (value: string) => void;
  /** Override the default outer padding, e.g. when nesting inside a card that already has padding. */
  className?: string;
  /** Wrap onto multiple lines instead of horizontally scrolling — use for
   * short, exhaustively-visible option sets (e.g. payment methods) rather
   * than long category lists where scrolling is expected. */
  wrap?: boolean;
}) {
  const layout = wrap ? 'flex-wrap' : 'overflow-x-auto no-scrollbar';
  return (
    <div className={`flex gap-2 ${layout} ${className}`}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
            active === opt ? 'bg-brand text-brand-contrast' : 'bg-stone-100 text-stone-600'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
