import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { ProductImage } from '@/components/ui/ProductImage';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import type { CafeMenuItem } from '../types';

export function ItemSheet({
  item,
  currency,
  onClose,
  onAdd,
}: {
  item: CafeMenuItem | null;
  currency: string;
  onClose: () => void;
  onAdd: (item: CafeMenuItem, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);

  const close = () => {
    setQty(1);
    onClose();
  };

  return (
    <Sheet open={Boolean(item)} onClose={close}>
      {item && (
        <>
          <div className="h-52 shrink-0 relative">
            <ProductImage src={item.imageUrl} alt={item.name} className="w-full h-full" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
          </div>

          {/* Без отрицательного отступа: он затягивал первую строку заголовка
              под фото, и та обрезалась границей прокручиваемой области. */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-1 pb-2">
            <h2 className="font-display text-2xl text-main leading-tight text-balance">{item.name}</h2>
            {item.weight && <div className="text-muted text-xs mt-1.5">{item.weight}</div>}
            <p className="text-muted text-sm mt-3 leading-relaxed">{item.desc}</p>
          </div>

          <div className="p-5 pt-4 border-t border-line flex items-center gap-3">
            <div className="flex items-center gap-3 px-2 py-2 rounded-full bg-surface-muted">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Меньше"
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-main"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-main text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Больше"
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-main"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => {
                onAdd(item, qty);
                close();
              }}
              className="flex-1 h-12 rounded-full bg-brand text-brand-contrast text-sm font-semibold flex items-center justify-center gap-2"
            >
              В корзину
              <AnimatedPrice value={item.price * qty} currency={currency} className="text-accent" />
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}
