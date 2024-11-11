const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const threadLoader = require('thread-loader');
const os = require('os');

// Optimized worker pool settings
const jsWorkerPool = {
  workers: Math.max(os.cpus().length - 1, 1), // Use all CPUs except one
  poolTimeout: 2000,
  poolParallelJobs: 100,
  workerParallelJobs: 50,
  workerNodeArgs: ['--max-old-space-size=4096'], // Increase memory limit
};

// Warm up thread-loader with commonly used loaders
threadLoader.warmup(jsWorkerPool, [
  'babel-loader',
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/preset-typescript'
]);

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          React: 'react'
        })
      ]
    },
    configure: (webpackConfig) => {
      // Keep existing extensions
      webpackConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx'];

      // Enable caching with larger cache
      webpackConfig.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
        compression: 'gzip',
        maxAge: 172800000 // 48 hours
      };

      // Optimize minimizer
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
          }),
        ],
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                return `vendor.${packageName.replace('@', '')}`;
              },
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Optimized rules with thread-loader
      webpackConfig.module.rules.unshift({
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'thread-loader',
            options: jsWorkerPool
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              compact: true,
            }
          }
        ],
        exclude: /node_modules/,
      });

      // Add performance hints
      webpackConfig.performance = {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
        hints: false
      };

      return webpackConfig;
    }
  },
  babel: {
    presets: [
      ['@babel/preset-env', {
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false,
      }],
      ['@babel/preset-react', {
        runtime: 'automatic'
      }],
      '@babel/preset-typescript'
    ],
    plugins: [
      process.env.NODE_ENV === 'development' && require.resolve('react-refresh/babel'),
      '@babel/plugin-transform-runtime',
      '@babel/plugin-transform-react-jsx'
    ].filter(Boolean)
  },
    devServer: {
      hot: true,
      watchOptions: {
        poll: false,
        ignored: /node_modules/,
      }
    }
};