import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import type { CafeConfig } from '../types';

const STAGES = ['Принят', 'Готовим', 'Собираем', 'Готов'];

export function SuccessScreen({
  config,
  orderNumber,
  stampAwarded,
  onDone,
}: {
  config: CafeConfig;
  orderNumber: string;
  stampAwarded: boolean;
  onDone: () => void;
}) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length - 1) return;
    const timer = setTimeout(() => setStage((s) => s + 1), 2600);
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <div className="h-full flex flex-col bg-app overflow-hidden">
      <div className="relative pt-14 pb-8 px-6 text-center">
        <div className="ornament-turkish absolute inset-0 opacity-20" />
        <div className="relative">
          <div className="w-20 h-20 rounded-full foil mx-auto flex items-center justify-center animate-scale-in">
            <Check size={36} className="text-brand" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl text-main mt-5">Заказ принят</h2>
          <p className="text-muted text-sm mt-2">
            Заказ №{orderNumber} · {config.business.name}
            {config.business.etaLabel && ` · ${config.business.etaLabel}`}
          </p>
        </div>
      </div>

      <div className="px-8">
        <div className="flex items-center">
          {STAGES.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <span
                  className={`absolute right-1/2 top-3 h-0.5 w-full -translate-y-1/2 ${
                    i <= stage ? 'bg-accent' : 'bg-line'
                  }`}
                />
              )}
              <span
                className={`relative w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i <= stage ? 'foil text-brand' : 'bg-surface-muted text-muted'
                }`}
              >
                {i < stage ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>
              <span className={`text-[10px] mt-2 ${i <= stage ? 'text-main' : 'text-muted'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {stampAwarded && config.modules?.loyalty && (
        <div className="mx-5 mt-8 p-4 rounded-2xl bg-surface border border-accent/40 flex items-center gap-3 animate-fade-up">
          <span className="w-11 h-11 rounded-full foil flex items-center justify-center text-brand text-lg animate-stamp-in">
            ✦
          </span>
          <div>
            <div className="text-sm font-semibold text-main">+1 штамп на карту гостя</div>
            <div className="text-[11px] text-muted mt-0.5">{config.modules.loyalty.rewardLabel} ближе</div>
          </div>
        </div>
      )}

      <div className="flex-1" />

      <div className="px-5 pb-28">
        <button
          onClick={onDone}
          className="w-full h-12 rounded-full bg-surface border border-line text-main text-sm font-medium"
        >
          Вернуться в меню
        </button>
      </div>
    </div>
  );
}
