import type { NextConfig } from "next";

interface WebpackConfigWithResolve {
  resolve: {
    extensionAlias?: Record<string, string[]>;
  };
}

const nextConfig: NextConfig = {
  typedRoutes: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    tsconfigPath: "tsconfig.next.json"
  },
  webpack(config: WebpackConfigWithResolve): WebpackConfigWithResolve {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"]
    };

    return config;
  }
};

export default nextConfig;
