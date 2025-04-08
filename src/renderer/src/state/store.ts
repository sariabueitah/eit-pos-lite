import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './slices/SessionSlice'
import pageReducer from './slices/PageSlice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    page: pageReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
