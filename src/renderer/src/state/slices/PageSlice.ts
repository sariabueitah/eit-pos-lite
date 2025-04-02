import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: {
  pageTitle: string
} = { pageTitle: '' }

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload
    }
  }
})

export const { setPage } = pageSlice.actions
export default pageSlice.reducer
