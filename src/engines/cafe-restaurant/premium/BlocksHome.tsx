import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { formatPrice } from '@/lib/format';
import { plural } from '@/lib/plural';
import { HeroStories } from './HeroStories';
import type { CafeConfig, CafeMenuItem, CafeStory } from '../types';

/**
 * Блочная вёрстка главной: вместо каруселей и списков — мозаика плиток,
 * крупный шрифт и плашки сплошного цвета. Включается style.layout: 'blocks'.
 */
export function BlocksHome({
  config,
  stamps,
  onSelectItem,
  onOpenStory,
  onStoryCta,
  onOpenBuilder,
  onOpenLoyalty,
  onOpenBooking,
  onOpenCategory,
}: {
  config: CafeConfig;
  stamps: number;
  onSelectItem: (item: CafeMenuItem) => void;
  onOpenStory: (index: number) => void;
  onStoryCta: (story: CafeStory) => void;
  onOpenBuilder?: () => void;
  onOpenLoyalty?: () => void;
  onOpenBooking?: () => void;
  onOpenCategory: (category: string) => void;
}) {
  const { business } = config;
  const stories = config.modules?.stories ?? [];
  const builder = config.modules?.builder;
  const loyalty = config.modules?.loyalty;
  const booking = config.modules?.booking;
  const [lead, ...restFeatured] = config.items.filter((i) => i.featured);

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-app pb-32 snap-y snap-proximity">
      {stories.length > 0 && (
        <HeroStories
          stories={stories}
          business={business}
          mood={config.theme.mood}
          onCta={onStoryCta}
          onExpand={onOpenStory}
        />
      )}

      {/* Плашка-заявление во всю ширину: часы и слоган крупно. */}
      <section className="snap-start bg-brand text-brand-contrast px-6 pt-10 pb-11">
        {(business.hoursLabel ?? business.etaLabel) && (
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-brand-soft">
            <Clock size={13} />
            {business.hoursLabel ?? business.etaLabel}
          </div>
        )}
        {business.tagline && (
          <h2 className="font-display text-[2.1rem] leading-[1.02] mt-5 text-balance">{business.tagline}</h2>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-brand-soft">
          {business.address && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {business.address}
            </span>
          )}
          {business.rating != null && (
            <span className="flex items-center gap-1.5">
              <Star size={13} className="fill-brand-soft" />
              {business.rating}
              {business.reviews != null && <span className="opacity-70">· {business.reviews}</span>}
            </span>
          )}
        </div>
      </section>

      <section className="snap-start px-4 pt-10 grid grid-cols-2 gap-3">
        {lead && (
          <button onClick={() => onSelectItem(lead)} className="col-span-2 relative h-60 overflow-hidden text-left">
            <ProductImage src={lead.imageUrl} alt={lead.name} className="absolute inset-0 w-full h-full" />
            <span className="absolute inset-x-0 bottom-0 bg-app px-4 py-3">
              <span className="block font-display text-[15px] leading-snug text-main">{lead.name}</span>
              <span className="block font-display text-[28px] leading-none text-brand mt-1.5">
                {formatPrice(lead.price, business.currency)}
              </span>
            </span>
            {lead.badge && (
              <span className="absolute top-3 left-3 bg-accent text-brand-contrast px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                {lead.badge}
              </span>
            )}
          </button>
        )}

        {builder && onOpenBuilder && (
          <button
            onClick={onOpenBuilder}
            className="aspect-square bg-accent text-brand-contrast p-4 flex flex-col justify-between text-left"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-85">Конструктор</span>
            <span>
              <span className="block font-display text-[21px] leading-[1.05]">{builder.title}</span>
              <ArrowRight size={20} className="mt-3" />
            </span>
          </button>
        )}

        {loyalty && onOpenLoyalty && (
          <button
            onClick={onOpenLoyalty}
            className="aspect-square bg-brand text-brand-contrast p-4 flex flex-col justify-between text-left"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-soft">Карта гостя</span>
            <span>
              <span className="block font-display text-[34px] leading-none">
                {Math.min(stamps, loyalty.stampsRequired)}
                <span className="text-brand-soft text-[20px]">/{loyalty.stampsRequired}</span>
              </span>
              <span className="block text-[12px] text-brand-soft mt-2">{loyalty.rewardLabel}</span>
            </span>
          </button>
        )}

        {config.categories.map((category) => {
          const cover = config.items.find((i) => i.category === category && i.imageUrl);
          const count = config.items.filter((i) => i.category === category).length;
          if (count === 0) return null;
          return (
            <button
              key={category}
              onClick={() => onOpenCategory(category)}
              className="relative aspect-square overflow-hidden text-left"
            >
              <ProductImage src={cover?.imageUrl} alt={category} className="absolute inset-0 w-full h-full" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3.5">
                <span className="block font-display text-[19px] leading-[1.08] text-white">{category}</span>
                <span className="block text-[11px] text-white/70 mt-1">
                  {count} {plural(count, 'позиция', 'позиции', 'позиций')}
                </span>
              </span>
            </button>
          );
        })}

        {restFeatured.map((item) => (
          <button key={item.id} onClick={() => onSelectItem(item)} className="relative aspect-square overflow-hidden text-left">
            <ProductImage src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full" />
            <span className="absolute inset-x-0 bottom-0 bg-app px-3 py-2.5">
              <span className="block text-[12px] leading-snug text-main line-clamp-2">{item.name}</span>
              <span className="block font-display text-[19px] leading-none text-brand mt-1.5">
                {formatPrice(item.price, business.currency)}
              </span>
            </span>
          </button>
        ))}

        {booking && onOpenBooking && (
          <button
            onClick={onOpenBooking}
            className="col-span-2 bg-surface-muted border border-line p-5 flex items-center justify-between text-left"
          >
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted">Бронь</span>
              <span className="block font-display text-[21px] leading-tight text-main mt-1.5">{booking.title}</span>
              {booking.subtitle && <span className="block text-[12px] text-muted mt-1.5">{booking.subtitle}</span>}
            </span>
            <ArrowRight size={22} className="text-brand shrink-0 ml-4" />
          </button>
        )}
      </section>
    </div>
  );
}
