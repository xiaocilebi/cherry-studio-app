import { loggerService } from '@/services/LoggerService'
import { MCPServer } from '@/types/mcp'

import { db } from '..'
import { transformDbToMcp, transformMcpToDb } from '../mappers'
import { mcp } from '../schema/mcp'

const logger = loggerService.withContext('DataBase MCP')

/**
 * 批量插入或更新 MCP 服务器配置
 * @description 在事务中执行 upsert 操作，确保数据一致性
 * @param mcpServers - 待插入或更新的 MCP 服务器数组
 * @throws 当数据库操作失败时抛出错误
 */
export async function upsertMcps(mcpServers: MCPServer[]) {
  try {
    const dbRecords = mcpServers.map(transformMcpToDb)
    await db.transaction(async tx => {
      const upsertPromises = dbRecords.map(record =>
        tx.insert(mcp).values(record).onConflictDoUpdate({
          target: mcp.id,
          set: record
        })
      )

      await Promise.all(upsertPromises)
    })
  } catch (error) {
    logger.error('Error upserting MCP servers:', error)
    throw error
  }
}

/**
 * 获取所有 MCP 服务器配置
 * @returns 返回所有 MCP 服务器的数组
 * @throws 当查询操作失败时抛出错误
 */
export async function getMcps(): Promise<MCPServer[]> {
  try {
    const result = await db.select().from(mcp)
    return result.map(transformDbToMcp)
  } catch (error) {
    logger.error('Error getting all MCP servers:', error)
    throw error
  }
}
