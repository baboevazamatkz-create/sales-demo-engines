import { useState } from 'react';
import { BackHeader } from '@/components/ui/BackHeader';
import { EditableRow } from '@/components/ui/EditableRow';
import { InfoRow } from '@/components/ui/InfoRow';
import { ChipTabs } from '@/components/ui/ChipTabs';
import { formatPrice } from '@/lib/format';
import type { RetailConfig } from './types';

const DEFAULT_PAYMENT_METHODS = ['Картой онлайн', 'Картой при получении', 'Наличными'];

export function CheckoutScreen({
  config,
  total,
  shippingMethodId,
  onBack,
  onConfirm,
}: {
  config: RetailConfig;
  total: number;
  shippingMethodId: string;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [address, setAddress] = useState('');
  const paymentMethods = config.paymentMethods?.length ? config.paymentMethods : DEFAULT_PAYMENT_METHODS;
  const [payment, setPayment] = useState(paymentMethods[0]);
  const shipping = config.shippingMethods.find((m) => m.id === shippingMethodId);

  return (
    <div className="flex flex-col h-full">
      <BackHeader title="Оформление" onBack={onBack} />
      <div className="flex-1 px-5 space-y-4 overflow-y-auto pb-4">
        <EditableRow label="Адрес доставки" value={address} onChange={setAddress} placeholder="Улица, дом, квартира" />

        {shipping && <InfoRow label="Доставка" value={shipping.etaLabel ? `${shipping.label} · ${shipping.etaLabel}` : shipping.label} />}

        <div className="bg-stone-50 rounded-2xl p-4">
          <div className="text-xs text-stone-400 mb-2">Оплата</div>
          <ChipTabs options={paymentMethods} active={payment} onSelect={setPayment} className="" wrap />
        </div>
      </div>
      <div className="p-4">
        <button onClick={onConfirm} className="w-full bg-brand text-brand-contrast rounded-2xl py-3.5 text-sm font-medium">
          Подтвердить · {formatPrice(total, config.business.currency)}
        </button>
      </div>
    </div>
  );
}
