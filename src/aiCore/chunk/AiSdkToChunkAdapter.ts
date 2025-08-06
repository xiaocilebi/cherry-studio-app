/**
 * AI SDK 到 Cherry Studio Chunk 适配器
 * 用于将 AI SDK 的 fullStream 转换为 Cherry Studio 的 chunk 格式
 */

import { TextStreamPart, ToolSet } from '@cherrystudio/ai-core'

import { Chunk, ChunkType } from '@/types/chunk'
import { BaseTool } from '@/types/tool'
import { WebSearchResults, WebSearchSource } from '@/types/websearch'

import { ToolCallChunkHandler } from './handleTooCallChunk'

// import { ToolCallChunkHandler } from './chunk/handleTooCallChunk'
// const logger = loggerService.withContext('AiSdkToChunkAdapter')

export interface CherryStudioChunk {
  type: 'text-delta' | 'text-complete' | 'tool-call' | 'tool-result' | 'finish' | 'error'
  text?: string
  toolCall?: any
  toolResult?: any
  finishReason?: string
  usage?: any
  error?: any
}

/**
 * AI SDK 到 Cherry Studio Chunk 适配器类
 * 处理 fullStream 到 Cherry Studio chunk 的转换
 */
export class AiSdkToChunkAdapter {
  toolCallHandler: ToolCallChunkHandler
  constructor(
    private onChunk: (chunk: Chunk) => void,
    private mcpTools: BaseTool[] = []
  ) {
    this.toolCallHandler = new ToolCallChunkHandler(onChunk, mcpTools)
  }

  /**
   * 处理 AI SDK 流结果
   * @param aiSdkResult AI SDK 的流结果对象
   * @returns 最终的文本内容
   */
  async processStream(aiSdkResult: any): Promise<string> {
    // 如果是流式且有 fullStream
    if (aiSdkResult.fullStream) {
      await this.readFullStream(aiSdkResult.fullStream)
    }

    // 使用 streamResult.text 获取最终结果
    return await aiSdkResult.text
  }

  /**
   * 读取 fullStream 并转换为 Cherry Studio chunks
   * @param fullStream AI SDK 的 fullStream (ReadableStream)
   */
  private async readFullStream(fullStream: ReadableStream<TextStreamPart<ToolSet>>) {
    const reader = fullStream.getReader()
    const final = {
      text: '',
      reasoningContent: '',
      webSearchResults: [],
      reasoningId: ''
    }

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        // 转换并发送 chunk
        this.convertAndEmitChunk(value, final)
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * 转换 AI SDK chunk 为 Cherry Studio chunk 并调用回调
   * @param chunk AI SDK 的 chunk 数据
   */
  private convertAndEmitChunk(
    chunk: TextStreamPart<any>,
    final: { text: string; reasoningContent: string; webSearchResults: any[]; reasoningId: string }
  ) {
    console.log('AI SDK chunk type:', chunk.type, chunk)

    switch (chunk.type) {
      // === 文本相关事件 ===
      case 'text-start':
        this.onChunk({
          type: ChunkType.TEXT_START
        })
        break
      case 'text-delta':
        final.text += chunk.text || ''
        this.onChunk({
          type: ChunkType.TEXT_DELTA,
          text: final.text || ''
        })
        break
      case 'text-end':
        this.onChunk({
          type: ChunkType.TEXT_COMPLETE,
          text: final.text || ''
        })
        final.text = ''
        break
      case 'reasoning-start':
        if (final.reasoningId !== chunk.id) {
          final.reasoningId = chunk.id
          this.onChunk({
            type: ChunkType.THINKING_START
          })
        }

        break
      case 'reasoning-delta':
        this.onChunk({
          type: ChunkType.THINKING_DELTA,
          text: final.reasoningContent || '',
          thinking_millsec: (chunk.providerMetadata?.metadata?.thinking_millsec as number) || 0
        })
        final.reasoningContent += chunk.text || ''
        break
      case 'reasoning-end':
        this.onChunk({
          type: ChunkType.THINKING_COMPLETE,
          text: (chunk.providerMetadata?.metadata?.thinking_content as string) || '',
          thinking_millsec: (chunk.providerMetadata?.metadata?.thinking_millsec as number) || 0
        })
        final.reasoningContent = ''
        break

      // === 工具调用相关事件（原始 AI SDK 事件，如果没有被中间件处理） ===

      case 'tool-input-start':
      case 'tool-input-delta':
      case 'tool-input-end':
        this.toolCallHandler.handleToolCallCreated(chunk)
        break

      // case 'tool-input-delta':
      //   this.toolCallHandler.handleToolCallCreated(chunk)
      //   break
      case 'tool-call':
        // 原始的工具调用（未被中间件处理）
        this.toolCallHandler.handleToolCall(chunk)
        break

      case 'tool-result':
        // 原始的工具调用结果（未被中间件处理）
        this.toolCallHandler.handleToolResult(chunk)
        break

      // === 步骤相关事件 ===
      // case 'start':
      //   this.onChunk({
      //     type: ChunkType.LLM_RESPONSE_CREATED
      //   })
      //   break
      // TODO: 需要区分接口开始和步骤开始
      // case 'start-step':
      //   this.onChunk({
      //     type: ChunkType.BLOCK_CREATED
      //   })
      //   break
      // case 'step-finish':
      //   this.onChunk({
      //     type: ChunkType.TEXT_COMPLETE,
      //     text: final.text || '' // TEXT_COMPLETE 需要 text 字段
      //   })
      //   final.text = ''
      //   break

      case 'finish-step': {
        const { providerMetadata } = chunk

        // googel web search
        if (providerMetadata?.google?.groundingMetadata) {
          this.onChunk({
            type: ChunkType.LLM_WEB_SEARCH_COMPLETE,
            llm_web_search: {
              results: providerMetadata.google?.groundingMetadata as WebSearchResults,
              source: WebSearchSource.GEMINI
            }
          })
        }

        // else {
        //   this.onChunk({
        //     type: ChunkType.LLM_WEB_SEARCH_COMPLETE,
        //     llm_web_search: {
        //       results: final.webSearchResults,
        //       source: WebSearchSource.AISDK
        //     }
        //   })
        // }
        final.webSearchResults = []
        // final.reasoningId = ''
        break
      }

      case 'finish':
        this.onChunk({
          type: ChunkType.BLOCK_COMPLETE,
          response: {
            text: final.text || '',
            reasoning_content: final.reasoningContent || '',
            usage: {
              completion_tokens: chunk.totalUsage.outputTokens || 0,
              prompt_tokens: chunk.totalUsage.inputTokens || 0,
              total_tokens: chunk.totalUsage.totalTokens || 0
            },
            metrics: chunk.totalUsage
              ? {
                  completion_tokens: chunk.totalUsage.outputTokens || 0,
                  time_completion_millsec: 0
                }
              : undefined
          }
        })
        this.onChunk({
          type: ChunkType.LLM_RESPONSE_COMPLETE,
          response: {
            text: final.text || '',
            reasoning_content: final.reasoningContent || '',
            usage: {
              completion_tokens: chunk.totalUsage.outputTokens || 0,
              prompt_tokens: chunk.totalUsage.inputTokens || 0,
              total_tokens: chunk.totalUsage.totalTokens || 0
            },
            metrics: chunk.totalUsage
              ? {
                  completion_tokens: chunk.totalUsage.outputTokens || 0,
                  time_completion_millsec: 0
                }
              : undefined
          }
        })
        break

      // === 源和文件相关事件 ===
      case 'source':
        if (chunk.sourceType === 'url') {
          // if (final.webSearchResults.length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { sourceType: _, ...rest } = chunk
          final.webSearchResults.push(rest)
          // }
          // this.onChunk({
          //   type: ChunkType.LLM_WEB_SEARCH_COMPLETE,
          //   llm_web_search: {
          //     source: WebSearchSource.AISDK,
          //     results: final.webSearchResults
          //   }
          // })
        }

        break
      case 'file':
        // 文件相关事件，可能是图片生成
        this.onChunk({
          type: ChunkType.IMAGE_COMPLETE,
          image: {
            type: 'base64',
            images: [`data:${chunk.file.mediaType};base64,${chunk.file.base64}`]
          }
        })
        break
      case 'error':
        this.onChunk({
          type: ChunkType.ERROR,
          error: chunk.error as Record<string, any>
        })
        break

      default:
      // 其他类型的 chunk 可以忽略或记录日志
      // console.log('Unhandled AI SDK chunk type:', chunk.type, chunk)
    }
  }
}

export default AiSdkToChunkAdapter
