import { tool } from 'ai'
import { z } from 'zod'

/**
 * Get current time
 */
export const getCurrentTime = tool({
  description: 'Get current time and date',
  inputSchema: z.object({}),
  execute: () => {
    return {
     time: new Date().toLocaleString()
    }
  },
})

/**
 * Combined export of all time tools as a ToolSet
 */
export const timeTools = {
  GetCurrentTime: getCurrentTime
}
