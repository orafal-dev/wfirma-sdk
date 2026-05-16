export { WFirmaClient } from "./client.js";
export type { WFirmaClientConfig } from "./client.types.js";

export { createApiKeysHeaders } from "./auth/api-keys.js";
export type {
  ApiKeysAuthHeaders,
  ApiKeysCredentials,
} from "./auth/api-keys.types.js";

export { WFirmaApiError, WFirmaError } from "./errors/wfirma-error.js";

export { buildXml, wrapResourcePayload } from "./xml/builder.js";
export {
  extractApiPayload,
  extractStatusCode,
  parseXml,
} from "./xml/parser.js";
export type { WFirmaXmlApiRoot } from "./xml/parser.js";

export type {
  DataFormat,
  FindParameters,
  WFirmaApiResponse,
  WFirmaQueryParams,
  WFirmaRequestOptions,
} from "./types/common.types.js";

export {
  createWFirmaModules,
  WFirmaModules,
} from "./modules/index.js";
export { InvoicesClient, createInvoicesClient } from "./modules/invoices.js";
export { ResourceClient } from "./modules/resource-client.js";
export {
  RESOURCE_DEFINITIONS,
  type ResourceAction,
  type ResourceDefinition,
  type ResourceName,
} from "./modules/resources.generated.js";
