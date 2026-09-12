/** True when the app is running inside the Capacitor-wrapped native shell
 * rather than a plain browser tab. Capacitor injects `window.Capacitor` at
 * runtime, so this needs no import of @capacitor/core (kept out of the web
 * bundle for clients who only ever see the browser demo link). */
export function isStandalone(): boolean {
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}
