import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SubscribeSource {
  key: number
  url: string
  name: string
  blacklist?: string[] // 存储从该订阅源获取的黑名单
}

export interface WebSearchState {
  // 是否在搜索查询中添加当前日期
  searchWithTime: boolean
  // 搜索结果的最大数量
  maxResults: number
  // 要排除的域名列表
  excludeDomains: string[]
  // 订阅源列表
  subscribeSources: SubscribeSource[]
  // 是否覆盖搜索服务
  overrideSearchService: boolean

  // 内容限制
  contentLimit?: number
  // 具体供应商的配置
  providerConfig: Record<string, any>
}

const initialState: WebSearchState = {
  searchWithTime: true,
  maxResults: 5,
  excludeDomains: [],
  subscribeSources: [],
  overrideSearchService: true,
  contentLimit: undefined,
  providerConfig: {}
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
    setExcludeDomains: (state, action: PayloadAction<string[]>) => {
      state.excludeDomains = action.payload
    },
    // 添加订阅源
    addSubscribeSource: (state, action: PayloadAction<Omit<SubscribeSource, 'key'>>) => {
      state.subscribeSources = state.subscribeSources || []
      const newKey =
        state.subscribeSources.length > 0 ? Math.max(...state.subscribeSources.map(item => item.key)) + 1 : 0
      state.subscribeSources.push({
        key: newKey,
        url: action.payload.url,
        name: action.payload.name,
        blacklist: action.payload.blacklist
      })
    },
    // 删除订阅源
    removeSubscribeSource: (state, action: PayloadAction<number>) => {
      state.subscribeSources = state.subscribeSources.filter(source => source.key !== action.payload)
    },
    // 更新订阅源的黑名单
    updateSubscribeBlacklist: (state, action: PayloadAction<{ key: number; blacklist: string[] }>) => {
      const source = state.subscribeSources.find(s => s.key === action.payload.key)

      if (source) {
        source.blacklist = action.payload.blacklist
      }
    },
    // 更新订阅源列表
    setSubscribeSources: (state, action: PayloadAction<SubscribeSource[]>) => {
      state.subscribeSources = action.payload
    },
    setContentLimit: (state, action: PayloadAction<number | undefined>) => {
      state.contentLimit = action.payload
    },
    setProviderConfig: (state, action: PayloadAction<Record<string, any>>) => {
      state.providerConfig = action.payload
    },
    updateProviderConfig: (state, action: PayloadAction<Record<string, any>>) => {
      state.providerConfig = { ...state.providerConfig, ...action.payload }
    }
  }
})

export const {
  setSearchWithTime,
  setOverrideSearchService,
  setExcludeDomains,
  setMaxResult,
  addSubscribeSource,
  removeSubscribeSource,
  updateSubscribeBlacklist,
  setSubscribeSources,
  setContentLimit,
  setProviderConfig,
  updateProviderConfig
} = websearchSlice.actions

export default websearchSlice.reducer
