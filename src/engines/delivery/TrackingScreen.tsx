import { useEffect, useState } from 'react';
import { PackageCheck } from 'lucide-react';
import { ProgressTracker } from '@/components/ui/ProgressTracker';
import type { DeliveryConfig } from './types';

const DEFAULT_STAGE_MS = 4000;

export function TrackingScreen({ config, onDone }: { config: DeliveryConfig; onDone: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stages = config.trackingStages;
  const stageMs = config.stageDurationMs ?? DEFAULT_STAGE_MS;
  const isDelivered = activeIndex >= stages.length - 1;

  useEffect(() => {
    if (isDelivered) return;
    const timer = setTimeout(() => setActiveIndex((i) => Math.min(i + 1, stages.length - 1)), stageMs);
    return () => clearTimeout(timer);
  }, [activeIndex, isDelivered, stages.length, stageMs]);

  return (
    <div className="flex flex-col h-full px-6 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center mb-4">
          <PackageCheck size={28} className="text-brand" />
        </div>
        <h2 className="text-xl font-serif text-stone-900">
          {isDelivered ? 'Заказ доставлен' : 'Заказ принят'}
        </h2>
        <p className="text-stone-500 text-sm mt-1">{config.business.name}</p>
      </div>

      <div className="flex-1">
        <ProgressTracker stages={stages} activeIndex={activeIndex} />
      </div>

      {isDelivered && (
        <button onClick={onDone} className="text-brand text-sm font-medium border-b border-brand self-center">
          Вернуться в меню
        </button>
      )}
    </div>
  );
}
