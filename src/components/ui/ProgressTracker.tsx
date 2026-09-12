import { Check } from 'lucide-react';

export function ProgressTracker({
  stages,
  activeIndex,
}: {
  stages: { id: string; label: string; detail?: string }[];
  activeIndex: number;
}) {
  return (
    <div className="space-y-0">
      {stages.map((stage, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        const isLast = i === stages.length - 1;
        return (
          <div key={stage.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  done || current ? 'bg-brand text-brand-contrast' : 'bg-stone-100 text-stone-400'
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              {!isLast && <div className={`w-0.5 flex-1 min-h-6 ${done ? 'bg-brand' : 'bg-stone-200'}`} />}
            </div>
            <div className="pb-6">
              <div className={`text-sm font-medium ${done || current ? 'text-stone-900' : 'text-stone-400'}`}>
                {stage.label}
              </div>
              {current && stage.detail && <div className="text-xs text-stone-500 mt-0.5">{stage.detail}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
