import type { WFirmaClient } from "../client.js";
import type {
  FindParameters,
  WFirmaApiResponse,
  WFirmaRequestOptions,
} from "../types/common.types.js";
import { wrapResourcePayload } from "../xml/builder.js";
import type { ResourceAction, ResourceDefinition } from "./resources.generated.js";

export type ResourceClientOptions = WFirmaRequestOptions;

const buildFindQuery = (params?: FindParameters) => {
  if (!params) {
    return undefined;
  }

  const query: Record<string, string | number> = {};

  if (params.conditions) {
    query.conditions = params.conditions;
  }
  if (params.order) {
    query.order = params.order;
  }
  if (params.page !== undefined) {
    query.page = params.page;
  }
  if (params.limit !== undefined) {
    query.limit = params.limit;
  }
  if (params.fields?.length) {
    query.fields = params.fields.join(",");
  }

  return query;
};

export class ResourceClient {
  constructor(
    private readonly client: WFirmaClient,
    private readonly definition: ResourceDefinition,
  ) {}

  async invoke<T = unknown>(
    action: ResourceAction,
    options: ResourceClientOptions & {
      id?: string | number;
      body?: Record<string, unknown> | string;
      pathSuffix?: string;
    } = {},
  ): Promise<WFirmaApiResponse<T>> {
    const actionDef = this.definition.actions[action];
    if (!actionDef) {
      throw new Error(
        `Action "${action}" is not supported for resource "${this.definition.name}"`,
      );
    }

    let path = `${this.definition.name}/${action}`;
    if (options.id !== undefined) {
      path += `/${options.id}`;
    }
    if (options.pathSuffix) {
      path += options.pathSuffix;
    }

    let body = options.body;
    if (
      body &&
      typeof body === "object" &&
      actionDef.method !== "GET" &&
      actionDef.wrapPayload !== false
    ) {
      body = wrapResourcePayload(
        this.definition.pluralName,
        this.definition.singularName,
        body,
      );
    }

    return this.client.request<T>(actionDef.method, path, {
      ...options,
      body,
      query: {
        ...buildFindQuery(
          action === "find" ? (options as { find?: FindParameters }).find : undefined,
        ),
        ...options.query,
      },
    });
  }

  add<T = unknown>(
    data: Record<string, unknown>,
    options?: ResourceClientOptions,
  ) {
    return this.invoke<T>("add", { ...options, body: data });
  }

  edit<T = unknown>(
    id: string | number,
    data: Record<string, unknown>,
    options?: ResourceClientOptions,
  ) {
    return this.invoke<T>("edit", { ...options, id, body: data });
  }

  delete<T = unknown>(id: string | number, options?: ResourceClientOptions) {
    return this.invoke<T>("delete", { ...options, id });
  }

  find<T = unknown>(
    params?: FindParameters,
    options?: ResourceClientOptions,
  ) {
    return this.invoke<T>("find", {
      ...options,
      query: {
        ...buildFindQuery(params),
        ...options?.query,
      },
    });
  }

  get<T = unknown>(id: string | number, options?: ResourceClientOptions) {
    return this.invoke<T>("get", { ...options, id });
  }
}
