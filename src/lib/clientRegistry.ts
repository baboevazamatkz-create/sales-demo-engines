import type { CafeConfig } from '@/engines/cafe-restaurant';
import type { RetailConfig } from '@/engines/retail';
import type { DeliveryConfig } from '@/engines/delivery';

export type AnyClientConfig = CafeConfig | RetailConfig | DeliveryConfig;

// Every real client lives directly under src/clients/<id>/config.json, one
// path segment deep, so this glob picks them up automatically and a new
// client folder needs zero code changes. Templates live one level deeper
// (src/clients/_templates/<niche>/config.json) and are intentionally out of
// this glob's reach, so they never show up as a selectable demo.
const modules = import.meta.glob('/src/clients/*/config.json', { eager: true }) as Record<
  string,
  { default: AnyClientConfig }
>;

// Стресс-фикстуры для break-ui: худшие реалистичные данные, пустой клиент и
// клиент ровно с одной позицией. Только в dev — в проде ветка сворачивается в
// пустой объект, и Rollup выбрасывает сами JSON из бандла.
const stressModules = import.meta.env.DEV
  ? (import.meta.glob('/src/dev/stress/*.json', { eager: true }) as Record<
      string,
      { default: AnyClientConfig }
    >)
  : {};

export const clientRegistry: Record<string, AnyClientConfig> = {};
for (const path in modules) {
  const config = modules[path].default;
  clientRegistry[config.clientId] = config;
}
for (const path in stressModules) {
  const config = stressModules[path].default;
  clientRegistry[config.clientId] = config;
}

/** Стресс-клиенты не должны попадать в галерею демо. */
const isStress = (id: string) => id.startsWith('stress-');

export function listClients(): AnyClientConfig[] {
  return Object.values(clientRegistry)
    .filter((c) => !isStress(c.clientId))
    .sort((a, b) => a.business.name.localeCompare(b.business.name, 'ru'));
}

export function getClient(id: string): AnyClientConfig | undefined {
  return clientRegistry[id];
}
