import { BuiltinTool } from '@/types/tool'
import { uuid } from '@/utils'
import { tool } from 'ai'
import { z } from 'zod'

const RequestPayloadSchema = z.object({
  url: z.url(),
  headers: z.record(z.string(), z.string()).optional()
})

type RequestPayload = z.infer<typeof RequestPayloadSchema>

export const FETCH_TOOLS: BuiltinTool[] = [
  {
    id: uuid(),
    name: 'FetchUrlAsHtml',
    type: 'builtin',
    description: 'Fetch URL content as HTML',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          format: 'uri',
          description: 'The URL to fetch'
        },
        headers: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Optional HTTP headers'
        }
      },
      required: ['url']
    }
  }
]

class Fetcher {
  private static async _fetch({ url, headers }: RequestPayload): Promise<Response> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          ...headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Failed to fetch ${url}: ${e.message}`)
      } else {
        throw new Error(`Failed to fetch ${url}: Unknown error`)
      }
    }
  }

  static async html(requestPayload: RequestPayload) {
    try {
      const response = await this._fetch(requestPayload)
      const html = await response.text()
      return { content: [{ type: 'text', text: html }], isError: false }
    } catch (error) {
      return {
        content: (error as Error).message,
        isError: true
      }
    }
  }
}

/**
 * Fetch URL as HTML
 */
export const fetchUrlAsHtml = tool({
  description: 'Fetch URL content as HTML',
  inputSchema: RequestPayloadSchema,
  execute: async params => {
    const result = await Fetcher.html(params)
    return result
  }
})

/**
 * Combined export of all fetch tools as a ToolSet
 */
export const fetchTools = {
  FetchUrlAsHtml: fetchUrlAsHtml
}
