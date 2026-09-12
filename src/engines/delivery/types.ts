import type { BaseClientConfig } from '@/types/config';

export interface DeliveryMenuItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  weight?: string;
  imageUrl?: string;
}

export interface DeliveryTrackingStage {
  id: string;
  label: string;
  /** Shown under the label once this stage is reached, e.g. "Курьер выехал". */
  detail?: string;
}

export interface DeliveryConfig extends BaseClientConfig {
  niche: 'delivery';
  /** food | flowers | pharmacy | ... — purely cosmetic, drives copy defaults. */
  subNiche?: string;
  categories: string[];
  items: DeliveryMenuItem[];
  /** Ordered list of statuses the order confirmation screen walks through. */
  trackingStages: DeliveryTrackingStage[];
  /** Milliseconds between automatic stage advances in the demo (no real backend). */
  stageDurationMs?: number;
  paymentMethods?: string[];
}
