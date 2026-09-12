import { Star } from 'lucide-react';
import type { CafeConfig } from './types';

export function SuccessScreen({ config, onDone }: { config: CafeConfig; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center mb-5">
        <Star size={28} className="text-brand fill-brand" />
      </div>
      <h2 className="text-xl font-serif text-stone-900">Заказ принят</h2>
      <p className="text-stone-500 text-sm mt-2">
        {config.business.name} готовит ваш заказ.
        {config.business.etaLabel && ` Ориентировочное время: ${config.business.etaLabel}.`}
      </p>
      <button onClick={onDone} className="mt-8 text-brand text-sm font-medium border-b border-brand">
        Вернуться в меню
      </button>
    </div>
  );
}
