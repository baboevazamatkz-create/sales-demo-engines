import { Clock, MapPin, ShoppingBag } from 'lucide-react';
import { ChipTabs } from '@/components/ui/ChipTabs';
import { ProductImage } from '@/components/ui/ProductImage';
import { StickyCTA } from '@/components/ui/StickyCTA';
import { formatPrice } from '@/lib/format';
import type { DeliveryConfig, DeliveryMenuItem } from './types';

export function MenuScreen({
  config,
  activeCategory,
  setActiveCategory,
  items,
  onSelectItem,
  cartCount,
  onOpenCart,
}: {
  config: DeliveryConfig;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  items: DeliveryMenuItem[];
  onSelectItem: (item: DeliveryMenuItem) => void;
  cartCount: number;
  onOpenCart: () => void;
}) {
  const { business } = config;
  return (
    <div className="flex flex-col h-full">
      <div className="bg-brand text-brand-contrast px-5 pt-7 pb-5 rounded-b-[1.75rem]">
        <div className="flex items-center gap-3">
          {business.logoUrl && (
            <img src={business.logoUrl} alt={business.name} className="w-10 h-10 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-serif">{business.name}</h1>
            {business.tagline && <p className="text-brand-soft text-sm mt-0.5">{business.tagline}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-brand-soft">
          {business.address && (
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {business.address}
            </span>
          )}
          {business.etaLabel && (
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {business.etaLabel}
            </span>
          )}
        </div>
      </div>

      <ChipTabs options={config.categories} active={activeCategory} onSelect={setActiveCategory} />

      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="w-full text-left flex gap-3 p-3 rounded-2xl border border-stone-100 hover:border-stone-200 hover:bg-stone-50 transition-colors"
          >
            <ProductImage src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-900 text-sm">{item.name}</div>
              <div className="text-stone-500 text-xs mt-0.5 line-clamp-2">{item.desc}</div>
              <div className="text-stone-900 text-sm font-medium mt-1.5">
                {formatPrice(item.price, business.currency)}
                {item.weight && <span className="text-stone-400 font-normal"> · {item.weight}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      {cartCount > 0 && (
        <StickyCTA
          floating
          onClick={onOpenCart}
          label="Открыть корзину"
          leading={
            <span className="flex items-center gap-2 text-sm font-medium">
              <ShoppingBag size={16} /> {cartCount} {cartCount === 1 ? 'товар' : 'товара'}
            </span>
          }
        />
      )}
    </div>
  );
}
