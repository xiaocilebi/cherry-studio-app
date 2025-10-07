import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { db } from '../../db'
import { mcp as mcpSchema } from '../../db/schema'
import { MCPServer } from '@/types/mcp'
import { transformDbToMcp } from '../../db/mappers'
import { upsertMcps } from '../../db/queries/mcp.queries'

export function useMcpServers() {
  const query = db.select().from(mcpSchema)
  const { data: rawMcps, updatedAt } = useLiveQuery(query)
  const updateMcpServers = async (mcps: MCPServer[]) => {
    await upsertMcps(mcps)
  }

  if (!updatedAt) {
    return {
      mcpServers: [],
      isLoading: true,
      updateMcpServers
    }
  }

  const processedMcps = rawMcps.map(mcp => transformDbToMcp(mcp))

  return {
    mcpServers: processedMcps,
    isLoading: false,
    updateMcpServers
  }
}

export function useActiveMcpServers() {
  const { mcpServers: mcps, isLoading, updateMcpServers } = useMcpServers()

  const activeMcpServers = mcps.filter(mcp => mcp.isActive === true)

  return {
    activeMcpServers,
    isLoading,
    updateMcpServers
  }
}
