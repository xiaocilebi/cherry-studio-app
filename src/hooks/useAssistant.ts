import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'

import { Assistant } from '@/types/assistant'

import { db } from '../../db'
import { transformDbToAssistant, upsertAssistants } from '../../db/queries/assistants.queries'
import { assistants as assistantsSchema } from '../../db/schema'

export function useAssistant(assistantId: string) {
  const query = db.select().from(assistantsSchema).where(eq(assistantsSchema.id, assistantId))

  const { data: rawAssistant, updatedAt } = useLiveQuery(query, [assistantId])

  const updateAssistant = async (assistant: Assistant) => {
    await upsertAssistants([assistant])
  }

  if (!updatedAt) {
    return {
      assistant: null,
      isLoading: true,
      updateAssistant
    }
  }

  const processedAssistant = transformDbToAssistant(rawAssistant[0])

  return {
    assistant: processedAssistant,
    isLoading: false,
    updateAssistant
  }
}

export function useAssistants() {
  const query = db.select().from(assistantsSchema)

  const { data: rawAssistants, updatedAt } = useLiveQuery(query)

  const updateAssistants = async (assistants: Assistant[]) => {
    await upsertAssistants(assistants)
  }

  if (!updatedAt) {
    return {
      assistants: [],
      isLoading: true,
      updateAssistants
    }
  }

  const processedAssistants = rawAssistants.map(provider => transformDbToAssistant(provider))

  return {
    assistants: processedAssistants,
    isLoading: false,
    updateAssistants
  }
}

export function useStarAssistants() {
  // bug: https://github.com/drizzle-team/drizzle-orm/issues/2660
  // const query = db.query.assistants.findMany({
  //   where: eq(assistantsSchema.isStar, true),
  //   with: {
  //     topics: true
  //   }
  // })

  const query = db.select().from(assistantsSchema).where(eq(assistantsSchema.isStar, true))
  const { data: rawAssistants, updatedAt } = useLiveQuery(query)

  const updateAssistants = async (assistants: Assistant[]) => {
    await upsertAssistants(assistants)
  }

  if (!updatedAt) {
    return {
      assistants: [],
      isLoading: true,
      updateAssistants
    }
  }

  const processedAssistants = rawAssistants.map(provider => transformDbToAssistant(provider))

  return {
    assistants: processedAssistants,
    isLoading: false,
    updateAssistants
  }
}

export function useBuiltInAssistants() {
  const query = db.select().from(assistantsSchema).where(eq(assistantsSchema.type, 'built_in'))
  const { data: rawAssistants, updatedAt } = useLiveQuery(query)

  const updateAssistants = async (assistants: Assistant[]) => {
    await upsertAssistants(assistants)
  }

  if (!updatedAt) {
    return {
      assistants: [],
      isLoading: true,
      updateAssistants
    }
  }

  const processedAssistants = rawAssistants.map(provider => transformDbToAssistant(provider))

  return {
    assistants: processedAssistants,
    isLoading: false,
    updateAssistants
  }
}
