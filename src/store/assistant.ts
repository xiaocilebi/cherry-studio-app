import { createSlice } from '@reduxjs/toolkit'

import { getBuiltInAssistants } from '@/config/assistants'
import { Assistant } from '@/types/assistant'

export interface AssistantsState {
  builtInAssistants: Assistant[]
}

const initialState: AssistantsState = {
  builtInAssistants: getBuiltInAssistants()
}

const assistantsSlice = createSlice({
  name: 'assistants',
  initialState,
  reducers: {
    resetBuiltInAssistants: state => {
      state.builtInAssistants = getBuiltInAssistants()
    }
  }
})

export const { resetBuiltInAssistants } = assistantsSlice.actions

export default assistantsSlice.reducer
