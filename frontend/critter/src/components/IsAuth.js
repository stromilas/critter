import React, { useContext } from 'react'
import AuthContext from '../context/auth-context'

const IsAuth = ({ children }) => {
  const context = useContext(AuthContext)
  return <>{ context.authenticated && children }</>
}

export default IsAuth