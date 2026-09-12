import { BackHeader } from '@/components/ui/BackHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatPrice } from '@/lib/format';
import { variantSummary, type RetailCartMeta } from './cartLine';
import type { RetailConfig } from './types';
import type { CartLine } from '@/hooks/useCart';

export function CartScreen({
  config,
  lines,
  total,
  onBack,
  onAdd,
  onRemove,
  onCheckout,
  shippingMethodId,
  setShippingMethodId,
}: {
  config: RetailConfig;
  lines: CartLine<RetailCartMeta>[];
  total: number;
  onBack: () => void;
  onAdd: (line: CartLine<RetailCartMeta>) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
  shippingMethodId: string;
  setShippingMethodId: (id: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <BackHeader title="Корзина" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {lines.length === 0 && <EmptyState label="Корзина пуста" />}
        {lines.map((line) => (
          <div key={line.key} className="flex items-center gap-3 py-2 border-b border-stone-100">
            <ProductImage src={line.meta.product.images[0]} alt={line.meta.product.name} className="w-12 h-12 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-stone-900 line-clamp-1">{line.meta.product.name}</div>
              {Object.keys(line.meta.selection).length > 0 && (
                <div className="text-xs text-stone-400">{variantSummary(line.meta.selection)}</div>
              )}
              <div className="text-xs text-stone-400">{formatPrice(line.meta.product.price, config.business.currency)}</div>
            </div>
            <QuantityStepper size="sm" qty={line.qty} onDecrease={() => onRemove(line.key)} onIncrease={() => onAdd(line)} />
          </div>
        ))}
      </div>

      {config.shippingMethods.length > 1 && (
        <div className="px-4 pb-2">
          <div className="text-xs text-stone-400 mb-2">Способ доставки</div>
          <div className="flex gap-2 flex-wrap">
            {config.shippingMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setShippingMethodId(m.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm border ${
                  shippingMethodId === m.id
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-stone-100">
        <div className="flex justify-between text-sm text-stone-500 mb-1">
          <span>Итого</span>
          <span className="text-stone-900 font-medium">{formatPrice(total, config.business.currency)}</span>
        </div>
        <button
          disabled={lines.length === 0}
          onClick={onCheckout}
          className="w-full bg-brand disabled:bg-stone-200 disabled:text-stone-400 text-brand-contrast rounded-2xl py-3.5 text-sm font-medium mt-2"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
