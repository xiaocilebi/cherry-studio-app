import { getProviderByModel } from '@/services/ProviderService'
import { Model } from '@/types/assistant'
import { getLowerBaseModelName } from '@/utils/naming'

import { WEB_SEARCH_PROMPT_FOR_OPENROUTER } from '../prompts'
import { getWebSearchTools } from '../tools'
import { isEmbeddingModel } from './embedding'
import { isOpenAIReasoningModel } from './reasoning'

export const CLAUDE_SUPPORTED_WEBSEARCH_REGEX = new RegExp(
  `\\b(?:claude-3(-|\\.)(7|5)-sonnet(?:-[\\w-]+)|claude-3(-|\\.)5-haiku(?:-[\\w-]+)|claude-sonnet-4(?:-[\\w-]+)?|claude-opus-4(?:-[\\w-]+)?)\\b`,
  'i'
)

export const OPENAI_NO_SUPPORT_DEV_ROLE_MODELS = ['o1-preview', 'o1-mini']
export const PERPLEXITY_SEARCH_MODELS = ['sonar-pro', 'sonar', 'sonar-reasoning', 'sonar-reasoning-pro']
export const GEMINI_SEARCH_REGEX = new RegExp('gemini-2\\..*', 'i')

export function isOpenAILLMModel(model: Model): boolean {
  if (!model) {
    return false
  }

  if (model.id.includes('gpt-4o-image')) {
    return false
  }

  if (isOpenAIReasoningModel(model)) {
    return true
  }

  if (model.id.includes('gpt')) {
    return true
  }

  return false
}

export function isOpenAIWebSearchChatCompletionOnlyModel(model: Model): boolean {
  return model.id.includes('gpt-4o-search-preview') || model.id.includes('gpt-4o-mini-search-preview')
}

export function isOpenAIWebSearchModel(model: Model): boolean {
  return (
    model.id.includes('gpt-4o-search-preview') ||
    model.id.includes('gpt-4o-mini-search-preview') ||
    (model.id.includes('gpt-4.1') && !model.id.includes('gpt-4.1-nano')) ||
    (model.id.includes('gpt-4o') && !model.id.includes('gpt-4o-image')) ||
    model.id.includes('o3') ||
    model.id.includes('o4')
  )
}

// Replaced with the complete function from original file
export function isWebSearchModel(model: Model): boolean {
  if (!model) {
    return false
  }

  if (model.type) {
    if (model.type.includes('web_search')) {
      return true
    }
  }

  const provider = getProviderByModel(model)

  if (!provider) {
    return false
  }

  const isEmbedding = isEmbeddingModel(model)

  if (isEmbedding) {
    return false
  }

  const baseName = getLowerBaseModelName(model.id, '/')

  // 不管哪个供应商都判断了
  if (model.id.includes('claude')) {
    return CLAUDE_SUPPORTED_WEBSEARCH_REGEX.test(baseName)
  }

  if (provider.type === 'openai-response') {
    if (isOpenAIWebSearchModel(model)) {
      return true
    }

    return false
  }

  if (provider.id === 'perplexity') {
    return PERPLEXITY_SEARCH_MODELS.includes(baseName)
  }

  if (provider.id === 'aihubmix') {
    if (isOpenAIWebSearchModel(model)) {
      return true
    }

    const models = ['gemini-2.0-flash-search', 'gemini-2.0-flash-exp-search', 'gemini-2.0-pro-exp-02-05-search']
    return models.includes(baseName)
  }

  if (provider?.type === 'openai') {
    if (GEMINI_SEARCH_REGEX.test(baseName) || isOpenAIWebSearchModel(model)) {
      return true
    }
  }

  if (provider.id === 'gemini' || provider?.type === 'gemini' || provider.type === 'vertexai') {
    return GEMINI_SEARCH_REGEX.test(baseName)
  }

  if (provider.id === 'hunyuan') {
    return baseName !== 'hunyuan-lite'
  }

  if (provider.id === 'zhipu') {
    return baseName?.startsWith('glm-4-')
  }

  if (provider.id === 'dashscope') {
    const models = ['qwen-turbo', 'qwen-max', 'qwen-plus', 'qwq']
    // matches id like qwen-max-0919, qwen-max-latest
    return models.some(i => baseName.startsWith(i))
  }

  if (provider.id === 'openrouter') {
    return true
  }

  if (provider.id === 'grok') {
    return true
  }

  return false
}

// Added the complete function from original file
export function getOpenAIWebSearchParams(model: Model, isEnableWebSearch?: boolean): Record<string, any> {
  if (!isEnableWebSearch) {
    return {}
  }

  const webSearchTools = getWebSearchTools(model)

  if (model.provider === 'grok') {
    return {
      search_parameters: {
        mode: 'auto',
        return_citations: true,
        sources: [{ type: 'web' }, { type: 'x' }, { type: 'news' }]
      }
    }
  }

  if (model.provider === 'hunyuan') {
    return { enable_enhancement: true, citation: true, search_info: true }
  }

  if (model.provider === 'dashscope') {
    return {
      enable_search: true,
      search_options: {
        forced_search: true
      }
    }
  }

  if (isOpenAIWebSearchChatCompletionOnlyModel(model)) {
    return {
      web_search_options: {}
    }
  }

  if (model.provider === 'openrouter') {
    return {
      plugins: [{ id: 'web', search_prompts: WEB_SEARCH_PROMPT_FOR_OPENROUTER }]
    }
  }

  if (webSearchTools) {
    return {
      tools: webSearchTools
    }
  }

  return {}
}
