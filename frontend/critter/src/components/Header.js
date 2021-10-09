import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import authActions from '../store/auth'
import Logo from '../components/Logo'
import { Link, useHistory } from 'react-router-dom'
import { media } from '../core/endpoints'
import { ArrowDropDownRounded } from '@material-ui/icons'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Stack,
  Avatar,
  Menu,
  IconButton,
  MenuItem,
} from '@material-ui/core'

const Header = ({ children }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)
  const authenticated = useSelector((state) => state.auth.authenticated)
  const user = useSelector((state) => state.auth.user)

  const clickMenu = (event) => setAnchorEl(event.currentTarget)
  const closeMenu = () => setAnchorEl(null)

  const changePage = (path) => {
    closeMenu()
    history.push(path)
  }

  const logout = () => {
    closeMenu()
    dispatch(authActions.logout())
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            backgroundColor: 'background.paper',
          }}
        >
          {/* Logo */}
          <div onClick={() => history.push('/')}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ cursor: 'pointer' }}
            >
              <Logo />
              <Typography
                variant="h6"
                component="div"
                color="text.primary"
                fontWeight="600"
              >
                Critter
              </Typography>
            </Stack>
          </div>

          {/* Tabs */}
          <Box sx={{ alignSelf: 'flex-end' }}>{children}</Box>

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
                src={media + user.profile}
                alt={user.name}
                variant="rounded-s"
              />
              <Typography
                variant="body1"
                component="div"
                fontWeight="bold"
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                onClick={() => history.push(`/users/${user.username}`)}
              >
                {user.name}
              </Typography>
              <Box sx={{ mx: 1 }}>
                <IconButton
                  size="small"
                  onClick={clickMenu}
                  color="inherit"
                  aria-label="User Settings"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
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
                  onClose={closeMenu}
                >
                  <MenuItem onClick={() => changePage(`/users/${user.username}`)}>My Profile</MenuItem>
                  <MenuItem onClick={() => changePage('/settings')}>Settings</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
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
