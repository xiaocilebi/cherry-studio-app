import { Assistant } from '@/types/assistant'
import {
  deleteAssistantById as _deleteAssistantById,
  getAssistantById as _getAssistantById,
  getExternalAssistants as _getExternalAssistants,
  upsertAssistants as _upsertAssistants
} from '@db/queries/assistants.queries'

export async function upsertAssistants(assistantsToUpsert: Assistant[]) {
  return _upsertAssistants(assistantsToUpsert)
}

export async function deleteAssistantById(id: string) {
  return _deleteAssistantById(id)
}

export async function getExternalAssistants(): Promise<Assistant[]> {
  return _getExternalAssistants()
}

export async function getAssistantById(id: string): Promise<Assistant | null> {
  return _getAssistantById(id)
}

export const assistantDatabase = {
  upsertAssistants,
  deleteAssistantById,
  getExternalAssistants,
  getAssistantById
}
