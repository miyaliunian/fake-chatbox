/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack'
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin'
import webpackPaths from './webpack.paths'
import { dependencies as externals } from '../../release/app/package.json'

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: [/node_modules/, /\.d\.ts$/],
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    plugins: [new TsconfigPathsPlugins()],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      CHATBOX_BUILD_TARGET: 'unknown',
      APP_NAME: '算大师',
      CHATBOX_BUILD_PLATFORM: 'unknown',
      USE_LOCAL_API: '',
      // Application Branding
      APP_DISPLAY_NAME: '算大师',
      
      APP_PRODUCT_NAME: 'xyz.suandashi.ce',
      // URLs and Domains
      APP_WEBSITE_URL: 'https://chatboxai.app',
      APP_API_URL: 'https://api.chatboxai.app',
      APP_STATIC_URL: 'https://static.chatboxai.app',
      APP_DOWNLOAD_URL: 'https://download.chatboxai.app',
      APP_CORS_PROXY_URL: 'https://cors-proxy.chatboxai.app',
      APP_MCP_URL: 'https://mcp.chatboxai.app',
      APP_ARTIFACT_PREVIEW_URL: 'https://artifact-preview.chatboxai.app',
      // Repository and Social
      GITHUB_REPO_URL: 'https://github.com/chatboxai/chatbox',
      GITHUB_ISSUES_URL: 'https://github.com/chatboxai/chatbox/issues?q=is%3Aissue',
      TWITTER_URL: 'https://x.com/ChatboxAI_HQ',
      TWITTER_HANDLE: '@ChatboxAI_HQ',
      // Contact
      SUPPORT_EMAIL: 'hi@chatboxai.com',
      // File and Storage
      BLOB_STORAGE_DIR: 'chatbox-blobs',
      EXPORT_FILE_PREFIX: 'chatbox-exported-data',
      // Build Environment Variables
      DEV_WEB_ONLY: 'false',
    }),
  ],
}

export default configuration
