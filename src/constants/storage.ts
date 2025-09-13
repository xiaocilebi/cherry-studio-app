import { Directory, Paths } from 'expo-file-system/next'

export const DEFAULT_STORAGE = new Directory(Paths.cache, 'Files')
export const DEFAULT_IMAGES_STORAGE = new Directory(Paths.cache, 'Files', 'Images')
export const DEFAULT_DOCUMENTS_STORAGE = new Directory(Paths.cache, 'Files', 'Documents')
export const DEFAULT_ICONS_STORAGE = new Directory(Paths.cache, 'Files', 'Icons')
