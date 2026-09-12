import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export function BottomNav({
  items,
  active,
  onSelect,
}: {
  items: NavItem[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 bg-surface/70 backdrop-blur-xl border-t border-line/60 px-2 pt-2 pb-3">
      <div className="flex items-stretch">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex-1 flex flex-col items-center gap-1 py-1 relative"
            >
              <span className="relative">
                <Icon
                  size={20}
                  className={isActive ? 'text-accent' : 'text-muted'}
                  strokeWidth={isActive ? 2.2 : 1.7}
                />
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-accent text-[10px] font-semibold text-brand flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span className={`text-[10px] ${isActive ? 'text-main font-medium' : 'text-muted'}`}>
                {item.label}
              </span>
              {isActive && <span className="absolute -top-2 w-8 h-0.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
