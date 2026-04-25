/// <reference types="astro/client" />
/// <reference types="astro/client-react" />
/// <reference types="astro/client-jsx" />
declare namespace NodeJS {
  interface ProcessEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;
    readonly RESEND_API_KEY: string;
    readonly OWNER_EMAIL: string;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly RESEND_API_KEY: string;
  readonly OWNER_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
