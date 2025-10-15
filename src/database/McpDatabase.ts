import { MCPServer } from '@/types/mcp'
import { getMcps as _getMcps, upsertMcps as _upsertMcps } from '@db/queries/mcp.queries'

export async function upsertMcps(servers: MCPServer[]) {
  return _upsertMcps(servers)
}

export async function getMcps() {
  return _getMcps()
}

export const mcpDatabase = {
  upsertMcps,
  getMcps
}
