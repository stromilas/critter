import { createSlice } from '@reduxjs/toolkit'

const persisted = JSON.parse(localStorage.getItem('authState'))

const initialState = persisted || {
  user: null,
  token: null,
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
      console.log(state);
      state.user = null
      state.token = null
      state.authenticated = false
      localStorage.removeItem('authState')
    }
  }
})

export const authReducer = authSlice.reducer
export default authSlice.actions