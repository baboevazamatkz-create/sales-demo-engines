import { useEffect, useState } from 'react';
import { EngineHost } from '@/components/EngineHost';
import { Gallery } from '@/components/Gallery';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { getClient, listClients } from '@/lib/clientRegistry';
import { isStandalone } from '@/lib/platform';
import { applyBranding } from '@/lib/branding';
import { setupPwa } from '@/lib/pwa';
import { AppViewport } from '@/components/ui/AppViewport';

// A build-time-locked client (VITE_CLIENT=<id> npm run build) skips the
// gallery entirely and always boots straight into that client — this is
// what a native Capacitor build or a client-specific static deploy uses.
const LOCKED_CLIENT_ID = import.meta.env.VITE_CLIENT;

function readClientIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('client');
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(LOCKED_CLIENT_ID || readClientIdFromUrl());

  useEffect(() => {
    if (LOCKED_CLIENT_ID) return;
    const onPopState = () => setSelectedId(readClientIdFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const selectClient = (clientId: string) => {
    setSelectedId(clientId);
    if (!LOCKED_CLIENT_ID) {
      const url = new URL(window.location.href);
      url.searchParams.set('client', clientId);
      window.history.pushState({}, '', url);
    }
  };

  const backToGallery = () => {
    setSelectedId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('client');
    window.history.pushState({}, '', url);
  };

  const config = selectedId ? getClient(selectedId) : undefined;

  useEffect(() => {
    if (!config) return;
    applyBranding(config.business.name, config.business.logoUrl);
    setupPwa(config);
  }, [config]);

  if (!config) {
    return <Gallery clients={listClients()} onSelect={selectClient} />;
  }

  // Ссылка, которую отправляют клиенту (сборка под одного клиента), и
  // нативная обёртка Capacitor открываются во весь экран — без рамки,
  // чтобы это читалось как приложение, а не как страница с картинкой.
  // Рамка остаётся только в режиме галереи, когда демо просматривают
  // несколько штук подряд.
  const framed = !LOCKED_CLIENT_ID && !isStandalone();

  if (!framed) {
    return (
      <AppViewport>
        <EngineHost config={config} />
      </AppViewport>
    );
  }

  return (
    <PhoneFrame>
      <button
        onClick={backToGallery}
        className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-[11px] text-muted bg-surface/90 backdrop-blur px-3 py-1 rounded-full shadow"
      >
        ← Все демо
      </button>
      <EngineHost config={config} />
    </PhoneFrame>
  );
}
