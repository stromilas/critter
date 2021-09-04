// import React, { useReducer, useState } from 'react' 
// import api from '../core/api'

// const AuthContext = React.createContext({
//   token: '',
//   authenticated: false,
//   user: null,
//   login: (token) => { },
//   signout: () => {}
// })

// const reducer = (state, action) => {

//   switch (action.type) {
//     case
//   }
// }


// export const AuthContextProvider = (props) => {


//   const [state, dispatch] = useReducer()

//   const [token, setToken] = useState(localStorage.getItem('token'))
//   const [user, setUser] = useState()



//   const authenticated = Boolean(token)

//   const login = (token) => { 
//     setToken(token)
//     localStorage.setItem('token', token)
//   }

//   const signout = () => { 
//     setToken(null) 
//     localStorage.removeItem('token')
//   }
  
//   const contextValue = {
//     token: token,
//     user: user,
//     authenticated: authenticated,
//     login: login,
//     signout: signout
//   }

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {props.children}
//     </AuthContext.Provider>
//   )
// }

// export default AuthContext