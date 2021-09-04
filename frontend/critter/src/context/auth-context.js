import React, { useState } from 'react' 
import api from '../core/api'

const AuthContext = React.createContext({
  token: '',
  authenticated: false,
  login: (token) => { },
  signout: () => {}
})

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  api.interceptors.request.use(config => {
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
  })

  const authenticated = Boolean(token)

  const login = (token) => { 
    setToken(token)
    localStorage.setItem('token', token)
  }
  const signout = () => { 
    setToken(null) 
    localStorage.removeItem('token')
  }
  
  const contextValue = {
    token: token,
    authenticated: authenticated,
    login: login,
    signout: signout
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext