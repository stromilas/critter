import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import { CssBaseline } from '@material-ui/core'

const App = () => {
  return (
    <div>
      <CssBaseline />
      <Router>
        <Route path="/" exact>
          <Dashboard />
          <Redirect to="/signin" />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
      </Router>
    </div>
  )
}

export default App
