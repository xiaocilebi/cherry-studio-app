import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as SQLite from 'expo-sqlite'

import * as schema from './schema'

export const DATABASE_NAME = 'cherry_studio_app.db'
export const expoDb = SQLite.openDatabaseSync(DATABASE_NAME, { enableChangeListener: true })
export const db = drizzle(expoDb, { schema })
