import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback.fs = false;
    }

    // Modify the webpack configuration
    // config.plugins.push(
    //     // Ignore node-specific modules when bundling for the browser
    //     new webpack.IgnorePlugin({
    //       resourceRegExp: /^onnxruntime-node$|^node:/,
    //     })
    // );
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });


    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
};

export default nextConfig;
