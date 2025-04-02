import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: { value: Session | null } = {
  value: null
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state.value = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getSession.fulfilled, (state, action: PayloadAction<Session | null>) => {
      state.value = action.payload
    })
  }
})

export const getSession = createAsyncThunk('session/getSession', async () => {
  return await window.electron.ipcRenderer.invoke('getSession')
})
export const { setSession } = sessionSlice.actions
export default sessionSlice.reducer
