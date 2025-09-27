import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../../db";
import { mcp as mcpSchema } from "../../db/schema";
import { MCPServer } from "@/types/mcp";
import { transformDbToMcp, upsertMcps } from "../../db/queries/mcp.queries";

export function useMcps(){
  const query = db.select().from(mcpSchema)
  const { data: rawMcps, updatedAt } = useLiveQuery(query)
  const updateMcps = async (mcps: MCPServer[]) => {
    await upsertMcps(mcps)
  }

  if (!updatedAt) {
    return {
      mcps: [],
      isLoading: true,
      updateMcps
    }
  }

  const processedMcps = rawMcps.map(mcp => transformDbToMcp(mcp))

  return {
    mcps: processedMcps,
    isLoading: false,
    updateMcps
  }
}
