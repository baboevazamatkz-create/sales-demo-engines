import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { CafeStory } from '../types';
import { asset } from '@/lib/asset';

/** Полноэкранный просмотрщик сторис с автопрогрессом и тапами по краям. */
export function StoryViewer({
  stories,
  startIndex,
  onClose,
  onCta,
}: {
  stories: CafeStory[];
  startIndex: number;
  onClose: () => void;
  onCta?: (story: CafeStory) => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const story = stories[index];

  useEffect(() => {
    setProgress(0);
    const started = performance.now();
    const duration = 5000;
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else if (index < stories.length - 1) setIndex((i) => i + 1);
      else onClose();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, stories.length, onClose]);

  if (!story) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black animate-fade-in">
      {/* Кадр показывается целиком (object-contain), а пустоту по краям
          закрывает размытая копия — иначе вертикальный экран срезает бока
          у квадратных промо-макетов вместе с текстом на них. */}
      <img
        src={asset(story.imageUrl)}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
      />
      <img src={asset(story.imageUrl)} alt={story.title} className="absolute inset-0 w-full h-full object-contain" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85" />

      <div className="absolute top-3 left-3 right-3 flex gap-1.5">
        {stories.map((s, i) => (
          <span key={s.id} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
            <span
              className="block h-full bg-white"
              style={{ width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%' }}
            />
          </span>
        ))}
      </div>

      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute top-7 right-3 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center"
      >
        <X size={16} />
      </button>

      <button
        aria-label="Назад"
        className="absolute left-0 top-16 bottom-24 w-1/3"
        onClick={() => (index > 0 ? setIndex(index - 1) : onClose())}
      />
      <button
        aria-label="Вперёд"
        className="absolute right-0 top-16 bottom-24 w-1/3"
        onClick={() => (index < stories.length - 1 ? setIndex(index + 1) : onClose())}
      />

      <div className="absolute left-0 right-0 bottom-0 p-6 pointer-events-none">
        {story.headline && (
          <h2 className="font-display text-2xl text-white leading-tight text-balance animate-fade-up">
            {story.headline}
          </h2>
        )}
        {story.text && <p className="text-white/75 text-sm mt-2 animate-fade-up">{story.text}</p>}
        {story.ctaLabel && onCta && (
          <button
            onClick={() => onCta(story)}
            className="pointer-events-auto mt-4 px-5 py-2.5 rounded-full foil text-brand text-sm font-semibold animate-fade-up"
          >
            {story.ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
