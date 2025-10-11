import { useColorScheme } from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '@/store'
import { ThemeMode } from '@/types'

export function useTheme() {
  const systemColorScheme = useColorScheme()
  const themeSetting = useSelector((state: RootState) => state.settings.theme)

  const settedTheme = themeSetting === ThemeMode.system ? systemColorScheme : themeSetting
  const activeTheme = settedTheme === ThemeMode.dark ? 'dark' : 'light'

  return { themeSetting, settedTheme, activeTheme }
}
