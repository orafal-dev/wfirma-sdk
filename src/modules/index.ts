import type { WFirmaClient } from "../client.js";
import { ResourceClient } from "./resource-client.js";
import {
  RESOURCE_DEFINITIONS,
  type ResourceName,
} from "./resources.generated.js";
import { InvoicesClient } from "./invoices.js";

export class WFirmaModules {
  readonly invoices: InvoicesClient;

  private readonly clients = new Map<ResourceName, ResourceClient>();

  constructor(private readonly client: WFirmaClient) {
    this.invoices = new InvoicesClient(client);
  }

  resource(name: ResourceName): ResourceClient {
    const existing = this.clients.get(name);
    if (existing) {
      return existing;
    }

    const definition = RESOURCE_DEFINITIONS[name];
    const resourceClient = new ResourceClient(this.client, definition);
    this.clients.set(name, resourceClient);
    return resourceClient;
  }
}

export const createWFirmaModules = (client: WFirmaClient): WFirmaModules =>
  new WFirmaModules(client);
