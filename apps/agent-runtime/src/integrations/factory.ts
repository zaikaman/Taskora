import { AppError } from "@taskora/core";
import { MockGensynAdapter, type GensynAdapter } from "@taskora/gensyn";
import { MockKeeperHubAdapter, type KeeperHubAdapter } from "@taskora/keeperhub";
import { MockOgAdapter, type OgAdapter } from "@taskora/og";
import type { RuntimeEnv } from "../config/env.js";

export interface RuntimeIntegrations {
  og: OgAdapter;
  gensyn: GensynAdapter;
  keeperhub: KeeperHubAdapter;
}

export function createRuntimeIntegrations(env: RuntimeEnv): RuntimeIntegrations {
  return {
    og: createOgAdapter(env),
    gensyn: createGensynAdapter(env),
    keeperhub: createKeeperHubAdapter(env)
  };
}

function createOgAdapter(env: RuntimeEnv): OgAdapter {
  if (env.OG_MODE === "mock") {
    return new MockOgAdapter();
  }

  throw new AppError("og_mode_not_supported", "Non-mock 0G adapters are not implemented yet.", {
    statusCode: 501
  });
}

function createGensynAdapter(env: RuntimeEnv): GensynAdapter {
  if (env.GENSYN_MODE === "mock") {
    return new MockGensynAdapter();
  }

  throw new AppError("gensyn_mode_not_supported", "Non-mock Gensyn adapters are not implemented yet.", {
    statusCode: 501
  });
}

function createKeeperHubAdapter(env: RuntimeEnv): KeeperHubAdapter {
  if (env.KEEPERHUB_MODE === "mock") {
    return new MockKeeperHubAdapter();
  }

  throw new AppError(
    "keeperhub_mode_not_supported",
    "Non-mock KeeperHub adapters are not implemented yet.",
    {
      statusCode: 501
    }
  );
}
