import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './slices/SessionSlice'
import pageReducer from './slices/PageSlice'
import confirmationReducer from './slices/ConfirmationSlice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    page: pageReducer,
    confirmation: confirmationReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
