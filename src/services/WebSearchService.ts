import dayjs from 'dayjs'

import WebSearchEngineProvider from '@/providers/WebSearchProvider'
import { loggerService } from '@/services/LoggerService'
import { setWebSearchStatus } from '@/store/runtime'
import { WebSearchState } from '@/store/websearch'
import { ExtractResults } from '@/types/extract'
import {
  WebSearchProvider,
  WebSearchProviderResponse,
  WebSearchProviderResult,
  WebSearchStatus
} from '@/types/websearch'
import { hasObjectKey } from '@/utils'

import { getAllWebSearchProviders, getWebSearchProviderByIdSync } from '../../db/queries/websearchProviders.queries'
const logger = loggerService.withContext('WebSearch Service')

class WebSearchService {
  /**
   * 是否暂停
   */
  private signal: AbortSignal | null = null

  isPaused = false

  /**
   * 获取当前存储的网络搜索状态
   * @private
   * @returns 网络搜索状态
   */
  private getWebSearchState(): WebSearchState {
    return store.getState().websearch
  }

  /**
   * 检查网络搜索功能是否启用
   * @public
   * @returns 如果默认搜索提供商已启用则返回true，否则返回false
   */
  public async isWebSearchEnabled(providerId?: WebSearchProvider['id']): Promise<boolean> {
    const providers = await getAllWebSearchProviders()
    const provider = providers.find(provider => provider.id === providerId)

    if (!provider) {
      return false
    }

    if (provider.id.startsWith('local-')) {
      return true
    }

    if (hasObjectKey(provider, 'api_key')) {
      return provider.apiKey !== ''
    }

    if (hasObjectKey(provider, 'api_host')) {
      return provider.apiHost !== ''
    }

    return false
  }

  /**
   * 获取当前默认的网络搜索提供商
   * @public
   * @returns 网络搜索提供商
   */
  public getWebSearchProvider(providerId?: string): WebSearchProvider | undefined {
    if (!providerId) return
    const provider = getWebSearchProviderByIdSync(providerId)

    return provider
  }

  /**
   * 使用指定的提供商执行网络搜索
   * @public
   * @param provider 搜索提供商
   * @param query 搜索查询
   * @returns 搜索响应
   */
  public async search(
    provider: WebSearchProvider,
    query: string,
    httpOptions?: RequestInit
  ): Promise<WebSearchProviderResponse> {
    const websearch = this.getWebSearchState()
    const webSearchEngine = new WebSearchEngineProvider(provider)

    let formattedQuery = query

    // FIXME: 有待商榷，效果一般
    if (websearch.searchWithTime) {
      formattedQuery = `today is ${dayjs().format('YYYY-MM-DD')} \r\n ${query}`
    }

    // try {
    return await webSearchEngine.search(formattedQuery, websearch, httpOptions)
    // } catch (error) {
    //   console.error('Search failed:', error)
    //   throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    // }
  }

  /**
   * 检查搜索提供商是否正常工作
   * @public
   * @param provider 要检查的搜索提供商
   * @returns 如果提供商可用返回true，否则返回false
   */
  public async checkSearch(provider: WebSearchProvider): Promise<{ valid: boolean; error?: any }> {
    try {
      const response = await this.search(provider, 'test query')
      logger.debug('Search response:', response)
      // 优化的判断条件：检查结果是否有效且没有错误
      return { valid: response.results !== undefined, error: undefined }
    } catch (error) {
      return { valid: false, error }
    }
  }

  /**
   * 设置网络搜索状态
   */
  private async setWebSearchStatus(requestId: string, status: WebSearchStatus, delayMs?: number) {
    store.dispatch(setWebSearchStatus({ requestId, status }))

    if (delayMs) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  /**
   * 处理网络搜索请求的核心方法，处理过程中会设置运行时状态供 UI 使用。
   *
   * 该方法执行以下步骤：
   * - 验证输入参数并处理边界情况
   * - 处理特殊的summarize请求
   * - 并行执行多个搜索查询
   * - 聚合搜索结果并处理失败情况
   * - 根据配置应用结果压缩（RAG或截断）
   * - 返回最终的搜索响应
   *
   * @param webSearchProvider - 要使用的网络搜索提供商
   * @param extractResults - 包含搜索问题和链接的提取结果对象
   * @param requestId - 唯一的请求标识符，用于状态跟踪和资源管理
   *
   * @returns 包含搜索结果的响应对象
   */
  public async processWebsearch(
    webSearchProvider: WebSearchProvider,
    extractResults: ExtractResults,
    requestId: string
  ): Promise<WebSearchProviderResponse> {
    // 检查 websearch 和 question 是否有效
    if (!extractResults.websearch?.question || extractResults.websearch.question.length === 0) {
      logger.info('No valid question found in extractResults.websearch')
      return { results: [] }
    }

    const questions = extractResults.websearch.question

    const searchPromises = questions.map(q => this.search(webSearchProvider, q))
    const searchResults = await Promise.allSettled(searchPromises)

    // 统计成功完成的搜索数量
    const successfulSearchCount = searchResults.filter(result => result.status === 'fulfilled').length

    if (successfulSearchCount > 1) {
      await this.setWebSearchStatus(
        requestId,
        {
          phase: 'fetch_complete',
          countAfter: successfulSearchCount
        },
        1000
      )
    }

    const finalResults: WebSearchProviderResult[] = []
    searchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        if (result.value.results) {
          finalResults.push(...result.value.results)
        }
      }

      if (result.status === 'rejected') {
        throw result.reason
      }
    })

    // 如果没有搜索结果，直接返回空结果
    if (finalResults.length === 0) {
      return {
        query: questions.join(' | '),
        results: []
      }
    }

    return {
      query: questions.join(' | '),
      results: finalResults
    }
  }
}
export default new WebSearchService()
