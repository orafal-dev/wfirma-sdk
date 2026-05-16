import type { ApiKeysCredentials } from "./auth/api-keys.types.js";
import type { DataFormat } from "./types/common.types.js";

export type WFirmaClientConfig = {
  /** API base URL. Default: https://api2.wfirma.pl */
  baseUrl?: string;
  credentials: ApiKeysCredentials;
  /** Default company id appended as `company_id` query param when set */
  companyId?: string | number;
  inputFormat?: DataFormat;
  outputFormat?: DataFormat;
  fetch?: typeof fetch;
};
