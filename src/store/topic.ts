import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TopicState {
  currentTopicId: string
}

const initialState: TopicState = {
  currentTopicId: ''
}

const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    setCurrentTopicId: (state, action: PayloadAction<string>) => {
      state.currentTopicId = action.payload
    }
  }
})

export const { setCurrentTopicId } = topicSlice.actions

export default topicSlice.reducer
