import { useAppDispatch, useAppSelector } from '@/store'
import { setAvatar, setTheme, setUserName } from '@/store/settings'
import { ThemeMode } from '@/types'

export function useSettings() {
  const settings = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()

  return {
    ...settings,
    setAvatar(avatar: string) {
      dispatch(setAvatar(avatar))
    },
    setUserName(userName: string) {
      dispatch(setUserName(userName))
    },
    setTheme(theme: ThemeMode) {
      dispatch(setTheme(theme))
    }
  }
}
