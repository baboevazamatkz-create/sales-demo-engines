import { useRef, useState } from 'react';
import { ChefHat, Clock, MapPin, Star } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { formatPrice } from '@/lib/format';
import { plural } from '@/lib/plural';
import { StoriesBar } from './StoriesBar';
import type { CafeConfig, CafeMenuItem } from '../types';
import { asset } from '@/lib/asset';

export function HomeScreen({
  config,
  onSelectItem,
  onOpenStory,
  onOpenBuilder,
  onOpenCategory,
}: {
  config: CafeConfig;
  onSelectItem: (item: CafeMenuItem) => void;
  onOpenStory: (index: number) => void;
  onOpenBuilder?: () => void;
  onOpenCategory: (category: string) => void;
}) {
  const { business } = config;
  const stories = config.modules?.stories ?? [];
  const featured = config.items.filter((i) => i.featured);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const heroImage = business.heroImageUrl ?? featured[0]?.imageUrl;

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
      className="h-full overflow-y-auto no-scrollbar pb-32 bg-app"
    >
      {/* Hero с параллаксом */}
      <div className="relative h-[58vh] min-h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.35}px) scale(${1 + scrollY * 0.0006})` }}
        >
          <ProductImage src={heroImage} alt={business.name} className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-app" />
        <div className="ornament-turkish absolute inset-0 opacity-25 mix-blend-overlay" />

        <div className="relative h-full flex flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            {business.logoUrl && (
              <img
                src={asset(business.logoUrl)}
                alt={business.name}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-white/30 animate-fade-in"
              />
            )}
            {business.rating != null && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur text-white text-xs">
                <Star size={12} className="fill-accent text-accent" />
                {business.rating}
                {business.reviews != null && <span className="text-white/50">· {business.reviews}</span>}
              </span>
            )}
          </div>

          <div className="animate-fade-up">
            <h1 className="font-display text-[2.6rem] leading-[1.05] text-white tracking-tight text-balance">
              {business.name}
            </h1>
            {business.tagline && <p className="text-white/70 text-sm mt-2">{business.tagline}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-white/60">
              {business.etaLabel && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {business.etaLabel}
                </span>
              )}
              {business.address && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {business.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {stories.length > 0 && (
        <div className="-mt-2 pb-5">
          <StoriesBar stories={stories} onOpen={onOpenStory} />
        </div>
      )}

      {onOpenBuilder && config.modules?.builder && (
        <button
          onClick={onOpenBuilder}
          className="mx-5 mb-6 w-[calc(100%-2.5rem)] rounded-2xl overflow-hidden relative text-left"
        >
          <div className="foil animate-shimmer p-[1.5px] rounded-2xl">
            <div className="rounded-2xl bg-surface px-4 py-3.5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shrink-0">
                <ChefHat size={18} className="text-accent" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-main">{config.modules.builder.title}</span>
                {config.modules.builder.subtitle && (
                  <span className="block text-[11px] text-muted mt-0.5">{config.modules.builder.subtitle}</span>
                )}
              </span>
              <span className="text-accent text-lg">→</span>
            </div>
          </div>
        </button>
      )}

      {featured.length > 0 && (
        <section className="mb-7 relative">
          <h2 className="px-5 font-display text-lg text-main mb-3">Хиты</h2>
          {/* Затухание у правого края: показывает, что карусель листается,
              вместо того чтобы карточка выглядела просто обрезанной. */}
          <div className="pointer-events-none absolute right-0 bottom-0 top-10 w-10 bg-gradient-to-l from-app to-transparent z-10" />
          <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar snap-x-mandatory">
            {featured.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="snap-start shrink-0 w-[78%] max-w-[300px] rounded-2xl overflow-hidden bg-surface border border-line text-left"
              >
                <div className="relative h-[170px]">
                  <ProductImage src={item.imageUrl} alt={item.name} className="w-full h-full" />
                  {item.badge && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full foil text-[10px] font-bold text-brand uppercase tracking-wide">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-main leading-snug">{item.name}</div>
                  <div className="text-accent text-sm font-semibold mt-1.5">
                    {formatPrice(item.price, business.currency)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="px-5">
        <h2 className="font-display text-lg text-main mb-3">Категории</h2>
        <div className="grid grid-cols-2 gap-3">
          {config.categories.map((category) => {
            const cover = config.items.find((i) => i.category === category && i.imageUrl);
            const count = config.items.filter((i) => i.category === category).length;
            return (
              <button
                key={category}
                onClick={() => onOpenCategory(category)}
                className="relative h-28 rounded-2xl overflow-hidden text-left border border-line"
              >
                <ProductImage src={cover?.imageUrl} alt={category} className="absolute inset-0 w-full h-full" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                <span className="absolute bottom-2.5 left-3 right-3">
                  <span className="block text-sm font-semibold text-white leading-tight">{category}</span>
                  <span className="block text-[10px] text-white/65 mt-0.5">
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
