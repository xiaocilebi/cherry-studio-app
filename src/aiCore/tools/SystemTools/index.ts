import { calendarTools } from './CalendarTools'
import { fetchTools } from './FetchTools'
import { timeTools } from './TimeTools'

export const SystemTool = {
  ...calendarTools,
  ...timeTools,
  ...fetchTools
}

export type SystemToolKeys = keyof typeof SystemTool
