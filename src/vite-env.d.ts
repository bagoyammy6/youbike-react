/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cloudflare Worker 網址，例如 https://youbike-tdx-proxy.xxx.workers.dev */
  readonly VITE_API_BASE?: string;
  /** (選填) Mapbox public token；沒有就用 OpenStreetMap */
  readonly VITE_MAPBOX_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
