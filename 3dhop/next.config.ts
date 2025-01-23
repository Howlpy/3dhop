// next.config.js
const nextConfig = {
  webpack: (config: { externals: { '@mapbox/node-pre-gyp': string; }[]; }, { isServer }: any) => {
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp'
      });
    }
    return config;
  }
};

module.exports = nextConfig;