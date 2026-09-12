import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { ProductImage } from '@/components/ui/ProductImage';
import { formatPrice } from '@/lib/format';

export interface SimpleMenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  weight?: string;
  imageUrl?: string;
}

/** Shared by the cafe-restaurant and delivery engines — both sell simple
 * menu-style items (no variants), unlike retail's ProductScreen. */
export function ItemDetailScreen({
  item,
  currency,
  onBack,
  onAdd,
}: {
  item: SimpleMenuItem;
  currency: string;
  onBack: () => void;
  onAdd: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex flex-col h-full">
      <div className="h-48 relative">
        <ProductImage src={item.imageUrl} alt={item.name} className="w-full h-full" />
        <button onClick={onBack} className="absolute top-4 left-4 bg-white rounded-full p-2 shadow">
          <ChevronLeft size={18} />
        </button>
      </div>
      <div className="flex-1 px-5 py-5">
        <h2 className="text-xl font-serif text-stone-900">{item.name}</h2>
        <p className="text-stone-500 text-sm mt-2 leading-relaxed">{item.desc}</p>
        {item.weight && <div className="text-stone-400 text-xs mt-2">{item.weight}</div>}
        <div className="text-2xl font-medium text-stone-900 mt-5">{formatPrice(item.price, currency)}</div>

        <div className="mt-6">
          <QuantityStepper qty={qty} onDecrease={() => setQty((q) => Math.max(1, q - 1))} onIncrease={() => setQty((q) => q + 1)} />
        </div>
      </div>
      <div className="p-4">
        <button onClick={() => onAdd(qty)} className="w-full bg-brand text-brand-contrast rounded-2xl py-3.5 text-sm font-medium">
          Добавить · {formatPrice(item.price * qty, currency)}
        </button>
      </div>
    </div>
  );
}
