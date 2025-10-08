import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useMemo } from 'react'

import { Provider } from '@/types/assistant'

import { db } from '../../db'
import { transformDbToProvider } from '../../db/mappers'
import { upsertProviders } from '../../db/queries/providers.queries'
import { providers as providersSchema } from '../../db/schema'

/**
 * Fetch all providers from the database.
 */
export function useAllProviders() {
  const query = db.select().from(providersSchema)
  const { data: rawProviders, updatedAt } = useLiveQuery(query)

  const processedProviders = useMemo(() => {
    if (!rawProviders || rawProviders.length === 0) return []
    return rawProviders.map(provider => transformDbToProvider(provider))
  }, [rawProviders])

  if (!updatedAt || !rawProviders || rawProviders.length === 0) {
    return {
      providers: [],
      isLoading: true
    }
  }

  return {
    providers: processedProviders,
    isLoading: false
  }
}

/**
 * Fetch a single provider by its ID.
 * @param providerId
 */
export function useProvider(providerId: string) {
  const query = db.select().from(providersSchema).where(eq(providersSchema.id, providerId))
  const { data: rawProvider, updatedAt } = useLiveQuery(query)

  const updateProvider = async (provider: Provider) => {
    await upsertProviders([provider])
  }

  const provider = useMemo(() => {
    if (!rawProvider || rawProvider.length === 0) return null
    return transformDbToProvider(rawProvider[0])
  }, [rawProvider])

  if (!updatedAt || !provider) {
    return {
      provider: null,
      isLoading: true,
      updateProvider
    }
  }

  return {
    provider,
    isLoading: false,
    updateProvider
  }
}
