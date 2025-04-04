// Next.js configuration file
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud', 'arweave.net'],
  },
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};
