import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ThemeMode } from '@/types'
import { TopicNamingSetting, TranslateModelSetting } from '@/types/setting'

export interface SettingsState {
  topicNamingSetting: TopicNamingSetting
  translateModelSetting: TranslateModelSetting
  theme: ThemeMode
}

const initialState: SettingsState = {
  topicNamingSetting: {
    autoNaming: false,
    prompt: ''
  },
  translateModelSetting: {
    specifyLanguage: false,
    sourceLanguage: undefined,
    targetLanguage: undefined,
    prompt: ''
  },
  theme: ThemeMode.system
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTopicNamingSetting: (state, action) => {
      state.topicNamingSetting = action.payload
    },
    setTranslateModelSetting: (state, action) => {
      state.translateModelSetting = action.payload
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload
    }
  }
})

export const { setTopicNamingSetting, setTranslateModelSetting, setTheme } = settingsSlice.actions

export default settingsSlice.reducer
