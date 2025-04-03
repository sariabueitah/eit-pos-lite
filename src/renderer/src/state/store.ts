import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './slices/SessionSlice'
import pageReducer from './slices/PageSlice'
import invoiceHoldReducer from './slices/InvoiceHoldSlice'
import loadingReducer from './slices/LoadingSlice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    page: pageReducer,
    invoiceHold: invoiceHoldReducer,
    loading: loadingReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
