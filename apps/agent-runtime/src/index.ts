import Fastify from "fastify";
import { pathToFileURL } from "node:url";

export function buildRuntimeServer() {
  const app = Fastify({
    logger: true
  });

  app.get("/runtime/health", () => ({
    status: "ok",
    version: process.env.npm_package_version ?? "0.1.0",
    adapters: {
      og: process.env.OG_MODE ?? "mock",
      gensyn: process.env.GENSYN_MODE ?? "mock",
      keeperhub: process.env.KEEPERHUB_MODE ?? "mock"
    }
  }));

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
