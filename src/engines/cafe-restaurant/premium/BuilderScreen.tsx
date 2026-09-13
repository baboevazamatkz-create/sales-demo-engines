import { useMemo, useState } from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { formatPrice } from '@/lib/format';
import type { BuilderModule, BuilderStep } from '../types';

export interface BuiltItem {
  name: string;
  price: number;
  summary: string;
  imageUrl?: string;
}

type Selection = Record<string, string[]>;

function initialSelection(steps: BuilderStep[]): Selection {
  return Object.fromEntries(
    steps.map((step) => [step.id, step.type === 'single' ? [step.options[0].id] : []]),
  );
}

export function BuilderScreen({
  builder,
  currency,
  onAdd,
}: {
  builder: BuilderModule;
  currency: string;
  onAdd: (item: BuiltItem) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selection, setSelection] = useState<Selection>(() => initialSelection(builder.steps));

  const step = builder.steps[stepIndex];
  const isLast = stepIndex === builder.steps.length - 1;

  const total = useMemo(() => {
    let sum = builder.basePrice;
    for (const s of builder.steps) {
      for (const id of selection[s.id] ?? []) {
        sum += s.options.find((o) => o.id === id)?.price ?? 0;
      }
    }
    return sum;
  }, [builder, selection]);

  const chosenLabels = useMemo(
    () =>
      builder.steps.flatMap((s) =>
        (selection[s.id] ?? []).map((id) => s.options.find((o) => o.id === id)?.label ?? ''),
      ),
    [builder.steps, selection],
  );

  const toggle = (optionId: string) => {
    setSelection((prev) => {
      const current = prev[step.id] ?? [];
      if (step.type === 'single') return { ...prev, [step.id]: [optionId] };
      if (current.includes(optionId)) return { ...prev, [step.id]: current.filter((id) => id !== optionId) };
      if (step.max && current.length >= step.max) return prev;
      return { ...prev, [step.id]: [...current, optionId] };
    });
  };

  const canProceed = step.type === 'single' || (selection[step.id]?.length ?? 0) > 0 || step.type === 'multi';

  return (
    <div className="h-full flex flex-col bg-app">
      <header className="px-5 pt-7 pb-3">
        <h1 className="font-display text-2xl text-main">{builder.title}</h1>
        {builder.subtitle && <p className="text-muted text-xs mt-1">{builder.subtitle}</p>}
      </header>

      {/* Живое превью сборки. Высота не фиксируется: состав растёт по мере
          выбора, и обрезать его нельзя — это единственная сводка того, что
          человек собрал. */}
      <div className="mx-5 rounded-2xl overflow-hidden relative min-h-32 shrink-0 border border-line">
        <ProductImage src={builder.imageUrl} alt={builder.itemName} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/25" />
        <div className="relative p-4">
          <div className="text-white font-display text-lg leading-tight">{builder.itemName}</div>
          <div key={chosenLabels.join()} className="text-white/70 text-[11px] mt-1 leading-snug animate-fade-in">
            {chosenLabels.filter(Boolean).join(' · ') || 'Выберите, что положить'}
          </div>
          <AnimatedPrice value={total} currency={currency} className="block text-accent font-semibold text-base mt-2" />
        </div>
      </div>

      {/* Прогресс шагов */}
      <div className="flex gap-1.5 px-5 py-4 shrink-0">
        {builder.steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStepIndex(i)}
            className={`flex-1 h-1 rounded-full transition-colors ${
              i < stepIndex ? 'bg-accent' : i === stepIndex ? 'bg-accent/70' : 'bg-line'
            }`}
            aria-label={s.label}
          />
        ))}
      </div>

      <div key={step.id} className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28 animate-fade-up">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-main font-semibold">{step.label}</h2>
          <span className="text-muted text-[11px]">
            {step.hint ?? (step.type === 'multi' ? `можно несколько${step.max ? ` (до ${step.max})` : ''}` : 'выберите одно')}
          </span>
        </div>

        <div className="space-y-2.5">
          {step.options.map((option) => {
            const selected = (selection[step.id] ?? []).includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggle(option.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-colors ${
                  selected ? 'border-accent bg-accent/10' : 'border-line bg-surface'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    selected ? 'bg-accent border-accent' : 'border-line'
                  }`}
                >
                  {selected && <Check size={12} className="text-brand" strokeWidth={3} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-main">{option.label}</span>
                  {option.hint && <span className="block text-[11px] text-muted mt-0.5">{option.hint}</span>}
                </span>
                <span className={`text-xs shrink-0 ${option.price > 0 ? 'text-accent' : 'text-muted'}`}>
                  {option.price > 0 ? `+${formatPrice(option.price, currency)}` : 'включено'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-[74px] left-0 right-0 px-5 pb-3 pt-3 bg-gradient-to-t from-app via-app to-transparent">
        <div className="flex gap-2.5">
          {stepIndex > 0 && (
            <button
              onClick={() => setStepIndex((i) => i - 1)}
              aria-label="Назад"
              className="w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center text-main"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <button
            disabled={!canProceed}
            onClick={() => {
              if (!isLast) {
                setStepIndex((i) => i + 1);
                return;
              }
              onAdd({
                name: builder.itemName,
                price: total,
                summary: chosenLabels.filter(Boolean).join(' · '),
                imageUrl: builder.imageUrl,
              });
              setStepIndex(0);
              setSelection(initialSelection(builder.steps));
            }}
            className="flex-1 h-12 rounded-full bg-brand text-brand-contrast text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLast ? (
              <>
                В корзину
                <AnimatedPrice value={total} currency={currency} className="text-accent" />
              </>
            ) : (
              'Далее'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
