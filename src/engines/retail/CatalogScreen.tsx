import { ShoppingBag } from 'lucide-react';
import { ChipTabs } from '@/components/ui/ChipTabs';
import { ProductImage } from '@/components/ui/ProductImage';
import { StickyCTA } from '@/components/ui/StickyCTA';
import { formatPrice } from '@/lib/format';
import type { RetailConfig, RetailProduct } from './types';
import { asset } from '@/lib/asset';

export function CatalogScreen({
  config,
  activeCategory,
  setActiveCategory,
  activeFilters,
  toggleFilter,
  items,
  onSelectProduct,
  cartCount,
  onOpenCart,
}: {
  config: RetailConfig;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  activeFilters: Set<string>;
  toggleFilter: (id: string) => void;
  items: RetailProduct[];
  onSelectProduct: (product: RetailProduct) => void;
  cartCount: number;
  onOpenCart: () => void;
}) {
  const { business } = config;
  return (
    <div className="flex flex-col h-full">
      <div className="bg-brand text-brand-contrast px-5 pt-7 pb-5 rounded-b-[1.75rem]">
        <div className="flex items-center gap-3">
          {business.logoUrl && (
            <img src={asset(business.logoUrl)} alt={business.name} className="w-10 h-10 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-serif">{business.name}</h1>
            {business.tagline && <p className="text-brand-soft text-sm mt-0.5">{business.tagline}</p>}
          </div>
        </div>
      </div>

      <ChipTabs options={config.categories} active={activeCategory} onSelect={setActiveCategory} />

      {config.filters && config.filters.length > 0 && (
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {config.filters.map((f) => (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
                activeFilters.has(f.id)
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-500 border-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-24 grid grid-cols-2 gap-3">
        {items.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="text-left rounded-2xl border border-stone-100 hover:border-stone-200 overflow-hidden flex flex-col"
          >
            <ProductImage src={product.images[0]} alt={product.name} className="w-full aspect-square" />
            <div className="p-2.5">
              <div className="text-xs font-medium text-stone-900 line-clamp-2">{product.name}</div>
              <div className="text-xs text-stone-500 mt-1">
                {product.variants?.length ? 'от ' : ''}
                {formatPrice(product.price, business.currency)}
              </div>
              {product.inStock === false && <div className="text-[10px] text-stone-400 mt-1">Нет в наличии</div>}
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
