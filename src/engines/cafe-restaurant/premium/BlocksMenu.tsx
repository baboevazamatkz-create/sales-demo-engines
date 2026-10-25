import { ProductImage } from '@/components/ui/ProductImage';
import { formatPrice } from '@/lib/format';
import { plural } from '@/lib/plural';
import type { CafeConfig, CafeMenuItem } from '../types';

/**
 * Блочное меню: раздел открывается плашкой сплошного цвета с крупным
 * заголовком, позиции идут мозаикой квадратных плиток с ценой крупно.
 */
export function BlocksMenu({
  config,
  onSelectItem,
}: {
  config: CafeConfig;
  onSelectItem: (item: CafeMenuItem) => void;
}) {
  const currency = config.business.currency;

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-app pb-32 snap-y snap-proximity">
      <header className="bg-brand text-brand-contrast px-6 pt-9 pb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-brand-soft">{config.business.name}</div>
        <h1 className="font-display text-[2.3rem] leading-none mt-3">Меню</h1>
      </header>

      {config.categories.map((category) => {
        const items = config.items.filter((i) => i.category === category);
        if (items.length === 0) return null;

        return (
          <section key={category} className="snap-start">
            <div className="px-6 pt-9 pb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-[1.7rem] leading-none text-main">{category}</h2>
              <span className="text-[11px] text-muted shrink-0">
                {items.length} {plural(items.length, 'позиция', 'позиции', 'позиций')}
              </span>
            </div>
            <div className="h-1 bg-accent mx-6" />

            <div className="px-4 pt-4 grid grid-cols-2 gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="relative aspect-[4/5] overflow-hidden text-left bg-surface-muted"
                >
                  <ProductImage src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full" />
                  {item.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-accent text-brand-contrast px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-app px-3 py-2.5">
                    <span className="block text-[12.5px] leading-snug text-main line-clamp-2">{item.name}</span>
                    <span className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="font-display text-[20px] leading-none text-brand">
                        {formatPrice(item.price, currency)}
                      </span>
                      {item.weight && <span className="text-[10px] text-muted">{item.weight}</span>}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
