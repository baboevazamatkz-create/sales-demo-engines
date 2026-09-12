import { asset } from '@/lib/asset';

/** Подменяет заголовок вкладки и фавикон на клиентские — чтобы ссылка,
 * отправленная клиенту, выглядела как его собственное приложение, а не как
 * чужой шаблон. */
export function applyBranding(name: string, logoUrl?: string) {
  document.title = name;
  const href = asset(logoUrl);
  if (!href) return;

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = href;
}
