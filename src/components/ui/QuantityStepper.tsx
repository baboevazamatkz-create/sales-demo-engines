import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({
  qty,
  onDecrease,
  onIncrease,
  size = 'md',
}: {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: 'sm' | 'md';
}) {
  const dims = size === 'sm' ? 'w-6 h-6' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 12 : 15;
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        aria-label="Уменьшить количество"
        className={`${dims} rounded-full border border-stone-200 flex items-center justify-center shrink-0`}
      >
        <Minus size={iconSize} />
      </button>
      <span className={size === 'sm' ? 'text-sm w-3 text-center' : 'text-base font-medium w-4 text-center'}>
        {qty}
      </span>
      <button
        onClick={onIncrease}
        aria-label="Увеличить количество"
        className={`${dims} rounded-full border border-stone-200 flex items-center justify-center shrink-0`}
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
