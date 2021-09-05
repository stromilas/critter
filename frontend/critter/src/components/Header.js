import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import authActions from '../store/auth'
import Logo from '../components/Logo'
import { Link, useHistory } from 'react-router-dom'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Stack,
  Avatar,
  Menu,
  IconButton,
  MenuItem,
} from '@material-ui/core'
import { ArrowDropDownRounded } from '@material-ui/icons'


const Header = ({ children }) => {
  const authenticated = useSelector((state) => state.auth.authenticated)
  const user = useSelector((state) => state.auth.user)
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(authActions.logout())
    handleClose()
  }

  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <div onClick={() => history.push('/')}>
            <Stack direction="row" alignItems="center">
              <Logo />
              <Typography variant="h6" component="div" color='text.primary' fontWeight='600'>
                Critter
              </Typography>
            </Stack>
          </div>

          {/* Tabs */}
          <Box sx={{ alignSelf: 'flex-end'}}>
            {children}
          </Box>

          {/* User Avatar | Login */}
          {!authenticated ? (
            <Link to="/login">Login</Link>
          ) : (
            <Stack direction="row" alignItems="center">
              <Avatar
                sx={{
                  backgroundColor: 'primary.main',
                  mr: 1,
                }}
                alt={user.name}
                variant="rounded-s"
              >
                {user.name[0]}
              </Avatar>
              <Typography variant="body1" component="div" fontWeight='bold' sx={{ color: 'text.primary' }}>
                {user.name}
              </Typography>
              <Box sx={{ mx: 1 }}>
                <IconButton
                  size='small'
                  onClick={handleMenu}
                  color='inherit'
                  aria-label="User Settings"
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                >
                  <ArrowDropDownRounded sx={{ width: 32, height: 32 }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
