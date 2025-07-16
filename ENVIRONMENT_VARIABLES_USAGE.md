# 环境变量使用说明

## 概述
项目中所有与 Chatbox 相关的硬编码字符串已被提取到 `.env` 文件中，通过环境变量进行管理。

## 使用方法

### 1. 在 TypeScript/JavaScript 文件中使用

```typescript
import ENV from '@/shared/env';

// 使用应用名称
console.log(ENV.APP_NAME); // 'Chatbox'

// 使用网站URL
const websiteUrl = ENV.APP_WEBSITE_URL; // 'https://chatboxai.app'

// 使用GitHub仓库URL
const repoUrl = ENV.GITHUB_REPO_URL; // 'https://github.com/chatboxai/chatbox'
```

### 2. 可用的环境变量

#### 应用品牌
- `ENV.APP_NAME` - 应用名称
- `ENV.APP_DISPLAY_NAME` - 显示名称
- `ENV.APP_PACKAGE_NAME` - 包名
- `ENV.APP_PRODUCT_NAME` - 产品名称

#### URLs 和域名
- `ENV.APP_WEBSITE_URL` - 主网站URL
- `ENV.APP_API_URL` - API地址
- `ENV.APP_STATIC_URL` - 静态资源URL
- `ENV.APP_DOWNLOAD_URL` - 下载地址
- `ENV.APP_CORS_PROXY_URL` - CORS代理URL
- `ENV.APP_MCP_URL` - MCP服务URL
- `ENV.APP_ARTIFACT_PREVIEW_URL` - 工件预览URL

#### 仓库和社交
- `ENV.GITHUB_REPO_URL` - GitHub仓库地址
- `ENV.GITHUB_ISSUES_URL` - GitHub Issues地址
- `ENV.TWITTER_URL` - Twitter链接
- `ENV.TWITTER_HANDLE` - Twitter用户名

#### 联系方式
- `ENV.SUPPORT_EMAIL` - 支持邮箱

#### 文件和存储
- `ENV.BLOB_STORAGE_DIR` - Blob存储目录
- `ENV.EXPORT_FILE_PREFIX` - 导出文件前缀

#### 构建环境变量
- `ENV.CHATBOX_BUILD_PLATFORM` - 构建平台
- `ENV.CHATBOX_BUILD_TARGET` - 构建目标
- `ENV.DEV_WEB_ONLY` - 仅Web开发模式

### 3. 修改环境变量

要修改这些值，只需编辑根目录下的 `.env` 文件即可：

```bash
# 例如修改应用名称
APP_NAME=MyCustomChatbox
APP_DISPLAY_NAME=My Custom Chatbox
```

### 4. 在现有代码中替换硬编码值

原来的硬编码：
```typescript
// 旧代码
tray.setToolTip('Chatbox')
shell.openExternal('https://chatboxai.app')
```

新的环境变量使用方式：
```typescript
// 新代码
import ENV from '@/shared/env';

tray.setToolTip(ENV.APP_NAME)
shell.openExternal(ENV.APP_WEBSITE_URL)
```

## 注意事项

1. 所有环境变量都有默认值，确保即使没有 `.env` 文件项目也能正常运行
2. 环境变量在构建时会被内联到代码中
3. 修改 `.env` 文件后需要重新启动开发服务器或重新构建项目
