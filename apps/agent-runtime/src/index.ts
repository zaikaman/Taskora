import Fastify from "fastify";
import { pathToFileURL } from "node:url";
import { createLogger, serializeError } from "@taskora/core";
import { parseRuntimeEnv } from "./config/env.js";
import { createRuntimeIntegrations } from "./integrations/factory.js";
import { registerRequestContext } from "./services/request-context.js";

export function buildRuntimeServer() {
  const env = parseRuntimeEnv();
  const logger = createLogger({ service: "agent-runtime" });
  const integrations = createRuntimeIntegrations(env);
  const app = Fastify({
    logger: true
  });

  registerRequestContext(app, logger);

  app.setErrorHandler((error, _request, reply) => {
    const serialized = serializeError(error);
    reply.status(serialized.statusCode).send(serialized);
  });

  app.get("/runtime/health", async () => {
    const [og, gensyn, keeperhub] = await Promise.all([
      integrations.og.healthCheck(),
      integrations.gensyn.healthCheck(),
      integrations.keeperhub.healthCheck()
    ]);

    return {
      status: "ok",
      version: process.env.npm_package_version ?? "0.1.0",
      adapters: {
        og,
        gensyn,
        keeperhub
      }
    };
  });

  return app;
}

const entryScript = process.argv[1];
const isEntrypoint = entryScript !== undefined && import.meta.url === pathToFileURL(entryScript).href;

if (isEntrypoint) {
  const app = buildRuntimeServer();
  const port = Number(process.env.PORT ?? 4001);

  app.listen({ host: "0.0.0.0", port }).catch((error) => {
    app.log.error(error);
    process.exitCode = 1;
  });
}
