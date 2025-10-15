import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useMemo } from 'react'
import { db } from '@db/index'
import { mcp as mcpSchema } from '@db/schema'
import { MCPServer } from '@/types/mcp'
import { transformDbToMcp } from '@db/mappers'
import { upsertMcps } from '@db/queries/mcp.queries'

export function useMcpServers() {
  const query = db.select().from(mcpSchema)
  const { data: rawMcps, updatedAt } = useLiveQuery(query)
  const updateMcpServers = async (mcps: MCPServer[]) => {
    await upsertMcps(mcps)
  }

  const processedMcps = useMemo(() => {
    if (!rawMcps) return []
    return rawMcps.map(mcp => transformDbToMcp(mcp))
  }, [rawMcps])

  if (!updatedAt) {
    return {
      mcpServers: [],
      isLoading: true,
      updateMcpServers
    }
  }

  return {
    mcpServers: processedMcps,
    isLoading: false,
    updateMcpServers
  }
}

export function useActiveMcpServers() {
  const { mcpServers: mcps, isLoading, updateMcpServers } = useMcpServers()

  const activeMcpServers = useMemo(() => {
    return mcps.filter(mcp => mcp.isActive === true)
  }, [mcps])

  return {
    activeMcpServers,
    isLoading,
    updateMcpServers
  }
}
