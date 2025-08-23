import { MessageParam, ToolUnion, ToolUseBlock } from '@anthropic-ai/sdk/resources'
import { Content, FunctionCall, Tool } from '@google/genai'
import { isArray, isObject, pull, transform } from 'lodash'
import OpenAI from 'openai'
import { ChatCompletionMessageParam, ChatCompletionMessageToolCall, ChatCompletionTool } from 'openai/resources'

import { CompletionsParams } from '@/aiCore'
import { isFunctionCallingModel } from '@/config/models/functionCalling'
import { loggerService } from '@/services/LoggerService'
import { Assistant, Model } from '@/types/assistant'
import { ChunkType, MCPToolCompleteChunk, MCPToolInProgressChunk, MCPToolPendingChunk } from '@/types/chunk'
import { MCPCallToolResponse, MCPServer, MCPToolResponse, ToolUseResponse } from '@/types/mcp'
import { MCPTool } from '@/types/tool'

const logger = loggerService.withContext('Utils Mcp Tool')

const MCP_AUTO_INSTALL_SERVER_NAME = '@cherry/mcp-auto-install'
const EXTRA_SCHEMA_KEYS = ['schema', 'headers']

export function filterProperties(
  properties: Record<string, any> | string | number | boolean | (Record<string, any> | string | number | boolean)[],
  supportedKeys: string[]
) {
  // If it is an array, recursively process each element
  if (isArray(properties)) {
    return properties.map(item => filterProperties(item, supportedKeys))
  }

  // If it is an object, recursively process each property
  if (isObject(properties)) {
    return transform(
      properties,
      (result, value, key) => {
        if (key === 'properties') {
          result[key] = transform(value, (acc, v, k) => {
            acc[k] = filterProperties(v, supportedKeys)
          })

          result['additionalProperties'] = false
          result['required'] = pull(Object.keys(value), ...EXTRA_SCHEMA_KEYS)
        } else if (key === 'oneOf') {
          // openai only supports anyOf
          result['anyOf'] = filterProperties(value, supportedKeys)
        } else if (supportedKeys.includes(key)) {
          result[key] = filterProperties(value, supportedKeys)

          if (key === 'type' && value === 'object') {
            result['additionalProperties'] = false
          }
        }
      },
      {}
    )
  }

  // Return other types directly (e.g., string, number, etc.)
  return properties
}

export function mcpToolsToOpenAIResponseTools(mcpTools: MCPTool[]): OpenAI.Responses.Tool[] {
  const schemaKeys = ['type', 'description', 'items', 'enum', 'additionalProperties', 'anyof']
  return mcpTools.map(
    tool =>
      ({
        type: 'function',
        name: tool.id,
        parameters: {
          type: 'object',
          properties: filterProperties(tool.inputSchema, schemaKeys).properties,
          required: pull(Object.keys(tool.inputSchema.properties), ...EXTRA_SCHEMA_KEYS),
          additionalProperties: false
        },
        strict: true
      }) satisfies OpenAI.Responses.Tool
  )
}

export function mcpToolsToOpenAIChatTools(mcpTools: MCPTool[]): ChatCompletionTool[] {
  return mcpTools.map(
    tool =>
      ({
        type: 'function',
        function: {
          name: tool.id,
          description: tool.description,
          parameters: {
            type: 'object',
            properties: tool.inputSchema.properties,
            required: tool.inputSchema.required
          }
        }
      }) as ChatCompletionTool
  )
}

export function openAIToolsToMcpTool(
  mcpTools: MCPTool[],
  toolCall: OpenAI.Responses.ResponseFunctionToolCall | ChatCompletionMessageToolCall
): MCPTool | undefined {
  const tool = mcpTools.find(mcpTool => {
    if ('name' in toolCall) {
      return mcpTool.id === toolCall.name || mcpTool.name === toolCall.name
    } else {
      return mcpTool.id === toolCall.function.name || mcpTool.name === toolCall.function.name
    }
  })

  if (!tool) {
    console.warn('No MCP Tool found for tool call:', toolCall)
    return undefined
  }

  return tool
}

export async function callMCPTool(toolResponse: MCPToolResponse): Promise<MCPCallToolResponse> {
  throw new Error('Not implemented')
}

export function mcpToolsToAnthropicTools(mcpTools: MCPTool[]): ToolUnion[] {
  throw new Error('Not implemented')
}

export function anthropicToolUseToMcpTool(mcpTools: MCPTool[] | undefined, toolUse: ToolUseBlock): MCPTool | undefined {
  return undefined
}

/**
 * @param mcpTools
 * @returns
 */
export function mcpToolsToGeminiTools(mcpTools: MCPTool[]): Tool[] {
  /**
   * @typedef {import('@google/genai').Schema} Schema
   */
  return []
}

export function geminiFunctionCallToMcpTool(
  mcpTools: MCPTool[] | undefined,
  toolCall: FunctionCall | undefined
): MCPTool | undefined {
  return undefined
}

export function upsertMCPToolResponse(
  results: MCPToolResponse[],
  resp: MCPToolResponse,
  onChunk: (chunk: MCPToolPendingChunk | MCPToolInProgressChunk | MCPToolCompleteChunk) => void
) {
  const index = results.findIndex(ret => ret.id === resp.id)
  let result = resp

  if (index !== -1) {
    const cur = {
      ...results[index],
      response: resp.response,
      arguments: resp.arguments,
      status: resp.status
    }
    results[index] = cur
    result = cur
  } else {
    results.push(resp)
  }

  switch (resp.status) {
    case 'pending':
      onChunk({
        type: ChunkType.MCP_TOOL_PENDING,
        responses: [result]
      })
      break
    case 'invoking':
      onChunk({
        type: ChunkType.MCP_TOOL_IN_PROGRESS,
        responses: [result]
      })
      break
    case 'cancelled':
    case 'done':
      onChunk({
        type: ChunkType.MCP_TOOL_COMPLETE,
        responses: [result]
      })
      break
    default:
      break
  }
}

export function filterMCPTools(
  mcpTools: MCPTool[] | undefined,
  enabledServers: MCPServer[] | undefined
): MCPTool[] | undefined {
  return undefined
}

export function getMcpServerByTool(tool: MCPTool) {
  throw new Error('Not implemented')
}

export function isToolAutoApproved(tool: MCPTool, server?: MCPServer): boolean {
  const effectiveServer = server ?? getMcpServerByTool(tool)
  return effectiveServer ? !effectiveServer.disabledAutoApproveTools?.includes(tool.name) : false
}

export function parseToolUse(content: string, mcpTools: MCPTool[], startIdx: number = 0): ToolUseResponse[] {
  if (!content || !mcpTools || mcpTools.length === 0) {
    return []
  }

  return []
}

export async function parseAndCallTools<R>(
  tools: MCPToolResponse[],
  allToolResponses: MCPToolResponse[],
  onChunk: CompletionsParams['onChunk'],
  convertToMessage: (mcpToolResponse: MCPToolResponse, resp: MCPCallToolResponse, model: Model) => R | undefined,
  model: Model,
  mcpTools?: MCPTool[],
  abortSignal?: AbortSignal
): Promise<{ toolResults: R[]; confirmedToolResponses: MCPToolResponse[] }>

export async function parseAndCallTools<R>(
  content: string,
  allToolResponses: MCPToolResponse[],
  onChunk: CompletionsParams['onChunk'],
  convertToMessage: (mcpToolResponse: MCPToolResponse, resp: MCPCallToolResponse, model: Model) => R | undefined,
  model: Model,
  mcpTools?: MCPTool[],
  abortSignal?: AbortSignal
): Promise<{ toolResults: R[]; confirmedToolResponses: MCPToolResponse[] }>

export async function parseAndCallTools<R>(
  content: string | MCPToolResponse[],
  allToolResponses: MCPToolResponse[],
  onChunk: CompletionsParams['onChunk'],
  convertToMessage: (mcpToolResponse: MCPToolResponse, resp: MCPCallToolResponse, model: Model) => R | undefined,
  model: Model,
  mcpTools?: MCPTool[],
  abortSignal?: AbortSignal
): Promise<{ toolResults: R[]; confirmedToolResponses: MCPToolResponse[] }> {
  return { toolResults: [], confirmedToolResponses: [] }
}

export function mcpToolCallResponseToOpenAICompatibleMessage(
  mcpToolResponse: MCPToolResponse,
  resp: MCPCallToolResponse,
  isVisionModel: boolean = false,
  isCompatibleMode: boolean = false
): ChatCompletionMessageParam {
  const message = {
    role: 'user'
  } as ChatCompletionMessageParam

  return message
}

export function mcpToolCallResponseToOpenAIMessage(
  mcpToolResponse: MCPToolResponse,
  resp: MCPCallToolResponse,
  isVisionModel: boolean = false
): OpenAI.Responses.EasyInputMessage {
  const message = {
    role: 'user'
  } as OpenAI.Responses.EasyInputMessage

  return message
}

export function mcpToolCallResponseToAnthropicMessage(
  mcpToolResponse: MCPToolResponse,
  resp: MCPCallToolResponse,
  model: Model
): MessageParam {
  const message = {
    role: 'user'
  } as MessageParam

  return message
}

export function mcpToolCallResponseToGeminiMessage(
  mcpToolResponse: MCPToolResponse,
  resp: MCPCallToolResponse,
  isVisionModel: boolean = false
): Content {
  const message = {
    role: 'user'
  } as Content

  return message
}

export function isEnabledToolUse(assistant: Assistant) {
  if (assistant.model) {
    if (isFunctionCallingModel(assistant.model)) {
      return assistant.settings?.toolUseMode === 'function'
    }
  }

  return false
}
