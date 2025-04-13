import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: {
  pageTitle: string
  loading: boolean
  hold: {
    show: boolean
    count: number
  }
  alert: {
    show: boolean
    message: string
    refocus: unknown | null
  }
} = {
  pageTitle: '',
  loading: false,
  alert: {
    show: false,
    message: '',
    refocus: null
  },
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
    },
    showAlert: (state, action: PayloadAction<string>) => {
      state.alert.show = true
      state.alert.message = action.payload
      state.alert.refocus = document.activeElement as Element
    },
    hideAlert: (state) => {
      state.alert.show = false
      state.alert.message = ''

      if (state.alert.refocus) {
        const refocus = state.alert.refocus as HTMLElement
        refocus.focus()
      }
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

export const { setPage, setLoading, showHold, addHold, removeHold, showAlert, hideAlert } =
  pageSlice.actions
export default pageSlice.reducer
