/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT?: string;
  readonly VITE_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
