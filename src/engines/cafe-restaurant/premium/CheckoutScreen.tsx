import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import type { CafeConfig } from '../types';
import { ORDER_MODE_LABELS, type OrderMode } from '../orderModes';

const DEFAULT_PAYMENT_METHODS = ['Картой при получении', 'Наличными', 'Онлайн'];

export function CheckoutScreen({
  config,
  total,
  orderMode,
  onBack,
  onConfirm,
}: {
  config: CafeConfig;
  total: number;
  orderMode: OrderMode;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [address, setAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [comment, setComment] = useState('');
  const paymentMethods = config.paymentMethods?.length ? config.paymentMethods : DEFAULT_PAYMENT_METHODS;
  const [payment, setPayment] = useState(paymentMethods[0]);

  return (
    <div className="h-full flex flex-col bg-app">
      <header className="flex items-center gap-3 px-5 pt-7 pb-4">
        <button onClick={onBack} aria-label="Назад" className="w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center text-main">
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-display text-2xl text-main">Оформление</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-40 space-y-4">
        <div className="px-4 py-3 rounded-2xl bg-surface border border-line">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Способ получения</div>
          <div className="text-main text-sm mt-1">{ORDER_MODE_LABELS[orderMode]}</div>
        </div>

        {orderMode === 'delivery' && (
          <Field label="Адрес доставки" value={address} onChange={setAddress} placeholder="Улица, дом, квартира" />
        )}
        {orderMode === 'pickup' && (
          <div className="px-4 py-3 rounded-2xl bg-surface border border-line">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Забрать по адресу</div>
            <div className="text-main text-sm mt-1">{config.business.address ?? '—'}</div>
          </div>
        )}
        {orderMode === 'tableOrder' && (
          <Field label="Номер столика" value={tableNumber} onChange={setTableNumber} placeholder="Например, 12" />
        )}

        <div className="px-4 py-3.5 rounded-2xl bg-surface border border-line">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-2.5">Оплата</div>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method}
                onClick={() => setPayment(method)}
                className={`px-3.5 py-2 rounded-xl text-xs border ${
                  method === payment
                    ? 'bg-accent text-brand border-transparent font-semibold'
                    : 'bg-surface-muted text-muted border-line'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <Field label="Комментарий" value={comment} onChange={setComment} placeholder="Без лука, побольше соуса…" />

        {config.business.etaLabel && (
          <div className="px-4 py-3 rounded-2xl bg-surface border border-line">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Время</div>
            <div className="text-main text-sm mt-1">{config.business.etaLabel}</div>
          </div>
        )}
      </div>

      <div className="absolute bottom-[74px] left-0 right-0 px-5 pb-3 pt-4 bg-gradient-to-t from-app via-app to-transparent">
        <button
          onClick={onConfirm}
          className="w-full h-12 rounded-full bg-brand text-brand-contrast text-sm font-semibold flex items-center justify-center gap-2"
        >
          Подтвердить заказ
          <AnimatedPrice value={total} currency={config.business.currency} className="text-accent" />
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block px-4 py-3 rounded-2xl bg-surface border border-line">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-main text-sm mt-1 outline-none placeholder:text-muted/50"
      />
    </label>
  );
}
