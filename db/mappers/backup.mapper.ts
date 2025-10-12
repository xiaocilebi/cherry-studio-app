/**
 * 将数据库记录转换为 DataBackupProvider 类型。
 * @param dbRecord - 从数据库检索的记录。
 * @returns 一个 DataBackupProvider 对象。
 */
export function transformDbToDataBackupProvider(dbRecord: any) {
  if (!dbRecord) return null
  const config = typeof dbRecord.config === 'string' ? JSON.parse(dbRecord.config) : dbRecord.config

  if (dbRecord.id === 'webdav') {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      webdavHost: config.webdavHost,
      webdavUser: config.webdavUser,
      webdavPass: config.webdavPass,
      webdavPath: config.webdavPath
    }
  }

  if (dbRecord.id === 'nutstore') {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      nutstoreToken: config.nutstoreToken,
      nutstorePath: config.nutstorePath,
      nutstoreAutoSync: config.nutstoreAutoSync,
      nutstoreSyncInterval: config.nutstoreSyncInterval,
      nutstoreSyncState: config.nutstoreSyncState
    }
  }

  if (dbRecord.id === 'notion') {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      notionDatabaseID: config.notionDatabaseID,
      notionApiKey: config.notionApiKey,
      notionPageNameKey: config.notionPageNameKey,
      notionExportReasoning: config.notionExportReasoning
    }
  }

  if (dbRecord.id === 'yuque') {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      yuqueToken: config.yuqueToken,
      yuqueUrl: config.yuqueUrl,
      yuqueRepoId: config.yuqueRepoId
    }
  }

  if (dbRecord.id === 'joplin') {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      joplinToken: config.joplinToken,
      joplinUrl: config.joplinUrl,
      joplinExportReasoning: config.joplinExportReasoning
    }
  }

  if (dbRecord.id === 'siyuan') {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      siyuanApiUrl: config.siyuanApiUrl,
      siyuanToken: config.siyuanToken,
      siyuanBoxId: config.siyuanBoxId,
      siyuanRootPath: config.siyuanRootPath
    }
  }
}

/**
 * 将 DataBackupProvider 对象转换为数据库记录格式。
 * @param provider - DataBackupProvider 对象。
 * @returns 一个适合数据库操作的对象。
 */
export function transformDataBackupProviderToDb(provider: any) {
  const { id, name, ...configProps } = provider
  return {
    id,
    name,
    config: JSON.stringify(configProps)
  }
}
