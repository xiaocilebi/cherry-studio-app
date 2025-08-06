import { InferToolInput, InferToolOutput, tool } from 'ai'
import { z } from 'zod'

import { REFERENCE_PROMPT } from '@/config/prompts'
import WebSearchService from '@/services/WebSearchService'
import { ExtractResults } from '@/types/extract'
import { WebSearchProvider, WebSearchProviderResponse } from '@/types/websearch'

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
  const webSearchService = WebSearchService.getInstance(webSearchProviderId)

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
        console.log(`🔍 AI enhanced search with: ${additionalContext}`)
        const cleanContext = additionalContext.trim()

        if (cleanContext) {
          finalQueries = [cleanContext]
          console.log(`➕ Added additional context: ${cleanContext}`)
        }
      }

      const searchResults: WebSearchProviderResponse[] = []

      // 检查是否需要搜索
      if (finalQueries[0] === 'not_needed') {
        return {
          summary: 'No search needed based on the query analysis.',
          searchResults: [],
          sources: '',
          instructions: '',
          rawResults: []
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
        console.log('extractResults', extractResults)
        const response = await webSearchService.processWebsearch(extractResults, requestId)
        searchResults.push(response)
      } catch (error) {
        console.error(`Web search failed for query "${finalQueries}":`, error)
        return {
          summary: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          searchResults: [],
          sources: '',
          instructions: '',
          rawResults: []
        }
      }

      if (searchResults.length === 0 || !searchResults[0].results) {
        return {
          summary: 'No search results found for the given query.',
          searchResults: [],
          sources: '',
          instructions: '',
          rawResults: []
        }
      }

      const results = searchResults[0].results
      const citationData = results.map((result, index) => ({
        number: index + 1,
        title: result.title,
        content: result.content,
        url: result.url
      }))

      // 🔑 返回引用友好的格式，复用 REFERENCE_PROMPT 逻辑
      const referenceContent = `\`\`\`json\n${JSON.stringify(citationData, null, 2)}\n\`\`\``

      // 构建完整的引用指导文本
      const fullInstructions = REFERENCE_PROMPT.replace(
        '{question}',
        "Based on the search results, please answer the user's question with proper citations."
      ).replace('{references}', referenceContent)

      return {
        summary: `Found ${citationData.length} relevant sources. Use [number] format to cite specific information.`,
        searchResults,
        sources: citationData
          .map(source => `[${source.number}] ${source.title}\n${source.content}\nURL: ${source.url}`)
          .join('\n\n'),

        instructions: fullInstructions,

        // 原始数据，便于后续处理
        rawResults: citationData
      }
    }
  })
}

export type WebSearchToolOutput = InferToolOutput<ReturnType<typeof webSearchToolWithPreExtractedKeywords>>
export type WebSearchToolInput = InferToolInput<ReturnType<typeof webSearchToolWithPreExtractedKeywords>>
