import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ThemeMode } from '@/types'
import { uuid } from '@/utils'

export interface SettingsState {
  avatar: string
  userName: string
  userId: string
  theme: ThemeMode
}

const initialState: SettingsState = {
  avatar: '',
  userName: '',
  userId: uuid(),
  theme: ThemeMode.system
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload
    }
  }
})

export const { setAvatar, setUserName, setUserId, setTheme } = settingsSlice.actions

export default settingsSlice.reducer
