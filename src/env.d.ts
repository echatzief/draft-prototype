/// <reference types="astro/client" />
/// <reference types="astro/client-react" />
/// <reference types="astro/client-jsx" />
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_SUPABASE_PROJECT_ID: string;
    readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
    readonly VITE_SUPABASE_URL: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_ID: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}