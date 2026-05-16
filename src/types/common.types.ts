export type DataFormat = "xml" | "json";

export type WFirmaQueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export type WFirmaRequestOptions = {
  companyId?: string | number;
  inputFormat?: DataFormat;
  outputFormat?: DataFormat;
  query?: WFirmaQueryParams;
  signal?: AbortSignal;
};

export type WFirmaApiResponse<T = unknown> = {
  status: {
    code: string;
    message?: string;
  };
  data: T;
  rawXml: string;
};

export type FindParameters = {
  conditions?: string;
  order?: string;
  page?: number;
  limit?: number;
  fields?: string[];
};
