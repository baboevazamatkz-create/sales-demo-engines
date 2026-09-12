import { ChevronLeft } from 'lucide-react';

export function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 pt-6 pb-4">
      <button onClick={onBack} aria-label="Назад" className="p-1">
        <ChevronLeft size={20} />
      </button>
      <h2 className="text-lg font-serif text-stone-900">{title}</h2>
    </div>
  );
}
