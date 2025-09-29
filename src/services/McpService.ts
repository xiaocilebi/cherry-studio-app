import { getMcps } from '../../db/queries/mcp.queries'

export async function getActiveMcps() {
  return (await getMcps()).filter(mcp => mcp.isActive)
}
