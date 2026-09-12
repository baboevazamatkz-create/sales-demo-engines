import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { formatPrice } from '@/lib/format';
import type { CartLine } from '@/hooks/useCart';
import type { CafeConfig } from '../types';
import type { CafeCartMeta } from './cartLine';
import { ORDER_MODE_LABELS, type OrderMode } from '../orderModes';

export function CartScreen({
  config,
  lines,
  total,
  onAdd,
  onRemove,
  onCheckout,
  orderMode,
  setOrderMode,
  availableModes,
}: {
  config: CafeConfig;
  lines: CartLine<CafeCartMeta>[];
  total: number;
  onAdd: (line: CartLine<CafeCartMeta>) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
  orderMode: OrderMode;
  setOrderMode: (mode: OrderMode) => void;
  availableModes: OrderMode[];
}) {
  const currency = config.business.currency;

  return (
    <div className="h-full flex flex-col bg-app">
      <header className="px-5 pt-7 pb-4">
        <h1 className="font-display text-2xl text-main">Корзина</h1>
      </header>

      {availableModes.length > 1 && (
        <div className="flex gap-2 px-5 pb-4">
          {availableModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setOrderMode(mode)}
              className={`flex-1 py-2.5 rounded-xl text-xs border transition-colors ${
                mode === orderMode
                  ? 'bg-brand text-brand-contrast border-transparent'
                  : 'bg-surface text-muted border-line'
              }`}
            >
              {ORDER_MODE_LABELS[mode]}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-48 space-y-3">
        {lines.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <span className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-muted" />
            </span>
            <p className="text-muted text-sm">Пока пусто — самое время выбрать донер</p>
          </div>
        )}

        {lines.map((line) => (
          <div key={line.key} className="flex gap-3 p-3 rounded-2xl bg-surface border border-line animate-fade-up">
            <ProductImage src={line.meta.imageUrl} alt={line.meta.name} className="w-16 h-16 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-main leading-snug">{line.meta.name}</div>
              {/* Состав собранного блюда показывается целиком: это главное,
                  что человек хочет перепроверить перед оплатой. */}
              {line.meta.summary && (
                <div className="text-[11px] text-muted mt-0.5 leading-snug">{line.meta.summary}</div>
              )}
              <div className="text-accent text-sm font-semibold mt-1.5">
                {formatPrice(line.meta.price * line.qty, currency)}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1.5">
              <button
                onClick={() => onAdd(line)}
                aria-label="Больше"
                className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-main"
              >
                <Plus size={13} />
              </button>
              <span className="text-main text-sm font-semibold">{line.qty}</span>
              <button
                onClick={() => onRemove(line.key)}
                aria-label="Меньше"
                className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-main"
              >
                <Minus size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {lines.length > 0 && (
        <div className="absolute bottom-[74px] left-0 right-0 px-5 pb-3 pt-4 bg-gradient-to-t from-app via-app to-transparent">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-sm">Итого</span>
            <AnimatedPrice value={total} currency={currency} className="text-main text-lg font-semibold" />
          </div>
          <button
            onClick={onCheckout}
            className="w-full h-12 rounded-full bg-brand text-brand-contrast text-sm font-semibold"
          >
            Оформить заказ
          </button>
        </div>
      )}
    </div>
  );
}
