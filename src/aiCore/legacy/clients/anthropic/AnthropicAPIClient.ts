import Anthropic from '@anthropic-ai/sdk'
import {
  Base64ImageSource,
  ImageBlockParam,
  MessageParam,
  TextBlockParam,
  ToolResultBlockParam,
  ToolUseBlock,
  WebSearchTool20250305
} from '@anthropic-ai/sdk/resources'
import {
  ContentBlock,
  ContentBlockParam,
  MessageCreateParamsBase,
  RedactedThinkingBlockParam,
  ServerToolUseBlockParam,
  ThinkingBlockParam,
  ThinkingConfigParam,
  ToolUnion,
  ToolUseBlockParam,
  WebSearchResultBlock,
  WebSearchToolResultBlockParam,
  WebSearchToolResultError
} from '@anthropic-ai/sdk/resources/messages'
import { MessageStream } from '@anthropic-ai/sdk/resources/messages/messages'
import { File, Paths } from 'expo-file-system/next'
import { t } from 'i18next'

import { findTokenLimit, isClaudeReasoningModel, isReasoningModel, isWebSearchModel } from '@/config/models'
import { DEFAULT_MAX_TOKENS } from '@/constants'
import { getAssistantSettings } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { estimateTextTokens } from '@/services/TokenService'
import { Assistant, EFFORT_RATIO, Model, Provider } from '@/types/assistant'
import {
  ChunkType,
  ErrorChunk,
  LLMWebSearchCompleteChunk,
  LLMWebSearchInProgressChunk,
  MCPToolCreatedChunk,
  TextDeltaChunk,
  TextStartChunk,
  ThinkingDeltaChunk,
  ThinkingStartChunk
} from '@/types/chunk'
import { FileTypes } from '@/types/file'
import { MCPCallToolResponse, MCPToolResponse, ToolCallResponse } from '@/types/mcp'
import { type Message } from '@/types/message'
import { AnthropicSdkMessageParam, AnthropicSdkParams, AnthropicSdkRawChunk, AnthropicSdkRawOutput } from '@/types/sdk'
import { MCPTool } from '@/types/tool'
import { WebSearchSource } from '@/types/websearch'
import { addImageFileToContents } from '@/utils/formats'
import {
  anthropicToolUseToMcpTool,
  isSupportedToolUse,
  mcpToolCallResponseToAnthropicMessage,
  mcpToolsToAnthropicTools
} from '@/utils/mcpTool'
import { findFileBlocks, findImageBlocks } from '@/utils/messageUtils/find'

import { GenericChunk } from '../../middleware/schemas'
import { BaseApiClient } from '../BaseApiClient'
import { AnthropicStreamListener, RawStreamListener, RequestTransformer, ResponseChunkTransformer } from '../types'

const logger = loggerService.withContext('AnthropicAPIClient')

export class AnthropicAPIClient extends BaseApiClient<
  Anthropic,
  AnthropicSdkParams,
  AnthropicSdkRawOutput,
  AnthropicSdkRawChunk,
  AnthropicSdkMessageParam,
  ToolUseBlock,
  ToolUnion
> {
  oauthToken: string | undefined = undefined
  isOAuthMode: boolean = false
  sdkInstance: Anthropic | undefined = undefined
  constructor(provider: Provider) {
    super(provider)
  }

  async getSdkInstance(): Promise<Anthropic> {
    if (this.sdkInstance) {
      return this.sdkInstance
    }

    if (this.provider.authType === 'oauth') {
      if (!this.oauthToken) {
        throw new Error('OAuth token is not available')
      }

      this.sdkInstance = new Anthropic({
        authToken: this.oauthToken,
        baseURL: 'https://api.anthropic.com',
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'oauth-2025-04-20'
          // ...this.provider.extra_headers
        }
      })
    } else {
      this.sdkInstance = new Anthropic({
        apiKey: this.apiKey,
        baseURL: this.getBaseURL(),
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          'anthropic-beta': 'output-128k-2025-02-19',
          ...this.provider.extra_headers
        }
      })
    }

    return this.sdkInstance
  }

  private buildClaudeCodeSystemMessage(system?: string | TextBlockParam[]): string | TextBlockParam[] {
    const defaultClaudeCodeSystem = `You are Claude Code, Anthropic's official CLI for Claude.`

    if (!system) {
      return defaultClaudeCodeSystem
    }

    if (typeof system === 'string') {
      if (system.trim() === defaultClaudeCodeSystem) {
        return system
      }

      return [
        {
          type: 'text',
          text: defaultClaudeCodeSystem
        },
        {
          type: 'text',
          text: system
        }
      ]
    }

    if (system[0].text.trim() != defaultClaudeCodeSystem) {
      system.unshift({
        type: 'text',
        text: defaultClaudeCodeSystem
      })
    }

    return system
  }

  override async createCompletions(
    payload: AnthropicSdkParams,
    options?: Anthropic.RequestOptions
  ): Promise<AnthropicSdkRawOutput> {
    if (this.provider.authType === 'oauth') {
      // this.oauthToken = await window.api.anthropic_oauth.getAccessToken()
      // this.isOAuthMode = true
      // logger.info('[Anthropic Provider] Using OAuth token for authentication')
      // payload.system = this.buildClaudeCodeSystemMessage(payload.system)
      logger.error('Anthropic OAuth token is not available')
      throw new Error('Anthropic OAuth token is not available')
    }

    const sdk = (await this.getSdkInstance()) as Anthropic

    if (payload.stream) {
      return sdk.messages.stream(payload, options)
    }

    return await sdk.messages.create(payload, options)
  }

  // @ts-ignore sdk未提供

  override async generateImage(generateImageParams: GenerateImageParams): Promise<string[]> {
    return []
  }

  override async listModels(): Promise<Anthropic.ModelInfo[]> {
    if (this.provider.authType === 'oauth') {
      // this.oauthToken = await window.api.anthropic_oauth.getAccessToken()
      // this.isOAuthMode = true
      // logger.info('[Anthropic Provider] Using OAuth token for authentication')
      //
      logger.error('Anthropic OAuth token is not available')
      throw new Error('Anthropic OAuth token is not available')
    }

    const sdk = (await this.getSdkInstance()) as Anthropic
    const response = await sdk.models.list()

    return response.data
  }

  // @ts-ignore sdk未提供
  override async getEmbeddingDimensions(): Promise<number> {
    throw new Error("Anthropic SDK doesn't support getEmbeddingDimensions method.")
  }

  override getTemperature(assistant: Assistant, model: Model): number | undefined {
    if (assistant.settings?.reasoning_effort && isClaudeReasoningModel(model)) {
      return undefined
    }

    return super.getTemperature(assistant, model)
  }

  override getTopP(assistant: Assistant, model: Model): number | undefined {
    if (assistant.settings?.reasoning_effort && isClaudeReasoningModel(model)) {
      return undefined
    }

    return super.getTopP(assistant, model)
  }

  /**
   * Get the reasoning effort
   * @param assistant - The assistant
   * @param model - The model
   * @returns The reasoning effort
   */
  private getBudgetToken(assistant: Assistant, model: Model): ThinkingConfigParam | undefined {
    if (!isReasoningModel(model)) {
      return undefined
    }

    const { maxTokens } = getAssistantSettings(assistant)

    const reasoningEffort = assistant?.settings?.reasoning_effort

    if (reasoningEffort === undefined) {
      return {
        type: 'disabled'
      }
    }

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
      type: 'enabled',
      budget_tokens: budgetTokens
    }
  }

  private static isValidBase64ImageMediaType(mime: string): mime is Base64ImageSource['media_type'] {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mime)
  }

  /**
   * Get the message parameter
   * @param message - The message
   * @returns The message parameter
   */
  public async convertMessageToSdkParam(message: Message): Promise<AnthropicSdkMessageParam> {
    const { textContent, imageContents } = await this.getMessageContent(message)

    const parts: MessageParam['content'] = [
      {
        type: 'text',
        text: textContent
      }
    ]

    if (imageContents.length > 0) {
      for (const imageContent of imageContents) {
        const image = new File(Paths.join(Paths.cache, 'Files', imageContent.fileId + imageContent.fileExt))

        if (!image.type) {
          logger.warn('Image type not found', { fileId: imageContent.fileId })
          throw new Error('Image type not found')
        }

        image.type = image.type.replace('jpg', 'jpeg')

        if (AnthropicAPIClient.isValidBase64ImageMediaType(image.type)) {
          parts.push({
            type: 'image',
            source: {
              data: image.base64(),
              media_type: image.type,
              type: 'base64'
            }
          })
        } else {
          logger.warn('Unsupported image type, ignored.', { mime: image.type })
        }
      }
    }

    // Get and process image blocks
    const imageBlocks = await findImageBlocks(message)

    for (const imageBlock of imageBlocks) {
      if (imageBlock.file) {
        const image = new File(imageBlock.file.path)

        parts.push({
          type: 'image',
          source: {
            data: image.base64(),
            media_type: image.type?.replace('jpg', 'jpeg') as any,
            type: 'base64'
          }
        })
      }
    }

    // Get and process file blocks
    const fileBlocks = await findFileBlocks(message)

    for (const fileBlock of fileBlocks) {
      const { file } = fileBlock

      if ([FileTypes.TEXT, FileTypes.DOCUMENT].includes(file.type)) {
        if (file.ext === '.pdf' && file.size < 32 * 1024 * 1024) {
          const base64Data = new File(file.path).base64()
          parts.push({
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64Data
            }
          })
        } else {
          const fileContent = (await new File(file.path).text()).trim()
          parts.push({
            type: 'text',
            text: file.origin_name + '\n' + fileContent
          })
        }
      }
    }

    return {
      role: message.role === 'system' ? 'user' : message.role,
      content: parts
    }
  }

  public convertMcpToolsToSdkTools(mcpTools: MCPTool[]): ToolUnion[] {
    return mcpToolsToAnthropicTools(mcpTools)
  }

  public convertMcpToolResponseToSdkMessageParam(
    mcpToolResponse: MCPToolResponse,
    resp: MCPCallToolResponse,
    model: Model
  ): AnthropicSdkMessageParam | undefined {
    if ('toolUseId' in mcpToolResponse && mcpToolResponse.toolUseId) {
      return mcpToolCallResponseToAnthropicMessage(mcpToolResponse, resp, model)
    } else if ('toolCallId' in mcpToolResponse) {
      return {
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: mcpToolResponse.toolCallId!,
            content: resp.content
              .map(item => {
                if (item.type === 'text') {
                  return {
                    type: 'text',
                    text: item.text || ''
                  } satisfies TextBlockParam
                }

                if (item.type === 'image') {
                  return {
                    type: 'image',
                    source: {
                      data: item.data || '',
                      media_type: (item.mimeType || 'image/png') as Base64ImageSource['media_type'],
                      type: 'base64'
                    }
                  } satisfies ImageBlockParam
                }

                return
              })
              .filter(n => typeof n !== 'undefined'),
            is_error: resp.isError
          } satisfies ToolResultBlockParam
        ]
      }
    }

    return
  }

  // Implementing abstract methods from BaseApiClient
  convertSdkToolCallToMcp(toolCall: ToolUseBlock, mcpTools: MCPTool[]): MCPTool | undefined {
    // Based on anthropicToolUseToMcpTool logic in AnthropicProvider
    // This might need adjustment based on how tool calls are specifically handled in the new structure
    const mcpTool = anthropicToolUseToMcpTool(mcpTools, toolCall)
    return mcpTool
  }

  convertSdkToolCallToMcpToolResponse(toolCall: ToolUseBlock, mcpTool: MCPTool): ToolCallResponse {
    return {
      id: toolCall.id,
      toolCallId: toolCall.id,
      tool: mcpTool,
      arguments: toolCall.input as Record<string, unknown>,
      status: 'pending'
    } as ToolCallResponse
  }

  override buildSdkMessages(
    currentReqMessages: AnthropicSdkMessageParam[],
    output: Anthropic.Message,
    toolResults: AnthropicSdkMessageParam[]
  ): AnthropicSdkMessageParam[] {
    const assistantMessage: AnthropicSdkMessageParam = {
      role: output.role,
      content: convertContentBlocksToParams(output.content)
    }

    const newMessages: AnthropicSdkMessageParam[] = [...currentReqMessages, assistantMessage]

    if (toolResults && toolResults.length > 0) {
      newMessages.push(...toolResults)
    }

    return newMessages
  }

  override estimateMessageTokens(message: AnthropicSdkMessageParam): number {
    if (typeof message.content === 'string') {
      return estimateTextTokens(message.content)
    }

    return message.content
      .map(content => {
        switch (content.type) {
          case 'text':
            return estimateTextTokens(content.text)

          case 'image':
            if (content.source.type === 'base64') {
              return estimateTextTokens(content.source.data)
            } else {
              return estimateTextTokens(content.source.url)
            }

          case 'tool_use':
            return estimateTextTokens(JSON.stringify(content.input))
          case 'tool_result':
            return estimateTextTokens(JSON.stringify(content.content))
          default:
            return 0
        }
      })
      .reduce((acc, curr) => acc + curr, 0)
  }

  public buildAssistantMessage(message: Anthropic.Message): AnthropicSdkMessageParam {
    const messageParam: AnthropicSdkMessageParam = {
      role: message.role,
      content: convertContentBlocksToParams(message.content)
    }
    return messageParam
  }

  public extractMessagesFromSdkPayload(sdkPayload: AnthropicSdkParams): AnthropicSdkMessageParam[] {
    return sdkPayload.messages || []
  }

  /**
   * Anthropic专用的原始流监听器
   * 处理MessageStream对象的特定事件
   */
  attachRawStreamListener(
    rawOutput: AnthropicSdkRawOutput,
    listener: RawStreamListener<AnthropicSdkRawChunk>
  ): AnthropicSdkRawOutput {
    logger.debug(`Attaching stream listener to raw output`)
    // 专用的Anthropic事件处理
    const anthropicListener = listener as AnthropicStreamListener

    // 检查是否为MessageStream
    if (rawOutput instanceof MessageStream) {
      logger.debug(`Detected Anthropic MessageStream, attaching specialized listener`)

      if (listener.onStart) {
        listener.onStart()
      }

      if (listener.onChunk) {
        rawOutput.on('streamEvent', (event: AnthropicSdkRawChunk) => {
          listener.onChunk!(event)
        })
      }

      if (anthropicListener.onContentBlock) {
        rawOutput.on('contentBlock', anthropicListener.onContentBlock)
      }

      if (anthropicListener.onMessage) {
        rawOutput.on('finalMessage', anthropicListener.onMessage)
      }

      if (listener.onEnd) {
        rawOutput.on('end', () => {
          listener.onEnd!()
        })
      }

      if (listener.onError) {
        rawOutput.on('error', (error: Error) => {
          listener.onError!(error)
        })
      }

      return rawOutput
    }

    if (anthropicListener.onMessage) {
      anthropicListener.onMessage(rawOutput)
    }

    // 对于非MessageStream响应
    return rawOutput
  }

  private async getWebSearchParams(model: Model): Promise<WebSearchTool20250305 | undefined> {
    if (!isWebSearchModel(model)) {
      return undefined
    }

    return {
      type: 'web_search_20250305',
      name: 'web_search',
      max_uses: 5
    } as WebSearchTool20250305
  }

  getRequestTransformer(): RequestTransformer<AnthropicSdkParams, AnthropicSdkMessageParam> {
    return {
      transform: async (
        coreRequest,
        assistant,
        model,
        isRecursiveCall,
        recursiveSdkMessages
      ): Promise<{
        payload: AnthropicSdkParams
        messages: AnthropicSdkMessageParam[]
        metadata: Record<string, any>
      }> => {
        const { messages, mcpTools, maxTokens, streamOutput, enableWebSearch } = coreRequest
        // 1. 处理系统消息
        const systemPrompt = assistant.prompt

        // 2. 设置工具
        const { tools } = this.setupToolsConfig({
          mcpTools: mcpTools,
          model,
          enableToolUse: isSupportedToolUse(assistant)
        })

        const systemMessage: TextBlockParam | undefined = systemPrompt
          ? { type: 'text', text: systemPrompt }
          : undefined

        // 3. 处理用户消息
        const sdkMessages: AnthropicSdkMessageParam[] = []

        if (typeof messages === 'string') {
          sdkMessages.push({ role: 'user', content: messages })
        } else {
          const processedMessages = await addImageFileToContents(messages)

          for (const message of processedMessages) {
            sdkMessages.push(await this.convertMessageToSdkParam(message))
          }
        }

        if (enableWebSearch) {
          const webSearchTool = await this.getWebSearchParams(model)

          if (webSearchTool) {
            tools.push(webSearchTool)
          }
        }

        const commonParams: MessageCreateParamsBase = {
          model: model.id,
          messages:
            isRecursiveCall && recursiveSdkMessages && recursiveSdkMessages.length > 0
              ? recursiveSdkMessages
              : sdkMessages,
          max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
          temperature: this.getTemperature(assistant, model),
          top_p: this.getTopP(assistant, model),
          system: systemMessage ? [systemMessage] : undefined,
          thinking: this.getBudgetToken(assistant, model),
          tools: tools.length > 0 ? tools : undefined,
          stream: streamOutput,
          // 只在对话场景下应用自定义参数，避免影响翻译、总结等其他业务逻辑
          // 注意：用户自定义参数总是应该覆盖其他参数
          ...(coreRequest.callType === 'chat' ? this.getCustomParameters(assistant) : {})
        }

        const timeout = this.getTimeout(model)
        return { payload: commonParams, messages: sdkMessages, metadata: { timeout } }
      }
    }
  }

  getResponseChunkTransformer(): ResponseChunkTransformer<AnthropicSdkRawChunk> {
    return () => {
      let accumulatedJson = ''
      const toolCalls: Record<number, ToolUseBlock> = {}
      return {
        async transform(rawChunk: AnthropicSdkRawChunk, controller: TransformStreamDefaultController<GenericChunk>) {
          if (typeof rawChunk === 'string') {
            try {
              rawChunk = JSON.parse(rawChunk)
            } catch (error) {
              logger.error('invalid chunk', { rawChunk, error })
              throw new Error(t('error.chat.chunk.non_json'))
            }
          }

          switch (rawChunk.type) {
            case 'message': {
              let i = 0
              let hasTextContent = false
              let hasThinkingContent = false

              for (const content of rawChunk.content) {
                switch (content.type) {
                  case 'text': {
                    if (!hasTextContent) {
                      controller.enqueue({
                        type: ChunkType.TEXT_START
                      } as TextStartChunk)
                      hasTextContent = true
                    }

                    controller.enqueue({
                      type: ChunkType.TEXT_DELTA,
                      text: content.text
                    } as TextDeltaChunk)
                    break
                  }

                  case 'tool_use': {
                    toolCalls[i] = content
                    i++
                    break
                  }

                  case 'thinking': {
                    if (!hasThinkingContent) {
                      controller.enqueue({
                        type: ChunkType.THINKING_START
                      } as ThinkingStartChunk)
                      hasThinkingContent = true
                    }

                    controller.enqueue({
                      type: ChunkType.THINKING_DELTA,
                      text: content.thinking
                    } as ThinkingDeltaChunk)
                    break
                  }

                  case 'web_search_tool_result': {
                    controller.enqueue({
                      type: ChunkType.LLM_WEB_SEARCH_COMPLETE,
                      llm_web_search: {
                        results: content.content,
                        source: WebSearchSource.ANTHROPIC
                      }
                    } as LLMWebSearchCompleteChunk)
                    break
                  }
                }
              }

              if (i > 0) {
                controller.enqueue({
                  type: ChunkType.MCP_TOOL_CREATED,
                  tool_calls: Object.values(toolCalls)
                } as MCPToolCreatedChunk)
              }

              controller.enqueue({
                type: ChunkType.LLM_RESPONSE_COMPLETE,
                response: {
                  usage: {
                    prompt_tokens: rawChunk.usage.input_tokens || 0,
                    completion_tokens: rawChunk.usage.output_tokens || 0,
                    total_tokens: (rawChunk.usage.input_tokens || 0) + (rawChunk.usage.output_tokens || 0)
                  }
                }
              })
              break
            }

            case 'content_block_start': {
              const contentBlock = rawChunk.content_block

              switch (contentBlock.type) {
                case 'server_tool_use': {
                  if (contentBlock.name === 'web_search') {
                    controller.enqueue({
                      type: ChunkType.LLM_WEB_SEARCH_IN_PROGRESS
                    } as LLMWebSearchInProgressChunk)
                  }

                  break
                }

                case 'web_search_tool_result': {
                  if (
                    contentBlock.content &&
                    (contentBlock.content as WebSearchToolResultError).type === 'web_search_tool_result_error'
                  ) {
                    controller.enqueue({
                      type: ChunkType.ERROR,
                      error: {
                        code: (contentBlock.content as WebSearchToolResultError).error_code,
                        message: (contentBlock.content as WebSearchToolResultError).error_code
                      }
                    } as ErrorChunk)
                  } else {
                    controller.enqueue({
                      type: ChunkType.LLM_WEB_SEARCH_COMPLETE,
                      llm_web_search: {
                        results: contentBlock.content as WebSearchResultBlock[],
                        source: WebSearchSource.ANTHROPIC
                      }
                    } as LLMWebSearchCompleteChunk)
                  }

                  break
                }

                case 'tool_use': {
                  toolCalls[rawChunk.index] = contentBlock
                  break
                }

                case 'text': {
                  controller.enqueue({
                    type: ChunkType.TEXT_START
                  } as TextStartChunk)
                  break
                }

                case 'thinking':

                case 'redacted_thinking': {
                  controller.enqueue({
                    type: ChunkType.THINKING_START
                  } as ThinkingStartChunk)
                  break
                }
              }

              break
            }

            case 'content_block_delta': {
              const messageDelta = rawChunk.delta

              switch (messageDelta.type) {
                case 'text_delta': {
                  if (messageDelta.text) {
                    controller.enqueue({
                      type: ChunkType.TEXT_DELTA,
                      text: messageDelta.text
                    } as TextDeltaChunk)
                  }

                  break
                }

                case 'thinking_delta': {
                  if (messageDelta.thinking) {
                    controller.enqueue({
                      type: ChunkType.THINKING_DELTA,
                      text: messageDelta.thinking
                    } as ThinkingDeltaChunk)
                  }

                  break
                }

                case 'input_json_delta': {
                  if (messageDelta.partial_json) {
                    accumulatedJson += messageDelta.partial_json
                  }

                  break
                }
              }

              break
            }

            case 'content_block_stop': {
              const toolCall = toolCalls[rawChunk.index]

              if (toolCall) {
                try {
                  toolCall.input = accumulatedJson ? JSON.parse(accumulatedJson) : {}
                  logger.debug(`Tool call id: ${toolCall.id}, accumulated json: ${accumulatedJson}`)
                  controller.enqueue({
                    type: ChunkType.MCP_TOOL_CREATED,
                    tool_calls: [toolCall]
                  } as MCPToolCreatedChunk)
                } catch (error) {
                  logger.error('Error parsing tool call input:', error as Error)
                }
              }

              break
            }

            case 'message_delta': {
              controller.enqueue({
                type: ChunkType.LLM_RESPONSE_COMPLETE,
                response: {
                  usage: {
                    prompt_tokens: rawChunk.usage.input_tokens || 0,
                    completion_tokens: rawChunk.usage.output_tokens || 0,
                    total_tokens: (rawChunk.usage.input_tokens || 0) + (rawChunk.usage.output_tokens || 0)
                  }
                }
              })
            }
          }
        }
      }
    }
  }
}

/**
 * 将 ContentBlock 数组转换为 ContentBlockParam 数组
 * 去除服务器生成的额外字段，只保留发送给API所需的字段
 */
function convertContentBlocksToParams(contentBlocks: ContentBlock[]): ContentBlockParam[] {
  return contentBlocks.map((block): ContentBlockParam => {
    switch (block.type) {
      case 'text':
        // TextBlock -> TextBlockParam，去除 citations 等服务器字段
        return {
          type: 'text',
          text: block.text
        } satisfies TextBlockParam
      case 'tool_use':
        // ToolUseBlock -> ToolUseBlockParam
        return {
          type: 'tool_use',
          id: block.id,
          name: block.name,
          input: block.input
        } satisfies ToolUseBlockParam
      case 'thinking':
        // ThinkingBlock -> ThinkingBlockParam
        return {
          type: 'thinking',
          thinking: block.thinking,
          signature: block.signature
        } satisfies ThinkingBlockParam
      case 'redacted_thinking':
        // RedactedThinkingBlock -> RedactedThinkingBlockParam
        return {
          type: 'redacted_thinking',
          data: block.data
        } satisfies RedactedThinkingBlockParam
      case 'server_tool_use':
        // ServerToolUseBlock -> ServerToolUseBlockParam
        return {
          type: 'server_tool_use',
          id: block.id,
          name: block.name,
          input: block.input
        } satisfies ServerToolUseBlockParam
      case 'web_search_tool_result':
        // WebSearchToolResultBlock -> WebSearchToolResultBlockParam
        return {
          type: 'web_search_tool_result',
          tool_use_id: block.tool_use_id,
          content: block.content
        } satisfies WebSearchToolResultBlockParam
      default:
        return block as ContentBlockParam
    }
  })
}
