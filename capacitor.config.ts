import type { CapacitorConfig } from '@capacitor/cli';

// appId/appName are placeholders — override per client build, e.g.:
//   CAPACITOR_APP_ID=com.agency.polynDemo CAPACITOR_APP_NAME="Полынь demo" npx cap sync
const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.salesdemo.engine',
  appName: process.env.CAPACITOR_APP_NAME || 'Sales Demo',
  webDir: process.env.CAPACITOR_WEB_DIR || 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
