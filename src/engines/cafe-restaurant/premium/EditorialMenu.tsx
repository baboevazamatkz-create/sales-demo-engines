import { useEffect, useRef } from 'react';
import { ProductImage } from '@/components/ui/ProductImage';
import { formatPrice } from '@/lib/format';
import type { CafeConfig, CafeMenuItem } from '../types';

/**
 * «Журнальная» вёрстка меню: не карточки с фото, а печатное меню
 * ресторана — разделы с баннером, названия с отточием до цены и составом
 * курсивом. Включается style.layout: 'editorial'.
 */
export function EditorialMenu({
  config,
  activeCategory,
  onSelectItem,
}: {
  config: CafeConfig;
  /** Раздел, выбранный на главной: к нему подкручиваем страницу. */
  activeCategory?: string;
  onSelectItem: (item: CafeMenuItem) => void;
}) {
  const { business } = config;
  const currency = business.currency;
  const scrollRef = useRef<HTMLDivElement>(null);
  // На первом рендере раздел ещё никто не выбирал — показываем меню с шапки,
  // а не с середины.
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!activeCategory) return;
    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-category="${CSS.escape(activeCategory)}"]`);
    el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [activeCategory]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto no-scrollbar bg-app pb-32">
      <header className="px-6 pt-9 pb-7 text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-accent">{business.name}</div>
        <h1 className="font-serif text-[2rem] leading-tight text-main mt-2">Меню</h1>
        <div className="mx-auto mt-4 w-14 h-px bg-accent/50" />
      </header>

      {config.categories.map((category) => {
        const items = config.items.filter((i) => i.category === category);
        if (items.length === 0) return null;
        const cover = items.find((i) => i.imageUrl);

        return (
          <section key={category} data-category={category} className="mb-9 scroll-mt-2">
            {cover ? (
              <div className="relative h-28 mb-6 overflow-hidden">
                <ProductImage src={cover.imageUrl} alt={category} className="absolute inset-0 w-full h-full" />
                <span className="absolute inset-0 bg-black/55" />
                <h2 className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-white tracking-[0.08em]">
                  {category}
                </h2>
              </div>
            ) : (
              <h2 className="font-serif text-2xl text-main text-center mb-6 tracking-[0.08em]">{category}</h2>
            )}

            <div className="px-6 space-y-6">
              {items.map((item) => (
                <button key={item.id} onClick={() => onSelectItem(item)} className="w-full text-left block">
                  <span className="flex items-baseline gap-2">
                    <span className="font-serif text-[17px] leading-snug text-main">{item.name}</span>
                    {item.badge && (
                      <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-accent">{item.badge}</span>
                    )}
                    {/* Отточие как в печатном меню: тянется от названия к цене. */}
                    <span className="flex-1 border-b border-dotted border-line self-end mb-1.5 min-w-4" />
                    <span className="shrink-0 text-[15px] font-semibold text-accent tabular-nums">
                      {formatPrice(item.price, currency)}
                    </span>
                  </span>
                  {item.desc && (
                    <span className="block text-muted text-[12px] italic leading-relaxed mt-1 pr-10">{item.desc}</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        );
      })}

      <p className="px-6 pb-6 text-center text-[11px] text-muted">
        Если у вас есть аллергия или особые предпочтения — скажите официанту
      </p>
    </div>
  );
}
