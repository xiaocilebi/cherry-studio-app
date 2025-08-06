import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import websearch from '@/store/websearch'

import app from './app'
import assistant from './assistant'
import newMessagesReducer from './newMessage'
import runtime from './runtime'
import settings from './settings'
import topic from './topic'

const rootReducer = combineReducers({
  app,
  runtime,
  assistant,
  websearch,
  settings,
  topic,
  messages: newMessagesReducer
})

const persistedReducer = persistReducer(
  {
    key: 'cherry-studio',
    storage: AsyncStorage,
    version: 1,
    blacklist: ['runtime']
    // migrate
  },
  rootReducer
)

const store = configureStore({
  // @ts-ignore store type is unknown
  reducer: persistedReducer as typeof rootReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] }
    })
  },
  devTools: false,
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer())
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<typeof store>()

global.store = store

export default store
