import { Clock, MapPin, Star } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { formatPrice } from '@/lib/format';
import { plural } from '@/lib/plural';
import { HeroStories } from './HeroStories';
import type { CafeConfig, CafeMenuItem, CafeStory } from '../types';

/** Заголовок раздела в «журнальной» вёрстке: капитель с разрядкой. */
function Kicker({ children }: { children: string }) {
  return (
    <div className="text-center text-[10px] uppercase tracking-[0.4em] text-accent">{children}</div>
  );
}

/**
 * Главный экран «журнальной» вёрстки: вместо каруселей и сетки плиток —
 * один разворот с блюдом от шефа и разделы меню широкими полосами.
 */
export function EditorialHome({
  config,
  onSelectItem,
  onOpenStory,
  onStoryCta,
  onOpenBuilder,
  onOpenCategory,
}: {
  config: CafeConfig;
  onSelectItem: (item: CafeMenuItem) => void;
  onOpenStory: (index: number) => void;
  onStoryCta: (story: CafeStory) => void;
  onOpenBuilder?: () => void;
  onOpenCategory: (category: string) => void;
}) {
  const { business } = config;
  const stories = config.modules?.stories ?? [];
  const featured = config.items.filter((i) => i.featured);
  const [chef, ...rest] = featured;

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-app pb-32">
      {stories.length > 0 && (
        <HeroStories
          stories={stories}
          business={business}
          mood={config.theme.mood}
          variant="serif"
          onCta={onStoryCta}
          onExpand={onOpenStory}
        />
      )}

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-6 py-5 text-[11px] text-muted border-b border-line/60">
        {(business.hoursLabel ?? business.etaLabel) && (
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-accent" />
            {business.hoursLabel ?? business.etaLabel}
          </span>
        )}
        {business.rating != null && (
          <span className="flex items-center gap-1.5">
            <Star size={12} className="fill-accent text-accent" />
            <span className="text-main">{business.rating}</span>
          </span>
        )}
        {business.address && (
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin size={12} className="text-accent shrink-0" />
            <span className="truncate">{business.address}</span>
          </span>
        )}
      </div>

      {chef && (
        <section className="px-6 pt-8">
          <Kicker>Шеф рекомендует</Kicker>
          <button onClick={() => onSelectItem(chef)} className="w-full text-left mt-4 animate-fade-up">
            <ProductImage src={chef.imageUrl} alt={chef.name} className="w-full h-60 rounded-sm" />
            <h3 className="font-serif text-[1.6rem] leading-tight text-main mt-4 text-center text-balance">
              {chef.name}
            </h3>
            <p className="text-muted text-xs italic leading-relaxed mt-2 text-center">{chef.desc}</p>
            <div className="mt-3 text-center text-accent font-semibold">
              {formatPrice(chef.price, business.currency)}
            </div>
          </button>
        </section>
      )}

      {onOpenBuilder && config.modules?.builder && (
        <button
          onClick={onOpenBuilder}
          className="mx-6 mt-9 w-[calc(100%-3rem)] border border-accent/45 py-4 px-4 text-center hover:bg-accent/5 transition-colors"
        >
          <span className="block text-[10px] uppercase tracking-[0.34em] text-accent">
            {config.modules.builder.title}
          </span>
          {config.modules.builder.subtitle && (
            <span className="block font-serif text-base text-main mt-2">{config.modules.builder.subtitle}</span>
          )}
        </button>
      )}

      {rest.length > 0 && (
        <section className="mt-10">
          <Kicker>Ещё в меню</Kicker>
          <div className="mt-4 flex gap-4 px-6 overflow-x-auto no-scrollbar snap-x-mandatory">
            {rest.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="snap-start shrink-0 w-[62%] max-w-[230px] text-left"
              >
                <ProductImage src={item.imageUrl} alt={item.name} className="w-full h-36 rounded-sm" />
                <div className="font-serif text-[15px] leading-snug text-main mt-2.5">{item.name}</div>
                <div className="text-accent text-sm mt-1">{formatPrice(item.price, business.currency)}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-11">
        <Kicker>Разделы меню</Kicker>
        <div className="mt-4">
          {config.categories.map((category) => {
            const cover = config.items.find((i) => i.category === category && i.imageUrl);
            const count = config.items.filter((i) => i.category === category).length;
            if (count === 0) return null;
            return (
              <button
                key={category}
                onClick={() => onOpenCategory(category)}
                className="relative w-full h-[74px] border-t border-line/60 overflow-hidden block last:border-b"
              >
                {/* Без фото полосу не заливаем заглушкой: крупная буква на всю
                    ширину выглядела бы случайной. */}
                {cover && (
                  <>
                    <ProductImage src={cover.imageUrl} alt={category} className="absolute inset-0 w-full h-full" />
                    <span className="absolute inset-0 bg-gradient-to-r from-app via-app/85 to-app/25" />
                  </>
                )}
                <span className="relative h-full px-6 flex items-center justify-between">
                  <span className="font-serif text-lg text-main tracking-wide">{category}</span>
                  <span className="text-[11px] text-muted">
                    {count} {plural(count, 'позиция', 'позиции', 'позиций')}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
