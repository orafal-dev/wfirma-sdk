import { describe, expect, it } from "bun:test";
import { buildXml, wrapResourcePayload } from "../src/xml/builder.js";
import {
  extractApiPayload,
  extractStatusCode,
  parseXml,
  type WFirmaXmlApiRoot,
} from "../src/xml/parser.js";

describe("xml", () => {
  it("builds wrapped contractor payload", () => {
    const xml = buildXml(
      wrapResourcePayload("contractors", "contractor", {
        name: "Acme",
        nip: "5252525252",
      }),
    );

    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain("<contractors>");
    expect(xml).toContain("<contractor>");
    expect(xml).toContain("<name>Acme</name>");
  });

  it("parses api status and payload", () => {
    const parsed = parseXml<WFirmaXmlApiRoot>(`
      <api>
        <status><code>OK</code></status>
        <contractors>
          <contractor><id>1</id><name>Acme</name></contractor>
        </contractors>
      </api>
    `);

    expect(extractStatusCode(parsed)).toBe("OK");
    expect(extractApiPayload(parsed)).toEqual({
      contractor: { id: 1, name: "Acme" },
    });
  });
});
