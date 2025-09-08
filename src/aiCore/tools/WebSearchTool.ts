import { InferToolInput, InferToolOutput, tool } from 'ai'
import { z } from 'zod'

import { REFERENCE_PROMPT } from '@/config/prompts'
import { loggerService } from '@/services/LoggerService'
import WebSearchService from '@/services/WebSearchService'
import { ExtractResults } from '@/types/extract'
import { WebSearchProvider, WebSearchProviderResponse } from '@/types/websearch'

const logger = loggerService.withContext('WebSearchTool')

/**
 * 使用预提取关键词的网络搜索工具
 * 这个工具直接使用插件阶段分析的搜索意图，避免重复分析
 */
export const webSearchToolWithPreExtractedKeywords = (
  webSearchProviderId: WebSearchProvider['id'],
  extractedKeywords: {
    question: string[]
    links?: string[]
  },
  requestId: string
) => {
  const webSearchProvider = WebSearchService.getWebSearchProvider(webSearchProviderId)

  logger.info('Starting web search with pre-extracted keywords')

  return tool({
    name: 'builtin_web_search',
    description: `Search the web and return citable sources using pre-analyzed search intent.

Pre-extracted search keywords: "${extractedKeywords.question.join(', ')}"${
      extractedKeywords.links
        ? `
Relevant links: ${extractedKeywords.links.join(', ')}`
        : ''
    }

This tool searches for relevant information and formats results for easy citation. The returned sources should be cited using [1], [2], etc. format in your response.

Call this tool to execute the search. You can optionally provide additional context to refine the search.`,

    inputSchema: z.object({
      additionalContext: z
        .string()
        .optional()
        .describe('Optional additional context, keywords, or specific focus to enhance the search')
    }),

    execute: async ({ additionalContext }) => {
      let finalQueries = [...extractedKeywords.question]

      if (additionalContext?.trim()) {
        // 如果大模型提供了额外上下文，使用更具体的描述
        const cleanContext = additionalContext.trim()

        if (cleanContext) {
          finalQueries = [cleanContext]
        }
      }

      let searchResults: WebSearchProviderResponse = {
        query: '',
        results: []
      }

      // 检查是否需要搜索
      if (finalQueries[0] === 'not_needed') {
        return {
          summary: 'No search needed based on the query analysis.',
          searchResults,
          sources: '',
          instructions: ''
        }
      }

      try {
        // 构建 ExtractResults 结构用于 processWebsearch
        const extractResults: ExtractResults = {
          websearch: {
            question: finalQueries,
            links: extractedKeywords.links
          }
        }
        searchResults = await WebSearchService.processWebsearch(webSearchProvider!, extractResults, requestId)
      } catch (error) {
        return {
          summary: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          sources: [],
          instructions: ''
        }
      }

      if (searchResults.results.length === 0) {
        return {
          summary: 'No search results found for the given query.',
          sources: [],
          instructions: ''
        }
      }

      const results = searchResults.results
      const citationData = results.map((result, index) => ({
        number: index + 1,
        title: result.title,
        content: result.content,
        url: result.url
      }))

      // 🔑 返回引用友好的格式，复用 REFERENCE_PROMPT 逻辑
      // const referenceContent = `\`\`\`json\n${JSON.stringify(citationData, null, 2)}\n\`\`\``

      // 构建完整的引用指导文本
      const fullInstructions = REFERENCE_PROMPT.replace(
        '{question}',
        "Based on the search results, please answer the user's question with proper citations."
      ).replace('{references}', 'searchResults:')

      return {
        summary: `Found ${citationData.length} relevant sources. Use [number] format to cite specific information.`,
        searchResults,
        instructions: fullInstructions
      }
    }
  })
}

// export const webSearchToolWithExtraction = (
//   webSearchProviderId: WebSearchProvider['id'],
//   requestId: string,
//   assistant: Assistant
// ) => {
//   const webSearchService = WebSearchService.getInstance(webSearchProviderId)

//   return tool({
//     name: 'web_search_with_extraction',
//     description: 'Search the web for information with automatic keyword extraction from user messages',
//     inputSchema: z.object({
//       userMessage: z.object({
//         content: z.string().describe('The main content of the message'),
//         role: z.enum(['user', 'assistant', 'system']).describe('Message role')
//       }),
//       lastAnswer: z.object({
//         content: z.string().describe('The main content of the message'),
//         role: z.enum(['user', 'assistant', 'system']).describe('Message role')
//       })
//     }),
//     outputSchema: z.object({
//       extractedKeywords: z.object({
//         question: z.array(z.string()),
//         links: z.array(z.string()).optional()
//       }),
//       searchResults: z.array(
//         z.object({
//           query: z.string(),
//           results: WebSearchProviderResult
//         })
//       )
//     }),
//     execute: async ({ userMessage, lastAnswer }) => {
//       const lastUserMessage: Message = {
//         id: requestId,
//         role: userMessage.role,
//         assistantId: assistant.id,
//         topicId: 'temp',
//         createdAt: new Date().toISOString(),
//         status: UserMessageStatus.SUCCESS,
//         blocks: []
//       }

//       const lastAnswerMessage: Message | undefined = lastAnswer
//         ? {
//             id: requestId + '_answer',
//             role: lastAnswer.role,
//             assistantId: assistant.id,
//             topicId: 'temp',
//             createdAt: new Date().toISOString(),
//             status: UserMessageStatus.SUCCESS,
//             blocks: []
//           }
//         : undefined

//       const extractResults = await extractSearchKeywords(lastUserMessage, assistant, {
//         shouldWebSearch: true,
//         shouldKnowledgeSearch: false,
//         lastAnswer: lastAnswerMessage
//       })

//       if (!extractResults?.websearch || extractResults.websearch.question[0] === 'not_needed') {
//         return 'No search needed or extraction failed'
//       }

//       const searchQueries = extractResults.websearch.question
//       const searchResults: Array<{ query: string; results: any }> = []

//       for (const query of searchQueries) {
//         // 构建单个查询的ExtractResults结构
//         const queryExtractResults: ExtractResults = {
//           websearch: {
//             question: [query],
//             links: extractResults.websearch.links
//           }
//         }
//         const response = await webSearchService.processWebsearch(queryExtractResults, requestId)
//         searchResults.push({
//           query,
//           results: response
//         })
//       }

//       return { extractedKeywords: extractResults.websearch, searchResults }
//     }
//   })
// }

// export type WebSearchToolWithExtractionOutput = InferToolOutput<ReturnType<typeof webSearchToolWithExtraction>>

export type WebSearchToolOutput = InferToolOutput<ReturnType<typeof webSearchToolWithPreExtractedKeywords>>
export type WebSearchToolInput = InferToolInput<ReturnType<typeof webSearchToolWithPreExtractedKeywords>>
