import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Сколько живёт анимация ухода — столько же шторка остаётся в DOM. */
const EXIT_MS = 280;

/**
 * Выезжающая снизу шторка — как в нативных приложениях доставки.
 * Уходит тем же путём, которым пришла: до этого она въезжала анимацией,
 * а при закрытии просто исчезала из DOM.
 */
export function Sheet({
  open,
  onClose,
  children,
  fullHeight = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  fullHeight?: boolean;
}) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Кадр на то, чтобы браузер увидел закрытое состояние: без него
      // переход не запустится и шторка появится рывком.
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  const closed = shown ? undefined : '';

  return (
    <div className="absolute inset-0 z-40">
      <button
        aria-label="Закрыть"
        onClick={onClose}
        data-closed={closed}
        className="sheet-backdrop absolute inset-0 bg-black/60"
      />
      <div
        data-closed={closed}
        className={`sheet-panel absolute left-0 right-0 bottom-0 bg-surface rounded-t-[1.75rem] overflow-hidden ${
          fullHeight ? 'top-8' : 'max-h-[88%]'
        } flex flex-col`}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
