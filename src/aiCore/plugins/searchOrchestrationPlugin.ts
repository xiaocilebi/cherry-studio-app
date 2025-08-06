import type { AiRequestContext, ModelMessage } from '@cherrystudio/ai-core'
import { definePlugin } from '@cherrystudio/ai-core'
import { isEmpty } from 'lodash'

import {
  SEARCH_SUMMARY_PROMPT,
  SEARCH_SUMMARY_PROMPT_KNOWLEDGE_ONLY,
  SEARCH_SUMMARY_PROMPT_WEB_ONLY
} from '@/config/prompts'
import { getDefaultModel, getProviderByModel } from '@/services/AssistantService'
import { Assistant } from '@/types/assistant'
import { ExtractResults } from '@/types/extract'
import { extractInfoFromXML } from '@/utils/extract'

import { webSearchToolWithPreExtractedKeywords } from '../tools/WebSearchTool'

const getMessageContent = (message: ModelMessage) => {
  if (typeof message.content === 'string') return message.content
  return message.content.reduce((acc, part) => {
    if (part.type === 'text') {
      return acc + part.text + '\n'
    }

    return acc
  }, '')
}

// === Schema Definitions ===

// const WebSearchSchema = z.object({
//   question: z
//     .array(z.string())
//     .describe('Search queries for web search. Use "not_needed" if no web search is required.'),
//   links: z.array(z.string()).optional().describe('Specific URLs to search or summarize if mentioned in the query.')
// })

// const KnowledgeSearchSchema = z.object({
//   question: z
//     .array(z.string())
//     .describe('Search queries for knowledge base. Use "not_needed" if no knowledge search is required.'),
//   rewrite: z
//     .string()
//     .describe('Rewritten query with alternative phrasing while preserving original intent and meaning.')
// })

// const SearchIntentAnalysisSchema = z.object({
//   websearch: WebSearchSchema.optional().describe('Web search intent analysis results.'),
//   knowledge: KnowledgeSearchSchema.optional().describe('Knowledge base search intent analysis results.')
// })

// type SearchIntentResult = z.infer<typeof SearchIntentAnalysisSchema>

// let isAnalyzing = false
/**
 * 🧠 意图分析函数 - 使用 XML 解析
 */
async function analyzeSearchIntent(
  lastUserMessage: ModelMessage,
  assistant: Assistant,
  options: {
    shouldWebSearch?: boolean
    shouldKnowledgeSearch?: boolean
    shouldMemorySearch?: boolean
    lastAnswer?: ModelMessage
    context: AiRequestContext & {
      isAnalyzing?: boolean
    }
  }
): Promise<ExtractResults | undefined> {
  const { shouldWebSearch = false, shouldKnowledgeSearch = false, lastAnswer, context } = options

  if (!lastUserMessage) return undefined

  // 根据配置决定是否需要提取
  const needWebExtract = shouldWebSearch
  const needKnowledgeExtract = shouldKnowledgeSearch

  if (!needWebExtract && !needKnowledgeExtract) return undefined

  // 选择合适的提示词
  let prompt: string
  // let schema: z.Schema

  if (needWebExtract && !needKnowledgeExtract) {
    prompt = SEARCH_SUMMARY_PROMPT_WEB_ONLY
    // schema = z.object({ websearch: WebSearchSchema })
  } else if (!needWebExtract && needKnowledgeExtract) {
    prompt = SEARCH_SUMMARY_PROMPT_KNOWLEDGE_ONLY
    // schema = z.object({ knowledge: KnowledgeSearchSchema })
  } else {
    prompt = SEARCH_SUMMARY_PROMPT
    // schema = SearchIntentAnalysisSchema
  }

  // 构建消息上下文 - 简化逻辑
  const chatHistory = lastAnswer ? `assistant: ${getMessageContent(lastAnswer)}` : ''
  const question = getMessageContent(lastUserMessage) || ''

  // 使用模板替换变量
  const formattedPrompt = prompt.replace('{chat_history}', chatHistory).replace('{question}', question)

  // 获取模型和provider信息
  const model = assistant.model || getDefaultModel()
  const provider = getProviderByModel(model)

  if (!provider || isEmpty(provider.apiKey)) {
    console.error('Provider not found or missing API key')
    return getFallbackResult()
  }

  // console.log('formattedPrompt', schema)
  try {
    context.isAnalyzing = true
    const { text: result } = await context.executor.generateText(model.id, {
      prompt: formattedPrompt
    })
    context.isAnalyzing = false
    const parsedResult = extractInfoFromXML(result)
    console.log('parsedResult', parsedResult)

    // 根据需求过滤结果
    return {
      websearch: needWebExtract ? parsedResult?.websearch : undefined,
      knowledge: needKnowledgeExtract ? parsedResult?.knowledge : undefined
    }
  } catch (e: any) {
    console.error('analyze search intent error', e)
    return getFallbackResult()
  }

  function getFallbackResult(): ExtractResults {
    const fallbackContent = getMessageContent(lastUserMessage)
    return {
      websearch: shouldWebSearch ? { question: [fallbackContent || 'search'] } : undefined,
      knowledge: shouldKnowledgeSearch
        ? {
            question: [fallbackContent || 'search'],
            rewrite: fallbackContent || 'search'
          }
        : undefined
    }
  }
}

/**
 * 🎯 搜索编排插件
 */
export const searchOrchestrationPlugin = (assistant: Assistant) => {
  // 存储意图分析结果
  const intentAnalysisResults: { [requestId: string]: ExtractResults } = {}
  const userMessages: { [requestId: string]: ModelMessage } = {}
  console.log('searchOrchestrationPlugin', assistant)

  return definePlugin({
    name: 'search-orchestration',
    enforce: 'pre', // 确保在其他插件之前执行

    /**
     * 🔍 Step 1: 意图识别阶段
     */
    onRequestStart: async (context: AiRequestContext) => {
      console.log('onRequestStart', context.isAnalyzing)
      if (context.isAnalyzing) return
      console.log('🧠 [SearchOrchestration] Starting intent analysis...', context.requestId)

      try {
        const messages = context.originalParams.messages

        if (!messages || messages.length === 0) {
          console.log('🧠 [SearchOrchestration] No messages found, skipping analysis')
          return
        }

        const lastUserMessage = messages[messages.length - 1]
        const lastAssistantMessage = messages.length >= 2 ? messages[messages.length - 2] : undefined

        // 存储用户消息用于后续记忆存储
        userMessages[context.requestId] = lastUserMessage

        const shouldWebSearch = !!assistant.webSearchProviderId

        console.log('🧠 [SearchOrchestration] Search capabilities:', {
          shouldWebSearch
        })

        // 执行意图分析
        if (shouldWebSearch) {
          const analysisResult = await analyzeSearchIntent(lastUserMessage, assistant, {
            shouldWebSearch,
            lastAnswer: lastAssistantMessage,
            context
          })

          if (analysisResult) {
            intentAnalysisResults[context.requestId] = analysisResult
            console.log('🧠 [SearchOrchestration] Intent analysis completed:', analysisResult)
          }
        }
      } catch (error) {
        console.error('🧠 [SearchOrchestration] Intent analysis failed:', error)
        // 不抛出错误，让流程继续
      }
    },

    /**
     * 🔧 Step 2: 工具配置阶段
     */
    transformParams: async (params: any, context: AiRequestContext) => {
      if (context.isAnalyzing) return params
      console.log('🔧 [SearchOrchestration] Configuring tools based on intent...', context.requestId)

      try {
        const analysisResult = intentAnalysisResults[context.requestId]
        // if (!analysisResult || !assistant) {
        //   console.log('🔧 [SearchOrchestration] No analysis result or assistant, skipping tool configuration')
        //   return params
        // }

        // 确保 tools 对象存在
        if (!params.tools) {
          params.tools = {}
        }

        // 🌐 网络搜索工具配置
        if (analysisResult?.websearch && assistant.webSearchProviderId) {
          const needsSearch = analysisResult.websearch.question && analysisResult.websearch.question[0] !== 'not_needed'

          if (needsSearch) {
            // onChunk({ type: ChunkType.EXTERNEL_TOOL_IN_PROGRESS })
            console.log('🌐 [SearchOrchestration] Adding web search tool with pre-extracted keywords')
            params.tools['builtin_web_search'] = webSearchToolWithPreExtractedKeywords(
              assistant.webSearchProviderId,
              analysisResult.websearch,
              context.requestId
            )
          }
        }

        console.log('🔧 [SearchOrchestration] Tools configured:', Object.keys(params.tools))
        return params
      } catch (error) {
        console.error('🔧 [SearchOrchestration] Tool configuration failed:', error)
        return params
      }
    },

    /**
     * 💾 Step 3: 记忆存储阶段
     */

    onRequestEnd: async (context: AiRequestContext, result: any) => {
      // context.isAnalyzing = false
      console.log('context.isAnalyzing', context, result)
      console.log('💾 [SearchOrchestration] Starting memory storage...', context.requestId)
      if (context.isAnalyzing) return

      try {
        // const messages = context.originalParams.messages

        // if (messages && assistant) {
        //   await storeConversationMemory(messages, assistant, context)
        // }

        // 清理缓存
        delete intentAnalysisResults[context.requestId]
        delete userMessages[context.requestId]
      } catch (error) {
        console.error('💾 [SearchOrchestration] Memory storage failed:', error)
        // 不抛出错误，避免影响主流程
      }
    }
  })
}

export default searchOrchestrationPlugin
