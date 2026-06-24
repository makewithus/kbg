/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['plus.unsplash.com'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
    });
    return config;
  },
  turbopack: {
    rules: {
      '*.pdf': {
        loaders: [],
        as: '*.pdf',
      },
    },
  },
};

export default nextConfig;
