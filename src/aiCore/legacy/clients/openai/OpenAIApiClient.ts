import { File } from 'expo-file-system/next'
import OpenAI, { AzureOpenAI } from 'openai'
import { ChatCompletionContentPart, ChatCompletionContentPartRefusal, ChatCompletionTool } from 'openai/resources'

import { findTokenLimit, GEMINI_FLASH_MODEL_REGEX } from '@/config/models'
import {
  EFFORT_RATIO,
  isDoubaoThinkingAutoModel,
  isQwenReasoningModel,
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
import { isVisionModel } from '@/config/models/vision'
import { getOpenAIWebSearchParams } from '@/config/models/webSearch'
import { DEFAULT_MAX_TOKENS } from '@/constants'
import { loggerService } from '@/services/LoggerService'
import { processPostsuffixQwen3Model, processReqMessages } from '@/services/ModelMessageService'
import { estimateTextTokens } from '@/services/TokenService'
import { Assistant, Model, Provider } from '@/types/assistant'
// For Copilot token
import { ChunkType, TextStartChunk, ThinkingStartChunk } from '@/types/chunk'
import { FileTypes } from '@/types/file'
import { MCPCallToolResponse, MCPToolResponse, ToolCallResponse } from '@/types/mcp'
import { Message } from '@/types/message'
import {
  OpenAISdkMessageParam,
  OpenAISdkParams,
  OpenAISdkRawChunk,
  OpenAISdkRawContentSource,
  OpenAISdkRawOutput,
  ReasoningEffortOptionalParams
} from '@/types/sdk'
import { MCPTool } from '@/types/tool'
import { WebSearchSource } from '@/types/websearch'
import { addImageFileToContents } from '@/utils/formats'
import {
  isEnabledToolUse,
  mcpToolCallResponseToOpenAICompatibleMessage,
  mcpToolsToOpenAIChatTools,
  openAIToolsToMcpTool
} from '@/utils/mcpTool'
import { findFileBlocks, findImageBlocks } from '@/utils/messageUtils/find'
import { buildSystemPrompt } from '@/utils/prompt'

import { GenericChunk } from '../../middleware/schemas'
import { RequestTransformer, ResponseChunkTransformer, ResponseChunkTransformerContext } from '../types'
import { OpenAIBaseClient } from './OpenAIBaseClient'

const logger = loggerService.withContext('OpenAIAPIClient')

export class OpenAIAPIClient extends OpenAIBaseClient<
  OpenAI | AzureOpenAI,
  OpenAISdkParams,
  OpenAISdkRawOutput,
  OpenAISdkRawChunk,
  OpenAISdkMessageParam,
  OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  ChatCompletionTool
> {
  constructor(provider: Provider) {
    super(provider)
  }

  override async createCompletions(
    payload: OpenAISdkParams,
    options?: OpenAI.RequestOptions
  ): Promise<OpenAISdkRawOutput> {
    const sdk = await this.getSdkInstance()
    // @ts-ignore - SDK参数可能有额外的字段
    return await sdk.chat.completions.create(payload, options)
  }

  /**
   * Get the reasoning effort for the assistant
   * @param assistant - The assistant
   * @param model - The model
   * @returns The reasoning effort
   */
  // Method for reasoning effort, moved from OpenAIProvider
  override getReasoningEffort(assistant: Assistant, model: Model): ReasoningEffortOptionalParams {
    if (this.provider.id === 'groq') {
      return {}
    }

    if (!isReasoningModel(model)) {
      return {}
    }

    const reasoningEffort = assistant?.settings?.reasoning_effort

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
        if (
          isSupportedThinkingTokenGeminiModel(model) &&
          !GEMINI_FLASH_MODEL_REGEX.test(model.id) &&
          model.id.includes('grok-4')
        ) {
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
      const thinkConfig = {
        enable_thinking: true,
        thinking_budget: budgetTokens
      }

      if (this.provider.id === 'dashscope') {
        return {
          ...thinkConfig,
          incremental_output: true
        }
      }

      return thinkConfig
    }

    // Grok models
    if (isSupportedReasoningEffortGrokModel(model)) {
      return {
        reasoning_effort: reasoningEffort
      }
    }

    // OpenAI models
    if (isSupportedReasoningEffortOpenAIModel(model)) {
      return {
        reasoning_effort: reasoningEffort
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
   * Check if the provider does not support files
   * @returns True if the provider does not support files, false otherwise
   */
  private get isNotSupportFiles() {
    if (this.provider?.isNotSupportArrayContent) {
      return true
    }

    const providers = ['deepseek', 'baichuan', 'minimax', 'xirang']

    return providers.includes(this.provider.id)
  }

  /**
   * Get the message parameter
   * @param message - The message
   * @param model - The model
   * @returns The message parameter
   */
  public async convertMessageToSdkParam(message: Message, model: Model): Promise<OpenAISdkMessageParam> {
    const isVision = isVisionModel(model)
    const content = await this.getMessageContent(message)
    const fileBlocks = await findFileBlocks(message)
    const imageBlocks = await findImageBlocks(message)

    if (fileBlocks.length === 0 && imageBlocks.length === 0) {
      return {
        role: message.role === 'system' ? 'user' : message.role,
        content
      } as OpenAISdkMessageParam
    }

    // If the model does not support files, extract the file content
    if (this.isNotSupportFiles) {
      const fileContent = await this.extractFileContent(message)

      return {
        role: message.role === 'system' ? 'user' : message.role,
        content: content + '\n\n---\n\n' + fileContent
      } as OpenAISdkMessageParam
    }

    // If the model supports files, add the file content to the message
    const parts: ChatCompletionContentPart[] = []

    if (content) {
      parts.push({ type: 'text', text: content })
    }

    for (const imageBlock of imageBlocks) {
      if (isVision) {
        if (imageBlock.file) {
          const image = new File(imageBlock.file.path)
          parts.push({ type: 'image_url', image_url: { url: image.base64() } })
        } else if (imageBlock.url && imageBlock.url.startsWith('data:')) {
          parts.push({ type: 'image_url', image_url: { url: imageBlock.url } })
        }
      }
    }

    for (const fileBlock of fileBlocks) {
      const file = fileBlock.file

      if (!file) {
        continue
      }

      if ([FileTypes.TEXT, FileTypes.DOCUMENT].includes(file.type)) {
        const fileContent = new File(file.path).text().trim()

        parts.push({
          type: 'text',
          text: file.origin_name + '\n' + fileContent
        })
      }
    }

    return {
      role: message.role === 'system' ? 'user' : message.role,
      content: parts
    } as OpenAISdkMessageParam
  }

  public convertMcpToolsToSdkTools(mcpTools: MCPTool[]): ChatCompletionTool[] {
    return mcpToolsToOpenAIChatTools(mcpTools)
  }

  public convertSdkToolCallToMcp(
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    mcpTools: MCPTool[]
  ): MCPTool | undefined {
    return openAIToolsToMcpTool(mcpTools, toolCall)
  }

  public convertSdkToolCallToMcpToolResponse(
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    mcpTool: MCPTool
  ): ToolCallResponse {
    let parsedArgs: any

    try {
      parsedArgs = JSON.parse(toolCall.function.arguments)
    } catch {
      parsedArgs = toolCall.function.arguments
    }

    return {
      id: toolCall.id,
      toolCallId: toolCall.id,
      tool: mcpTool,
      arguments: parsedArgs,
      status: 'pending'
    } as ToolCallResponse
  }

  public convertMcpToolResponseToSdkMessageParam(
    mcpToolResponse: MCPToolResponse,
    resp: MCPCallToolResponse,
    model: Model
  ): OpenAISdkMessageParam | undefined {
    if ('toolUseId' in mcpToolResponse && mcpToolResponse.toolUseId) {
      // This case is for Anthropic/Claude like tool usage, OpenAI uses tool_call_id
      // For OpenAI, we primarily expect toolCallId. This might need adjustment if mixing provider concepts.
      return mcpToolCallResponseToOpenAICompatibleMessage(
        mcpToolResponse,
        resp,
        isVisionModel(model),
        this.provider.isNotSupportArrayContent ?? false
      )
    } else if ('toolCallId' in mcpToolResponse && mcpToolResponse.toolCallId) {
      return {
        role: 'tool',
        tool_call_id: mcpToolResponse.toolCallId,
        content: JSON.stringify(resp.content)
      } as OpenAI.Chat.Completions.ChatCompletionToolMessageParam
    }

    return undefined
  }

  public buildSdkMessages(
    currentReqMessages: OpenAISdkMessageParam[],
    output: string | undefined,
    toolResults: OpenAISdkMessageParam[],
    toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]
  ): OpenAISdkMessageParam[] {
    if (!output && toolCalls.length === 0) {
      return [...currentReqMessages, ...toolResults]
    }

    const assistantMessage: OpenAISdkMessageParam = {
      role: 'assistant',
      content: output,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined
    }
    const newReqMessages = [...currentReqMessages, assistantMessage, ...toolResults]
    return newReqMessages
  }

  override estimateMessageTokens(message: OpenAISdkMessageParam): number {
    let sum = 0

    if (typeof message.content === 'string') {
      sum += estimateTextTokens(message.content)
    } else if (Array.isArray(message.content)) {
      sum += (message.content || [])
        .map((part: ChatCompletionContentPart | ChatCompletionContentPartRefusal) => {
          switch (part.type) {
            case 'text':
              return estimateTextTokens(part.text)
            case 'image_url':
              return estimateTextTokens(part.image_url.url)
            case 'input_audio':
              return estimateTextTokens(part.input_audio.data)
            case 'file':
              return estimateTextTokens(part.file.file_data || '')
            default:
              return 0
          }
        })
        .reduce((acc, curr) => acc + curr, 0)
    }

    if ('tool_calls' in message && message.tool_calls) {
      sum += message.tool_calls.reduce((acc, toolCall) => {
        return acc + estimateTextTokens(JSON.stringify(toolCall.function.arguments))
      }, 0)
    }

    return sum
  }

  public extractMessagesFromSdkPayload(sdkPayload: OpenAISdkParams): OpenAISdkMessageParam[] {
    return sdkPayload.messages || []
  }

  getRequestTransformer(): RequestTransformer<OpenAISdkParams, OpenAISdkMessageParam> {
    return {
      transform: async (
        coreRequest,
        assistant,
        model,
        isRecursiveCall,
        recursiveSdkMessages
      ): Promise<{
        payload: OpenAISdkParams
        messages: OpenAISdkMessageParam[]
        metadata: Record<string, any>
      }> => {
        const { messages, mcpTools, maxTokens, enableWebSearch } = coreRequest
        let { streamOutput } = coreRequest

        // Qwen3商业版（思考模式）、Qwen3开源版、QwQ、QVQ只支持流式输出。
        if (isQwenReasoningModel(model)) {
          streamOutput = true
        }

        // 1. 处理系统消息
        let systemMessage = { role: 'system', content: assistant.prompt || '' }

        if (isSupportedReasoningEffortOpenAIModel(model)) {
          systemMessage = {
            role: 'developer',
            content: `Formatting re-enabled${systemMessage ? '\n' + systemMessage.content : ''}`
          }
        }

        if (model.id.includes('o1-mini') || model.id.includes('o1-preview')) {
          systemMessage.role = 'assistant'
        }

        // 2. 设置工具（必须在this.usesystemPromptForTools前面）
        const { tools } = this.setupToolsConfig({
          mcpTools: mcpTools,
          model,
          enableToolUse: isEnabledToolUse(assistant)
        })

        if (this.useSystemPromptForTools) {
          systemMessage.content = await buildSystemPrompt(systemMessage.content || '', mcpTools, assistant)
        }

        // 3. 处理用户消息
        const userMessages: OpenAISdkMessageParam[] = []

        if (typeof messages === 'string') {
          userMessages.push({ role: 'user', content: messages })
        } else {
          const processedMessages = await addImageFileToContents(messages)

          for (const message of processedMessages) {
            userMessages.push(await this.convertMessageToSdkParam(message, model))
          }
        }

        const lastUserMsg = userMessages.findLast(m => m.role === 'user')

        if (lastUserMsg && isSupportedThinkingTokenQwenModel(model)) {
          const postsuffix = '/no_think'
          const qwenThinkModeEnabled = assistant.settings?.qwenThinkMode === true
          const currentContent = lastUserMsg.content

          lastUserMsg.content = processPostsuffixQwen3Model(currentContent, postsuffix, qwenThinkModeEnabled) as any
        }

        // 4. 最终请求消息
        let reqMessages: OpenAISdkMessageParam[]

        if (!systemMessage.content) {
          reqMessages = [...userMessages]
        } else {
          reqMessages = [systemMessage, ...userMessages].filter(Boolean) as OpenAISdkMessageParam[]
        }

        reqMessages = processReqMessages(model, reqMessages)

        // 5. 创建通用参数
        const commonParams = {
          model: model.id,
          messages:
            isRecursiveCall && recursiveSdkMessages && recursiveSdkMessages.length > 0
              ? recursiveSdkMessages
              : reqMessages,
          temperature: this.getTemperature(assistant, model),
          top_p: this.getTopP(assistant, model),
          max_tokens: maxTokens,
          tools: tools.length > 0 ? tools : undefined,
          // service_tier: this.getServiceTier(model),
          ...this.getProviderSpecificParameters(assistant, model),
          ...this.getReasoningEffort(assistant, model),
          ...getOpenAIWebSearchParams(model, enableWebSearch),
          // 只在对话场景下应用自定义参数，避免影响翻译、总结等其他业务逻辑
          ...(coreRequest.callType === 'chat' ? this.getCustomParameters(assistant) : {})
        }

        // Create the appropriate parameters object based on whether streaming is enabled
        const sdkParams: OpenAISdkParams = streamOutput
          ? {
              ...commonParams,
              stream: true
            }
          : {
              ...commonParams,
              stream: false
            }

        const timeout = this.getTimeout(model)

        return { payload: sdkParams, messages: reqMessages, metadata: { timeout } }
      }
    }
  }

  // 在RawSdkChunkToGenericChunkMiddleware中使用
  getResponseChunkTransformer(): ResponseChunkTransformer<OpenAISdkRawChunk> {
    let hasBeenCollectedWebSearch = false

    const collectWebSearchData = (
      chunk: OpenAISdkRawChunk,
      contentSource: OpenAISdkRawContentSource,
      context: ResponseChunkTransformerContext
    ) => {
      if (hasBeenCollectedWebSearch) {
        return
      }

      // OpenAI annotations
      // @ts-ignore - annotations may not be in standard type definitions
      const annotations = contentSource.annotations || chunk.annotations

      if (annotations && annotations.length > 0 && annotations[0].type === 'url_citation') {
        hasBeenCollectedWebSearch = true
        return {
          results: annotations,
          source: WebSearchSource.OPENAI
        }
      }

      // Grok citations
      // @ts-ignore - citations may not be in standard type definitions
      if (context.provider?.id === 'grok' && chunk.citations) {
        hasBeenCollectedWebSearch = true
        return {
          // @ts-ignore - citations may not be in standard type definitions
          results: chunk.citations,
          source: WebSearchSource.GROK
        }
      }

      // Perplexity citations
      // @ts-ignore - citations may not be in standard type definitions
      if (context.provider?.id === 'perplexity' && chunk.search_results && chunk.search_results.length > 0) {
        hasBeenCollectedWebSearch = true
        return {
          // @ts-ignore - citations may not be in standard type definitions
          results: chunk.search_results,
          source: WebSearchSource.PERPLEXITY
        }
      }

      // OpenRouter citations
      // @ts-ignore - citations may not be in standard type definitions
      if (context.provider?.id === 'openrouter' && chunk.citations && chunk.citations.length > 0) {
        hasBeenCollectedWebSearch = true
        return {
          // @ts-ignore - citations may not be in standard type definitions
          results: chunk.citations,
          source: WebSearchSource.OPENROUTER
        }
      }

      // Zhipu web search
      // @ts-ignore - web_search may not be in standard type definitions
      if (context.provider?.id === 'zhipu' && chunk.web_search) {
        hasBeenCollectedWebSearch = true
        return {
          // @ts-ignore - web_search may not be in standard type definitions
          results: chunk.web_search,
          source: WebSearchSource.ZHIPU
        }
      }

      // Hunyuan web search
      // @ts-ignore - search_info may not be in standard type definitions
      if (context.provider?.id === 'hunyuan' && chunk.search_info?.search_results) {
        hasBeenCollectedWebSearch = true
        return {
          // @ts-ignore - search_info may not be in standard type definitions
          results: chunk.search_info.search_results,
          source: WebSearchSource.HUNYUAN
        }
      }

      // TODO: 放到AnthropicApiClient中
      // // Other providers...
      // // @ts-ignore - web_search may not be in standard type definitions
      // if (chunk.web_search) {
      //   const sourceMap: Record<string, string> = {
      //     openai: 'openai',
      //     anthropic: 'anthropic',
      //     qwenlm: 'qwen'
      //   }
      //   const source = sourceMap[context.provider?.id] || 'openai_response'
      //   return {
      //     results: chunk.web_search,
      //     source: source as const
      //   }
      // }

      return null
    }

    const toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[] = []
    let isFinished = false
    let lastUsageInfo: any = null

    /**
     * 统一的完成信号发送逻辑
     * - 有 finish_reason 时
     * - 无 finish_reason 但是流正常结束时
     */
    const emitCompletionSignals = (controller: TransformStreamDefaultController<GenericChunk>) => {
      if (isFinished) return

      if (toolCalls.length > 0) {
        controller.enqueue({
          type: ChunkType.MCP_TOOL_CREATED,
          tool_calls: toolCalls
        })
      }

      const usage = lastUsageInfo || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }

      controller.enqueue({
        type: ChunkType.LLM_RESPONSE_COMPLETE,
        response: { usage }
      })

      // 防止重复发送
      isFinished = true
    }

    let isFirstThinkingChunk = true
    let isFirstTextChunk = true
    return (context: ResponseChunkTransformerContext) => ({
      async transform(chunk: OpenAISdkRawChunk, controller: TransformStreamDefaultController<GenericChunk>) {
        // 持续更新usage信息
        if (chunk.usage) {
          lastUsageInfo = {
            prompt_tokens: chunk.usage.prompt_tokens || 0,
            completion_tokens: chunk.usage.completion_tokens || 0,
            total_tokens: (chunk.usage.prompt_tokens || 0) + (chunk.usage.completion_tokens || 0)
          }
        }

        // 处理chunk
        if ('choices' in chunk && chunk.choices && chunk.choices.length > 0) {
          for (const choice of chunk.choices) {
            if (!choice) continue

            // 对于流式响应，使用 delta；对于非流式响应，使用 message。
            // 然而某些 OpenAI 兼容平台在非流式请求时会错误地返回一个空对象的 delta 字段。
            // 如果 delta 为空对象或content为空，应当忽略它并回退到 message，避免造成内容缺失。
            let contentSource: OpenAISdkRawContentSource | null = null

            if (
              'delta' in choice &&
              choice.delta &&
              Object.keys(choice.delta).length > 0 &&
              (!('content' in choice.delta) ||
                (typeof choice.delta.content === 'string' && choice.delta.content !== ''))
            ) {
              contentSource = choice.delta
            } else if ('message' in choice) {
              contentSource = choice.message
            }

            if (!contentSource) {
              if ('finish_reason' in choice && choice.finish_reason) {
                emitCompletionSignals(controller)
              }

              continue
            }

            const webSearchData = collectWebSearchData(chunk, contentSource, context)

            if (webSearchData) {
              controller.enqueue({
                type: ChunkType.LLM_WEB_SEARCH_COMPLETE,
                llm_web_search: webSearchData
              })
            }

            // 处理推理内容 (e.g. from OpenRouter DeepSeek-R1)
            // @ts-ignore - reasoning_content is not in standard OpenAI types but some providers use it
            const reasoningText = contentSource.reasoning_content || contentSource.reasoning

            if (reasoningText) {
              if (isFirstThinkingChunk) {
                controller.enqueue({
                  type: ChunkType.THINKING_START
                } as ThinkingStartChunk)
                isFirstThinkingChunk = false
              }

              controller.enqueue({
                type: ChunkType.THINKING_DELTA,
                text: reasoningText
              })
            }

            // 处理文本内容
            if (contentSource.content) {
              if (isFirstTextChunk) {
                controller.enqueue({
                  type: ChunkType.TEXT_START
                } as TextStartChunk)
                isFirstTextChunk = false
              }

              controller.enqueue({
                type: ChunkType.TEXT_DELTA,
                text: contentSource.content
              })
            }

            // 处理工具调用
            if (contentSource.tool_calls) {
              for (const toolCall of contentSource.tool_calls) {
                if ('index' in toolCall) {
                  const { id, index, function: fun } = toolCall

                  if (fun?.name) {
                    toolCalls[index] = {
                      id: id || '',
                      function: {
                        name: fun.name,
                        arguments: fun.arguments || ''
                      },
                      type: 'function'
                    }
                  } else if (fun?.arguments) {
                    toolCalls[index].function.arguments += fun.arguments
                  }
                } else {
                  toolCalls.push(toolCall)
                }
              }
            }

            // 处理finish_reason，发送流结束信号
            if ('finish_reason' in choice && choice.finish_reason) {
              logger.debug(`[OpenAIApiClient] Stream finished with reason: ${choice.finish_reason}`)
              const webSearchData = collectWebSearchData(chunk, contentSource, context)

              if (webSearchData) {
                controller.enqueue({
                  type: ChunkType.LLM_WEB_SEARCH_COMPLETE,
                  llm_web_search: webSearchData
                })
              }

              emitCompletionSignals(controller)
            }
          }
        }
      },

      // 流正常结束时，检查是否需要发送完成信号
      flush(controller) {
        if (isFinished) return

        logger.debug('[OpenAIApiClient] Stream ended without finish_reason, emitting fallback completion signals')
        emitCompletionSignals(controller)
      }
    })
  }
}
