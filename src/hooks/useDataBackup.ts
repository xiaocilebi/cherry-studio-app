import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useMemo } from 'react'

import { db } from '@db/index'
import { transformDbToDataBackupProvider } from '@db/mappers'
import { upsertDataBackupProviders } from '@db/queries/backup.queries'
import { backup_providers } from '@db/schema'

export function useDataBackupProvider(providerId: string) {
  const query = db.select().from(backup_providers).where(eq(backup_providers.id, providerId))
  const { data: rawProviders, updatedAt } = useLiveQuery(query)

  const provider = useMemo(() => {
    if (!rawProviders || rawProviders.length === 0) return null
    return transformDbToDataBackupProvider(rawProviders[0])
  }, [rawProviders])

  const updateProvider = async updatedProvider => {
    await upsertDataBackupProviders([updatedProvider])
  }

  if (!updatedAt || !provider) {
    return {
      provider: null,
      isLoading: true,
      updateProvider: async () => {}
    }
  }

  return {
    provider,
    isLoading: false,
    updateProvider
  }
}
