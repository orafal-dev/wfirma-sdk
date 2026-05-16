import XMLBuilder from "fast-xml-builder";

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  suppressEmptyNode: true,
});

export const buildXml = (payload: Record<string, unknown>): string => {
  const body = builder.build({ api: payload });
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`;
};

export const wrapResourcePayload = (
  resourceName: string,
  singularName: string,
  data: Record<string, unknown>,
): Record<string, unknown> => ({
  [resourceName]: {
    [singularName]: data,
  },
});
