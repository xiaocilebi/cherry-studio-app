import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import { setContentLimit, setMaxResult, setOverrideSearchService, setSearchWithTime } from '@/store/websearch'
import { WebSearchProvider } from '@/types/websearch'

import { db } from '@db'
import { transformDbToWebSearchProvider } from '@db/mappers'
import { upsertWebSearchProviders } from '@db/queries/websearchProviders.queries'
import { websearch_providers } from '@db/schema'

export function useWebsearchProviders() {
  const query = db.select().from(websearch_providers)
  const { data: rawProviders, updatedAt } = useLiveQuery(query)

  const processedProviders = useMemo(() => {
    if (!rawProviders || rawProviders.length === 0) return []
    return rawProviders.map(provider => transformDbToWebSearchProvider(provider))
  }, [rawProviders])

  const freeProviders = useMemo(() => {
    return processedProviders.filter(provider => provider.id.startsWith('local-'))
  }, [processedProviders])

  const apiProviders = useMemo(() => {
    return processedProviders.filter(provider => !provider.id.startsWith('local-') && provider.id !== 'searxng')
  }, [processedProviders])

  if (!updatedAt || !rawProviders || rawProviders.length === 0) {
    return {
      freeProviders: [],
      apiProviders: [],
      isLoading: true
    }
  }

  return {
    freeProviders,
    apiProviders,
    isLoading: false
  }
}

/**
 * Fetch all web search providers from the database.
 */
export function useAllWebSearchProviders() {
  const query = db.select().from(websearch_providers)
  const { data: rawProviders, updatedAt } = useLiveQuery(query)

  const processedProviders = useMemo(() => {
    if (!rawProviders || rawProviders.length === 0) return []
    return rawProviders.map(provider => transformDbToWebSearchProvider(provider))
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
 * Fetch a web search provider by its ID.
 * @param providerId
 */
export function useWebSearchProvider(providerId: string) {
  const query = db.select().from(websearch_providers).where(eq(websearch_providers.id, providerId))
  const { data: rawProvider, updatedAt } = useLiveQuery(query)

  const updateProvider = async (provider: WebSearchProvider) => {
    await upsertWebSearchProviders([provider])
  }

  const provider = useMemo(() => {
    if (!rawProvider || rawProvider.length === 0) return null
    return transformDbToWebSearchProvider(rawProvider[0])
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

/**
 * Hook for managing websearch settings with Redux
 */
export function useWebsearchSettings() {
  const dispatch = useDispatch()

  // Get state from Redux store
  const searchWithDates = useSelector((state: RootState) => state.websearch.searchWithTime)
  const overrideSearchService = useSelector((state: RootState) => state.websearch.overrideSearchService)
  const searchCount = useSelector((state: RootState) => state.websearch.maxResults)
  const contentLimit = useSelector((state: RootState) => state.websearch.contentLimit)

  // Action dispatchers
  const setSearchWithDates = (value: boolean) => {
    dispatch(setSearchWithTime(value))
  }

  const setOverrideSearchServiceSetting = (value: boolean) => {
    dispatch(setOverrideSearchService(value))
  }

  const setSearchCountSetting = (value: number) => {
    if (typeof value === 'number' && !isNaN(value) && value >= 1 && value <= 20) {
      dispatch(setMaxResult(Math.round(value)))
    }
  }

  const setContentLimitSetting = (value: number | undefined) => {
    if (value === undefined || (typeof value === 'number' && !isNaN(value) && value > 0)) {
      dispatch(setContentLimit(value))
    }
  }

  return {
    // State
    searchWithDates,
    overrideSearchService,
    searchCount,
    contentLimit,
    // Actions
    setSearchWithDates,
    setOverrideSearchService: setOverrideSearchServiceSetting,
    setSearchCount: setSearchCountSetting,
    setContentLimit: setContentLimitSetting
  }
}
