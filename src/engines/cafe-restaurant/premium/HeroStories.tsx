import { useEffect, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { asset } from '@/lib/asset';
import type { BusinessInfo } from '@/types/config';
import type { CafeStory } from '../types';

/** Сколько держится один кадр. */
const DURATION = 5200;

/**
 * Главный экран начинается не со статичного фото, а с ленты сторис: кадры
 * листаются сами, с заголовком и текстом поверх. Свайп и тап по краям —
 * как в инстаграме; палец, задержанный на экране, ставит показ на паузу.
 */
export function HeroStories({
  stories,
  business,
  onCta,
  onExpand,
}: {
  stories: CafeStory[];
  business: BusinessInfo;
  onCta?: (story: CafeStory) => void;
  onExpand?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  /** Квадратные и горизонтальные кадры показываем целиком на размытой
   *  подложке: это обычно промо-макеты с текстом, и обрезка по краям
   *  срезала бы у них надписи. Вертикальные фото кроем на весь экран. */
  const [contain, setContain] = useState<Record<string, boolean>>({});
  const progressRef = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const story = stories[index];
  const count = stories.length;

  const go = (next: number) => {
    if (count === 0) return;
    setIndex(((next % count) + count) % count);
  };

  useEffect(() => {
    progressRef.current = 0;
    setProgress(0);
  }, [index]);

  useEffect(() => {
    if (paused || count < 2) return;
    let raf = 0;
    const started = performance.now() - progressRef.current * DURATION;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / DURATION);
      progressRef.current = t;
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setIndex((i) => (i + 1) % count);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, paused, count]);

  const pointer = useRef({ x: 0, moved: false });

  if (!story) return null;

  const fitClass = contain[story.id] ? 'object-contain' : 'object-cover';

  return (
    <div ref={boxRef} className="relative h-[66vh] min-h-[440px] overflow-hidden bg-black select-none">
      {contain[story.id] && (
        <img
          src={asset(story.imageUrl)}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45"
        />
      )}
      <img
        key={story.id}
        src={asset(story.imageUrl)}
        alt={story.title}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (!img.naturalWidth) return;
          const wide = img.naturalWidth / img.naturalHeight > 0.95;
          setContain((prev) => (prev[story.id] === wide ? prev : { ...prev, [story.id]: wide }));
        }}
        className={`absolute inset-0 w-full h-full animate-fade-in ${fitClass}`}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/15 to-app" />
      {/* Отдельная затемняющая подложка снизу: на промо-макетах кадр сам
          по себе с крупным текстом, и заголовок сторис иначе тонет в нём. */}
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-app via-app/80 to-transparent" />
      <div className="ornament absolute inset-0 opacity-20 mix-blend-overlay" />

      {/* Полоски прогресса — сразу видно, что кадров несколько. */}
      <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-20">
        {stories.map((s, i) => (
          <span key={s.id} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
            <span
              className="block h-full bg-white rounded-full"
              style={{ width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%' }}
            />
          </span>
        ))}
      </div>

      <div className="absolute top-7 left-4 right-4 flex items-center gap-2.5 z-20">
        {business.logoUrl && (
          <img
            src={asset(business.logoUrl)}
            alt={business.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/30"
          />
        )}
        <span className="text-white text-[13px] font-semibold tracking-wide truncate">{business.name}</span>
        {onExpand && (
          <button
            onClick={() => onExpand(index)}
            aria-label="Открыть на весь экран"
            className="ml-auto shrink-0 w-8 h-8 rounded-full bg-black/35 backdrop-blur text-white flex items-center justify-center"
          >
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Слой жестов: свайп листает, тап по краю — назад/вперёд,
          удержание ставит на паузу. Лежит под текстом, чтобы кнопка
          действия оставалась кликабельной. */}
      <div
        className="absolute inset-0 z-10"
        onPointerDown={(e) => {
          pointer.current = { x: e.clientX, moved: false };
          setPaused(true);
        }}
        onPointerMove={(e) => {
          if (Math.abs(e.clientX - pointer.current.x) > 12) pointer.current.moved = true;
        }}
        onPointerCancel={() => setPaused(false)}
        onPointerUp={(e) => {
          setPaused(false);
          const dx = e.clientX - pointer.current.x;
          if (dx < -45) return go(index + 1);
          if (dx > 45) return go(index - 1);
          if (pointer.current.moved) return;
          const box = boxRef.current;
          if (!box) return;
          const x = e.clientX - box.getBoundingClientRect().left;
          go(x < box.clientWidth * 0.33 ? index - 1 : index + 1);
        }}
      />

      <div className="absolute left-0 right-0 bottom-0 p-5 pb-6 z-20 pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.28em] text-accent">{story.title}</span>
        <h2 className="font-display text-[1.7rem] leading-[1.12] text-white mt-2 text-balance">
          {story.headline ?? business.name}
        </h2>
        {story.text && <p className="text-white/75 text-sm leading-snug mt-2 line-clamp-3">{story.text}</p>}
        {story.ctaLabel && onCta && (
          <button
            onClick={() => onCta(story)}
            className="pointer-events-auto mt-4 px-5 py-2.5 rounded-full foil text-brand text-sm font-semibold"
          >
            {story.ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
