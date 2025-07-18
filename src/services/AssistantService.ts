import { getSystemProviders } from '@/config/providers'
import { DEFAULT_CONTEXTCOUNT, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '@/constants'
import i18n from '@/i18n'
import { Assistant, AssistantSettings, Model, Provider, Topic } from '@/types/assistant'
import { uuid } from '@/utils'

import {
  deleteAssistantById as _deleteAssistantById,
  getAssistantById as _getAssistantById,
  getStarredAssistants as _getStarredAssistants,
  upsertAssistants
} from '../../db/queries/assistants.queries'
import { getProviderById } from '../../db/queries/providers.queries'

export async function getDefaultAssistant(): Promise<Assistant> {
  return await getAssistantById('default')
}

export async function getAssistantById(assistantId: string): Promise<Assistant> {
  const assistant = await _getAssistantById(assistantId)

  if (!assistant) {
    console.error(`Assistant with ID ${assistantId} not found`)
    throw new Error(`Assistant with ID ${assistantId} not found`)
  }

  return assistant
}

export async function getAssistantProvider(assistant: Assistant): Promise<Provider> {
  const provider = await getProviderById(assistant.model?.provider || '')
  return provider || getDefaultProvider()
}

export function getDefaultTopic(assistantId: string): Topic {
  // todo
  return {
    id: uuid(),
    assistantId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: i18n.t('chat.default.topic.name'),
    isNameManuallyEdited: false
  }
}

export function getDefaultProvider() {
  return getProviderByModel(getDefaultModel())
}

export function getDefaultModel() {
  // todo
  return getSystemProviders()[0].models[0]
}

export function getProviderByModel(model?: Model): Provider {
  // todo
  const providers = getSystemProviders()
  const providerId = model ? model.provider : getDefaultProvider().id
  return providers.find(p => p.id === providerId) as Provider
}

export const getAssistantSettings = (assistant: Assistant): AssistantSettings => {
  const contextCount = assistant?.settings?.contextCount ?? DEFAULT_CONTEXTCOUNT

  const getAssistantMaxTokens = () => {
    if (assistant.settings?.enableMaxTokens) {
      const maxTokens = assistant.settings.maxTokens

      if (typeof maxTokens === 'number') {
        return maxTokens > 0 ? maxTokens : DEFAULT_MAX_TOKENS
      }

      return DEFAULT_MAX_TOKENS
    }

    return undefined
  }

  return {
    contextCount: contextCount === 100 ? 100000 : contextCount,
    temperature: assistant?.settings?.temperature ?? DEFAULT_TEMPERATURE,
    topP: assistant?.settings?.topP ?? 1,
    enableMaxTokens: assistant?.settings?.enableMaxTokens ?? false,
    maxTokens: getAssistantMaxTokens(),
    streamOutput: assistant?.settings?.streamOutput ?? true,
    toolUseMode: assistant?.settings?.toolUseMode ?? 'prompt',
    defaultModel: assistant?.defaultModel ?? undefined,
    customParameters: assistant?.settings?.customParameters ?? []
  }
}

export async function saveAssistant(assistant: Assistant): Promise<void> {
  try {
    await upsertAssistants([assistant])
  } catch (error) {
    console.error('Error saving assistant:', error)
    throw new Error('Failed to save assistant')
  }
}

export async function createAssistant() {
  const newAssistant: Assistant = {
    id: uuid(),
    name: i18n.t('assistant.default.name'),
    prompt: i18n.t('assistant.default.prompt'),
    topics: [],
    type: 'external'
  }

  await saveAssistant(newAssistant)
  return newAssistant
}

export function createBlankAssistant() {
  const blankAssistant: Assistant = {
    id: 'blank',
    name: 'Blank Assistant',
    prompt: '',
    topics: [],
    type: 'external'
  }
  return blankAssistant
}

export async function getStarredAssistants(): Promise<Assistant[]> {
  try {
    return await _getStarredAssistants()
  } catch (error) {
    console.error('Failed to get starred assistants:', error)
    return []
  }
}

export async function deleteAssistantById(assistantId: string) {
  try {
    await _deleteAssistantById(assistantId)
  } catch (error) {
    console.error('Failed to delete Assistant', error)
  }
}

export async function getRecentAssistants(): Promise<Assistant[]> {
  try {
    const starredAssistants = await getStarredAssistants()
    return starredAssistants.filter(assistant => assistant.topics.length > 0)
  } catch (error) {
    console.error('Failed to get starred assistants:', error)
    return []
  }
}
