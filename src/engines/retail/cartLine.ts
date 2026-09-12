import type { RetailProduct } from './types';

export interface RetailCartMeta {
  product: RetailProduct;
  selection: Record<string, string>;
}

export function buildLineKey(productId: string, selection: Record<string, string>): string {
  const suffix = Object.keys(selection)
    .sort()
    .map((k) => `${k}=${selection[k]}`)
    .join('|');
  return suffix ? `${productId}::${suffix}` : productId;
}

export function variantSummary(selection: Record<string, string>): string {
  return Object.values(selection).join(' · ');
}
