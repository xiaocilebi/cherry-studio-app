import {
  getDataBackupProvider as _getDataBackupProvider,
  upsertDataBackupProviders as _upsertDataBackupProviders
} from '@db/queries/backup.queries'

export async function upsertDataBackupProviders(providers: any[]) {
  return _upsertDataBackupProviders(providers)
}

export async function getDataBackupProvider(providerId: string) {
  return _getDataBackupProvider(providerId)
}

export const backupProviderDatabase = {
  upsertDataBackupProviders,
  getDataBackupProvider
}
