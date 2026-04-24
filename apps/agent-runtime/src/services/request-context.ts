import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { createLogger, type Logger } from "@taskora/core";

export interface RequestContext {
  requestId: string;
  logger: Logger;
}

declare module "fastify" {
  interface FastifyRequest {
    context: RequestContext;
  }
}

export function buildRequestContext(request: Pick<FastifyRequest, "headers">, baseLogger: Logger): RequestContext {
  const requestIdHeader = request.headers["x-request-id"];
  const requestId =
    typeof requestIdHeader === "string" && requestIdHeader.length > 0
      ? requestIdHeader
      : randomUUID();

  return {
    requestId,
    logger: baseLogger.child({ requestId })
  };
}

export function registerRequestContext(app: FastifyInstance, baseLogger = createLogger()): void {
  app.addHook("onRequest", (request, _reply, done) => {
    request.context = buildRequestContext(request, baseLogger);
    done();
  });
}
