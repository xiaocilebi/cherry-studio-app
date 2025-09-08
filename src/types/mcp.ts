import z from 'zod'

import { BaseTool, MCPTool } from './tool'

export const MCPConfigSampleSchema = z.object({
  command: z.string(),
  args: z.array(z.string()),
  env: z.record(z.string(), z.string()).optional()
})
export type MCPConfigSample = z.infer<typeof MCPConfigSampleSchema>
/**
 * 定义 MCP 服务器的通信类型。
 * stdio: 通过标准输入/输出与子进程通信 (最常见)。
 * sse:  通过HTTP Server-Sent Events 通信。
 *
 * 允许 inMemory 作为合法字段，需要额外校验 name 是否 builtin
 */
export const McpServerTypeSchema = z
  .string()
  .transform(type => {
    if (type.includes('http')) {
      return 'streamableHttp'
    } else {
      return type
    }
  })
  .pipe(
    z.union([z.literal('stdio'), z.literal('sse'), z.literal('streamableHttp'), z.literal('inMemory')]).default('stdio') // 大多数情况下默认使用 stdio
  )

/**
 * 定义单个 MCP 服务器的配置。
 * FIXME: 为了兼容性，暂时允许用户编辑任意字段，这可能会导致问题。
 * 除了类型匹配以外，目前唯一显式禁止的行为是将 type 设置为 inMemory
 */
export const McpServerConfigSchema = z
  .object({
    /**
     * 服务器内部ID
     * 可选。用于内部标识服务器的唯一标识符。
     */
    id: z.string().optional().describe('Server internal id.'),
    /**
     * 服务器名称
     * 可选。用于标识和显示服务器。
     */
    name: z.string().optional().describe('Server name for identification and display'),
    /**
     * 服务器的通信类型。
     * 可选。如果未指定，默认为 "stdio"。
     */
    type: McpServerTypeSchema.optional(),
    /**
     * 服务器描述
     * 可选。用于描述服务器的功能和用途。
     */
    description: z.string().optional().describe('Server description'),
    /**
     * 服务器的URL地址
     * 可选。用于指定服务器的访问地址。
     */
    url: z.string().optional().describe('Server URL address'),
    /**
     * url 的内部别名，优先使用 baseUrl 字段。
     * 可选。用于指定服务器的访问地址。
     */
    baseUrl: z.string().optional().describe('Server URL address'),
    /**
     * 启动服务器的命令 (如 "uvx", "npx")。
     * 可选。
     */
    command: z.string().optional().describe("The command to execute (e.g., 'uvx', 'npx')"),
    /**
     * registry URL
     * 可选。用于指定服务器的 registry 地址。
     */
    registryUrl: z.string().optional().describe('Registry URL for the server'),
    /**
     * 传递给命令的参数数组。
     * 通常第一个参数是脚本路径或包名。
     * 可选。
     */
    args: z.array(z.string()).optional().describe('The arguments to pass to the command'),
    /**
     * 启动时注入的环境变量对象。
     * 键为变量名，值为字符串。
     * 可选。
     */
    env: z.record(z.string(), z.string()).optional().describe('Environment variables for the server process'),
    /**
     * 请求头配置
     * 可选。用于设置请求时的自定义headers。
     */
    headers: z.record(z.string(), z.string()).optional().describe('Custom headers configuration'),
    /**
     * provider 名称
     * 可选。用于指定服务器的提供商。
     */
    provider: z.string().optional().describe('Provider name for the server'),
    /**
     * provider URL
     * 可选。用于指定服务器提供商的网站或文档地址。
     */
    providerUrl: z.string().optional().describe('URL of the provider website or documentation'),
    /**
     * logo URL
     * 可选。用于指定服务器的logo图片地址。
     */
    logoUrl: z.string().optional().describe('URL of the server logo'),
    /**
     * 服务器标签
     * 可选。用于对服务器进行分类和标记。
     */
    tags: z.array(z.string()).optional().describe('Server tags for categorization'),
    /**
     * 是否为长期运行的服务器
     * 可选。用于标识服务器是否需要持续运行。
     */
    longRunning: z.boolean().optional().describe('Whether the server is long running'),
    /**
     * 请求超时时间
     * 可选。单位为秒，默认为60秒。
     */
    timeout: z.number().optional().describe('Timeout in seconds for requests to this server'),
    /**
     * DXT包版本号
     * 可选。用于标识DXT包的版本。
     */
    dxtVersion: z.string().optional().describe('Version of the DXT package'),
    /**
     * DXT包解压路径
     * 可选。指定DXT包解压后的存放路径。
     */
    dxtPath: z.string().optional().describe('Path where the DXT package was extracted'),
    /**
     * 参考链接
     * 可选。服务器的文档或主页链接。
     */
    reference: z.string().optional().describe('Reference link for the server'),
    /**
     * 搜索关键字
     * 可选。用于服务器搜索的关键字。
     */
    searchKey: z.string().optional().describe('Search key for the server'),
    /**
     * 配置示例
     * 可选。服务器配置的示例。
     */
    configSample: MCPConfigSampleSchema.optional().describe('Configuration sample for the server'),
    /**
     * 禁用的工具列表
     * 可选。用于指定该服务器上禁用的工具。
     */
    disabledTools: z.array(z.string()).optional().describe('List of disabled tools for this server'),
    /**
     * 禁用自动批准的工具列表
     * 可选。用于指定该服务器上禁用自动批准的工具。
     */
    disabledAutoApproveTools: z
      .array(z.string())
      .optional()
      .describe('List of tools that are disabled for auto-approval on this server'),
    /**
     * 是否应该配置
     * 可选。用于标识服务器是否需要配置。
     */
    shouldConfig: z.boolean().optional().describe('Whether the server should be configured'),
    /**
     * 是否激活
     * 可选。用于标识服务器是否处于激活状态。
     */
    isActive: z.boolean().optional().describe('Whether the server is active')
  })
  .strict()
  // 在这里定义额外的校验逻辑
  .refine(
    schema => {
      if (schema.type === 'inMemory' && schema.name && !isBuiltinMCPServerName(schema.name)) {
        return false
      }

      return true
    },
    {
      message: 'Server type is inMemory but this is not a builtin MCP server, which is not allowed'
    }
  )
  .transform(schema => {
    // 显式传入的type会覆盖掉从url推断的逻辑
    if (!schema.type) {
      const url = schema.baseUrl ?? schema.url ?? null

      if (url !== null) {
        if (url.endsWith('/mcp')) {
          return {
            ...schema,
            type: 'streamableHttp'
          } as const
        } else if (url.endsWith('/sse')) {
          return {
            ...schema,
            type: 'sse'
          } as const
        }
      }
    }

    return schema
  })
/**
 * 将服务器别名（字符串ID）映射到其配置的对象。
 * 例如: { "my-tools": { command: "...", args: [...] }, "github": { ... } }
 */
export const McpServersMapSchema = z.record(z.string(), McpServerConfigSchema)
/**
 * 顶层配置对象Schema。
 * 表示整个MCP配置文件的结构。
 */
export const McpConfigSchema = z.object({
  /**
   * 包含一个或多个MCP服务器定义的映射。
   * 名称（键）是用户定义的别名。
   * 此字段为必需。
   */
  // 不在这里 refine 服务器数量，因为在类型定义文件中不能用 i18n 处理错误信息
  mcpServers: McpServersMapSchema.describe('Mapping of server aliases to their configurations')
})
// 数据校验用类型，McpServerType 复用于 MCPServer

export type McpServerType = z.infer<typeof McpServerTypeSchema>
export type McpServerConfig = z.infer<typeof McpServerConfigSchema>
export type McpServersMap = z.infer<typeof McpServersMapSchema>
export type McpConfig = z.infer<typeof McpConfigSchema>
/**
 * 验证一个未知对象是否为合法的MCP配置。
 * @param config - 要验证的配置对象
 * @returns 如果有效则为解析后的 `McpConfig` 对象，否则抛出 ZodError。
 */

export function validateMcpConfig(config: unknown): McpConfig {
  return McpConfigSchema.parse(config)
}
/**
 * 安全地验证一个未知对象，返回结果和可能的错误。
 * @param config - 要验证的配置对象
 * @returns 包含成功/失败状态和数据的 `SafeParseResult`。
 */

export function safeValidateMcpConfig(config: unknown) {
  return McpConfigSchema.safeParse(config)
}

/**
 * 安全地验证一个未知对象是否为合法的MCP服务器配置。
 * @param config - 要验证的配置对象
 * @returns 包含成功/失败状态和数据的 `SafeParseResult`。
 */
export function safeValidateMcpServerConfig(config: unknown) {
  return McpServerConfigSchema.safeParse(config)
}

// TODO: 把 mcp 相关类型定义迁移到独立文件中
export type MCPArgType = 'string' | 'list' | 'number'
export type MCPEnvType = 'string' | 'number'
export type MCPArgParameter = { [key: string]: MCPArgType }
export type MCPEnvParameter = { [key: string]: MCPEnvType }

export interface MCPServerParameter {
  name: string
  type: MCPArgType | MCPEnvType
  description: string
}

export interface MCPServer {
  id: string // internal id
  name: string // mcp name, generally as unique key
  type?: McpServerType | 'inMemory'
  description?: string
  baseUrl?: string
  command?: string
  registryUrl?: string
  args?: string[]
  env?: Record<string, string>
  headers?: Record<string, string> // Custom headers to be sent with requests to this server
  provider?: string // Provider name for this server like ModelScope, Higress, etc.
  providerUrl?: string // URL of the MCP server in provider's website or documentation
  logoUrl?: string // URL of the MCP server's logo
  tags?: string[] // List of tags associated with this server
  longRunning?: boolean // Whether the server is long running
  timeout?: number // Timeout in seconds for requests to this server, default is 60 seconds
  dxtVersion?: string // Version of the DXT package
  dxtPath?: string // Path where the DXT package was extracted
  reference?: string // Reference link for the server, e.g., documentation or homepage
  searchKey?: string
  configSample?: MCPConfigSample
  /** List of tool names that are disabled for this server */
  disabledTools?: string[]
  /** Whether to auto-approve tools for this server */
  disabledAutoApproveTools?: string[]

  /** 用于标记内置 MCP 是否需要配置 */
  shouldConfig?: boolean
  /** 用于标记服务器是否运行中 */
  isActive: boolean
}

export type BuiltinMCPServer = MCPServer & {
  type: 'inMemory'
  name: BuiltinMCPServerName
}

export const isBuiltinMCPServer = (server: MCPServer): server is BuiltinMCPServer => {
  return server.type === 'inMemory' && isBuiltinMCPServerName(server.name)
}

export const BuiltinMCPServerNames = {
  mcpAutoInstall: '@cherry/mcp-auto-install',
  memory: '@cherry/memory',
  sequentialThinking: '@cherry/sequentialthinking',
  braveSearch: '@cherry/brave-search',
  fetch: '@cherry/fetch',
  filesystem: '@cherry/filesystem',
  difyKnowledge: '@cherry/dify-knowledge',
  python: '@cherry/python'
} as const

export type BuiltinMCPServerName = (typeof BuiltinMCPServerNames)[keyof typeof BuiltinMCPServerNames]

export const BuiltinMCPServerNamesArray = Object.values(BuiltinMCPServerNames)

export const isBuiltinMCPServerName = (name: string): name is BuiltinMCPServerName => {
  return BuiltinMCPServerNamesArray.some(n => n === name)
}

export interface MCPToolInputSchema {
  type: string
  title: string
  description?: string
  required?: string[]
  properties: Record<string, object>
}

export const MCPToolOutputSchema = z.object({
  type: z.literal('object'),
  properties: z.record(z.string(), z.unknown()),
  required: z.array(z.string())
})

export interface MCPPromptArguments {
  name: string
  description?: string
  required?: boolean
}

export interface MCPPrompt {
  id: string
  name: string
  description?: string
  arguments?: MCPPromptArguments[]
  serverId: string
  serverName: string
}

export interface GetMCPPromptResponse {
  description?: string
  messages: {
    role: string
    content: {
      type: 'text' | 'image' | 'audio' | 'resource'
      text?: string
      data?: string
      mimeType?: string
    }
  }[]
}

export interface MCPConfig {
  servers: MCPServer[]
  isUvInstalled: boolean
  isBunInstalled: boolean
}

export type MCPToolResponseStatus = 'pending' | 'cancelled' | 'invoking' | 'done' | 'error'

interface BaseToolResponse {
  id: string // unique id
  tool: BaseTool | MCPTool
  arguments: Record<string, unknown> | undefined
  status: MCPToolResponseStatus
  response?: any
}

export interface ToolUseResponse extends BaseToolResponse {
  toolUseId: string
}

export interface ToolCallResponse extends BaseToolResponse {
  // gemini tool call id might be undefined
  toolCallId?: string
}

// export type MCPToolResponse = ToolUseResponse | ToolCallResponse
export interface MCPToolResponse extends Omit<ToolUseResponse | ToolCallResponse, 'tool'> {
  tool: MCPTool
  toolCallId?: string
  toolUseId?: string
}

export interface NormalToolResponse extends Omit<ToolCallResponse, 'tool'> {
  tool: BaseTool
  toolCallId: string
}

export interface MCPToolResultContent {
  type: 'text' | 'image' | 'audio' | 'resource'
  text?: string
  data?: string
  mimeType?: string
  resource?: {
    uri?: string
    text?: string
    mimeType?: string
    blob?: string
  }
}

export interface MCPCallToolResponse {
  content: MCPToolResultContent[]
  isError?: boolean
}

export interface MCPResource {
  serverId: string
  serverName: string
  uri: string
  name: string
  description?: string
  mimeType?: string
  size?: number
  text?: string
  blob?: string
}
