/**
 * Переключатель фикстур для break-ui: показывает тот же экран на нормальных
 * и на худших данных. Только для разработки — в проде компонент не
 * рендерится и стресс-конфиги в бандл не попадают.
 */
const STATES: { id: string; label: string }[] = [
  { id: 'cafe-main', label: 'Демо' },
  { id: 'stress-cards', label: 'Худшее · cards' },
  { id: 'stress-editorial', label: 'Худшее · editorial' },
  { id: 'stress-blocks', label: 'Худшее · blocks' },
  { id: 'stress-empty', label: 'Пусто' },
  { id: 'stress-one', label: 'Одна позиция' },
];

export function StressSwitch({ active, onSelect }: { active: string | null; onSelect: (id: string) => void }) {
  if (!import.meta.env.DEV) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        gap: 2,
        padding: 3,
        borderRadius: 999,
        background: '#e5e5e5',
        boxShadow: '0 2px 10px rgba(0,0,0,.18)',
        font: '11px/1 -apple-system, system-ui, sans-serif',
      }}
    >
      {STATES.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          style={{
            padding: '6px 10px',
            borderRadius: 999,
            border: 0,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            background: active === s.id ? '#fff' : 'transparent',
            color: '#111',
            fontWeight: active === s.id ? 600 : 400,
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
