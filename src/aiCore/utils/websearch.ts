import { isOpenAIWebSearchChatCompletionOnlyModel } from '@/config/models'
import { WEB_SEARCH_PROMPT_FOR_OPENROUTER } from '@/config/prompts'
import { Model } from '@/types/assistant'

export function getWebSearchParams(model: Model): Record<string, any> {
  if (model.provider === 'hunyuan') {
    return { enable_enhancement: true, citation: true, search_info: true }
  }

  if (model.provider === 'dashscope') {
    return {
      enable_search: true,
      search_options: {
        forced_search: true
      }
    }
  }

  if (isOpenAIWebSearchChatCompletionOnlyModel(model)) {
    return {
      web_search_options: {}
    }
  }

  if (model.provider === 'openrouter') {
    return {
      plugins: [{ id: 'web', search_prompts: WEB_SEARCH_PROMPT_FOR_OPENROUTER }]
    }
  }

  return {}
}
