import type { CafeConfig } from './types';

export type OrderMode = 'delivery' | 'pickup' | 'tableOrder';

export const ORDER_MODE_LABELS: Record<OrderMode, string> = {
  delivery: 'Доставка',
  pickup: 'Самовывоз',
  tableOrder: 'Заказ за столик',
};

export function getAvailableModes(features: CafeConfig['features']): OrderMode[] {
  const modes: OrderMode[] = [];
  if (features.delivery) modes.push('delivery');
  if (features.pickup) modes.push('pickup');
  if (features.tableOrder) modes.push('tableOrder');
  return modes;
}
