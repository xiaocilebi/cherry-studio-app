import { baseProviderIdSchema, customProviderIdSchema } from '@cherrystudio/ai-core/provider'

import { isOpenAIModel, isSupportFlexServiceTierModel } from '@/config/models'
import { isSupportServiceTierProvider } from '@/config/providers'
import {
  Assistant,
  GroqServiceTiers,
  isGroqServiceTier,
  isOpenAIServiceTier,
  Model,
  OpenAIServiceTiers,
  Provider,
  SystemProviderIds
} from '@/types/assistant'

import { getAiSdkProviderId } from '../provider/factory'
import { buildGeminiGenerateImageParams } from './image'
import {
  getAnthropicReasoningParams,
  getCustomParameters,
  getGeminiReasoningParams,
  getOpenAIReasoningParams,
  getReasoningEffort,
  getXAIReasoningParams
} from './reasoning'
import { getWebSearchParams } from './websearch'

// copy from BaseApiClient.ts
const getServiceTier = (model: Model, provider: Provider) => {
  const serviceTierSetting = provider.serviceTier

  if (!isSupportServiceTierProvider(provider) || !isOpenAIModel(model) || !serviceTierSetting) {
    return undefined
  }

  // 处理不同供应商需要 fallback 到默认值的情况
  if (provider.id === SystemProviderIds.groq) {
    if (
      !isGroqServiceTier(serviceTierSetting) ||
      (serviceTierSetting === GroqServiceTiers.flex && !isSupportFlexServiceTierModel(model))
    ) {
      return undefined
    }
  } else {
    // 其他 OpenAI 供应商，假设他们的服务层级设置和 OpenAI 完全相同
    if (
      !isOpenAIServiceTier(serviceTierSetting) ||
      (serviceTierSetting === OpenAIServiceTiers.flex && !isSupportFlexServiceTierModel(model))
    ) {
      return undefined
    }
  }

  return serviceTierSetting
}

/**
 * 构建 AI SDK 的 providerOptions
 * 按 provider 类型分离，保持类型安全
 * 返回格式：{ 'providerId': providerOptions }
 */
export function buildProviderOptions(
  assistant: Assistant,
  model: Model,
  actualProvider: Provider,
  capabilities: {
    enableReasoning: boolean
    enableWebSearch: boolean
    enableGenerateImage: boolean
  }
): Record<string, any> {
  const rawProviderId = getAiSdkProviderId(actualProvider)
  // 构建 provider 特定的选项
  let providerSpecificOptions: Record<string, any> = {}
  const serviceTierSetting = getServiceTier(model, actualProvider)
  providerSpecificOptions.serviceTier = serviceTierSetting
  // 根据 provider 类型分离构建逻辑
  const { data: baseProviderId, success } = baseProviderIdSchema.safeParse(rawProviderId)

  if (success) {
    // 应该覆盖所有类型
    switch (baseProviderId) {
      case 'openai':
      case 'azure':
        providerSpecificOptions = {
          ...buildOpenAIProviderOptions(assistant, model, capabilities),
          serviceTier: serviceTierSetting
        }
        break

      case 'anthropic':
        providerSpecificOptions = buildAnthropicProviderOptions(assistant, model, capabilities)
        break

      case 'google':
        providerSpecificOptions = buildGeminiProviderOptions(assistant, model, capabilities)
        break

      case 'xai':
        providerSpecificOptions = buildXAIProviderOptions(assistant, model, capabilities)
        break
      case 'deepseek':
      case 'openai-compatible':
        // 对于其他 provider，使用通用的构建逻辑
        providerSpecificOptions = {
          ...buildGenericProviderOptions(assistant, model, capabilities),
          serviceTier: serviceTierSetting
        }
        break
      default:
        throw new Error(`Unsupported base provider ${baseProviderId}`)
    }
  } else {
    // 处理自定义 provider
    const { data: providerId, success, error } = customProviderIdSchema.safeParse(rawProviderId)

    if (success) {
      switch (providerId) {
        // 非 base provider 的单独处理逻辑
        case 'google-vertex':
          providerSpecificOptions = buildGeminiProviderOptions(assistant, model, capabilities)
          break
        default:
          // 对于其他 provider，使用通用的构建逻辑
          providerSpecificOptions = {
            ...buildGenericProviderOptions(assistant, model, capabilities),
            serviceTier: serviceTierSetting
          }
      }
    } else {
      throw error
    }
  }

  // 合并自定义参数到 provider 特定的选项中
  providerSpecificOptions = {
    ...providerSpecificOptions,
    ...getCustomParameters(assistant)
  }

  // 返回 AI Core SDK 要求的格式：{ 'providerId': providerOptions }
  return {
    [rawProviderId]: providerSpecificOptions
  }
}

/**
 * 构建 OpenAI 特定的 providerOptions
 */
function buildOpenAIProviderOptions(
  assistant: Assistant,
  model: Model,
  capabilities: {
    enableReasoning: boolean
    enableWebSearch: boolean
    enableGenerateImage: boolean
  }
): Record<string, any> {
  const { enableReasoning } = capabilities
  let providerOptions: Record<string, any> = {}

  // OpenAI 推理参数
  if (enableReasoning) {
    const reasoningParams = getOpenAIReasoningParams(assistant, model)
    providerOptions = {
      ...providerOptions,
      ...reasoningParams
    }
  }

  return providerOptions
}

/**
 * 构建 Anthropic 特定的 providerOptions
 */
function buildAnthropicProviderOptions(
  assistant: Assistant,
  model: Model,
  capabilities: {
    enableReasoning: boolean
    enableWebSearch: boolean
    enableGenerateImage: boolean
  }
): Record<string, any> {
  const { enableReasoning } = capabilities
  let providerOptions: Record<string, any> = {}

  // Anthropic 推理参数
  if (enableReasoning) {
    const reasoningParams = getAnthropicReasoningParams(assistant, model)
    providerOptions = {
      ...providerOptions,
      ...reasoningParams
    }
  }

  return providerOptions
}

/**
 * 构建 Gemini 特定的 providerOptions
 */
function buildGeminiProviderOptions(
  assistant: Assistant,
  model: Model,
  capabilities: {
    enableReasoning: boolean
    enableWebSearch: boolean
    enableGenerateImage: boolean
  }
): Record<string, any> {
  const { enableReasoning, enableGenerateImage } = capabilities
  let providerOptions: Record<string, any> = {}

  // Gemini 推理参数
  if (enableReasoning) {
    const reasoningParams = getGeminiReasoningParams(assistant, model)
    providerOptions = {
      ...providerOptions,
      ...reasoningParams
    }
  }

  if (enableGenerateImage) {
    providerOptions = {
      ...providerOptions,
      ...buildGeminiGenerateImageParams()
    }
  }

  return providerOptions
}

function buildXAIProviderOptions(
  assistant: Assistant,
  model: Model,
  capabilities: {
    enableReasoning: boolean
    enableWebSearch: boolean
    enableGenerateImage: boolean
  }
): Record<string, any> {
  const { enableReasoning } = capabilities
  let providerOptions: Record<string, any> = {}

  if (enableReasoning) {
    const reasoningParams = getXAIReasoningParams(assistant, model)
    providerOptions = {
      ...providerOptions,
      ...reasoningParams
    }
  }

  return providerOptions
}

/**
 * 构建通用的 providerOptions（用于其他 provider）
 */
function buildGenericProviderOptions(
  assistant: Assistant,
  model: Model,
  capabilities: {
    enableReasoning: boolean
    enableWebSearch: boolean
    enableGenerateImage: boolean
  }
): Record<string, any> {
  const { enableWebSearch } = capabilities
  let providerOptions: Record<string, any> = {}

  const reasoningParams = getReasoningEffort(assistant, model)
  providerOptions = {
    ...providerOptions,
    ...reasoningParams
  }

  if (enableWebSearch) {
    const webSearchParams = getWebSearchParams(model)
    providerOptions = {
      ...providerOptions,
      ...webSearchParams
    }
  }

  // 特殊处理 Qwen MT
  // if (isQwenMTModel(model)) {
  //   if (isTranslateAssistant(assistant)) {
  //     const targetLanguage = assistant.targetLanguage
  //     const translationOptions = {
  //       source_lang: 'auto',
  //       target_lang: mapLanguageToQwenMTModel(targetLanguage)
  //     } as const

  //     if (!translationOptions.target_lang) {
  //       throw new Error(t('translate.error.not_supported', { language: targetLanguage.value }))
  //     }

  //     providerOptions.translation_options = translationOptions
  //   } else {
  //     throw new Error(t('translate.error.chat_qwen_mt'))
  //   }
  // }

  return providerOptions
}
