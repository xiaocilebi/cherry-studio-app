import {
  hasProviderConfig,
  ProviderConfigFactory,
  ProviderId,
  ProviderSettingsMap
} from '@cherrystudio/ai-core/provider'
import { cloneDeep } from 'lodash'

import { isOpenAIChatCompletionOnlyModel } from '@/config/models'
import { loggerService } from '@/services/LoggerService'
import { getProviderByModel } from '@/services/ProviderService'
import { Model, Provider } from '@/types/assistant'
import { storage } from '@/utils'
import { formatApiHost } from '@/utils/api'

import { aihubmixProviderCreator, newApiResolverCreator } from './config'
import { getAiSdkProviderId } from './factory'

const logger = loggerService.withContext('ProviderConfigProcessor')

/**
 * 获取轮询的API key
 * 复用legacy架构的多key轮询逻辑
 */
function getRotatedApiKey(provider: Provider): string {
  const keys = provider.apiKey.split(',').map(key => key.trim())
  const keyName = `provider:${provider.id}:last_used_key`

  if (keys.length === 1) {
    return keys[0]
  }

  const lastUsedKey = storage.getString(keyName)

  if (!lastUsedKey) {
    storage.set(keyName, keys[0])
    return keys[0]
  }

  const currentIndex = keys.indexOf(lastUsedKey)
  const nextIndex = (currentIndex + 1) % keys.length
  const nextKey = keys[nextIndex]
  storage.set(keyName, nextKey)

  return nextKey
}

/**
 * 处理特殊provider的转换逻辑
 */
function handleSpecialProviders(model: Model, provider: Provider): Provider {
  // if (provider.type === 'vertexai' && !isVertexProvider(provider)) {
  //   if (!isVertexAIConfigured()) {
  //     throw new Error('VertexAI is not configured. Please configure project, location and service account credentials.')
  //   }
  //   return createVertexProvider(provider)
  // }

  if (provider.id === 'aihubmix') {
    return aihubmixProviderCreator(model, provider)
  }

  if (provider.id === 'newapi') {
    return newApiResolverCreator(model, provider)
  }

  if (provider.id === 'vertexai') {
    throw new Error('VertexAI is not supported yet.')
    // return vertexAnthropicProviderCreator(model, provider)
  }

  return provider
}

/**
 * 格式化provider的API Host
 */
function formatProviderApiHost(provider: Provider): Provider {
  const formatted = { ...provider }

  if (formatted.type === 'gemini') {
    formatted.apiHost = formatApiHost(formatted.apiHost, 'v1beta')
  } else {
    formatted.apiHost = formatApiHost(formatted.apiHost)
  }

  return formatted
}

/**
 * 获取实际的Provider配置
 * 简化版：将逻辑分解为小函数
 */
export function getActualProvider(model: Model): Provider {
  const baseProvider = getProviderByModel(model)

  // 按顺序处理各种转换
  let actualProvider = cloneDeep(baseProvider)
  actualProvider = handleSpecialProviders(model, actualProvider)
  actualProvider = formatProviderApiHost(actualProvider)

  return actualProvider
}

/**
 * 将 Provider 配置转换为新 AI SDK 格式
 * 简化版：利用新的别名映射系统
 */
export function providerToAiSdkConfig(
  actualProvider: Provider,
  model: Model
): {
  providerId: ProviderId | 'openai-compatible'
  options: ProviderSettingsMap[keyof ProviderSettingsMap]
} {
  const aiSdkProviderId = getAiSdkProviderId(actualProvider)
  logger.debug('providerToAiSdkConfig', { aiSdkProviderId })

  // 构建基础配置
  const baseConfig = {
    baseURL: actualProvider.apiHost,
    apiKey: getRotatedApiKey(actualProvider)
  }
  // 处理OpenAI模式
  const extraOptions: any = {}

  if (actualProvider.type === 'openai-response' && !isOpenAIChatCompletionOnlyModel(model)) {
    extraOptions.mode = 'responses'
  } else if (aiSdkProviderId === 'openai') {
    extraOptions.mode = 'chat'
  }

  // 添加额外headers
  if (actualProvider.extra_headers) {
    extraOptions.headers = actualProvider.extra_headers

    // copy from openaiBaseClient/openaiResponseApiClient
    if (aiSdkProviderId === 'openai') {
      extraOptions.headers = {
        ...extraOptions.headers,
        'HTTP-Referer': 'https://cherry-ai.com',
        'X-Title': 'Cherry Studio',
        'X-Api-Key': baseConfig.apiKey
      }
    }
  }

  // copilot
  if (actualProvider.id === 'copilot') {
    extraOptions.headers = {
      ...extraOptions.headers,
      'editor-version': 'vscode/1.97.2',
      'copilot-vision-request': 'true'
    }
  }

  // azure
  if (aiSdkProviderId === 'azure' || actualProvider.type === 'azure-openai') {
    extraOptions.apiVersion = actualProvider.apiVersion
    baseConfig.baseURL += '/openai'

    if (actualProvider.apiVersion === 'preview') {
      extraOptions.mode = 'responses'
    } else {
      extraOptions.mode = 'chat'
      extraOptions.useDeploymentBasedUrls = true
    }
  }

  // bedrock
  if (aiSdkProviderId === 'bedrock') {
    throw new Error('Bedrock is not supported yet.')
    // extraOptions.region = getAwsBedrockRegion()
    // extraOptions.accessKeyId = getAwsBedrockAccessKeyId()
    // extraOptions.secretAccessKey = getAwsBedrockSecretAccessKey()
  }

  // google-vertex
  if (aiSdkProviderId === 'google-vertex' || aiSdkProviderId === 'google-vertex-anthropic') {
    throw new Error('VertexAI is not configured. ')
    // if (!isVertexAIConfigured()) {
    //   throw new Error('VertexAI is not configured. Please configure project, location and service account credentials.')
    // }

    // const { project, location, googleCredentials } = createVertexProvider(actualProvider)
    // extraOptions.project = project
    // extraOptions.location = location
    // extraOptions.googleCredentials = {
    //   ...googleCredentials,
    //   privateKey: formatPrivateKey(googleCredentials.privateKey)
    // }

    // // extraOptions.headers = window.api.vertexAI.getAuthHeaders({
    // //   projectId: project,
    // //   serviceAccount: {
    // //     privateKey: googleCredentials.privateKey,
    // //     clientEmail: googleCredentials.clientEmail
    // //   }
    // // })
    // if (baseConfig.baseURL.endsWith('/v1/')) {
    //   baseConfig.baseURL = baseConfig.baseURL.slice(0, -4)
    // } else if (baseConfig.baseURL.endsWith('/v1')) {
    //   baseConfig.baseURL = baseConfig.baseURL.slice(0, -3)
    // }

    // baseConfig.baseURL = isEmpty(baseConfig.baseURL) ? '' : baseConfig.baseURL
  }

  // 如果AI SDK支持该provider，使用原生配置
  if (hasProviderConfig(aiSdkProviderId) && aiSdkProviderId !== 'openai-compatible') {
    const options = ProviderConfigFactory.fromProvider(aiSdkProviderId, baseConfig, extraOptions)
    return {
      providerId: aiSdkProviderId as ProviderId,
      options
    }
  }

  // 否则fallback到openai-compatible
  const options = ProviderConfigFactory.createOpenAICompatible(baseConfig.baseURL, baseConfig.apiKey)
  return {
    providerId: 'openai-compatible',
    options: {
      ...options,
      name: actualProvider.id,
      ...extraOptions
    }
  }
}

/**
 * 检查是否支持使用新的AI SDK
 * 简化版：利用新的别名映射和动态provider系统
 */
export function isModernSdkSupported(provider: Provider): boolean {
  // 特殊检查：vertexai需要配置完整
  // if (provider.type === 'vertexai' && !isVertexAIConfigured()) {
  //   return false
  // }
  if (provider.type === 'vertexai') {
    throw new Error('vertexai provider is not supported')
  }

  // 使用getAiSdkProviderId获取映射后的providerId，然后检查AI SDK是否支持
  const aiSdkProviderId = getAiSdkProviderId(provider)

  // 如果映射到了支持的provider，则支持现代SDK
  return hasProviderConfig(aiSdkProviderId)
}

/**
 * 准备特殊provider的配置,主要用于异步处理的配置
 */
export async function prepareSpecialProviderConfig(
  provider: Provider,
  config: ReturnType<typeof providerToAiSdkConfig>
) {
  // todo
  // switch (provider.id) {
  //   // case 'copilot': {
  //   //   const defaultHeaders = store.getState().copilot.defaultHeaders
  //   //   const { token } = await window.api.copilot.getToken(defaultHeaders)
  //   //   config.options.apiKey = token
  //   //   break
  //   // }

  //   case 'cherryin': {
  //     config.options.fetch = async (url, options) => {
  //       // 在这里对最终参数进行签名
  //       const signature = await window.api.cherryin.generateSignature({
  //         method: 'POST',
  //         path: '/chat/completions',
  //         query: '',
  //         body: JSON.parse(options.body)
  //       })
  //       return fetch(url, {
  //         ...options,
  //         headers: {
  //           ...options.headers,
  //           ...signature
  //         }
  //       })
  //     }

  //     break
  //   }

  //   // case 'anthropic': {
  //   //   if (provider.authType === 'oauth') {
  //   //     const oauthToken = await window.api.anthropic_oauth.getAccessToken()
  //   //     config.options = {
  //   //       ...config.options,
  //   //       headers: {
  //   //         ...(config.options.headers ? config.options.headers : {}),
  //   //         'Content-Type': 'application/json',
  //   //         'anthropic-version': '2023-06-01',
  //   //         'anthropic-beta': 'oauth-2025-04-20',
  //   //         Authorization: `Bearer ${oauthToken}`
  //   //       },
  //   //       baseURL: 'https://api.anthropic.com/v1',
  //   //       apiKey: ''
  //   //     }
  //   //   }
  //   // }
  // }

  return config
}
