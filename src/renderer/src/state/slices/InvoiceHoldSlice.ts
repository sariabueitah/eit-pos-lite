import { createSlice } from '@reduxjs/toolkit'

const initialState: {
  counter: number
  invoiceHold:
    | {
        invoice: SaleInvoice
        items: SaleInvoiceItem[]
      }[]
    | null
} = {
  counter: 1,
  invoiceHold: null
}

const invoiceHoldSlice = createSlice({
  name: 'hold',
  initialState,
  reducers: {}
})

export default invoiceHoldSlice.reducer
