
module.exports = function override(config, env) {
    // Add your fallback configuration here
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      http: false,
      net: false,
      tls: false,
      https: false,
      stream: false,
      zlib: false,
      os: false,
      child_process: false,
      // ... other fallbacks
    };

    return config;
  }
