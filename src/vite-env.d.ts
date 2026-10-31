/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_FORM_URL?: string;
  readonly VITE_BKASH_MERCHANT_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
