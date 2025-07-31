import { useAppDispatch, useAppSelector } from '@/store'
import { setTheme, setTopicNamingSetting, setTranslateModelSetting } from '@/store/settings'
import { ThemeMode } from '@/types'

export function useSettings() {
  const settings = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()

  return {
    ...settings,
    setTopicNamingSetting: setting => dispatch(setTopicNamingSetting(setting)),
    setTranslateModelSetting: setting => dispatch(setTranslateModelSetting(setting)),
    setTheme(theme: ThemeMode) {
      dispatch(setTheme(theme))
    }
  }
}
