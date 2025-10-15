import { WebSearchProvider } from '@/types/websearch'
import {
  getAllWebSearchProviders as _getAllWebSearchProviders,
  getWebSearchProviderByIdSync as _getWebSearchProviderByIdSync,
  upsertWebSearchProviders as _upsertWebSearchProviders
} from '@db/queries/websearchProviders.queries'

export async function upsertWebSearchProviders(providers: WebSearchProvider[]) {
  return _upsertWebSearchProviders(providers)
}

export async function getAllWebSearchProviders() {
  return _getAllWebSearchProviders()
}

export function getWebSearchProviderByIdSync(providerId: string) {
  return _getWebSearchProviderByIdSync(providerId)
}

export const websearchProviderDatabase = {
  upsertWebSearchProviders,
  getAllWebSearchProviders,
  getWebSearchProviderByIdSync
}
