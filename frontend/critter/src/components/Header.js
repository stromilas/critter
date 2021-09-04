import React, { useContext } from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Stack,
} from '@material-ui/core'
import AuthContext from '../context/auth-context'
import Logo from '../components/Logo'
import { Link } from 'react-router-dom'

const Header = ({ children }) => {
  const authContext = useContext(AuthContext)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" >
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', backgroundColor: 'white' }}>
          {/* Logo */}
          <Link to='/'>
            <Stack direction='row' alignItems='center'>
              <Logo />
              <Typography variant="span" component="div">
                Critter
              </Typography>
            </Stack>
          </Link>

          {/* Tabs */}
          { children }

          {/* User Avatar | Login */}
          { !authContext.authenticated ? (
            <Link to='/login' >
              Login
            </Link>
          ) : (
            <Typography>
              Welcome
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
