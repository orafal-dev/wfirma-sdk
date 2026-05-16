import type { DevEnv } from "./env.types.js";

const readEnv = (...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = Bun.env[key]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
};

export const loadDevEnv = (): DevEnv => {
  const accessKey = readEnv("ACCESS_KEY", "WFIRMA_ACCESS_KEY", "accessKey");
  const secretKey = readEnv("SECRET_KEY", "WFIRMA_SECRET_KEY", "secretKey");
  const appKey = readEnv("APP_KEY", "WFIRMA_APP_KEY", "appKey");
  const companyId = readEnv("COMPANY_ID", "WFIRMA_COMPANY_ID", "companyId");
  const baseUrl = readEnv("WFIRMA_BASE_URL", "BASE_URL");

  const missing: string[] = [];
  if (!accessKey) {
    missing.push("ACCESS_KEY");
  }
  if (!secretKey) {
    missing.push("SECRET_KEY");
  }
  if (!appKey) {
    missing.push("APP_KEY");
  }

  if (!accessKey || !secretKey || !appKey) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Copy .env.example to .env and fill in your wFirma API keys.",
    );
  }

  return {
    accessKey,
    secretKey,
    appKey,
    companyId,
    baseUrl,
  };
};
