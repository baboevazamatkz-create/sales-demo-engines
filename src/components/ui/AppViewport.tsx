import type { ReactNode } from 'react';

/**
 * Полноэкранный контейнер клиентской сборки: приложение занимает весь
 * экран без рамок и полей, как нативное. На широком экране контент
 * держится колонкой по центру, но фон растекается до краёв — чтобы это
 * читалось как одно приложение, а не как карточка на веб-странице.
 */
export function AppViewport({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-app overflow-hidden">
      <div className="relative h-full w-full max-w-[480px] mx-auto overflow-hidden">{children}</div>
    </div>
  );
}
