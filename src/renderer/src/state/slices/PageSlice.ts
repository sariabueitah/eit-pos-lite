import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: {
  pageTitle: string
  loading: boolean
  hold: {
    show: boolean
    count: number
  }
} = {
  pageTitle: '',
  loading: false,
  hold: {
    show: false,
    count: 0
  }
}

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    showHold: (state, action: PayloadAction<boolean>) => {
      state.hold.show = action.payload
    },
    addHold: (state) => {
      state.hold.count += 1
    },
    removeHold: (state) => {
      state.hold.count -= 1
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getHoldCount.fulfilled, (state, action: PayloadAction<number>) => {
      state.hold.count = action.payload
    })
  }
})

export const getHoldCount = createAsyncThunk('page/getHoldCount', async () => {
  return window.electron.ipcRenderer.invoke('getAllTempSaleInvoices').then((result) => {
    return result.length
  })
})

export const { setPage, setLoading, showHold, addHold, removeHold } = pageSlice.actions
export default pageSlice.reducer
