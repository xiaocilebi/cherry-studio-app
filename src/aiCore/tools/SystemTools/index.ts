import { calendarTools } from './CalendarTools'
import { timeTools } from './TimeTools'

export const SystemTool = {
  ...calendarTools,
  ...timeTools
}

export type SystemToolKeys = keyof typeof SystemTool
