import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set empty turbopack config to acknowledge we're using webpack
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', 'tls' and other node modules in the client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'pino-pretty': false,
      };

      // Exclude test files and problematic dependencies
      config.module = {
        ...config.module,
        exprContextCritical: false,
      };
    }

    // Ignore test files and other non-source files
    config.module.rules.push({
      test: /node_modules\/.*\/(test|tests|__tests__|spec|__mocks__)\/.*\.(js|mjs|ts|tsx)$/,
      use: 'null-loader',
    });

    config.module.rules.push({
      test: /node_modules\/.*\.(md|markdown|yml|yaml|sh|zip|LICENSE|README)$/i,
      use: 'null-loader',
    });

    return config;
  },
};

export default nextConfig;
