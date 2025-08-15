import { Model } from '@/types/assistant'

export const DEFAULT_MODELS: Model[] = [
  {
    // 默认助手模型
    id: 'deepseek-ai/DeepSeek-V3',
    name: 'deepseek-ai/DeepSeek-V3',
    provider: 'silicon',
    group: 'deepseek-ai'
  },
  {
    // 默认话题命名模型
    id: 'deepseek-ai/DeepSeek-V3',
    name: 'deepseek-ai/DeepSeek-V3',
    provider: 'silicon',
    group: 'deepseek-ai'
  },
  {
    // 默认翻译模型
    id: 'deepseek-ai/DeepSeek-V3',
    name: 'deepseek-ai/DeepSeek-V3',
    provider: 'silicon',
    group: 'deepseek-ai'
  }
]

export const SILICON_MODELS: Model[] = [
  {
    id: 'deepseek-ai/DeepSeek-R1',
    name: 'deepseek-ai/DeepSeek-R1',
    provider: 'silicon',
    group: 'deepseek-ai'
  },
  {
    id: 'deepseek-ai/DeepSeek-V3',
    name: 'deepseek-ai/DeepSeek-V3',
    provider: 'silicon',
    group: 'deepseek-ai'
  }
]

export const GEMINI_MODELS: Model[] = [
  {
    id: 'models/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    group: 'models',
    description:
      'Stable version of Gemini 2.5 Flash, our mid-size multimodal model that supports up to 1 million tokens, released in June of 2025.',
    owned_by: ''
  },
  {
    id: 'models/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    group: 'models',
    description: 'Stable release (June 17th, 2025) of Gemini 2.5 Pro',
    owned_by: ''
  },
  {
    id: 'models/gemini-2.5-flash-lite-preview-06-17',
    name: 'Gemini 2.5 Flash-Lite Preview 06-17',
    provider: 'gemini',
    group: 'models',
    description: 'Preview release (June 11th, 2025) of Gemini 2.5 Flash-Lite',
    owned_by: ''
  }
]

// mock data
export const AIHUBMIX_MODELS: Model[] = [
  {
    id: 'gemini-2.0-flash-exp',
    name: 'gemini-2.0-flash-exp',
    provider: 'aihubmix',
    group: 'gemini',
    owned_by: 'Google'
  },
  {
    id: 'gemini-2.0-flash-thinking-exp',
    name: 'gemini-2.0-flash-thinking-exp',
    provider: 'aihubmix',
    group: 'gemini',
    owned_by: 'Google'
  },
  {
    id: 'claude-sonnet-4-20250514',
    name: 'claude-sonnet-4-20250514',
    provider: 'aihubmix',
    group: 'claude',
    owned_by: 'Anthropic'
  },
  {
    id: 'deepseek-ai/DeepSeek-V3-0324',
    name: 'deepseek-ai/DeepSeek-V3-0324',
    provider: 'aihubmix',
    group: 'deepseek-ai',
    owned_by: 'custom'
  }
]

export const OPENROUTER_MODELS: Model[] = [
  {
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek: DeepSeek V3 0324 (free)',
    provider: 'openrouter',
    group: 'deepseek',
    description:
      'DeepSeek V3, a 685B-parameter, mixture-of-experts model, is the latest iteration of the flagship chat model family from the DeepSeek team.\n\nIt succeeds the [DeepSeek V3](/deepseek/deepseek-chat-v3) model and performs really well on a variety of tasks.'
  },
  {
    id: 'qwen/qwq-32b:free',
    name: 'Qwen: QwQ 32B (free)',
    provider: 'openrouter',
    group: 'qwen',
    description:
      'QwQ is the reasoning model of the Qwen series. Compared with conventional instruction-tuned models, QwQ, which is capable of thinking and reasoning, can achieve significantly enhanced performance in downstream tasks, especially hard problems. QwQ-32B is the medium-sized reasoning model, which is capable of achieving competitive performance against state-of-the-art reasoning models, e.g., DeepSeek-R1, o1-mini.'
  }
]

export const SYSTEM_MODELS: Record<string, Model[]> = {
  silicon: SILICON_MODELS,
  gemini: GEMINI_MODELS,
  aihubmix: AIHUBMIX_MODELS,
  openrouter: OPENROUTER_MODELS
}
