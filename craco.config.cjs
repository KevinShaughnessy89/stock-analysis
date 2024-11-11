const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const threadLoader = require('thread-loader');
const os = require('os');
const webpack = require('webpack');

// Optimized worker pool settings
const jsWorkerPool = {
  workers: Math.max(os.cpus().length - 1, 1),
  poolTimeout: 2000,
  poolParallelJobs: 100,
  workerParallelJobs: 50,
  workerNodeArgs: ['--max-old-space-size=4096'],
};

// Warm up thread-loader
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
          React: 'react',
          JSX: 'react'
        })
      ]
    },
    configure: (webpackConfig) => {
      // Extensions
      webpackConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx'];

      // Simplified Node.js polyfills - explicitly false out problematic ones
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
        vm: false,
        path: false,
        fs: false,
        buffer: false,
        process: false,
        util: false,
        buffer: false,
        querystring: false,
        zlib: false,
        dns: false,
        net: false,
        tls: false,
        child_process: false
      };

      // Enhanced plugins configuration
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
      ];

      // Filesystem cache
      webpackConfig.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
        compression: 'gzip',
        maxAge: 172800000, // 48 hours
        buildDependencies: {
          config: [__filename]
        }
      };

      // Optimization configuration
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        minimize: process.env.NODE_ENV === 'production',
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

      // Enhanced rules with thread-loader and explicit babel config
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
              compact: process.env.NODE_ENV === 'production',
              presets: [
                ['@babel/preset-env', {
                  useBuiltIns: 'usage',
                  corejs: 3,
                  modules: false,
                }],
                ['@babel/preset-react', {
                  runtime: 'automatic',
                  development: process.env.NODE_ENV === 'development',
                  importSource: 'react'
                }],
                '@babel/preset-typescript'
              ],
              plugins: [
                process.env.NODE_ENV === 'development' && require.resolve('react-refresh/babel'),
                ['@babel/plugin-transform-runtime', {
                  regenerator: true,
                }],
                ['@babel/plugin-transform-react-jsx', {
                  runtime: 'automatic'
                }]
              ].filter(Boolean)
            }
          }
        ],
        exclude: /node_modules/,
      });

      // Performance hints
      webpackConfig.performance = {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false
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
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development',
        importSource: 'react'
      }],
      '@babel/preset-typescript'
    ],
    plugins: [
      process.env.NODE_ENV === 'development' && require.resolve('react-refresh/babel'),
      ['@babel/plugin-transform-runtime', {
        regenerator: true,
      }],
      ['@babel/plugin-transform-react-jsx', {
        runtime: 'automatic'
      }]
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