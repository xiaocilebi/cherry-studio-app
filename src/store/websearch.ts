import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WebSearchState {
  // 是否在搜索查询中添加当前日期
  searchWithTime: boolean
  // 搜索结果的最大数量
  maxResults: number
  // 是否覆盖搜索服务
  overrideSearchService: boolean
  // 内容限制
  contentLimit?: number
}

const initialState: WebSearchState = {
  searchWithTime: true,
  maxResults: 5,
  overrideSearchService: true,
  contentLimit: 2000
}

const websearchSlice = createSlice({
  name: 'websearch',
  initialState,
  reducers: {
    setSearchWithTime: (state, action: PayloadAction<boolean>) => {
      state.searchWithTime = action.payload
    },
    setOverrideSearchService: (state, action: PayloadAction<boolean>) => {
      state.overrideSearchService = action.payload
    },
    setMaxResult: (state, action: PayloadAction<number>) => {
      state.maxResults = action.payload
    },
    setContentLimit: (state, action: PayloadAction<number | undefined>) => {
      state.contentLimit = action.payload
    }
  }
})

export const { setSearchWithTime, setOverrideSearchService, setMaxResult, setContentLimit } = websearchSlice.actions

export default websearchSlice.reducer
