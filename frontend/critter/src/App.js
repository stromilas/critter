import React, { useEffect } from 'react'
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom'
import { CssBaseline, Tab, Tabs } from '@material-ui/core'
import { ThemeProvider, createTheme } from '@material-ui/core'
import themeOptions from './theme/main'
import Header from './components/Header'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import PostPage from './pages/PostPage'
import api from './core/endpoints'
import UserPage from './pages/UserPage'

const App = () => {
  const theme = createTheme(themeOptions)
  const tabPaths = ['/', '/explore', '/bookmarks']

  api.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('authState'))?.token?.access_token
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
              path={tabPaths}
              render={({ location }) => (
                <Tabs
                  value={
                    tabPaths.includes(location.pathname)
                      ? location.pathname
                      : tabPaths[0]
                  }
                >
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
          <Route path="/users/:username">
            <UserPage />
          </Route>
          <Route path="/posts/:id">
            <PostPage />
          </Route>
          <Route path="/explore">WIP</Route>
          <Route path="/bookmarks">WIP</Route>
          <Route path="/login">
            <SignIn />
          </Route>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
