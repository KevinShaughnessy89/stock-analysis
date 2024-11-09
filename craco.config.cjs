const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const threadLoader = require('thread-loader');

// More conservative thread pool settings
const jsWorkerPool = {
  workers: 2, // Reduced from max CPUs
  poolTimeout: 2000,
  poolParallelJobs: 50,
};
threadLoader.warmup(jsWorkerPool, ['babel-loader']);

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Keep existing extensions
      webpackConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx'];

      // Enable caching
      webpackConfig.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack-cache')
      };

      // Optimize minimizer with logging
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              compress: {
                drop_console: false, // Enable console for debugging
              },
            },
          }),
        ],
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 20, // Reduced from Infinity
          minSize: 20000, // Increased minimum size
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                return `vendor.${packageName.replace('@', '')}`;
              },
            },
          },
        },
      };

      // Simplified rules
      webpackConfig.module.rules.unshift({
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'thread-loader',
            options: jsWorkerPool
          },
          'babel-loader'
        ],
        exclude: /node_modules/,
      });

      return webpackConfig;
    }
  },
  babel: {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      process.env.NODE_ENV === 'development' && require.resolve('react-refresh/babel'),
      '@babel/plugin-transform-runtime'
    ].filter(Boolean),
  },
  devServer: {
    hot: true,
    watchOptions: {
      poll: false,
      ignored: /node_modules/,
    },
  }
};