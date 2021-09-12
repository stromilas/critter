import { createSlice } from '@reduxjs/toolkit'
import api from '../core/api'

// const setInterceptor = token => {
//   const id = api.interceptors.request.use((config) => {
//     config.headers.Authorization = token ? `Bearer ${token}` : ''
//     return config
//   })
//   // console.log('setting interceptor: ', id);
//   return id
// }

// const ejectInterceptor = id => {
//   // console.log('ejecting interceptor: ', id);
//   api.interceptors.request.eject(id)
// }

const persisted = JSON.parse(localStorage.getItem('authState'))

// let interesctorID
// if (persisted) {
//   const token = persisted.token?.access_token
//   interesctorID = setInterceptor(token)
// }

const initialState = persisted || {
  user: undefined,
  token: undefined,
  authenticated: false,
  // intersectorID: interesctorID,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.token = payload.token
      state.user = payload.user
      state.authenticated = true
      // state.interesctorID = setInterceptor(payload.token.access_token)
      localStorage.setItem('authState', JSON.stringify(state))
    },
    logout: (state) => {
      // ejectInterceptor(state.interesctorID)
      state.user = undefined
      state.token = undefined
      state.authenticated = false
      // state.interesctorID = undefined
      localStorage.removeItem('authState')
    }
  }
})

export const authReducer = authSlice.reducer
export default authSlice.actions