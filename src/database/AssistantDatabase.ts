import { Assistant } from '@/types/assistant'
import {
  deleteAssistantById as _deleteAssistantById,
  getAssistantById as _getAssistantById,
  getExternalAssistants as _getExternalAssistants,
  upsertAssistants as _upsertAssistants
} from '@db/queries/assistants.queries'

export async function upsertAssistants(assistantsToUpsert: Assistant[]) {
  try {
    return await _upsertAssistants(assistantsToUpsert)
  } catch (error) {
    throw new Error(`Failed to upsert assistants: ${error}`)
  }
}

export async function deleteAssistantById(id: string) {
  try {
    return await _deleteAssistantById(id)
  } catch (error) {
    throw new Error(`Failed to delete assistant with id "${id}": ${error}`)
  }
}

export async function getExternalAssistants(): Promise<Assistant[]> {
  try {
    return await _getExternalAssistants()
  } catch (error) {
    throw new Error(`Failed to get external assistants: ${error}`)
  }
}

export async function getAssistantById(id: string): Promise<Assistant> {
  try {
    const assistant = await _getAssistantById(id)
    if (assistant === null) {
      throw new Error(`Assistant with id "${id}" not found`)
    }
    return assistant
  } catch (error) {
    throw new Error(`Failed to get assistant with id "${id}": ${error}`)
  }
}

export const assistantDatabase = {
  upsertAssistants,
  deleteAssistantById,
  getExternalAssistants,
  getAssistantById
}
