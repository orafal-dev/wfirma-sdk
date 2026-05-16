import type { WFirmaClient } from "../client.js";
import type { WFirmaRequestOptions } from "../types/common.types.js";
import { ResourceClient } from "./resource-client.js";

export type InvoicesClientOptions = WFirmaRequestOptions;

export class InvoicesClient {
  private readonly resource: ResourceClient;

  constructor(client: WFirmaClient) {
    this.resource = new ResourceClient(client, {
      name: "invoices",
      singularName: "invoice",
      pluralName: "invoices",
      actions: {
        add: { method: "POST" },
        edit: { method: "POST" },
        delete: { method: "DELETE" },
        find: { method: "GET", wrapPayload: false },
        get: { method: "GET", wrapPayload: false },
        download: { method: "POST", wrapPayload: false },
        fiscalize: { method: "GET", wrapPayload: false },
        unfiscalize: { method: "GET", wrapPayload: false },
        send: { method: "POST", wrapPayload: false },
      },
    });
  }

  add<T = unknown>(data: Record<string, unknown>, options?: InvoicesClientOptions) {
    return this.resource.add<T>(data, options);
  }

  edit<T = unknown>(
    id: string | number,
    data: Record<string, unknown>,
    options?: InvoicesClientOptions,
  ) {
    return this.resource.edit<T>(id, data, options);
  }

  delete<T = unknown>(id: string | number, options?: InvoicesClientOptions) {
    return this.resource.delete<T>(id, options);
  }

  find<T = unknown>(options?: InvoicesClientOptions) {
    return this.resource.find<T>(undefined, options);
  }

  get<T = unknown>(id: string | number, options?: InvoicesClientOptions) {
    return this.resource.get<T>(id, options);
  }

  download<T = unknown>(id: string | number, options?: InvoicesClientOptions) {
    return this.resource.invoke<T>("download", { ...options, id });
  }

  fiscalize<T = unknown>(id: string | number, options?: InvoicesClientOptions) {
    return this.resource.invoke<T>("fiscalize", { ...options, id });
  }

  unfiscalize<T = unknown>(id: string | number, options?: InvoicesClientOptions) {
    return this.resource.invoke<T>("unfiscalize", { ...options, id });
  }

  send<T = unknown>(
    id: string | number,
    body?: Record<string, unknown>,
    options?: InvoicesClientOptions,
  ) {
    return this.resource.invoke<T>("send", { ...options, id, body });
  }
}

export const createInvoicesClient = (client: WFirmaClient): InvoicesClient =>
  new InvoicesClient(client);
