import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { WebSearchStatus } from '@/types/websearch'

export interface WebSearchState {
  activeSearches: Record<string, WebSearchStatus>
}

export interface RuntimeState {
  websearch: WebSearchState
}

const initialState: RuntimeState = {
  websearch: {
    activeSearches: {}
  }
}

const runtimeSlice = createSlice({
  name: 'runtime',
  initialState,
  reducers: {
    setWebSearchStatus: (state, action: PayloadAction<{ requestId: string; status: WebSearchStatus }>) => {
      const { requestId, status } = action.payload

      if (status.phase === 'default') {
        delete state.websearch.activeSearches[requestId]
      }

      state.websearch.activeSearches[requestId] = status
    }
  }
})

export const { setWebSearchStatus } = runtimeSlice.actions

export default runtimeSlice.reducer
