import { createSlice } from '@reduxjs/toolkit'
import api from '../core/endpoints'

const persisted = JSON.parse(localStorage.getItem('authState'))

const initialState = persisted || {
  user: undefined,
  token: undefined,
  authenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.token = payload.token
      state.user = payload.user
      state.authenticated = true
      localStorage.setItem('authState', JSON.stringify(state))
    },
    logout: (state) => {
      // ejectInterceptor(state.interesctorID)
      state.user = undefined
      state.token = undefined
      state.authenticated = false
      localStorage.removeItem('authState')
    }
  }
})

export const authReducer = authSlice.reducer
export default authSlice.actions