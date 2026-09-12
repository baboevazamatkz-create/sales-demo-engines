/**
 * Пути к фото и логотипам в конфигах записаны от корня («/clients/x/logo.jpg»),
 * а сайт может жить в подпапке — на GitHub Pages у каждого клиента свой
 * подкаталог. Подставляем базовый путь сборки, иначе все картинки отдают 404.
 */
export function asset(path?: string): string | undefined {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  if (!path.startsWith('/')) return path;
  return `${base.replace(/\/$/, '')}${path}`;
}
