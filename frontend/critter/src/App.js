import React from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import { CssBaseline, Tab, Tabs, Typography } from '@material-ui/core'
import { ThemeProvider, createTheme } from '@material-ui/core'
import themeOptions from './core/theme'
import Header from './components/Header'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import { useSelector } from 'react-redux'
import api from './core/api'

const App = () => {
  const theme = createTheme(themeOptions)
  const token = useSelector((state) => state.auth.token?.access_token)

  api.interceptors.request.use((config) => {
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
  })

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <CssBaseline />
          <Header>
            <Route
              path={['/', '/explore', '/bookmarks']}
              exact
              render={({ location }) => (
                <Tabs value={location.pathname}>
                  <Tab
                    label="Home"
                    value="/"
                    component={Link}
                    to="/"
                    sx={{ color: 'inherit' }}
                  />
                  <Tab
                    label="Explore"
                    value="/explore"
                    component={Link}
                    to="/explore"
                    sx={{ color: 'inherit' }}
                  />
                  <Tab
                    label="Bookmars"
                    value="/bookmarks"
                    component={Link}
                    to="/bookmarks"
                    sx={{ color: 'inherit' }}
                  />
                </Tabs>
              )}
            ></Route>
          </Header>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/explore">pooopppee</Route>
          <Route path="/bookmarks">poop</Route>
          <Route path="/login">
            <SignIn />
          </Route>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
