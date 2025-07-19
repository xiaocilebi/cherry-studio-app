import { Model } from '@/types/assistant'

import { isEmbeddingModel } from './embedding'

export const FUNCTION_CALLING_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4',
  'gpt-4.5',
  'o(1|3|4)(?:-[\\w-]+)?',
  'claude',
  'qwen',
  'qwen3',
  'hunyuan',
  'deepseek',
  'glm-4(?:-[\\w-]+)?',
  'learnlm(?:-[\\w-]+)?',
  'gemini(?:-[\\w-]+)?', // 提前排除了gemini的嵌入模型
  'grok-3(?:-[\\w-]+)?',
  'doubao-seed-1[.-]6(?:-[\\w-]+)?',
  'kimi-k2(?:-[\\w-]+)?'
]

const FUNCTION_CALLING_EXCLUDED_MODELS = [
  'aqa(?:-[\\w-]+)?',
  'imagen(?:-[\\w-]+)?',
  'o1-mini',
  'o1-preview',
  'AIDC-AI/Marco-o1',
  'gemini-1(?:\\.[\\w-]+)?'
]

export const FUNCTION_CALLING_REGEX = new RegExp(
  `\\b(?!(?:${FUNCTION_CALLING_EXCLUDED_MODELS.join('|')})\\b)(?:${FUNCTION_CALLING_MODELS.join('|')})\\b`,
  'i'
)

export const CLAUDE_SUPPORTED_WEBSEARCH_REGEX = new RegExp(
  `\\b(?:claude-3(-|\\.)(7|5)-sonnet(?:-[\\w-]+)|claude-3(-|\\.)5-haiku(?:-[\\w-]+)|claude-sonnet-4(?:-[\\w-]+)?|claude-opus-4(?:-[\\w-]+)?)\\b`,
  'i'
)

export function isFunctionCallingModel(model?: Model): boolean {
  if (!model) {
    return false
  }

  if (model.type?.includes('function_calling')) {
    return true
  }

  if (isEmbeddingModel(model)) {
    return false
  }

  if (model.provider === 'qiniu') {
    return ['deepseek-v3-tool', 'deepseek-v3-0324', 'qwq-32b', 'qwen2.5-72b-instruct'].includes(model.id)
  }

  if (model.provider === 'doubao' || model.id.includes('doubao')) {
    return FUNCTION_CALLING_REGEX.test(model.id) || FUNCTION_CALLING_REGEX.test(model.name)
  }

  if (['deepseek', 'anthropic'].includes(model.provider)) {
    return true
  }

  return FUNCTION_CALLING_REGEX.test(model.id)
}
