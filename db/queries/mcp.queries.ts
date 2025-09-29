import { loggerService } from '@/services/LoggerService'
import { MCPServer } from '@/types/mcp'

import { db } from '..'
import { mcp } from '../schema/mcp'
import { safeJsonParse } from '@/utils/json'

const logger = loggerService.withContext('DataBase MCP')

/**
 * 将数据库记录转换为 MCPServer 类型。
 * @param dbRecord - 从数据库检索的记录。
 * @returns 一个 MCPServer 对象。
 */
export function transformDbToMcp(dbRecord: any): MCPServer {
  // console.log('transformDbToMcp', dbRecord)
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    type: dbRecord.type,
    description: dbRecord.description,
    isActive: !!dbRecord.is_active,
    disabledTools: dbRecord.disabled_tools ? safeJsonParse(dbRecord.disabled_tools) : undefined
  }
}

/**
 * 将 MCPServer 对象转换为数据库记录格式。
 * @param mcpServer - MCPServer 对象。
 * @returns 一个适合数据库操作的对象。
 */
function transformMcpToDb(mcpServer: MCPServer): any {
  return {
    id: mcpServer.id,
    name: mcpServer.name,
    type: mcpServer.type || 'stdio',
    description: mcpServer.description || null,
    is_active: mcpServer.isActive ? 1 : 0,
    disabled_tools: JSON.stringify(mcpServer.disabledTools || [])
  }
}

/**
 * 获取所有 MCP 服务器。
 * @returns 一个包含所有 MCPServer 对象的数组。
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

/**
 * 批量插入或更新 MCP 服务器。
 * @param mcpServers 要插入或更新的 MCP 服务器数组。
 * @returns 无返回值。
 * @description 此函数将尝试插入或更新 MCP 服务器记录到数据库中。
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
