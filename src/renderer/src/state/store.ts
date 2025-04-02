import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './slices/SessionSlice'
import pageReducer from './slices/PageSlice'
import invoiceHoldReducer from './slices/InvoiceHoldSlice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    page: pageReducer,
    invoiceHold: invoiceHoldReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
