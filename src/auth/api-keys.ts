import type { ApiKeysAuthHeaders, ApiKeysCredentials } from "./api-keys.types.js";

export const createApiKeysHeaders = (
  credentials: ApiKeysCredentials,
): ApiKeysAuthHeaders => ({
  accessKey: credentials.accessKey,
  secretKey: credentials.secretKey,
  appKey: credentials.appKey,
});
