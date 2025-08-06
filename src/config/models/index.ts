// 导出所有模型相关功能
import OpenAI from 'openai'

import { getProviderByModel } from '@/services/AssistantService'
import { Model } from '@/types/assistant'

import { isOpenAIReasoningModel } from './reasoning'

export interface ModelGroup {
  [provider: string]: Model[]
}

export type ModelCategory =
  | 'embedding'
  | 'rerank'
  | 'vision'
  | 'function_calling'
  | 'reasoning'
  | 'text_to_image'
  | 'web_search'

export function isFreeModel(model: Model) {
  return (model.id + model.name).toLocaleLowerCase().includes('free')
}

/**
 * 按 Qwen 系列模型分组
 * @param models 模型列表
 * @returns 分组后的模型
 */
export function groupQwenModels(models: Model[]): Record<string, Model[]> {
  return models.reduce(
    (groups, model) => {
      // 匹配 Qwen 系列模型的前缀
      const prefixMatch = model.id.match(/^(qwen(?:\d+\.\d+|2(?:\.\d+)?|-\d+b|-(?:max|coder|vl)))/i)
      // 匹配 qwen2.5、qwen2、qwen-7b、qwen-max、qwen-coder 等
      const groupKey = prefixMatch ? prefixMatch[1] : model.group || '其他'

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }

      groups[groupKey].push(model)

      return groups
    },
    {} as Record<string, Model[]>
  )
}

export const GEMINI_FLASH_MODEL_REGEX = new RegExp('gemini-.*-flash.*$')

export const THINKING_TOKEN_MAP: Record<string, { min: number; max: number }> = {
  // Gemini models
  'gemini-.*-flash.*$': { min: 0, max: 24576 },
  'gemini-.*-pro.*$': { min: 128, max: 32768 },

  // Qwen models
  'qwen-plus-.*$': { min: 0, max: 38912 },
  'qwen-turbo-.*$': { min: 0, max: 38912 },
  'qwen3-0\\.6b$': { min: 0, max: 30720 },
  'qwen3-1\\.7b$': { min: 0, max: 30720 },
  'qwen3-.*$': { min: 1024, max: 38912 },

  // Claude models
  'claude-3[.-]7.*sonnet.*$': { min: 1024, max: 64000 },
  'claude-(:?sonnet|opus)-4.*$': { min: 1024, max: 32000 }
}

export const findTokenLimit = (modelId: string): { min: number; max: number } | undefined => {
  for (const [pattern, limits] of Object.entries(THINKING_TOKEN_MAP)) {
    if (new RegExp(pattern, 'i').test(modelId)) {
      return limits
    }
  }

  return undefined
}

export const NOT_SUPPORTED_REGEX = /(?:^tts|whisper|speech)/i

export function isSupportedModel(model: OpenAI.Models.Model): boolean {
  if (!model) {
    return false
  }

  return !NOT_SUPPORTED_REGEX.test(model.id)
}

export function isOpenAIChatCompletionOnlyModel(model: Model): boolean {
  if (!model) {
    return false
  }

  return (
    model.id.includes('gpt-4o-search-preview') ||
    model.id.includes('gpt-4o-mini-search-preview') ||
    model.id.includes('o1-mini') ||
    model.id.includes('o1-preview')
  )
}

export function isGemmaModel(model?: Model): boolean {
  if (!model) {
    return false
  }

  return model.id.includes('gemma-') || model.group === 'Gemma'
}

export function isNotSupportTemperatureAndTopP(model: Model): boolean {
  if (!model) {
    return true
  }

  if (isOpenAIReasoningModel(model) || isOpenAIChatCompletionOnlyModel(model)) {
    return true
  }

  return false
}

export function isSupportedFlexServiceTier(model: Model): boolean {
  if (!model) {
    return false
  }

  return (model.id.includes('o3') && !model.id.includes('o3-mini')) || model.id.includes('o4-mini')
}

export function isOpenRouterBuiltInWebSearchModel(model: Model): boolean {
  if (!model) {
    return false
  }

  const provider = getProviderByModel(model)

  if (provider.id !== 'openrouter') {
    return false
  }

  return isOpenAIWebSearchChatCompletionOnlyModel(model) || model.id.includes('sonar')
}

export function isOpenAIWebSearchChatCompletionOnlyModel(model: Model): boolean {
  return model.id.includes('gpt-4o-search-preview') || model.id.includes('gpt-4o-mini-search-preview')
}

export function isOpenAIModel(model: Model): boolean {
  if (!model) {
    return false
  }

  return model.id.includes('gpt') || isOpenAIReasoningModel(model)
}
