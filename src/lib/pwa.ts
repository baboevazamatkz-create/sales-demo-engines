import type { BaseClientConfig } from '@/types/config';
import { asset } from '@/lib/asset';

/**
 * Делает из клиентской сборки устанавливаемое приложение: манифест
 * собирается прямо из конфига клиента, поэтому «Добавить на главный экран»
 * даёт иконку с его логотипом и запуск без браузерной обвязки.
 */
export function setupPwa(config: BaseClientConfig) {
  const { business, theme } = config;
  const icons = [
    { src: asset(`/clients/${config.clientId}/icon-192.png`)!, sizes: '192x192', type: 'image/png' },
    { src: asset(`/clients/${config.clientId}/icon-512.png`)!, sizes: '512x512', type: 'image/png' },
  ];

  const manifest = {
    name: business.name,
    short_name: business.name,
    description: business.tagline ?? business.name,
    start_url: window.location.pathname + window.location.search,
    // Область приложения — папка этой сборки, а не корень домена: на Pages
    // у каждого клиента свой подкаталог.
    scope: import.meta.env.BASE_URL || '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: theme.bg ?? (theme.mood === 'dark' ? '#120b0c' : '#ffffff'),
    theme_color: theme.primary,
    icons,
  };

  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
  setLink('manifest', URL.createObjectURL(blob));
  setLink('apple-touch-icon', icons[0].src);
  setMeta('theme-color', theme.primary);
}

function setLink(rel: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function setMeta(name: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}
