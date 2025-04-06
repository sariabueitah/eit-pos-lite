import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './slices/SessionSlice'
import pageReducer from './slices/PageSlice'
import loadingReducer from './slices/LoadingSlice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    page: pageReducer,
    loading: loadingReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
