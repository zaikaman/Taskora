export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: Record<string, unknown> | undefined;

  public constructor(
    code: string,
    message: string,
    options: {
      statusCode?: number;
      details?: Record<string, unknown>;
      cause?: unknown;
    } = {}
  ) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.statusCode = options.statusCode ?? 500;
    this.details = options.details;
  }
}

export interface SerializedError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export function serializeError(error: unknown): SerializedError {
  if (error instanceof AppError) {
    const serialized: SerializedError = {
      error: error.code,
      message: error.message,
      statusCode: error.statusCode
    };

    if (error.details) {
      serialized.details = error.details;
    }

    return serialized;
  }

  if (error instanceof Error) {
    return {
      error: "internal_error",
      message: error.message,
      statusCode: 500
    };
  }

  return {
    error: "internal_error",
    message: "Unknown error",
    statusCode: 500
  };
}
