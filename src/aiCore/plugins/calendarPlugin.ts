import { AiRequestContext, definePlugin } from '@cherrystudio/ai-core'
import { createCalendarEvent } from '../tools/Calendartool'

export default definePlugin({
    name: 'calendarPlugin',
  transformParams: async (params: any, context: AiRequestContext) => {
    params.tools['builtin_calendar'] = createCalendarEvent
    console.log('Calendar plugin initialized',params)
    return params
  }
})
