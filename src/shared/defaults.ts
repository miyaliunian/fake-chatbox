import { v4 as uuidv4 } from 'uuid'
import {
  Config,
  ModelProviderEnum,
  ModelProviderType,
  ProviderBaseInfo,
  SessionSettings,
  Settings,
  Theme,
} from './types'

export function settings(): Settings {
  return {
    // aiProvider: ModelProviderEnum.OpenAI,
    // openaiKey: '',
    // apiHost: 'https://api.openai.com',
    // dalleStyle: 'vivid',
    // imageGenerateNum: 3,
    // openaiUseProxy: false,

    // azureApikey: '',
    // azureDeploymentName: '',
    // azureDeploymentNameOptions: [],
    // azureDalleDeploymentName: 'dall-e-3',
    // azureEndpoint: '',
    // azureApiVersion: '2024-05-01-preview',

    // chatglm6bUrl: '', // deprecated
    // chatglmApiKey: '',
    // chatglmModel: '',

    // model: 'gpt-4o',
    // openaiCustomModelOptions: [],
    // temperature: 0.7,
    // topP: 1,
    // // openaiMaxTokens: 0,
    // // openaiMaxContextTokens: 4000,
    // openaiMaxContextMessageCount: 20,
    // // maxContextSize: "4000",
    // // maxTokens: "2048",

    // claudeApiKey: '',
    // claudeApiHost: 'https://api.anthropic.com/v1',
    // claudeModel: 'claude-3-5-sonnet-20241022',
    // claudeApiKey: '',
    // claudeApiHost: 'https://api.anthropic.com',
    // claudeModel: 'claude-3-5-sonnet-20241022',

    // chatboxAIModel: 'chatboxai-3.5',

    // geminiAPIKey: '',
    // geminiAPIHost: 'https://generativelanguage.googleapis.com',
    // geminiModel: 'gemini-1.5-pro-latest',

    // ollamaHost: 'http://127.0.0.1:11434',
    // ollamaModel: '',

    // groqAPIKey: '',
    // groqModel: 'llama3-70b-8192',

    // deepseekAPIKey: '',
    // deepseekModel: 'deepseek-chat',

    // siliconCloudKey: '',
    // siliconCloudModel: 'Qwen/Qwen2.5-7B-Instruct',

    // lmStudioHost: 'http://127.0.0.1:1234/v1',
    // lmStudioModel: '',

    // perplexityApiKey: '',
    // perplexityModel: 'llama-3.1-sonar-large-128k-online',

    // xAIKey: '',
    // xAIModel: 'grok-beta',

    // customProviders: [],

    showWordCount: false,
    showTokenCount: false,
    showTokenUsed: true,
    showModelName: true,
    showMessageTimestamp: false,
    showFirstTokenLatency: false,
    userAvatarKey: '',
    defaultAssistantAvatarKey: '',
    theme: Theme.System,
    language: 'zh-Hans',
    fontSize: 14,
    spellCheck: true,

    defaultPrompt: getDefaultPrompt(),

    // 关闭错误报错
    allowReportingAndTracking: false,

    enableMarkdownRendering: true,
    enableLaTeXRendering: true,
    enableMermaidRendering: true,
    injectDefaultMetadata: true,
    autoPreviewArtifacts: false,
    autoCollapseCodeBlock: true,
    pasteLongTextAsAFile: true,

    autoGenerateTitle: true,

    disableWelcomeOnStartup: true, // 默认禁用欢迎界面

    startupPage: 'home' as const,

    autoLaunch: false,
    autoUpdate: false,
    betaUpdate: false,

    shortcuts: {
      quickToggle: 'Alt+`', // 快速切换窗口显隐的快捷键
      inputBoxFocus: 'mod+i', // 聚焦输入框的快捷键
      inputBoxWebBrowsingMode: 'mod+e', // 切换输入框的 web 浏览模式的快捷键
      newChat: 'mod+n', // 新建聊天的快捷键
      newPictureChat: 'mod+shift+n', // 新建图片会话的快捷键
      sessionListNavNext: 'mod+tab', // 切换到下一个会话的快捷键
      sessionListNavPrev: 'mod+shift+tab', // 切换到上一个会话的快捷键
      sessionListNavTargetIndex: 'mod', // 会话导航的快捷键
      messageListRefreshContext: 'mod+r', // 刷新上下文的快捷键
      dialogOpenSearch: 'mod+k', // 打开搜索对话框的快捷键
      inpubBoxSendMessage: 'Enter', // 发送消息的快捷键
      inpubBoxSendMessageWithoutResponse: 'Ctrl+Enter', // 发送但不生成回复的快捷键
      optionNavUp: 'up', // 选项导航的快捷键
      optionNavDown: 'down', // 选项导航的快捷键
      optionSelect: 'enter', // 选项导航的快捷键
    },
    extension: {
      webSearch: {
        provider: 'bing',
        tavilyApiKey: '',
      },
    },
    mcp: {
      servers: [],
      enabledBuiltinServers: [],
    },
  }
}

export function newConfigs(): Config {
  return { uuid: uuidv4() }
}

export function getDefaultPrompt() {
  return 'You are a helpful assistant.'
}

export function chatSessionSettings(): SessionSettings {
  return {
    provider: ModelProviderEnum.ChatboxAI,
    modelId: 'chatboxai-4',
    maxContextMessageCount: 6,
  }
}

export function pictureSessionSettings(): SessionSettings {
  return {
    provider: ModelProviderEnum.ChatboxAI,
    modelId: 'DALL-E-3',
    imageGenerateNum: 3,
    dalleStyle: 'vivid',
  }
}

export const SystemProviders: ProviderBaseInfo[] = [
  // 原代码：已注释，过滤掉 ChatBox AI 提供方
  // {
  //   id: ModelProviderEnum.ChatboxAI,
  //   name: 'Chatbox AI',
  //   type: ModelProviderType.ChatboxAI,
  // },
  // {
  //   id: ModelProviderEnum.OpenAI,
  //   name: 'OpenAI',
  //   type: ModelProviderType.OpenAI,
  //   urls: {
  //     website: 'https://openai.com',
  //   },
  //   defaultSettings: {
  //     apiHost: 'https://api.openai.com',
  //     // https://platform.openai.com/docs/models
  //     models: [
  //       {
  //         modelId: 'gpt-4.1',
  //         capabilities: ['vision', 'tool_use'],
  //         contextWindow: 1_047_576,
  //         maxOutput: 32_768,
  //       },
  //       {
  //         modelId: 'gpt-4o',
  //         capabilities: ['vision', 'tool_use'],
  //         contextWindow: 128_000,
  //         maxOutput: 4_096,
  //       },
  //       {
  //         modelId: 'gpt-4o-mini',
  //         capabilities: ['vision', 'tool_use'],
  //         contextWindow: 128_000,
  //         maxOutput: 4_096,
  //       },
  //       {
  //         modelId: 'o4-mini',
  //         capabilities: ['vision', 'tool_use', 'reasoning'],
  //         contextWindow: 200_000,
  //         maxOutput: 100_000,
  //       },
  //       {
  //         modelId: 'o3-mini',
  //         capabilities: ['vision', 'tool_use', 'reasoning'],
  //         contextWindow: 200_000,
  //         maxOutput: 200_000,
  //       },
  //       {
  //         modelId: 'o1-mini',
  //         capabilities: ['vision', 'tool_use', 'reasoning'],
  //         contextWindow: 128_000,
  //         maxOutput: 128_000,
  //       },
  //       {
  //         modelId: 'o3',
  //         capabilities: ['vision', 'tool_use', 'reasoning'],
  //         contextWindow: 200_000,
  //         maxOutput: 100_000,
  //       },
  //       {
  //         modelId: 'o1',
  //         capabilities: ['vision', 'tool_use', 'reasoning'],
  //         contextWindow: 200_000,
  //         maxOutput: 100_000,
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.Claude,
  //   name: 'Claude',
  //   type: ModelProviderType.Claude,
  //   urls: {
  //     website: 'https://www.anthropic.com',
  //   },
  //   defaultSettings: {
  //     apiHost: 'https://api.anthropic.com/v1',
  //     // https://docs.anthropic.com/en/docs/about-claude/models/overview
  //     models: [
  //       {
  //         modelId: 'claude-opus-4-0',
  //         contextWindow: 200_000,
  //         maxOutput: 32_000,
  //         capabilities: ['vision', 'reasoning', 'tool_use'],
  //       },
  //       {
  //         modelId: 'claude-sonnet-4-0',
  //         contextWindow: 200_000,
  //         maxOutput: 64_000,
  //         capabilities: ['vision', 'reasoning', 'tool_use'],
  //       },
  //       {
  //         modelId: 'claude-3-7-sonnet-latest',
  //         capabilities: ['vision', 'tool_use', 'reasoning'],
  //         contextWindow: 200_000,
  //       },
  //       {
  //         modelId: 'claude-3-5-sonnet-latest',
  //         capabilities: ['vision'],
  //         contextWindow: 200_000,
  //       },
  //       {
  //         modelId: 'claude-3-5-haiku-latest',
  //         capabilities: ['vision'],
  //         contextWindow: 200_000,
  //       },
  //       {
  //         modelId: 'claude-3-opus-latest',
  //         capabilities: ['vision'],
  //         contextWindow: 200_000,
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.Gemini,
  //   name: 'Gemini',
  //   type: ModelProviderType.Gemini,
  //   urls: {
  //     website: 'https://gemini.google.com/',
  //   },
  //   defaultSettings: {
  //     apiHost: 'https://generativelanguage.googleapis.com',
  //     // https://ai.google.dev/models/gemini
  //     models: [
  //       {
  //         modelId: 'gemini-2.5-flash-preview-05-20',
  //         capabilities: ['vision', 'reasoning'],
  //       },
  //       {
  //         modelId: 'gemini-2.5-pro-preview-06-05',
  //         capabilities: ['vision', 'reasoning'],
  //       },
  //       {
  //         modelId: 'gemini-2.0-flash-exp',
  //         capabilities: ['vision'],
  //       },
  //       {
  //         modelId: 'gemini-2.0-flash-thinking-exp',
  //         capabilities: ['vision', 'reasoning'],
  //       },
  //       {
  //         modelId: 'gemini-2.0-flash-thinking-exp-1219',
  //         capabilities: ['vision', 'reasoning'],
  //       },
  //       {
  //         modelId: 'gemini-1.5-pro-latest',
  //         capabilities: ['vision'],
  //       },
  //       {
  //         modelId: 'gemini-1.5-flash-latest',
  //         capabilities: ['vision'],
  //       },
  //       {
  //         modelId: 'gemini-1.5-pro-exp-0827',
  //         capabilities: ['vision'],
  //       },
  //       {
  //         modelId: 'gemini-1.5-flash-exp-0827',
  //         capabilities: ['vision'],
  //       },
  //       {
  //         modelId: 'gemini-1.5-flash-8b-exp-0924',
  //         capabilities: ['vision'],
  //       },
  //       {
  //         modelId: 'gemini-pro',
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.Ollama,
  //   name: 'Ollama',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     apiHost: 'http://127.0.0.1:11434',
  //   },
  // },
  // {
  //   id: ModelProviderEnum.LMStudio,
  //   name: 'LM Studio',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     apiHost: 'http://127.0.0.1:1234',
  //   },
  // },

  {
    id: ModelProviderEnum.DeepSeek,
    name: 'DeepSeek',
    type: ModelProviderType.OpenAI,
    defaultSettings: {
      models: [
        {
          modelId: 'deepseek-chat',
          contextWindow: 64_000,
          capabilities: ['tool_use'],
        },
        {
          modelId: 'deepseek-coder',
          contextWindow: 64_000,
        },
        {
          modelId: 'deepseek-reasoner',
          contextWindow: 64_000,
          capabilities: ['reasoning', 'tool_use'],
        },
      ],
    },
  },
  {
    id: ModelProviderEnum.SiliconFlow,
    name: 'SiliconFlow',
    type: ModelProviderType.OpenAI,
    defaultSettings: {
      apiHost: 'https://api.siliconflow.cn',
      models: [
        {
          modelId: 'deepseek-ai/DeepSeek-V3',
          capabilities: ['tool_use'],
          contextWindow: 64_000,
        },
        {
          modelId: 'deepseek-ai/DeepSeek-R1',
          capabilities: ['reasoning', 'tool_use'],
          contextWindow: 64_000,
        },
        {
          modelId: 'Pro/deepseek-ai/DeepSeek-R1',
          capabilities: ['reasoning', 'tool_use'],
          contextWindow: 64_000,
        },
        {
          modelId: 'Pro/deepseek-ai/DeepSeek-V3',
          capabilities: ['tool_use'],
          contextWindow: 64_000,
        },

        {
          modelId: 'Qwen/Qwen2.5-7B-Instruct',
          capabilities: ['tool_use'],
          contextWindow: 32_000,
        },
      ],
    },
  },
  // {
  //   id: ModelProviderEnum.Groq,
  //   name: 'Groq',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     apiHost: 'https://api.groq.com/openai',
  //     models: [
  //       {
  //         modelId: 'llama-3.2-1b-preview',
  //       },
  //       {
  //         modelId: 'llama-3.2-3b-preview',
  //       },
  //       {
  //         modelId: 'llama-3.2-11b-text-preview',
  //       },
  //       {
  //         modelId: 'llama-3.2-90b-text-preview',
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.ChatGLM6B,
  //   name: 'ChatGLM6B',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     apiHost: 'https://open.bigmodel.cn/api/paas/v4/',
  //     models: [
  //       {
  //         modelId: 'glm-4-air',
  //         capabilities: ['tool_use'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'glm-4-plus',
  //         capabilities: ['tool_use'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'glm-4-flash',
  //         capabilities: ['tool_use'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'glm-4v-plus-0111',
  //         capabilities: ['vision', 'tool_use'],
  //         contextWindow: 16_000,
  //       },
  //       {
  //         capabilities: ['tool_use'],
  //         contextWindow: 32_000,
  //       },
  //       {
  //         modelId: 'Qwen/Qwen2.5-32B-Instruct',
  //         capabilities: ['tool_use'],
  //         contextWindow: 32_000,
  //       },
  //       {
  //         modelId: 'Qwen/Qwen2.5-72B-Instruct',
  //         capabilities: ['tool_use'],
  //         contextWindow: 32_000,
  //       },
  //       {
  //         modelId: 'Qwen/Qwen2.5-VL-32B-Instruct',
  //         capabilities: ['vision'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'Qwen/Qwen2.5-VL-72B-Instruct',
  //         capabilities: ['vision'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'Qwen/QVQ-72B-Preview',
  //         capabilities: ['vision'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'Qwen/QwQ-32B',
  //         capabilities: ['tool_use'],
  //         contextWindow: 32_000,
  //       },
  //       {
  //         modelId: 'Pro/Qwen/Qwen2.5-VL-7B-Instruct',
  //         capabilities: ['vision'],
  //         contextWindow: 32_000,
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.VolcEngine,
  //   name: 'VolcEngine',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     apiHost: 'https://ark.cn-beijing.volces.com',
  //     apiPath: '/api/v3/chat/completions',
  //     models: [
  //       {
  //         modelId: 'deepseek-v3-250324',
  //         contextWindow: 64_000,
  //         capabilities: ['tool_use', 'reasoning'],
  //       },
  //       {
  //         modelId: 'deepseek-r1-250528',
  //         contextWindow: 16_384,
  //         capabilities: ['reasoning', 'tool_use'],
  //       },
  //       {
  //         modelId: 'doubao-1-5-thinking-pro-250415',
  //         contextWindow: 128_000,
  //         capabilities: ['reasoning'],
  //       },
  //       {
  //         modelId: 'doubao-1.5-vision-pro-250328',
  //         contextWindow: 128_000,
  //         capabilities: ['vision'],
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.Azure,
  //   name: 'Azure OpenAI',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     endpoint: 'https://<resource_name>.openai.azure.com',
  //     apiVersion: '2024-05-01-preview',
  //   },
  // },
  // {
  //   id: ModelProviderEnum.XAI,
  //   name: 'xAI',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     apiHost: 'https://api.x.ai',
  //     models: [
  //       {
  //         modelId: 'grok-3-beta',
  //         contextWindow: 128_000,
  //         capabilities: ['vision', 'tool_use'],
  //       },
  //       {
  //         modelId: 'grok-3-mini-beta',
  //         contextWindow: 128_000,
  //         capabilities: ['vision', 'tool_use'],
  //       },
  //       {
  //         modelId: 'grok-2-vision-1212',
  //         capabilities: ['vision'],
  //         contextWindow: 8192,
  //       },
  //       {
  //         modelId: 'grok-2-image-1212',
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'grok-2-1212',
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'grok-vision-beta',
  //         capabilities: ['vision'],
  //         contextWindow: 8192,
  //       },
  //       {
  //         modelId: 'grok-beta',
  //         contextWindow: 128_000,
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.Perplexity,
  //   name: 'Perplexity',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     models: [
  //       { modelId: 'sonar' },
  //       { modelId: 'sonar-pro' },
  //       { modelId: 'sonar-reasoning' },
  //       { modelId: 'sonar-reasoning-pro' },
  //       { modelId: 'sonar-deep-research' },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.Groq,
  //   name: 'Groq',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     apiHost: 'https://api.groq.com/openai',
  //     models: [
  //       {
  //         modelId: 'llama-3.2-1b-preview',
  //       },
  //       {
  //         modelId: 'llama-3.2-3b-preview',
  //       },
  //       {
  //         modelId: 'llama-3.2-11b-text-preview',
  //       },
  //       {
  //         modelId: 'llama-3.2-90b-text-preview',
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: ModelProviderEnum.ChatGLM6B,
  //   name: 'ChatGLM6B',
  //   type: ModelProviderType.OpenAI,
  //   defaultSettings: {
  //     apiHost: 'https://open.bigmodel.cn/api/paas/v4/',
  //     models: [
  //       {
  //         modelId: 'glm-4-air',
  //         capabilities: ['tool_use'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'glm-4-plus',
  //         capabilities: ['tool_use'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'glm-4-flash',
  //         capabilities: ['tool_use'],
  //         contextWindow: 128_000,
  //       },
  //       {
  //         modelId: 'glm-4v-plus-0111',
  //         capabilities: ['vision', 'tool_use'],
  //         contextWindow: 16_000,
  //       },
  //       {
  //         modelId: 'glm-4v-flash',
  //         capabilities: ['vision', 'tool_use'],
  //         contextWindow: 16_000,
  //       },
  //     ],
  //   },
  // },
]
