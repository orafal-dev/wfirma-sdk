export type WFirmaErrorDetails = {
  statusCode: number;
  code?: string;
  message?: string;
  rawBody?: string;
};

export class WFirmaError extends Error {
  readonly statusCode: number;
  readonly code?: string;
  readonly rawBody?: string;

  constructor(message: string, details: WFirmaErrorDetails) {
    super(message);
    this.name = "WFirmaError";
    this.statusCode = details.statusCode;
    this.code = details.code;
    this.rawBody = details.rawBody;
  }
}

export class WFirmaApiError extends WFirmaError {
  constructor(message: string, details: WFirmaErrorDetails) {
    super(message, details);
    this.name = "WFirmaApiError";
  }
}
