import { loggerService } from '@/services/LoggerService'
import { Provider } from '@/types/assistant'

import {
  getAllProviders as _getAllProviders,
  getProviderById as _getProviderById,
  upsertProviders
} from '../../db/queries/providers.queries'
const logger = loggerService.withContext('Provider Service')

export async function saveProvider(provider: Provider) {
  try {
    await upsertProviders([provider])
  } catch (error) {
    logger.error('Error saving provider:', error)
    throw error
  }
}

export async function getProviderById(providerId: string) {
  try {
    const provider = await _getProviderById(providerId)

    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found`)
    }

    return provider
  } catch (error) {
    logger.error('Error getting provider by id:', error)
    throw error
  }
}

export async function getAllProviders() {
  try {
    return await _getAllProviders()
  } catch (error) {
    logger.error('Error getting all providers:', error)
    throw error
  }
}
