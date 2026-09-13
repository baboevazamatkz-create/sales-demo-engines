import { useState } from 'react';
import { Check, Minus, Plus, Users } from 'lucide-react';
import type { BookingModule, BookingTable } from '../types';

const DAYS = ['Сегодня', 'Завтра', 'Послезавтра'];

export function BookingScreen({ booking, businessName }: { booking: BookingModule; businessName: string }) {
  const [zoneId, setZoneId] = useState(booking.zones[0]?.id ?? '');
  const [tableId, setTableId] = useState<string | null>(null);
  const [day, setDay] = useState(DAYS[0]);
  const [time, setTime] = useState(booking.timeSlots[0]);
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  const zone = booking.zones.find((z) => z.id === zoneId);
  const table = zone?.tables.find((t) => t.id === tableId);

  if (confirmed && table) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center bg-app">
        <div className="w-20 h-20 rounded-full foil flex items-center justify-center mb-6 animate-scale-in">
          <Check size={34} className="text-brand" strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-2xl text-main">Стол забронирован</h2>
        <p className="text-muted text-sm mt-3 leading-relaxed">
          {businessName} ждёт вас: {table.label}, {day.toLowerCase()} в {time}, гостей — {guests}.
        </p>
        <div className="mt-6 px-5 py-3 rounded-2xl bg-surface border border-line">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Код брони</div>
          <div className="font-display text-xl text-accent mt-1">
            BR-{table.id.toUpperCase()}-{time.replace(':', '')}
          </div>
        </div>
        <button
          onClick={() => {
            setConfirmed(false);
            setTableId(null);
          }}
          className="mt-8 text-accent text-sm font-medium border-b border-accent/50"
        >
          Забронировать ещё
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-app pb-40">
      <header className="px-5 pt-7 pb-4">
        <h1 className="font-display text-2xl text-main">{booking.title}</h1>
        {booking.subtitle && <p className="text-muted text-xs mt-1">{booking.subtitle}</p>}
      </header>

      {/* Зоны */}
      <div className="flex flex-wrap gap-2 px-5 pb-4">
        {booking.zones.map((z) => (
          <button
            key={z.id}
            onClick={() => {
              setZoneId(z.id);
              setTableId(null);
            }}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${
              z.id === zoneId ? 'bg-brand text-brand-contrast border-transparent' : 'bg-surface text-muted border-line'
            }`}
          >
            {z.name}
          </button>
        ))}
      </div>

      {/* Схема зала */}
      {zone && (
        <div className="mx-5 p-4 rounded-2xl bg-surface border border-line">
          {zone.hint && <div className="text-[11px] text-muted mb-3">{zone.hint}</div>}
          <div className="relative rounded-xl overflow-hidden p-3 bg-surface-muted">
            <div className="ornament absolute inset-0 opacity-25" />
            <div className="relative grid grid-cols-4 gap-2.5">
              {zone.tables.map((t) => (
                <TableCell key={t.id} table={t} selected={t.id === tableId} onSelect={() => !t.busy && setTableId(t.id)} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-surface border border-line" /> свободно
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-accent" /> выбран
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-surface-muted border border-line opacity-50" /> занят
            </span>
          </div>
        </div>
      )}

      {/* Дата и время */}
      <div className="mx-5 mt-4 space-y-4">
        <div>
          <div className="text-main text-sm font-semibold mb-2.5">Когда</div>
          <div className="flex gap-2 mb-2.5">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`flex-1 py-2 rounded-xl text-xs border ${
                  d === day ? 'bg-brand text-brand-contrast border-transparent' : 'bg-surface text-muted border-line'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {booking.timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                className={`px-3.5 py-2 rounded-xl text-xs whitespace-nowrap border ${
                  slot === time ? 'bg-accent text-brand border-transparent font-semibold' : 'bg-surface text-muted border-line'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-main text-sm font-semibold mb-2.5">Гостей</div>
          <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-surface border border-line">
            <Users size={16} className="text-muted" />
            <span className="flex-1 text-main text-sm">{guests}</span>
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              aria-label="Меньше гостей"
              className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-main"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => setGuests((g) => Math.min(20, g + 1))}
              aria-label="Больше гостей"
              className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-main"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[74px] left-0 right-0 px-5 pb-3 pt-3 bg-gradient-to-t from-app via-app to-transparent">
        <button
          disabled={!table}
          onClick={() => setConfirmed(true)}
          className="w-full h-12 rounded-full bg-brand text-brand-contrast text-sm font-semibold disabled:opacity-40"
        >
          {table ? `Забронировать ${table.label} · ${time}` : 'Выберите стол на схеме'}
        </button>
      </div>
    </div>
  );
}

function TableCell({
  table,
  selected,
  onSelect,
}: {
  table: BookingTable;
  selected: boolean;
  onSelect: () => void;
}) {
  const base = 'relative rounded-lg flex flex-col items-center justify-center py-2.5 border text-[10px] transition-colors';
  const state = table.busy
    ? 'bg-surface-muted border-line opacity-45 cursor-not-allowed text-muted'
    : selected
      ? 'bg-accent border-transparent text-brand font-bold'
      : 'bg-surface border-line text-main';
  const shape = table.kind === 'vip' ? 'rounded-xl' : 'rounded-lg';

  return (
    <button disabled={table.busy} onClick={onSelect} className={`${base} ${state} ${shape}`}>
      {table.kind === 'vip' && (
        <span className={`text-[7px] uppercase tracking-wider ${selected ? 'text-brand/70' : 'text-accent'}`}>vip</span>
      )}
      <span className="font-semibold leading-tight">{table.label.replace(/^(Стол|Кабина)\s*/i, '')}</span>
      <span className={selected ? 'text-brand/70' : 'text-muted'}>{table.seats} мест</span>
    </button>
  );
}
