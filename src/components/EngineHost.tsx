import { CafeRestaurantEngine } from '@/engines/cafe-restaurant';
import { RetailEngine } from '@/engines/retail';
import { DeliveryEngine } from '@/engines/delivery';
import type { AnyClientConfig } from '@/lib/clientRegistry';

/** Picks the right engine component for a config's niche. Adding a 4th
 * niche means adding one case here plus the engine module itself — nothing
 * else in the app needs to change. */
export function EngineHost({ config }: { config: AnyClientConfig }) {
  switch (config.niche) {
    case 'cafe-restaurant':
      return <CafeRestaurantEngine config={config} />;
    case 'retail':
      return <RetailEngine config={config} />;
    case 'delivery':
      return <DeliveryEngine config={config} />;
    default: {
      const _exhaustive: never = config;
      return _exhaustive;
    }
  }
}
