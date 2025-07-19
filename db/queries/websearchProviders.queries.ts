import { eq } from 'drizzle-orm'

import { loggerService } from '@/services/LoggerService'
import { WebSearchProvider } from '@/types/websearch'
import { safeJsonParse } from '@/utils/json'

import { db } from '..'
import { websearch_providers } from '../schema'
const logger = loggerService.withContext('DataBase WebSearchProviders')

/**
 * 将数据库记录转换为 WebSearchProvider 类型。
 * @param dbRecord
 * @return 一个 WebSearchProvider 对象。
 */
export function transformDbToWebSearchProvider(dbRecord: any): WebSearchProvider {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    type: dbRecord.url ? 'free' : 'api',
    apiKey: dbRecord.api_key,
    apiHost: dbRecord.api_host,
    engines: dbRecord.engines ? safeJsonParse(dbRecord.engines) : [],
    url: dbRecord.url,
    basicAuthUsername: dbRecord.basic_auth_username,
    basicAuthPassword: dbRecord.basic_auth_password,
    contentLimit: dbRecord.content_limit,
    usingBrowser: !!dbRecord.using_browser
  }
}

/**
 * 将 WebSearchProvider 对象转换为数据库记录格式。
 * @param provider - WebSearchProvider 对象。
 * @returns 一个适合数据库操作的对象。
 */
function transformWebSearchProviderToDb(provider: WebSearchProvider): any {
  return {
    id: provider.id,
    name: provider.name,
    api_key: provider.apiKey,
    api_host: provider.apiHost,
    engines: provider.engines ? JSON.stringify(provider.engines) : null,
    url: provider.url,
    basic_auth_username: provider.basicAuthUsername,
    basic_auth_password: provider.basicAuthPassword,
    content_limit: provider.contentLimit,
    using_browser: provider.usingBrowser ? 1 : 0
  }
}

/**
 * 更新或插入 WebSearchProvider 数据到数据库。
 * @param providersToUpsert - 要更新或插入的 WebSearchProvider 数组。
 */
export async function upsertWebSearchProviders(providersToUpsert: WebSearchProvider[]) {
  try {
    const dbRecords = providersToUpsert.map(transformWebSearchProviderToDb)
    const upsertPromises = dbRecords.map(record =>
      db
        .insert(websearch_providers)
        .values(record)
        .onConflictDoUpdate({
          target: [websearch_providers.id],
          set: record
        })
    )
    await Promise.all(upsertPromises)
  } catch (error) {
    logger.error('Error in upsertWebSearchProviders:', error)
    throw error
  }
}

export async function getWebSearchProviderById(providerId: string): Promise<WebSearchProvider | undefined> {
  try {
    const result = await db.select().from(websearch_providers).where(eq(websearch_providers.id, providerId)).limit(1)

    if (result.length === 0) {
      return undefined
    }

    return transformDbToWebSearchProvider(result[0])
  } catch (error) {
    logger.error('Error in getWebSearchProviderById:', error)
    throw error
  }
}

export async function getAllWebSearchProviders(): Promise<WebSearchProvider[]> {
  try {
    const result = await db.select().from(websearch_providers)

    if (result.length === 0) {
      return []
    }

    return result.map(transformDbToWebSearchProvider)
  } catch (error) {
    logger.error('Error in getAllWebSearchProviders:', error)
    throw error
  }
}
