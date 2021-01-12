const withCSS = require('@zeit/next-css');
const path = require('path');

var env = {};

const nextConfig = {
  compress: false,
  poweredByHeader: false,
  generateEtags: false,
  webpack: (config) => {
    config.resolve.alias['~'] = `${path.resolve(__dirname)}/`;

    return config;
  },
  env,
};

module.exports = withCSS(nextConfig);
