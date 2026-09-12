import { CheckCircle2 } from 'lucide-react';
import type { RetailConfig } from './types';

export function SuccessScreen({
  config,
  orderNumber,
  onDone,
}: {
  config: RetailConfig;
  orderNumber: string;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center mb-5">
        <CheckCircle2 size={28} className="text-brand" />
      </div>
      <h2 className="text-xl font-serif text-stone-900">Заказ принят</h2>
      <p className="text-stone-500 text-sm mt-2">
        Заказ №{orderNumber} оформлен. {config.business.name} свяжется с вами для подтверждения.
      </p>
      <button onClick={onDone} className="mt-8 text-brand text-sm font-medium border-b border-brand">
        Вернуться в каталог
      </button>
    </div>
  );
}
