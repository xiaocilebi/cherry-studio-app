import { BUILTIN_TOOLS } from '@/config/mcp'
import { MCPServer } from '@/types/mcp'
import { mcpDatabase } from '@database'

export async function getActiveMcps() {
  return (await mcpDatabase.getMcps()).filter(mcp => mcp.isActive)
}

/**
 * Get Mcp Tools
 * @param mcpServer
 * @returns
 */
export async function fetchMcpTools(mcpServer: MCPServer) {
  // 暂时只获取内置
  const tools = BUILTIN_TOOLS[mcpServer.id]
  return tools || []
}
