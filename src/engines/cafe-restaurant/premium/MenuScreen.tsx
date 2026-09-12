import { useEffect, useRef } from 'react';
import { ProductImage } from '@/components/ui/ProductImage';
import { formatPrice } from '@/lib/format';
import type { CafeConfig, CafeMenuItem } from '../types';

export function MenuScreen({
  config,
  activeCategory,
  setActiveCategory,
  onSelectItem,
}: {
  config: CafeConfig;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  onSelectItem: (item: CafeMenuItem) => void;
}) {
  const items = config.items.filter((i) => i.category === activeCategory);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Активная категория может прийти с главного экрана — подкручиваем ленту к ней.
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeCategory]);

  return (
    <div className="h-full flex flex-col bg-app">
      <header className="px-5 pt-7 pb-3">
        <h1 className="font-display text-2xl text-main">Меню</h1>
      </header>

      {/* Категории переносятся, а не уезжают в горизонтальный скролл:
          иначе последняя всегда срезана краем экрана. */}
      <div ref={tabsRef} className="flex flex-wrap gap-2 px-5 pb-4">
        {config.categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              data-active={isActive}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-brand text-brand-contrast border-transparent'
                  : 'bg-surface text-muted border-line'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28 space-y-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            style={{ animationDelay: `${i * 45}ms` }}
            className="w-full text-left flex gap-3.5 p-3 rounded-2xl bg-surface border border-line animate-fade-up"
          >
            <ProductImage src={item.imageUrl} alt={item.name} className="w-[88px] h-[88px] rounded-xl shrink-0" />
            <div className="flex-1 min-w-0 py-0.5">
              <div className="flex items-start gap-2">
                <span className="font-medium text-main text-sm leading-snug">{item.name}</span>
                {item.badge && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-accent/15 text-accent text-[9px] font-bold uppercase tracking-wide">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-muted text-xs mt-1 line-clamp-3 leading-relaxed">{item.desc}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-main text-sm font-semibold">{formatPrice(item.price, config.business.currency)}</span>
                {item.weight && <span className="text-muted text-[11px]">{item.weight}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
