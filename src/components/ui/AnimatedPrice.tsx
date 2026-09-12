import { useEffect, useRef, useState } from 'react';
import { formatPrice } from '@/lib/format';

/** Цена, которая «докручивается» до нового значения — заметная мелочь,
 * которая продаёт ощущение живого приложения в конструкторе и корзине. */
export function AnimatedPrice({
  value,
  currency,
  className = '',
}: {
  value: number;
  currency: string;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const frame = useRef<number>();
  const from = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const startValue = from.current;
    const delta = value - startValue;
    if (delta === 0) return;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 380);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(startValue + delta * eased));
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else from.current = value;
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      from.current = value;
    };
  }, [value]);

  return <span className={className}>{formatPrice(shown, currency)}</span>;
}
