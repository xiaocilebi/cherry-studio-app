import { eq } from 'drizzle-orm'

import { loggerService } from '@/services/LoggerService'

import { db } from '../index'
import { transformDbToDataBackupProvider, transformDataBackupProviderToDb } from '../mappers'
import { backup_providers } from '../schema'
import { buildExcludedSet } from '../utils/buildExcludedSet'

const logger = loggerService.withContext('DataBase Backup')

/**
 * 批量插入或更新数据备份提供商
 * @description 使用 upsert 模式处理备份提供商的新增或更新操作
 * @param providersToUpsert - 待插入或更新的备份提供商数组
 * @returns 返回所有 upsert 操作的 Promise 结果数组
 * @throws 当数据库操作失败时抛出错误
 */
export async function upsertDataBackupProviders(providersToUpsert: any[]) {
  if (providersToUpsert.length === 0) return

  try {
    const dbRecords = providersToUpsert.map(transformDataBackupProviderToDb)

    await db.transaction(async tx => {
      const updateFields = buildExcludedSet(dbRecords[0])

      await tx
        .insert(backup_providers)
        .values(dbRecords)
        .onConflictDoUpdate({
          target: backup_providers.id,
          set: updateFields
        })
    })
  } catch (error) {
    logger.error('Error upserting backup providers:', error)
    throw error
  }
}

/**
 * 根据 ID 获取数据备份提供商
 * @param providerId - 备份提供商的唯一标识符
 * @returns 如果找到则返回备份提供商对象，否则返回 null
 * @throws 当查询操作失败时抛出错误
 */
export async function getDataBackupProvider(providerId: string) {
  try {
    const rawProviders = await db.select().from(backup_providers).where(eq(backup_providers.id, providerId))

    if (!rawProviders || rawProviders.length === 0) {
      return null
    }

    const rawProvider = rawProviders[0]
    return transformDbToDataBackupProvider(rawProvider)
  } catch (error) {
    logger.error('Error getting backup provider:', error)
    throw error
  }
}
