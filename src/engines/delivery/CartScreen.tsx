import { BackHeader } from '@/components/ui/BackHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatPrice } from '@/lib/format';
import type { DeliveryConfig, DeliveryMenuItem } from './types';

export function CartScreen({
  config,
  items,
  total,
  onBack,
  onAdd,
  onRemove,
  onCheckout,
}: {
  config: DeliveryConfig;
  items: (DeliveryMenuItem & { qty: number })[];
  total: number;
  onBack: () => void;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <BackHeader title="Корзина" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {items.length === 0 && <EmptyState label="Корзина пуста" />}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2 border-b border-stone-100">
            <ProductImage src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-stone-900">{item.name}</div>
              <div className="text-xs text-stone-400">{formatPrice(item.price, config.business.currency)}</div>
            </div>
            <QuantityStepper size="sm" qty={item.qty} onDecrease={() => onRemove(item.id)} onIncrease={() => onAdd(item.id)} />
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-stone-100">
        <div className="flex justify-between text-sm text-stone-500 mb-1">
          <span>Итого</span>
          <span className="text-stone-900 font-medium">{formatPrice(total, config.business.currency)}</span>
        </div>
        <button
          disabled={items.length === 0}
          onClick={onCheckout}
          className="w-full bg-brand disabled:bg-stone-200 disabled:text-stone-400 text-brand-contrast rounded-2xl py-3.5 text-sm font-medium mt-2"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
