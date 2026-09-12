import { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatPrice } from '@/lib/format';
import type { RetailProduct } from './types';

export function ProductScreen({
  product,
  currency,
  onBack,
  onAdd,
}: {
  product: RetailProduct;
  currency: string;
  onBack: () => void;
  onAdd: (qty: number, selection: Record<string, string>) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.variants ?? []).map((g) => [g.label, g.options[0]])),
  );

  const missingSelection = useMemo(
    () => (product.variants ?? []).some((g) => !selection[g.label]),
    [product.variants, selection],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="h-56 relative">
        <ProductImage src={product.images[activeImage]} alt={product.name} className="w-full h-full" />
        <button onClick={onBack} className="absolute top-4 left-4 bg-white rounded-full p-2 shadow">
          <ChevronLeft size={18} />
        </button>
      </div>

      {product.images.length > 1 && (
        <div className="flex gap-2 px-5 pt-3 overflow-x-auto no-scrollbar">
          {product.images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActiveImage(i)}
              className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 ${
                i === activeImage ? 'border-brand' : 'border-transparent'
              }`}
            >
              <ProductImage src={img} alt="" className="w-full h-full" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 px-5 py-5 overflow-y-auto">
        <h2 className="text-xl font-serif text-stone-900">{product.name}</h2>
        <p className="text-stone-500 text-sm mt-2 leading-relaxed">{product.desc}</p>
        <div className="text-2xl font-medium text-stone-900 mt-4">{formatPrice(product.price, currency)}</div>

        {(product.variants ?? []).map((group) => (
          <div key={group.label} className="mt-5">
            <div className="text-xs text-stone-400 mb-2">{group.label}</div>
            <div className="flex gap-2 flex-wrap">
              {group.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelection((s) => ({ ...s, [group.label]: opt }))}
                  className={`px-3.5 py-1.5 rounded-full text-sm border ${
                    selection[group.label] === opt
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6">
          <QuantityStepper qty={qty} onDecrease={() => setQty((q) => Math.max(1, q - 1))} onIncrease={() => setQty((q) => q + 1)} />
        </div>
      </div>
      <div className="p-4">
        <button
          disabled={missingSelection || product.inStock === false}
          onClick={() => onAdd(qty, selection)}
          className="w-full bg-brand disabled:bg-stone-200 disabled:text-stone-400 text-brand-contrast rounded-2xl py-3.5 text-sm font-medium"
        >
          {product.inStock === false ? 'Нет в наличии' : `Добавить · ${formatPrice(product.price * qty, currency)}`}
        </button>
      </div>
    </div>
  );
}
