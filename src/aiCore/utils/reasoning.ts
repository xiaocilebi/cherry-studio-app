import { findTokenLimit, GEMINI_FLASH_MODEL_REGEX } from '@/config/models'
import {
  EFFORT_RATIO,
  isDoubaoThinkingAutoModel,
  isReasoningModel,
  isSupportedReasoningEffortGrokModel,
  isSupportedReasoningEffortModel,
  isSupportedReasoningEffortOpenAIModel,
  isSupportedThinkingTokenClaudeModel,
  isSupportedThinkingTokenDoubaoModel,
  isSupportedThinkingTokenGeminiModel,
  isSupportedThinkingTokenModel,
  isSupportedThinkingTokenQwenModel
} from '@/config/models/reasoning'
import { DEFAULT_MAX_TOKENS } from '@/constants'
import { getAssistantSettings } from '@/services/AssistantService'
import { getProviderByModel } from '@/services/ProviderService'
import { Assistant, Model } from '@/types/assistant'
import { ReasoningEffortOptionalParams } from '@/types/sdk'

export function getReasoningEffort(assistant: Assistant, model: Model): ReasoningEffortOptionalParams {
  const provider = getProviderByModel(model)

  if (provider.id === 'groq') {
    return {}
  }

  if (!isReasoningModel(model)) {
    return {}
  }

  const reasoningEffort = assistant?.settings?.reasoning_effort

  if (!reasoningEffort) {
    if (model.provider === 'openrouter') {
      return { reasoning: { enabled: false } }
    }

    if (isSupportedThinkingTokenQwenModel(model)) {
      return { enable_thinking: false }
    }

    if (isSupportedThinkingTokenClaudeModel(model)) {
      return {}
    }

    if (isSupportedThinkingTokenGeminiModel(model)) {
      if (GEMINI_FLASH_MODEL_REGEX.test(model.id)) {
        return { reasoning_effort: 'none' }
      }

      return {}
    }

    if (isSupportedThinkingTokenDoubaoModel(model)) {
      return { thinking: { type: 'disabled' } }
    }

    return {}
  }

  // Doubao 思考模式支持
  if (isSupportedThinkingTokenDoubaoModel(model)) {
    // reasoningEffort 为空，默认开启 enabled
    if (!reasoningEffort) {
      return { thinking: { type: 'disabled' } }
    }

    if (reasoningEffort === 'high') {
      return { thinking: { type: 'enabled' } }
    }

    if (reasoningEffort === 'auto' && isDoubaoThinkingAutoModel(model)) {
      return { thinking: { type: 'auto' } }
    }

    // 其他情况不带 thinking 字段
    return {}
  }

  if (!reasoningEffort) {
    if (model.provider === 'openrouter') {
      if (isSupportedThinkingTokenGeminiModel(model) && !GEMINI_FLASH_MODEL_REGEX.test(model.id)) {
        return {}
      }

      return { reasoning: { enabled: false, exclude: true } }
    }

    if (isSupportedThinkingTokenQwenModel(model)) {
      return { enable_thinking: false }
    }

    if (isSupportedThinkingTokenClaudeModel(model)) {
      return {}
    }

    if (isSupportedThinkingTokenGeminiModel(model)) {
      if (GEMINI_FLASH_MODEL_REGEX.test(model.id)) {
        return {
          extra_body: {
            google: {
              thinking_config: {
                thinking_budget: 0
              }
            }
          }
        }
      }

      return {}
    }

    if (isSupportedThinkingTokenDoubaoModel(model)) {
      return { thinking: { type: 'disabled' } }
    }

    return {}
  }

  const effortRatio = EFFORT_RATIO[reasoningEffort]
  const budgetTokens = Math.floor(
    (findTokenLimit(model.id)?.max! - findTokenLimit(model.id)?.min!) * effortRatio + findTokenLimit(model.id)?.min!
  )

  // OpenRouter models
  if (model.provider === 'openrouter') {
    if (isSupportedReasoningEffortModel(model) || isSupportedThinkingTokenModel(model)) {
      return {
        reasoning: {
          effort: reasoningEffort === 'auto' ? 'medium' : reasoningEffort
        }
      }
    }
  }

  // Qwen models
  if (isSupportedThinkingTokenQwenModel(model)) {
    return {
      enable_thinking: true,
      thinking_budget: budgetTokens
    }
  }

  // Grok models
  if (isSupportedReasoningEffortGrokModel(model)) {
    return {
      reasoningEffort: reasoningEffort
    }
  }

  // OpenAI models
  if (isSupportedReasoningEffortOpenAIModel(model)) {
    return {
      reasoningEffort: reasoningEffort
    }
  }

  if (isSupportedThinkingTokenGeminiModel(model)) {
    if (reasoningEffort === 'auto') {
      return {
        extra_body: {
          google: {
            thinking_config: {
              thinking_budget: -1,
              include_thoughts: true
            }
          }
        }
      }
    }

    return {
      extra_body: {
        google: {
          thinking_config: {
            thinking_budget: budgetTokens,
            include_thoughts: true
          }
        }
      }
    }
  }

  // Claude models
  if (isSupportedThinkingTokenClaudeModel(model)) {
    const maxTokens = assistant.settings?.maxTokens
    return {
      thinking: {
        type: 'enabled',
        budget_tokens: Math.floor(
          Math.max(1024, Math.min(budgetTokens, (maxTokens || DEFAULT_MAX_TOKENS) * effortRatio))
        )
      }
    }
  }

  // Doubao models
  if (isSupportedThinkingTokenDoubaoModel(model)) {
    if (assistant.settings?.reasoning_effort === 'high') {
      return {
        thinking: {
          type: 'enabled'
        }
      }
    }
  }

  // Default case: no special thinking settings
  return {}
}

/**
 * 获取 OpenAI 推理参数
 * 从 OpenAIResponseAPIClient 和 OpenAIAPIClient 中提取的逻辑
 */
export function getOpenAIReasoningParams(assistant: Assistant, model: Model): Record<string, any> {
  if (!isReasoningModel(model)) {
    return {}
  }

  const reasoningEffort = assistant?.settings?.reasoning_effort

  if (!reasoningEffort) {
    return {}
  }

  // OpenAI 推理参数
  if (isSupportedReasoningEffortOpenAIModel(model)) {
    return {
      reasoningEffort
    }
  }

  return {}
}

/**
 * 获取 Anthropic 推理参数
 * 从 AnthropicAPIClient 中提取的逻辑
 */
export function getAnthropicReasoningParams(assistant: Assistant, model: Model): Record<string, any> {
  if (!isReasoningModel(model)) {
    return {}
  }

  const reasoningEffort = assistant?.settings?.reasoning_effort

  if (reasoningEffort === undefined) {
    return {
      thinking: {
        type: 'disabled'
      }
    }
  }

  // Claude 推理参数
  if (isSupportedThinkingTokenClaudeModel(model)) {
    const { maxTokens } = getAssistantSettings(assistant)
    const effortRatio = EFFORT_RATIO[reasoningEffort]

    const budgetTokens = Math.max(
      1024,
      Math.floor(
        Math.min(
          (findTokenLimit(model.id)?.max! - findTokenLimit(model.id)?.min!) * effortRatio +
            findTokenLimit(model.id)?.min!,
          (maxTokens || DEFAULT_MAX_TOKENS) * effortRatio
        )
      )
    )

    return {
      thinking: {
        type: 'enabled',
        budgetTokens: budgetTokens
      }
    }
  }

  return {}
}

/**
 * 获取 Gemini 推理参数
 * 从 GeminiAPIClient 中提取的逻辑
 */
export function getGeminiReasoningParams(assistant: Assistant, model: Model): Record<string, any> {
  if (!isReasoningModel(model)) {
    return {}
  }

  const reasoningEffort = assistant?.settings?.reasoning_effort

  // Gemini 推理参数
  if (isSupportedThinkingTokenGeminiModel(model)) {
    if (reasoningEffort === undefined) {
      return {
        thinkingConfig: {
          includeThoughts: false,
          ...(GEMINI_FLASH_MODEL_REGEX.test(model.id) ? { thinkingBudget: 0 } : {})
        }
      }
    }

    const effortRatio = EFFORT_RATIO[reasoningEffort]

    if (effortRatio > 1) {
      return {
        thinkingConfig: {
          includeThoughts: true
        }
      }
    }

    const { min, max } = findTokenLimit(model.id) || { min: 0, max: 0 }
    const budget = Math.floor((max - min) * effortRatio + min)

    return {
      thinkingConfig: {
        ...(budget > 0 ? { thinkingBudget: budget } : {}),
        includeThoughts: true
      }
    }
  }

  return {}
}

export function getXAIReasoningParams(assistant: Assistant, model: Model): Record<string, any> {
  if (!isSupportedReasoningEffortGrokModel(model)) {
    return {}
  }

  const { reasoning_effort: reasoningEffort } = getAssistantSettings(assistant)

  return {
    reasoningEffort
  }
}

/**
 * 获取自定义参数
 * 从 assistant 设置中提取自定义参数
 */
export function getCustomParameters(assistant: Assistant): Record<string, any> {
  return (
    assistant?.settings?.customParameters?.reduce((acc, param) => {
      if (!param.name?.trim()) {
        return acc
      }

      if (param.type === 'json') {
        const value = param.value as string

        if (value === 'undefined') {
          return { ...acc, [param.name]: undefined }
        }

        try {
          return { ...acc, [param.name]: JSON.parse(value) }
        } catch {
          return { ...acc, [param.name]: value }
        }
      }

      return {
        ...acc,
        [param.name]: param.value
      }
    }, {}) || {}
  )
}
