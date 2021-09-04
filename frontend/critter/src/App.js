import React from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import { CssBaseline, Tab, Tabs } from '@material-ui/core'
import Header from './components/Header'
import Home from './pages/Home'
import SignIn from './pages/SignIn'

const App = () => {

  return (
    <Router>
      <div>
        <CssBaseline />
        <Header>
          <Route
            path={['/', '/explore', '/bookmarks']}
            exact
            render={({ location }) => (
              <Tabs value={location.pathname}>
                <Tab label='Home' value='/' component={Link} to='/' sx={{ color: 'inherit' }} />
                <Tab label='Explore' value='/explore' component={Link} to='/explore' sx={{ color: 'inherit' }} />
                <Tab label='Bookmars' value='/bookmarks' component={Link} to='/bookmarks' sx={{ color: 'inherit' }} />
              </Tabs>
            )}
          >
          </Route>
        </Header>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/explore'>
          pooopppee
        </Route>
        <Route path='/bookmarks'>
          poop
        </Route>
        <Route path="/login">
          <SignIn />
        </Route>
      </div>
    </Router>
  )
}

export default App
