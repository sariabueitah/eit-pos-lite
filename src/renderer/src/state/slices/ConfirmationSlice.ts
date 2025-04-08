import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Confirmation {
  isOpen: boolean
  message: string
  onConfirm?: () => void
}

const initialState: Confirmation = {
  isOpen: false,
  message: 'Are you sure you want to proceed?'
}

const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    openConfirmation: (
      state,
      action: PayloadAction<{
        message: string
        onConfirm: () => void
      }>
    ) => {
      state.isOpen = true
      state.message = action.payload.message
      state.onConfirm = action.payload.onConfirm
    },
    closeConfirmation: (state) => {
      state.isOpen = false
    },
    confirm: (state) => {
      if (state.onConfirm) {
        state.onConfirm()
      }
      state.isOpen = false
    }
  }
})

export const { openConfirmation, closeConfirmation, confirm } = confirmationSlice.actions
export default confirmationSlice.reducer
