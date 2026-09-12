import { Gift, QrCode } from 'lucide-react';
import type { LoyaltyModule } from '../types';
import { asset } from '@/lib/asset';

export function LoyaltyScreen({
  loyalty,
  stamps,
  businessName,
  logoUrl,
}: {
  loyalty: LoyaltyModule;
  stamps: number;
  businessName: string;
  logoUrl?: string;
}) {
  const required = loyalty.stampsRequired;
  const earned = stamps % required;
  const rewardsReady = Math.floor(stamps / required);
  const left = required - earned;

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-app pb-28">
      <header className="px-5 pt-7 pb-4">
        <h1 className="font-display text-2xl text-main">{loyalty.title}</h1>
        {loyalty.subtitle && <p className="text-muted text-xs mt-1">{loyalty.subtitle}</p>}
      </header>

      {/* Карта */}
      <div className="mx-5 rounded-3xl overflow-hidden relative bg-brand p-5 animate-scale-in">
        <div className="ornament-turkish absolute inset-0 opacity-30" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-brand-soft text-[10px] uppercase tracking-[0.25em]">Карта гостя</div>
              <div className="font-display text-xl text-brand-contrast mt-1">{businessName}</div>
            </div>
            {logoUrl && <img src={asset(logoUrl)} alt="" className="w-11 h-11 rounded-full object-cover ring-1 ring-accent/40" />}
          </div>

          <div className="grid grid-cols-6 gap-2.5 mt-6">
            {Array.from({ length: required }).map((_, i) => {
              const filled = i < earned;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-full flex items-center justify-center border ${
                    filled ? 'foil border-transparent' : 'border-brand-soft/25 bg-black/15'
                  }`}
                  style={filled ? { animationDelay: `${i * 70}ms` } : undefined}
                >
                  {filled ? (
                    <span className="text-brand text-xs font-bold animate-stamp-in" style={{ animationDelay: `${i * 70}ms` }}>
                      ✦
                    </span>
                  ) : (
                    <span className="text-brand-soft/30 text-[10px]">{i + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-brand-contrast text-sm font-semibold">
                {left === required ? loyalty.rewardLabel : `Ещё ${left} — и ${loyalty.rewardLabel.toLowerCase()}`}
              </div>
              <div className="text-brand-soft/70 text-[11px] mt-0.5">
                Штампов всего: {stamps}
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-brand-contrast flex items-center justify-center">
              <QrCode size={34} className="text-brand" />
            </div>
          </div>
        </div>
      </div>

      {rewardsReady > 0 && (
        <div className="mx-5 mt-4 p-4 rounded-2xl border border-accent/40 bg-accent/10 flex items-center gap-3 animate-fade-up">
          <span className="w-10 h-10 rounded-full foil flex items-center justify-center shrink-0">
            <Gift size={18} className="text-brand" />
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-main">Награда готова</div>
            <div className="text-xs text-muted mt-0.5">
              {loyalty.rewardLabel} · доступно: {rewardsReady}
            </div>
          </div>
          <button className="px-4 py-2 rounded-full bg-brand text-brand-contrast text-xs font-semibold">
            Забрать
          </button>
        </div>
      )}

      <div className="mx-5 mt-6">
        <h2 className="text-main font-semibold text-sm mb-3">Как это работает</h2>
        <ol className="space-y-3">
          {[
            'Оформляете заказ в приложении — штамп начисляется автоматически.',
            `Собираете ${required} штампов на карте гостя.`,
            `Показываете QR-код на кассе и получаете ${loyalty.rewardLabel.toLowerCase()}.`,
          ].map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-surface-muted text-muted text-xs flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-xs text-muted leading-relaxed pt-1">{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
