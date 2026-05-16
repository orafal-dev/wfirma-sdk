import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  trimValues: true,
});

export const parseXml = <T = unknown>(xml: string): T => {
  return parser.parse(xml) as T;
};

export type WFirmaXmlApiRoot = {
  api?: {
    status?: {
      code?: string | number;
      message?: string;
    };
    [key: string]: unknown;
  };
};

export const extractApiPayload = (parsed: WFirmaXmlApiRoot): unknown => {
  if (!parsed.api) {
    return parsed;
  }

  const { status: _status, ...rest } = parsed.api;
  const keys = Object.keys(rest);

  if (keys.length === 1) {
    return rest[keys[0]];
  }

  return rest;
};

export const extractStatusCode = (
  parsed: WFirmaXmlApiRoot,
): string | undefined => {
  const code = parsed.api?.status?.code;
  if (code === undefined || code === null) {
    return undefined;
  }
  return String(code);
};
