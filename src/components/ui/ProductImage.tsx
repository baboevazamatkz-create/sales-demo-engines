import { asset } from '@/lib/asset';

/**
 * Фото позиции меню. Если фото у клиента ещё нет, вместо пустого градиента
 * рисуем плашку с первой буквой названия в фирменных цветах: карточка
 * выглядит как оформленная позиция меню, а не как незагрузившаяся картинка.
 */
export function ProductImage({
  src,
  alt,
  className = '',
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (src) {
    return <img src={asset(src)} alt={alt} className={`object-cover ${className}`} />;
  }

  const letter = alt.trim().charAt(0).toUpperCase();

  return (
    <div className={`relative bg-gradient-to-br from-img-from to-img-to ${className}`}>
      {letter && (
        <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 w-full h-full">
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="46"
            className="font-display fill-accent/40"
          >
            {letter}
          </text>
        </svg>
      )}
    </div>
  );
}
