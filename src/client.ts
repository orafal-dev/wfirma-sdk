import { createApiKeysHeaders } from "./auth/api-keys.js";
import type { WFirmaClientConfig } from "./client.types.js";
import { WFirmaApiError, WFirmaError } from "./errors/wfirma-error.js";
import type {
  DataFormat,
  WFirmaApiResponse,
  WFirmaRequestOptions,
} from "./types/common.types.js";
import { buildXml } from "./xml/builder.js";
import {
  extractApiPayload,
  extractStatusCode,
  parseXml,
  type WFirmaXmlApiRoot,
} from "./xml/parser.js";

const DEFAULT_BASE_URL = "https://api2.wfirma.pl";
const SUCCESS_STATUS_CODES = new Set(["OK", "200", "201"]);

export class WFirmaClient {
  readonly baseUrl: string;
  readonly companyId?: string | number;
  readonly inputFormat: DataFormat;
  readonly outputFormat: DataFormat;

  private readonly credentials: WFirmaClientConfig["credentials"];
  private readonly fetchImpl: typeof fetch;

  constructor(config: WFirmaClientConfig) {
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.credentials = config.credentials;
    this.companyId = config.companyId;
    this.inputFormat = config.inputFormat ?? "xml";
    this.outputFormat = config.outputFormat ?? "xml";
    this.fetchImpl = config.fetch ?? fetch;
  }

  async request<T = unknown>(
    method: string,
    path: string,
    options: WFirmaRequestOptions & {
      body?: Record<string, unknown> | string;
    } = {},
  ): Promise<WFirmaApiResponse<T>> {
    const url = this.buildUrl(path, options);
    const headers = this.buildHeaders(method, options.body);

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method,
        headers,
        body: this.serializeBody(options.body),
        signal: options.signal,
      });
    } catch (error) {
      throw new WFirmaError(
        error instanceof Error ? error.message : "Network request failed",
        { statusCode: 0 },
      );
    }

    const rawXml = await response.text();

    if (!response.ok) {
      throw new WFirmaApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        {
          statusCode: response.status,
          rawBody: rawXml,
        },
      );
    }

    const parsed = parseXml<WFirmaXmlApiRoot>(rawXml);
    const statusCode = extractStatusCode(parsed);

    if (statusCode && !SUCCESS_STATUS_CODES.has(statusCode)) {
      throw new WFirmaApiError(
        parsed.api?.status?.message ?? `API error: ${statusCode}`,
        {
          statusCode: response.status,
          code: statusCode,
          message: parsed.api?.status?.message,
          rawBody: rawXml,
        },
      );
    }

    return {
      status: {
        code: statusCode ?? "OK",
        message: parsed.api?.status?.message,
      },
      data: extractApiPayload(parsed) as T,
      rawXml,
    };
  }

  private buildUrl(path: string, options: WFirmaRequestOptions): string {
    const normalizedPath = path.replace(/^\//, "");
    const url = new URL(`${this.baseUrl}/${normalizedPath}`);

    const companyId = options.companyId ?? this.companyId;
    if (companyId !== undefined) {
      url.searchParams.set("company_id", String(companyId));
    }

    url.searchParams.set("inputFormat", options.inputFormat ?? this.inputFormat);
    url.searchParams.set(
      "outputFormat",
      options.outputFormat ?? this.outputFormat,
    );

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) {
          continue;
        }
        url.searchParams.set(key, String(value));
      }
    }

    return url.toString();
  }

  private buildHeaders(
    method: string,
    body?: Record<string, unknown> | string,
  ): Headers {
    const headers = new Headers(createApiKeysHeaders(this.credentials));

    if (body !== undefined && method !== "GET" && method !== "DELETE") {
      headers.set("Content-Type", "application/xml; charset=UTF-8");
    }

    return headers;
  }

  private serializeBody(
    body?: Record<string, unknown> | string,
  ): string | undefined {
    if (body === undefined) {
      return undefined;
    }

    if (typeof body === "string") {
      return body;
    }

    return buildXml(body);
  }
}
