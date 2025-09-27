import { MCPServer } from "@/types/mcp";
import { uuid } from "@/utils";
import { t } from "i18next";

export function initBuiltinMcp():MCPServer[] {
  return [
    {
      id:uuid(),
      name:'@cherry/fetch',
      type:'inMemory',
      description:t('mcp.builtin.fetch.description'),
      isActive:false
    },
    {
      id:uuid(),
      name:'@cherry/time',
      type:'inMemory',
      description:t('mcp.builtin.time.description'),
      isActive:false
    },
    {
      id:uuid(),
      name:'@cherry/calendar',
      type:'inMemory',
      description:t('mcp.builtin.calendar.description'),
      isActive:false
    }
  ]
}
