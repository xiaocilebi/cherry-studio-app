import OpenAI from 'openai'

import { Message } from './message'
import { WebSearchProvider } from './websearch'

export type Assistant = {
  id: string
  name: string
  prompt: string
  topics: Topic[]
  type: 'system' | 'built_in' | 'external'
  emoji?: string
  description?: string
  model?: Model
  defaultModel?: Model
  settings?: Partial<AssistantSettings>
  /** enableWebSearch 代表使用模型内置网络搜索功能 */
  enableWebSearch?: boolean
  webSearchProviderId?: WebSearchProvider['id']
  enableGenerateImage?: boolean
  knowledgeRecognition?: 'off' | 'on'
  tags?: string[] // 助手标签
  group?: string[] // 助手分组
}

export type AssistantSettings = {
  contextCount: number
  temperature: number
  topP: number
  maxTokens: number | undefined
  enableMaxTokens: boolean
  streamOutput: boolean
  defaultModel?: Model
  customParameters?: AssistantSettingCustomParameters[]
  reasoning_effort?: ReasoningEffortOptions
  qwenThinkMode?: boolean
  toolUseMode?: 'function' | 'prompt'
}
export type AssistantSettingCustomParameters = {
  name: string
  value: string | number | boolean | object
  type: 'string' | 'number' | 'boolean' | 'json'
}

export type ReasoningEffortOptions = 'low' | 'medium' | 'high' | 'auto'

export type Topic = {
  id: string
  assistantId: string
  name: string
  createdAt: string
  updatedAt: string
  messages: Message[]
  pinned?: boolean
  prompt?: string
  isNameManuallyEdited?: boolean
}

export type ModelPricing = {
  input_per_million_tokens: number
  output_per_million_tokens: number
  currencySymbol?: string
}

export type ModelCapability = {
  type: ModelType
  /**
   * 是否为用户手动选择，如果为true，则表示用户手动选择了该类型，否则表示用户手动禁止了该模型；如果为undefined，则表示使用默认值
   * Is it manually selected by the user? If true, it means the user manually selected this type; otherwise, it means the user  * manually disabled the model.
   */
  isUserSelected?: boolean
}

export type Model = {
  id: string
  provider: string
  name: string
  group: string
  owned_by?: string
  description?: string
  capabilities?: ModelCapability[]
  /**
   * @deprecated
   */
  type?: ModelType[]
  pricing?: ModelPricing
  endpoint_type?: EndpointType
  supported_endpoint_types?: EndpointType[]
  supported_text_delta?: boolean
}

export type ModelType = 'text' | 'vision' | 'embedding' | 'reasoning' | 'function_calling' | 'web_search' | 'rerank'

export type Usage = OpenAI.Completions.CompletionUsage & {
  thoughts_tokens?: number
}

export type Metrics = {
  completion_tokens: number
  time_completion_millsec: number
  time_first_token_millsec?: number
  time_thinking_millsec?: number
}

// undefined 视为支持，默认支持
export type ProviderApiOptions = {
  /** 是否不支持 message 的 content 为数组类型 */
  isNotSupportArrayContent?: boolean
  /** 是否不支持 stream_options 参数 */
  isNotSupportStreamOptions?: boolean
  /**
   * @deprecated
   * 是否不支持 message 的 role 为 developer */
  isNotSupportDeveloperRole?: boolean
  /* 是否支持 message 的 role 为 developer */
  isSupportDeveloperRole?: boolean
  /**
   * @deprecated
   * 是否不支持 service_tier 参数. Only for OpenAI Models. */
  isNotSupportServiceTier?: boolean
  /* 是否支持 service_tier 参数. Only for OpenAI Models. */
  isSupportServiceTier?: boolean
  /** 是否不支持 enable_thinking 参数 */
  isNotSupportEnableThinking?: boolean
}

export type ServiceTier = OpenAIServiceTier | GroqServiceTier

export const OpenAIServiceTiers = {
  auto: 'auto',
  default: 'default',
  flex: 'flex',
  priority: 'priority'
} as const

export type OpenAIServiceTier = keyof typeof OpenAIServiceTiers

export const GroqServiceTiers = {
  auto: 'auto',
  on_demand: 'on_demand',
  flex: 'flex',
  performance: 'performance'
} as const

// 从 GroqServiceTiers 对象中提取类型
export type GroqServiceTier = keyof typeof GroqServiceTiers

export type Provider = {
  id: string
  type: ProviderType
  name: string
  apiKey: string
  apiHost: string
  apiVersion?: string
  models: Model[]
  enabled?: boolean
  isSystem?: boolean
  isAuthed?: boolean
  rateLimit?: number

  // API options
  apiOptions?: ProviderApiOptions
  serviceTier?: ServiceTier

  /** @deprecated */
  isNotSupportArrayContent?: boolean
  /** @deprecated */
  isNotSupportStreamOptions?: boolean
  /** @deprecated */
  isNotSupportDeveloperRole?: boolean
  /** @deprecated */
  isNotSupportServiceTier?: boolean

  isVertex?: boolean
  notes?: string
  extra_headers?: Record<string, string>
}

export type ProviderType =
  | 'openai'
  | 'openai-response'
  | 'anthropic'
  | 'gemini'
  | 'qwenlm'
  | 'azure-openai'
  | 'vertexai'
  | 'mistral'
  | 'aws-bedrock'

export type ApiStatus = 'idle' | 'processing' | 'success' | 'error'

export type EndpointType = 'openai' | 'openai-response' | 'anthropic' | 'gemini' | 'image-generation' | 'jina-rerank'

export const SystemProviderIds = {
  silicon: 'silicon',
  aihubmix: 'aihubmix',
  ocoolai: 'ocoolai',
  deepseek: 'deepseek',
  ppio: 'ppio',
  alayanew: 'alayanew',
  qiniu: 'qiniu',
  dmxapi: 'dmxapi',
  burncloud: 'burncloud',
  tokenflux: 'tokenflux',
  '302ai': '302ai',
  cephalon: 'cephalon',
  lanyun: 'lanyun',
  ph8: 'ph8',
  openrouter: 'openrouter',
  ollama: 'ollama',
  'new-api': 'new-api',
  lmstudio: 'lmstudio',
  anthropic: 'anthropic',
  openai: 'openai',
  'azure-openai': 'azure-openai',
  gemini: 'gemini',
  // vertexai: 'vertexai',
  github: 'github',
  copilot: 'copilot',
  zhipu: 'zhipu',
  yi: 'yi',
  moonshot: 'moonshot',
  baichuan: 'baichuan',
  dashscope: 'dashscope',
  stepfun: 'stepfun',
  doubao: 'doubao',
  infini: 'infini',
  minimax: 'minimax',
  groq: 'groq',
  together: 'together',
  fireworks: 'fireworks',
  nvidia: 'nvidia',
  grok: 'grok',
  hyperbolic: 'hyperbolic',
  mistral: 'mistral',
  jina: 'jina',
  perplexity: 'perplexity',
  modelscope: 'modelscope',
  xirang: 'xirang',
  hunyuan: 'hunyuan',
  'tencent-cloud-ti': 'tencent-cloud-ti',
  'baidu-cloud': 'baidu-cloud',
  gpustack: 'gpustack',
  voyageai: 'voyageai',
  'aws-bedrock': 'aws-bedrock',
  poe: 'poe'
} as const

export type SystemProviderId = keyof typeof SystemProviderIds

export const isSystemProviderId = (id: string): id is SystemProviderId => {
  return Object.hasOwn(SystemProviderIds, id)
}

export type SystemProvider = Provider & {
  id: SystemProviderId
  isSystem: true
  apiOptions?: never
}
