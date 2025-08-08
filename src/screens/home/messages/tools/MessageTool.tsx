import React from 'react'

import { MCPToolResponse } from '@/types/mcp'
import { ToolMessageBlock } from '@/types/message'

import { MessageWebSearchToolTitle } from './MessageWebSearchTool'
// import { MessageKnowledgeSearchToolTitle } from './MessageKnowledgeSearchTool'

interface Props {
  block: ToolMessageBlock
}

const BUILTIN_PREFIX = 'builtin_'

// 工具组件映射表
const TOOL_COMPONENTS: Record<string, React.ComponentType<{ toolResponse: MCPToolResponse }>> = {
  web_search: MessageWebSearchToolTitle,
  web_search_preview: MessageWebSearchToolTitle
  // knowledge_search: MessageKnowledgeSearchToolTitle,
}

// 获取默认工具组件
const getDefaultToolComponent = (): React.ComponentType<{ toolResponse: MCPToolResponse }> => {
  return MessageWebSearchToolTitle
}

// 标准化工具名称
const normalizeToolName = (toolName: string): string => {
  return toolName.startsWith(BUILTIN_PREFIX) ? toolName.slice(BUILTIN_PREFIX.length) : toolName
}

// 获取工具标题组件
const getToolTitleComponent = (toolResponse: MCPToolResponse): React.ReactNode => {
  const normalizedName = normalizeToolName(toolResponse.tool.name)
  const ToolComponent = TOOL_COMPONENTS[normalizedName] || getDefaultToolComponent()

  return <ToolComponent toolResponse={toolResponse} />
}

export default function MessageTool({ block }: Props) {
  const toolResponse = block.metadata?.rawMcpToolResponse

  if (!toolResponse) {
    return null
  }

  return getToolTitleComponent(toolResponse)
}
