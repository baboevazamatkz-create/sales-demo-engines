import type { AnyClientConfig } from '@/lib/clientRegistry';
import type { Niche } from '@/types/config';

const NICHE_LABELS: Record<Niche, string> = {
  'cafe-restaurant': 'Кафе / ресторан',
  retail: 'Магазин / ритейл',
  delivery: 'Доставка',
};

export function Gallery({ clients, onSelect }: { clients: AnyClientConfig[]; onSelect: (clientId: string) => void }) {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-serif text-stone-900 mb-1">Демо-движки продаж</h1>
        <p className="text-stone-500 text-sm mb-8">
          Выберите готовое демо, чтобы посмотреть флоу. Ссылка на конкретного клиента: добавьте <code>?client=id</code>{' '}
          к адресу.
        </p>
        <div className="space-y-3">
          {clients.map((c) => (
            <button
              key={c.clientId}
              onClick={() => onSelect(c.clientId)}
              className="w-full text-left flex items-center gap-3 p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-colors"
            >
              <div
                className="w-11 h-11 rounded-xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${c.theme.imageGradientFrom}, ${c.theme.imageGradientTo})` }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-stone-900 text-sm">{c.business.name}</div>
                <div className="text-stone-400 text-xs mt-0.5">{NICHE_LABELS[c.niche]}</div>
              </div>
              <div className="text-xs text-stone-400 shrink-0">{c.clientId}</div>
            </button>
          ))}
          {clients.length === 0 && <p className="text-stone-400 text-sm">Пока нет ни одного клиентского конфига.</p>}
        </div>
      </div>
    </div>
  );
}
