import { type Tool, type ToolSet } from 'ai'
import { jsonSchema, tool } from 'ai'
import { JSONSchema7 } from 'json-schema'

import { loggerService } from '@/services/LoggerService'
// import { AiSdkTool, ToolCallResult } from '@renderer/aiCore/tools/types'
import { Chunk, ChunkType } from '@/types/chunk'
import { MCPToolResponse } from '@/types/mcp'
import { MCPTool } from '@/types/tool'
import { callMCPTool, getMcpServerByTool, isToolAutoApproved } from '@/utils/mcpTool'

const logger = loggerService.withContext('MCP-utils')

// Setup tools configuration based on provided parameters
export function setupToolsConfig(mcpTools?: MCPTool[]): Record<string, Tool> | undefined {
  let tools: ToolSet = {}

  if (!mcpTools?.length) {
    return undefined
  }

  tools = convertMcpToolsToAiSdkTools(mcpTools)

  return tools
}

/**
 * 将 MCPTool 转换为 AI SDK 工具格式
 */
export function convertMcpToolsToAiSdkTools(mcpTools: MCPTool[]): ToolSet {
  const tools: ToolSet = {}

  for (const mcpTool of mcpTools) {
    tools[mcpTool.name] = tool({
      description: mcpTool.description || `Tool from ${mcpTool.serverName}`,
      inputSchema: jsonSchema(mcpTool.inputSchema as JSONSchema7),
      execute: async (params, { toolCallId, experimental_context }) => {
        const { onChunk } = experimental_context as { onChunk: (chunk: Chunk) => void }
        // 创建适配的 MCPToolResponse 对象
        const toolResponse: MCPToolResponse = {
          id: toolCallId,
          tool: mcpTool,
          arguments: params,
          status: 'pending',
          toolCallId
        }

        try {
          // 检查是否启用自动批准
          const server = getMcpServerByTool(mcpTool)
          const isAutoApproveEnabled = isToolAutoApproved(mcpTool, server)

          const confirmed = true

          if (!isAutoApproveEnabled) {
            // 请求用户确认
            logger.debug(`Requesting user confirmation for tool: ${mcpTool.name}`)
            // confirmed = await requestToolConfirmation(toolResponse.id)
          }

          if (!confirmed) {
            // 用户拒绝执行工具
            logger.debug(`User cancelled tool execution: ${mcpTool.name}`)
            return {
              content: [
                {
                  type: 'text',
                  text: `User declined to execute tool "${mcpTool.name}".`
                }
              ],
              isError: false
            }
          }

          // 用户确认或自动批准，执行工具
          toolResponse.status = 'invoking'
          logger.debug(`Executing tool: ${mcpTool.name}`)

          onChunk({
            type: ChunkType.MCP_TOOL_IN_PROGRESS,
            responses: [toolResponse]
          })

          const result = await callMCPTool(toolResponse)

          // 返回结果，AI SDK 会处理序列化
          if (result.isError) {
            throw new Error(result.content?.[0]?.text || 'Tool execution failed')
          }

          // 返回工具执行结果
          return result
        } catch (error) {
          logger.error(`MCP Tool execution failed: ${mcpTool.name}`, { error })
          throw error
        }
      }
    })
  }

  return tools
}
