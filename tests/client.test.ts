import { describe, expect, it, mock } from "bun:test";
import { WFirmaClient } from "../src/client.js";

const credentials = {
  accessKey: "access",
  secretKey: "secret",
  appKey: "app",
};

describe("WFirmaClient", () => {
  it("sends API key headers and company_id query param", async () => {
    const fetchMock = mock(
      async (_url: string, _init?: RequestInit): Promise<Response> => {
        return new Response(
          `<api><status><code>OK</code></status><contractors></contractors></api>`,
          { status: 200 },
        );
      },
    );

    const client = new WFirmaClient({
      credentials,
      companyId: 42,
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.request("GET", "contractors/find");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstCall = fetchMock.mock.calls[0];
    if (!firstCall) {
      throw new Error("Expected fetch mock to be called");
    }
    const [url, init] = firstCall;
    expect(url).toContain("company_id=42");
    expect(url).toContain("outputFormat=xml");
    expect(init).toBeDefined();
    expect(init?.headers).toBeInstanceOf(Headers);
    const headers = init!.headers as Headers;
    expect(headers.get("accessKey")).toBe("access");
    expect(headers.get("secretKey")).toBe("secret");
    expect(headers.get("appKey")).toBe("app");
  });

  it("throws WFirmaApiError on non-OK API status code", async () => {
    const fetchMock = mock(
      async (_url: string, _init?: RequestInit): Promise<Response> => {
        return new Response(
          `<api><status><code>ERROR</code><message>Denied</message></status></api>`,
          { status: 200 },
        );
      },
    );

    const client = new WFirmaClient({
      credentials,
      fetch: fetchMock as unknown as typeof fetch,
    });

    await expect(client.request("GET", "contractors/find")).rejects.toMatchObject({
      name: "WFirmaApiError",
      code: "ERROR",
    });
  });
});
