/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2025-07-16 15:07:03
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2025-07-16 17:38:36
 * @FilePath: /chatbox/src/shared/env.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 环境变量配置
// 兼容不同环境的 process.env 访问
const getEnv = (key: string, defaultValue?: string): string | undefined => {
  // 在 webpack 构建时，process.env 会被注入
  // 在运行时检查 process 是否存在以避免错误
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue
  }
  return defaultValue
}

export const ENV = {
  // Application Branding
  APP_NAME: getEnv('APP_NAME', '算大师')!,
  APP_DISPLAY_NAME: getEnv('APP_DISPLAY_NAME', '算大师')!,
  APP_PACKAGE_NAME: getEnv('APP_PACKAGE_NAME', 'xyz.suandashi.ce')!,
  APP_PRODUCT_NAME: getEnv('APP_PRODUCT_NAME', 'xyz.suandashi.ce')!,

  // URLs and Domains
  APP_WEBSITE_URL: getEnv('APP_WEBSITE_URL', 'https://chatboxai.app')!,
  APP_API_URL: getEnv('APP_API_URL', 'https://api.chatboxai.app')!,
  APP_STATIC_URL: getEnv('APP_STATIC_URL', 'https://static.chatboxai.app')!,
  APP_DOWNLOAD_URL: getEnv('APP_DOWNLOAD_URL', 'https://download.chatboxai.app')!,
  APP_CORS_PROXY_URL: getEnv('APP_CORS_PROXY_URL', 'https://cors-proxy.chatboxai.app')!,
  APP_MCP_URL: getEnv('APP_MCP_URL', 'https://mcp.chatboxai.app')!,
  APP_ARTIFACT_PREVIEW_URL: getEnv('APP_ARTIFACT_PREVIEW_URL', 'https://artifact-preview.chatboxai.app')!,

  // Repository and Social
  GITHUB_REPO_URL: getEnv('GITHUB_REPO_URL', 'https://github.com/chatboxai/chatbox')!,
  GITHUB_ISSUES_URL: getEnv('GITHUB_ISSUES_URL', 'https://github.com/chatboxai/chatbox/issues?q=is%3Aissue')!,
  TWITTER_URL: getEnv('TWITTER_URL', 'https://x.com/ChatboxAI_HQ')!,
  TWITTER_HANDLE: getEnv('TWITTER_HANDLE', '@ChatboxAI_HQ')!,

  // Contact
  SUPPORT_EMAIL: getEnv('SUPPORT_EMAIL', 'hi@chatboxai.com')!,

  // File and Storage
  BLOB_STORAGE_DIR: getEnv('BLOB_STORAGE_DIR', 'chatbox-blobs')!,
  EXPORT_FILE_PREFIX: getEnv('EXPORT_FILE_PREFIX', 'chatbox-exported-data')!,

  // Build Environment Variables
  CHATBOX_BUILD_PLATFORM: getEnv('CHATBOX_BUILD_PLATFORM'),
  CHATBOX_BUILD_TARGET: getEnv('CHATBOX_BUILD_TARGET'),
  DEV_WEB_ONLY: getEnv('DEV_WEB_ONLY') === 'true',
}

export default ENV
