import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import { setContentLimit, setMaxResult, setOverrideSearchService, setSearchWithTime } from '@/store/websearch'
import { WebSearchProvider } from '@/types/websearch'

import { db } from '../../db'
import { transformDbToWebSearchProvider } from '../../db/mappers'
import { upsertWebSearchProviders } from '../../db/queries/websearchProviders.queries'
import { websearch_providers } from '../../db/schema'

export function useWebsearchProviders() {
  const query = db.select().from(websearch_providers)
  const { data: rawProviders, updatedAt } = useLiveQuery(query)

  if (!updatedAt || !rawProviders || rawProviders.length === 0) {
    return {
      freeProviders: [],
      apiProviders: [],
      isLoading: true
    }
  }

  const processedProviders = rawProviders.map(provider => transformDbToWebSearchProvider(provider))
  const freeProviders = processedProviders.filter(provider => provider.id.startsWith('local-'))
  const apiProviders = processedProviders.filter(
    provider => !provider.id.startsWith('local-') && provider.id !== 'searxng'
  )

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

  if (!updatedAt || !rawProviders || rawProviders.length === 0) {
    return {
      providers: [],
      isLoading: true
    }
  }

  const processedProviders = rawProviders.map(provider => transformDbToWebSearchProvider(provider))
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

  if (!updatedAt || !rawProvider || rawProvider.length === 0) {
    return {
      provider: null,
      isLoading: true,
      updateProvider
    }
  }

  const provider = transformDbToWebSearchProvider(rawProvider[0])
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
