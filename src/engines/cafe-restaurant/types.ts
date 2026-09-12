import type { BaseClientConfig } from '@/types/config';

export interface CafeMenuItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  weight?: string;
  imageUrl?: string;
}

export interface CafeConfig extends BaseClientConfig {
  niche: 'cafe-restaurant';
  /** Which order modes this business offers; the flow adapts to whichever are on. */
  features: {
    delivery: boolean;
    pickup: boolean;
    tableOrder: boolean;
  };
  categories: string[];
  items: CafeMenuItem[];
  paymentMethods?: string[];
}
